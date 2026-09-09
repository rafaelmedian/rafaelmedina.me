import { collaborators, type XProfilePreview } from "./portfolio"

export type PortfolioQuote = {
  id: string
  text: string
  emphasis: string
  attribution: string
  caption: string
  attributionNote?: string
  photo?: string
  /** Confirmed X username, without @. Omit for unidentified sample authors. */
  xHandle?: string
  /** Public X profile snapshot via api.fxtwitter.com, refreshed 2026-09-07. */
  xProfile?: Pick<XProfilePreview, "name" | "bio" | "following" | "followers">
}

// Supplied feedback.
export const portfolioQuotes: PortfolioQuote[] = [
  {
    id: "wong",
    xHandle: "wongisrite",
    xProfile: {
      name: "MW",
      bio: "",
      following: "2,670",
      followers: "8,154",
    },
    text: "i fkin love",
    emphasis: "what you did with this bro",
    attribution: "Michael Wong",
    caption: "michaelwong.eth",
    photo: "/quotes/wong.jpg",
  },
  {
    id: "anon",
    xHandle: "basedfloyd888",
    xProfile: {
      name: "BASED FLOYD VIII",
      bio: "gmeow. have a blessed day.",
      following: "1,014",
      followers: "5,792",
    },
    text: "matcha has",
    emphasis: "dope product designers",
    attribution: "BASED FLOYD VIII",
    caption: "@basedfloyd888",
    photo: "/quotes/basedfloyd888-avatar.jpg",
  },
  {
    id: "phil",
    xHandle: "philipliao_",
    xProfile: {
      name: "Phil 🍵",
      bio: "Building @matchaxyz",
      following: "2,649",
      followers: "2,005",
    },
    text: "One of the most",
    emphasis: "onchain-literate people at the org.",
    attribution: "Phil Liao",
    caption: "Head of Engineering at 0x",
    photo: "/quotes/phil-liao.png",
  },
  {
    id: "simon",
    xHandle: "simonricoo",
    xProfile: {
      name: "Simon Rico",
      bio: "Building @logram_ai, prev. Principal Designer @matchaxyz, Founder of @lapz_io",
      following: "528",
      followers: "511",
    },
    text: "Help me setup matcha",
    emphasis: "in my computer",
    attribution: collaborators.simon.name,
    caption: "Principal Designer at 0x",
    photo: collaborators.simon.photo,
  },
  {
    id: "jakub",
    xHandle: "jakubantalik",
    xProfile: {
      name: "Jakub Antalik",
      bio: "Product designer/engineer, prev at @frame_io (acq. by Adobe), @intercom\nhttp://transitions.dev \nhttp://libraries.dev",
      following: "1,925",
      followers: "19,598",
    },
    text: "Wait, you made these?",
    emphasis: "I thought an agency was doing the marketing posts!",
    attribution: collaborators.jakub.name,
    caption: "Lead Designer",
    photo: collaborators.jakub.photo,
  },
]

// The second card in the grid: praise from the teams and clients the work was
// made with, rather than from the timeline -- both the summing-up afterwards and
// the reactions from inside the work. These arrived as Slack messages and a
// testimonial card, so they carry no X handle and no profile preview: the name
// renders as plain text and the credit is the room the praise came from. A voice
// that speaks twice is kept apart in the order rather than dropped.
export const teamQuotes: PortfolioQuote[] = [
  {
    id: "jhon",
    text: "Our team could never have done what you did.",
    emphasis: "I miss working with you guys.",
    attribution: "John Gilman",
    caption: "VP Product and co-founder at Onit",
    attributionNote: "You make new product development rewarding and a lot of fun.",
    photo: "/quotes/jhon-onit.jpg",
  },
  {
    id: "cristina",
    text: "One of the proudest days of my career to have presented this prototype to the Managing Directors,",
    emphasis: "especially Rafael for making the prototype pop.",
    attribution: "Cristina Pieretti",
    caption: "VP at Moody’s",
    attributionNote: "Relayed to the sprint team the morning after her stakeholder review.",
  },
  {
    id: "josh",
    text: "Masterclass in user test facilitation.",
    emphasis: "That prototype 😍",
    attribution: "Josh Frank",
    caption: "Product Strategist at DEPT",
    photo: "/quotes/josh-frank.jpg",
  },
  {
    id: "dan",
    text: "Saw the prototype you pulled together!",
    emphasis: "That thing looks 🔥",
    attribution: "Dan Matiaudes",
    caption: "Director of Design at DEPT",
    photo: "/quotes/dan.jpg",
  },
  {
    id: "jen",
    text: "WOOOOOOO GO RAFAEL GO!",
    emphasis: "You did a great job!",
    attribution: "Jen Schnidman",
    caption: "Senior Product Strategist at DEPT",
    photo: "/quotes/jen.jpg",
  },
  {
    id: "rob",
    text: "You handled the questions very well —",
    emphasis: "the value of your build was crystal clear.",
    attribution: "Rob Adams",
    caption: "Senior UX Designer at DEPT",
    photo: "/quotes/rob-adams.jpg",
  },
  {
    id: "cristina-toc",
    text: "The new treatment for Table of Contents is",
    emphasis: "AMAZING, I love it.",
    attribution: "Cristina Pieretti",
    caption: "VP at Moody’s",
    attributionNote: "Overheard in the team check-in and passed along the same morning.",
  },
  {
    id: "jhon-happen",
    text: "I know I’ve said this before, but",
    emphasis: "you guys made this happen.",
    attribution: "John Gilman",
    caption: "VP Product and co-founder at Onit",
    photo: "/quotes/jhon-onit.jpg",
  },
  {
    id: "rob-workshop",
    text: "Awesome job! Looks really good",
    emphasis: "and seems like a fun project.",
    attribution: "Rob Adams",
    caption: "Senior UX Designer at DEPT",
    photo: "/quotes/rob-adams.jpg",
  },
]
