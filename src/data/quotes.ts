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
