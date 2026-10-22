import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readdir, readFile } from 'node:fs/promises'
import { createServer } from 'vite'

let vite
let worker
before(async () => {
  vite = await createServer({ server: { middlewareMode: true }, logLevel: 'error' })
  worker = (await vite.ssrLoadModule('/workers/likes/index.ts')).default
})
after(async () => { await vite?.close() })

async function fixture(t, overrides = {}) {
  const sqlite = new DatabaseSync(':memory:')
  t.after(() => sqlite.close())
  for (const file of (await readdir('workers/likes/migrations')).filter(f => f.endsWith('.sql')).sort()) {
    sqlite.exec(await readFile(`workers/likes/migrations/${file}`, 'utf8'))
  }
  const calls = []
  const keys = []
  const env = {
    ALLOWED_ORIGINS: 'https://rafaelmedina.me',
    CHAT_DAILY_LIMIT: '2',
    CHAT_MONTHLY_LIMIT: '3',
    CHAT_LIMITER: { limit: async ({ key }) => { keys.push(key); return { success: true } } },
    DB: { prepare: sql => ({ bind: (...args) => ({ first: async () => sqlite.prepare(sql).get(...args) ?? null }) }) },
    AI: { run: async (model, input) => { calls.push({ model, input }); return { response: 'A tailored answer.' } } },
    ...overrides,
  }
  const ask = async (id = crypto.randomUUID()) => {
    const response = await worker.fetch(new Request('https://api.example/chat', {
      method: 'POST',
      headers: { Origin: 'https://rafaelmedina.me', 'Content-Type': 'application/json', 'X-Visitor-ID': id, 'CF-Connecting-IP': '192.0.2.1' },
      body: JSON.stringify({ email: 'visitor@example.com', messages: [{ role: 'user', content: 'What does Rafael design?' }] }),
    }), env)
    return { status: response.status, body: await response.json() }
  }
  return { sqlite, env, calls, keys, ask }
}

function expectFallback(result) {
  assert.equal(result.status, 200)
  assert.equal(typeof result.body.answer, 'string')
  assert.match(result.body.answer, /Rafael/)
  assert.match(result.body.answer, /https:\/\/rafaelmedina.me/)
  assert.doesNotMatch(result.body.answer, /credit|quota|billing|limit|unavailable|error/i)
  assert.equal(result.body.error, undefined)
}

test('concurrent visitors share a hard daily inference cap across UUIDs', async t => {
  const { ask, calls, keys } = await fixture(t)
  const results = await Promise.all(Array.from({ length: 8 }, () => ask()))
  assert.equal(calls.length, 2)
  assert.equal(results.filter(r => r.body.answer === 'A tailored answer.').length, 2)
  for (const result of results.filter(r => r.body.answer !== 'A tailored answer.')) expectFallback(result)
  assert.ok(keys.every(key => key === '192.0.2.1'))
  assert.equal(calls[0].input.max_tokens, 220)
})

test('daily rollover preserves the shared monthly budget', async t => {
  const { ask, calls, sqlite } = await fixture(t)
  await ask(); await ask()
  sqlite.exec("UPDATE profile_chat_budget SET day = '2000-01-01'")
  assert.equal((await ask()).body.answer, 'A tailored answer.')
  expectFallback(await ask())
  assert.equal(calls.length, 3)
  sqlite.exec("UPDATE profile_chat_budget SET day = '2000-01-01', month = '2000-01'")
  assert.equal((await ask()).body.answer, 'A tailored answer.')
  assert.equal(calls.length, 4)
})

test('IP throttling returns useful static content without touching D1 or AI', async t => {
  const { ask, calls } = await fixture(t, {
    CHAT_LIMITER: { limit: async () => ({ success: false }) },
    DB: { prepare: () => { throw new Error('Must not read D1') } },
  })
  expectFallback(await ask())
  assert.equal(calls.length, 0)
})

for (const badLimit of ['0', '-1', '', 'oops', '1.5', undefined]) {
  test(`invalid or disabled budget (${String(badLimit)}) cannot authorize inference`, async t => {
    const { ask, calls } = await fixture(t, { CHAT_DAILY_LIMIT: badLimit })
    expectFallback(await ask())
    assert.equal(calls.length, 0)
  })
}

test('a failed reservation fails closed to static content', async t => {
  const { ask, calls } = await fixture(t, { DB: { prepare: () => { throw new Error('D1 unavailable') } } })
  expectFallback(await ask())
  assert.equal(calls.length, 0)
})

test('model failures keep their reservation and return the same useful fallback', async t => {
  let attempts = 0
  const { ask } = await fixture(t, { AI: { run: async () => { attempts++; throw new Error('credits exhausted') } } })
  expectFallback(await ask()); expectFallback(await ask()); expectFallback(await ask())
  assert.equal(attempts, 2)
})

test('missing throttle and malformed model responses fall back safely', async t => {
  const missing = await fixture(t, { CHAT_LIMITER: undefined })
  expectFallback(await missing.ask())
  assert.equal(missing.calls.length, 0)
  const empty = await fixture(t, { AI: { run: async () => ({ response: '' }) } })
  expectFallback(await empty.ask())
})
