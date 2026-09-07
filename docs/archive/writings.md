# Archived writings and notes

Saved for Rafael to revisit. These six pieces are omitted from the site's
writing list, recommendations, and reader navigation. Their complete original
entries are preserved below, including editorial source comments and image
references. This file is not imported by the site or copied into the build.

The visible selection includes five personal essays, Designing Matcha,
Designing for active traders, and From quote to confirmation. The remaining
smaller project notes are held for a later editorial pass. Protector booking
and Building a consistent dark theme were specifically requested for removal
from the visible list.

To restore a piece, copy its entry into the `writings` array in
`src/data/writings.ts`. The existing `projectImage` helper resolves its portfolio
image references. Keep the original ID so saved likes remain associated with it;
all IDs remain registered in `src/data/writingIds.ts`.

Future design thoughts should draw on Rafael's own supplied ChatGPT messages.
Those conversations have not yet been provided or used for this selection.

## Protector booking

```ts
  {
    id: "protector-booking",
    title: "Protector booking",
    publishedAt: "2024-10-15",
    cover: projectImage("preview-protector"),
    paragraphs: [
      "Booking personal security asks an interface to make an unfamiliar service understandable. Before someone can feel ready to book, they need to know what they're choosing. Who is coming? How will they be dressed? Is transportation part of the booking? Those are concrete questions, and the flow needs concrete answers.",
      "I was the sole product designer for Protector's booking experience. My scope covered choosing a protector, selecting their attire, and adding escorted transportation. The service has several moving parts; the booking needed to let someone consider them one at a time and still understand the whole arrangement.",
    ],
    sections: [
      {
        heading: "Each choice changes the booking",
        paragraphs: [
          "Clothing might look like a small preference in a form, but it changes how someone imagines the service. Transportation changes the arrangement again. Putting both under a vague heading like extras would save space while making the person do more interpretation.",
          "The guided flow gives these choices their own place. I see the value of a separate step in the attention it allows: the person can understand an option before moving on. The cost is that the booking becomes longer. A step has to justify that cost by answering a distinct question.",
          "This is also why labels matter so much in a service like this. A polished image can set an expectation, but it can't explain everything included in a selection. The language beside the choice has to carry its share of the work.",
        ],
      },
      {
        heading: "Review the arrangement as a whole",
        paragraphs: [
          "A sequence can feel clear locally and still leave someone uncertain at the end. They remember choosing a protector, then an outfit, then transport, but now they need to see how those decisions fit together. Confirmation is where the booking becomes one arrangement again.",
          "Each part of the service is selected and confirmed in the flow. That's the outcome I can describe from the design. Whether the experience earns someone's trust also depends on what happens outside the interface, when the service is delivered.",
          "I want the booking to set an expectation that the service can meet. That means being specific about the selections, making them easy to check, and using a tone that doesn't oversell reassurance. For this project, plain language belongs right beside the visual design.",
        ],
      },
    ],
  },
```

## A starting point for discovery

```ts
  {
    id: "starting-with-discovery",
    title: "A starting point for discovery",
    publishedAt: "2026-06-18",
    paragraphs: [
      "If I arrive knowing the token I want, a homepage full of things to explore is something to get past. If I arrive without a token in mind, a search field alone gives me very little to do. Both are reasonable ways to use the same product.",
      "That tension sits inside the Matcha homepage work. I led the page structure and the paths into discovery and trading, with token search, market browsing, and wallet connection available from the first screen. The problem was deciding how those entry points could share a page.",
    ],
    sections: [
      {
        heading: "Make room for a direct visit",
        paragraphs: [
          "Search gives a person with a clear intention a short route through the homepage. It needs to look available immediately. A returning visitor shouldn't have to interpret the page's editorial choices before they can act on their own.",
          "Browsing serves a different purpose. It gives someone material to consider when they haven't decided what to look for. The challenge is leaving enough room for that exploration without letting it push the direct route out of sight. Both paths should feel deliberate, even though they don't need equal space.",
        ],
        image: projectImage("preview-shot-16"),
      },
      {
        heading: "Discovery ends with another question",
        paragraphs: [
          "Finding an interesting token doesn't mean being ready to trade it. The next question may be about its recent price, its activity, or something in the chart. The token page brings market data, charting, order history, and trade controls together so that looking into a token and acting on it can happen in the same place.",
          "I like that handoff because it leaves room to stop. The homepage introduces something; the detail page gives it more context. A person can look, decide it isn't for them, and leave. Discovery shouldn't require the design to treat every expression of curiosity as purchase intent.",
          "The test I'd put to this kind of homepage is modest: can someone who knows what they want get there, and can someone who doesn't find a useful next question? That gives each part of the page a reason to exist beyond filling the first screen.",
        ],
        image: projectImage("preview-shot-21"),
      },
    ],
  },
```

