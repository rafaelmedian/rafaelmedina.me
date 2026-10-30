import type { CDPSession } from "@playwright/test"

type Transfer = { type: string; url: string; bytes: number; complete: boolean; failed?: boolean }
export function recordTransfers(client: CDPSession) {
  const requests = new Map<string, { resource: Transfer; headers: number; decoded: number; encoded: number }>()
  client.on("Network.responseReceived", event => {
    const headers = Math.max(0, event.response.encodedDataLength)
    requests.set(event.requestId, {
      resource: { type: event.type, url: event.response.url, bytes: headers, complete: false },
      headers, decoded: 0, encoded: headers,
    })
  })
  // Chromium can delay encoded byte updates until completion. Until then use
  // decoded bytes as a conservative floor too, so unfinished/cancelled media
  // cannot evade the budget. Compressed partial responses may be overestimated;
  // completed transfers always use Chromium's final encoded total.
  client.on("Network.dataReceived", event => {
    const request = requests.get(event.requestId)
    if (!request) return
    request.decoded += event.dataLength
    request.encoded += event.encodedDataLength
    request.resource.bytes = Math.max(request.encoded, request.headers + request.decoded)
  })
  client.on("Network.loadingFinished", event => {
    const request = requests.get(event.requestId)
    if (!request) return
    request.resource.bytes = event.encodedDataLength
    request.resource.complete = true
  })
  client.on("Network.loadingFailed", event => {
    const request = requests.get(event.requestId)
    if (request) request.resource.failed = true
  })
  return () => [...requests.values()].map(request => ({ ...request.resource }))
}