## Keeping wallet context close

```ts
  {
    id: "keeping-wallet-context",
    title: "Keeping wallet context close",
    publishedAt: "2025-08-21",
    paragraphs: [
      "Imagine entering a trade amount and then realizing you've selected the wrong wallet. You change accounts. When the menu closes, is the amount still there? Which balance are you looking at now? Has anything else changed? A small menu interaction can leave quite a few questions behind.",
      "I mapped Matcha's multiwallet flow and designed the menu, including adding another wallet and handling loading, empty, and error states. People can change wallets during a trade while keeping their quote and inputs. That continuity is the part of the feature I want to focus on.",
    ],
    sections: [
      {
        heading: "Preserve the work, explain the change",
        paragraphs: [
          "Keeping an entered amount saves someone from doing the same work twice. But preservation alone isn't enough. The surrounding account information has to make it clear that the trade now belongs to a different context. Otherwise, a form that looks comfortably unchanged can also be misleading.",
          "The wallet menu brings connected accounts and network details together. Once it closes, the rest of the experience still needs to make sense in relation to that selection. I think of the menu and the trade form as two views of the same decision, even though they're separate pieces of the interface.",
        ],
        image: projectImage("preview-shot-9"),
      },
      {
        heading: "An empty space can mean several things",
        paragraphs: [
          "A wallet being added, an account with nothing to show, and a connection that failed can all leave a blank-looking area. They need different explanations. Waiting is reasonable in one case; trying again might be useful in another. An empty state should give someone enough information to tell which situation they're in.",
          "That's why the scope included these states alongside wallet selection. They may get less space in a portfolio, but they're part of using the feature. The menu needs to remain understandable when the account information isn't ready, too.",
          "For me, the useful standard is what happens after the menu disappears. Someone should be able to identify the active wallet, understand the balance they're seeing, and recognize the trade they were working on. If they have to reopen the menu just to be sure what happened, there's still a question the interface hasn't answered.",
        ],
      },
    ],
  },
```

## Trading on a small screen

```ts
  {
    id: "trading-on-a-small-screen",
    title: "Trading on a small screen",
    publishedAt: "2025-04-08",
    paragraphs: [
      "On desktop, a chart and a trade form can explain each other by sitting side by side. On a phone, one of them usually has to come first. That's a decision about how someone reads the product, before it's a decision about how much padding to remove.",
      "I led the mobile design for Matcha's research and trading journey, covering token details, amount entry, review, and confirmation. The work included narrow layouts and touch targets, but the harder question was which information needed to stay together as the page became a sequence.",
    ],
    sections: [
      {
        heading: "Choose what belongs together",
        paragraphs: [
          "A token pair and an entered amount form a small, understandable unit. The quote and its cost need to remain connected to that unit. Research can take more space, but it shouldn't make the transaction difficult to recognize when someone reaches it.",
          "Stacking every desktop panel in its original order would avoid some design decisions while quietly making others. Whatever lands at the bottom becomes harder to reach. Whatever lands at the top gets more attention. I prefer to treat that reading order as part of the design and give each stage a clear job.",
        ],
        image: projectImage("preview-shot-14"),
      },
      {
        heading: "The keyboard takes a share of the screen",
        paragraphs: [
          "Amount entry is easy to underestimate in a static layout. Once a person taps the field, the keyboard occupies space that the mockup may have been using for context. The label, value, and surrounding controls need to make sense in that smaller working area.",
          "Touch targets add another constraint. Making a control easy to press takes room, and tightly packed secondary actions can become awkward near the main action. Mobile design has to account for the hand using the form as well as the eye reading it.",
        ],
      },
      {
        heading: "Keep the decision complete",
        paragraphs: [
          "The available width changes, but someone still needs to check what they're about to sign. I wouldn't use a smaller screen as a reason to make costs or transaction details harder to inspect. The review can take a different shape and still answer the same questions.",
          "The mobile work makes the main research and trading flow available on phone-sized screens. A screenshot only shows one moment of that journey. To judge the experience, I'd follow the whole thing with the keyboard open, an amount entered, and a reason to go back and change it. That's where the relationship between the screens becomes visible.",
        ],
      },
    ],
  },
```

## Building a consistent dark theme

```ts
  {
    id: "building-a-dark-theme",
    title: "Building a consistent dark theme",
    publishedAt: "2024-07-09",
    paragraphs: [
      "A dark theme can look convincing until you open a menu. Then the panel disappears into the page behind it, the selected row barely looks selected, or a muted label becomes difficult to read. The palette may be attractive while the interface is still hard to use.",
      "I led Matcha's theme work and defined its color and elevation tokens. The scope included component states, charts, and dense trading screens. That breadth matters because a theme has to hold up when several parts of the product are visible together.",
    ],
    sections: [
      {
        heading: "Give each surface a role",
        paragraphs: [
          "The page, a panel on the page, and a menu above that panel need to remain distinguishable. There isn't much value in choosing each background in isolation. What matters is the relationship between them when they're stacked in the actual interface.",
          "Semantic tokens give those relationships names tied to their use. A component can ask for a surface or a text role instead of making another local color choice. That doesn't settle every visual question, but it makes a decision reusable and gives you somewhere to correct it when it fails elsewhere.",
        ],
        image: projectImage("preview-shot-22"),
      },
      {
        heading: "Check the less flattering combinations",
        paragraphs: [
          "A large heading on an empty page doesn't ask very much of a theme. A small secondary label beside a disabled control inside an open menu asks considerably more. Charts add their own needs: data, grid lines, labels, and surrounding controls all have to remain legible without receiving the same emphasis.",
          "The trade workspace is useful for looking at these relationships together. It contains several levels of information, along with controls and activity. A color adjustment that helps one panel can make another feel too prominent, so the whole view needs attention.",
        ],
        image: projectImage("preview-shot-1"),
      },
      {
        heading: "Consistency is a practical outcome",
        paragraphs: [
          "The theme work gave Matcha a shared dark theme across its main surfaces. I can describe the coverage and the system behind it; an image alone can't establish that every state is comfortable to read for every person.",
          "What I value about a shared theme is the ability to improve it coherently. If a text role is too faint, the correction has a place to live. If a menu needs more separation, that relationship can be addressed across the product. The palette is only the beginning of that work.",
        ],
      },
    ],
  },
```

## Discovery through people

```ts
  {
    id: "discovery-through-people",
    title: "Discovery through people",
    publishedAt: "2024-03-05",
    paragraphs: [
      "A photo in a social feed comes with another question attached: why am I seeing this person? The image might be interesting on its own, but a name, a familiar face, or a connection can change the reason to stop and look.",
      "For an early version of Popparazi, I designed the discovery feed and recommendation patterns. The work explored friend suggestions, featured photos, content density, and the visual direction for V1. It established a structure for early product iterations, rather than a finished answer to how people would discover one another.",
    ],
    sections: [
      {
        heading: "People and photos share the feed",
        paragraphs: [
          "Friend suggestions and featured photos ask for different kinds of attention. One invites someone to consider a relationship; the other invites them to look at content. If they use the same visual treatment, those intentions can blur. If they're too separate, the feed can feel like several unrelated modules stacked together.",
          "I find that a useful tension to design around. A recommendation needs to be recognizable as a recommendation, while still belonging to the place where someone is browsing. The image, identity, and possible next action have to work together at the size they're actually shown.",
        ],
        image: projectImage("preview-popparazi-v1"),
      },
      {
        heading: "Density changes what gets noticed",
        paragraphs: [
          "Smaller cards put more people and photos within reach. Larger ones give each image more presence and leave more room for context. Neither choice is neutral: the layout influences whether someone scans for a familiar face, pauses on a photo, or reads who's behind it.",
          "An early feed design makes those tradeoffs tangible enough to discuss and iterate on. It doesn't prove that people will form connections or keep coming back. Those are different questions, and a polished composition shouldn't be made to answer them.",
          "What interests me about this work is how little space there can be between the content and its social meaning. A name or suggestion can look secondary in a layout while doing a large part of the explanatory work. When I look at the feed, that's the relationship I pay attention to: whether the person remains present beside the photo.",
        ],
      },
    ],
  },
```
