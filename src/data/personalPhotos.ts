export type PersonalPhoto = {
  id: string
  name: string
  width: number
  height: number
  caption: string
  alt: string
  /** Authored details; optimized WebP files do not retain EXIF metadata. */
  date?: string
  camera?: string
  location?: string
}

// Metadata is illustrative unless supplied by Rafael, not recovered EXIF.
// Rafael supplied the night portrait and street painter details.
// Rafael also supplied the dandelion camera and location; its date is illustrative.
// Rafael supplied the Jungle guitarist camera and lens.
// Rafael identified the party photos as the 0x year-end party; their dates
// remain illustrative. Previously authored locations are also preserved.
// The Sony α6700 photos carry camera, lens, and month from their EXIF.
const personalPhotoItems: PersonalPhoto[] = [
  { id: "office", name: "office", width: 1200, height: 1600, caption: "Office days", alt: "Working from the sofa with friends", location: "Santo Domingo, Dominican Republic", date: "March 14, 2024", camera: "iPhone 15 Pro" },
  { id: "night-portrait", name: "night-portrait", width: 1200, height: 846, caption: "After dark", alt: "A friend of mine out at night in DC", location: "Washington, DC", date: "2016", camera: "Canon EOS 50D" },
  { id: "street-artist", name: "street-artist", width: 1200, height: 1203, caption: "Street painter", alt: "Watching a canvas come together in Times Square", location: "Times Square, Manhattan", date: "2017", camera: "Canon EOS 50D" },
  { id: "hiking", name: "hiking", width: 1200, height: 1462, caption: "On the trail", alt: "Me hiking in Jarabacoa", location: "Jarabacoa, Dominican Republic", date: "February 18, 2024", camera: "iPhone 15 Pro" },
  { id: "surfing", name: "surfing", width: 1200, height: 1324, caption: "Surf day", alt: "Me with a surfboard at Playa Encuentro", location: "Playa Encuentro, Dominican Republic", date: "July 8, 2023", camera: "iPhone 13 Pro" },
  { id: "golden-gate-waves", name: "golden-gate-waves", width: 1200, height: 800, caption: "Pacific coast", alt: "The view from Baker Beach", location: "Baker Beach, San Francisco", date: "September 9, 2023", camera: "Sony α7 III · 35mm f/1.8" },
  { id: "jungle-guitar", name: "jungle-guitar", width: 1200, height: 1499, caption: "Jungle, live", alt: "Caught the guitarist mid-kick", location: "Brooklyn, New York", date: "October 7, 2023", camera: "Canon EOS 90D · 50mm f/1.4" },
  { id: "subway-door", name: "subway-door", width: 1200, height: 1500, caption: "Doors closing", alt: "A commuter checking his phone between stops", location: "Manhattan, New York", date: "October 21, 2023", camera: "Fujifilm X100V · 23mm f/2" },
  { id: "garden-pond", name: "garden-pond", width: 1067, height: 1600, caption: "Autumn pond", alt: "Autumn trees and clouds reflected in a garden pond", location: "Shinjuku Gyoen, Tokyo", date: "November 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "dandelion", name: "dandelion", width: 1071, height: 827, caption: "Spring", alt: "A dandelion on the National Mall", location: "National Mall, Washington, DC", date: "April 16, 2023", camera: "Canon EOS 50D" },
  { id: "sensoji-eaves", name: "sensoji-eaves", width: 1067, height: 1600, caption: "Eaves", alt: "The pagoda's red eaves against a clear blue sky", location: "Sensō-ji, Tokyo", date: "December 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "humantay-lake", name: "humantay-lake", width: 1200, height: 800, caption: "Humantay", alt: "Fog settling over a turquoise glacial lake", location: "Humantay Lake, Peru", date: "January 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "akihabara", location: "Akihabara, Tokyo", name: "akihabara", width: 1199, height: 1600, caption: "Akihabara", alt: "Me out exploring the neighborhood", date: "May 12, 2024", camera: "iPhone 15 Pro" },
  { id: "lone-pine", name: "lone-pine", width: 1200, height: 800, caption: "Shade", alt: "Pruned pines throwing shade across a lawn", location: "Shinjuku Gyoen, Tokyo", date: "November 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "golden-gate", name: "golden-gate", width: 1084, height: 1600, caption: "Golden Gate", alt: "Me on a boat in San Francisco Bay", location: "San Francisco Bay, California", date: "September 10, 2023", camera: "iPhone 13 Pro" },
  { id: "kaminarimon-lantern", name: "kaminarimon-lantern", width: 1067, height: 1600, caption: "Kaminarimon", alt: "The giant red lantern hanging in the Thunder Gate", location: "Asakusa, Tokyo", date: "December 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "prom-dance-floor", name: "prom-dance-floor", width: 1200, height: 900, caption: "Year-end party at 0x", alt: "Me dancing with coworkers", location: "Santo Domingo, Dominican Republic", date: "December 2023", camera: "Canon EOS 80D · 24mm f/2.8" },
  { id: "sacred-valley", name: "sacred-valley", width: 1067, height: 1600, caption: "Sacred Valley", alt: "Farm terraces on the valley floor below green mountains", location: "Sacred Valley, Peru", date: "January 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "twin-peaks", name: "twin-peaks", width: 1067, height: 1600, caption: "Twin Peaks", alt: "San Francisco spread out toward the bay", location: "Twin Peaks, San Francisco", date: "May 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "rush-hour", name: "rush-hour", width: 1200, height: 1500, caption: "Rush hour", alt: "A packed subway car in New York", location: "Brooklyn, New York", date: "October 21, 2023", camera: "Fujifilm X100V · 23mm f/2" },
  { id: "karting", name: "karting", width: 1200, height: 1454, caption: "Race day", alt: "Me getting ready for a few laps", location: "Punta Cana, Dominican Republic", date: "August 5, 2023", camera: "iPhone 13 Pro" },
  { id: "orange-supra", name: "orange-supra", width: 1200, height: 800, caption: "Night meet", alt: "An orange Supra with green underglow", location: "Tokyo", date: "December 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "sensoji", location: "Sensō-ji, Tokyo", name: "sensoji", width: 1200, height: 1600, caption: "Sensō-ji", alt: "Me in front of the five-story pagoda", date: "May 13, 2024", camera: "iPhone 15 Pro" },
  { id: "campfire", name: "campfire", width: 1200, height: 800, caption: "Campfire", alt: "Logs burning in a camp fire", location: "Pico Duarte, Dominican Republic", date: "September 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "golden-gate-view", location: "Marin Headlands", name: "golden-gate-view", width: 1200, height: 1200, caption: "Across the Golden Gate", alt: "Looking back at the bridge from Marin", date: "September 9, 2023", camera: "Sony α7 III · 35mm f/1.8" },
  { id: "baker-beach-surf", name: "baker-beach-surf", width: 1200, height: 800, caption: "Low sun", alt: "Surf breaking over dark rocks in the late light", location: "San Francisco", date: "May 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "tokyo-taxi", name: "tokyo-taxi", width: 1067, height: 1600, caption: "Black cab", alt: "A black Tokyo taxi turning through a crosswalk", location: "Tokyo", date: "November 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "prom-friends", name: "prom-friends", width: 1200, height: 900, caption: "Year-end party at 0x", alt: "Me and friends on the dance floor", location: "Santo Domingo, Dominican Republic", date: "December 2023", camera: "Canon EOS 80D · 24mm f/2.8" },
  { id: "pier-sunset", name: "pier-sunset", width: 1200, height: 1500, caption: "Last light", alt: "Sunset at the Santa Monica pier", location: "Santa Monica, California", date: "September 12, 2023", camera: "Sony α7 III · 35mm f/1.8" },
  { id: "kl-alley", name: "kl-alley", width: 1067, height: 1600, caption: "After hours", alt: "An old apartment street under the towers at night", location: "Kuala Lumpur, Malaysia", date: "November 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "batu-caves-macaque", name: "batu-caves-macaque", width: 1067, height: 1600, caption: "Lookout", alt: "A long-tailed macaque perched on a railing", location: "Batu Caves, Malaysia", date: "November 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "stone-path", name: "stone-path", width: 1067, height: 1600, caption: "Stone path", alt: "A flagstone path under the trees", location: "Tokyo", date: "November 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "scuba", name: "scuba", width: 1200, height: 1469, caption: "Underwater", alt: "Diving in Bayahibe", location: "Bayahibe, Dominican Republic", date: "August 6, 2023", camera: "GoPro HERO11 Black" },
  { id: "dumbo", location: "DUMBO, Brooklyn", name: "dumbo", width: 1066, height: 1600, caption: "DUMBO", alt: "Me by the Manhattan Bridge", date: "October 22, 2023", camera: "iPhone 15 Pro" },
  { id: "batu-caves-temple", name: "batu-caves-temple", width: 1200, height: 800, caption: "Batu Caves", alt: "The temple courtyard seen from the cave steps", location: "Batu Caves, Malaysia", date: "November 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "ballpark", name: "ballpark", width: 1067, height: 1600, caption: "At the ballpark", alt: "Me catching a game at Oracle Park", location: "Oracle Park, San Francisco", date: "September 8, 2023", camera: "iPhone 13 Pro" },
  { id: "jungle-stage", name: "jungle-stage", width: 1200, height: 1499, caption: "From the crowd", alt: "The band behind the keyboards", location: "Brooklyn, New York", date: "October 7, 2023", camera: "Sony α7 III · 35mm f/1.8" },
  { id: "rooftop-dj", name: "rooftop-dj", width: 1067, height: 1600, caption: "Rooftop set", alt: "A DJ at the decks under a red-lit tent", location: "New York", date: "May 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "tokyo-cyclist", name: "tokyo-cyclist", width: 1067, height: 1600, caption: "Side street", alt: "A cyclist riding down a quiet side street", location: "Tokyo", date: "December 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "antelope-canyon", name: "antelope-canyon", width: 1200, height: 1503, caption: "Antelope Canyon", alt: "Walking between the sandstone walls", location: "Page, Arizona", date: "September 15, 2023", camera: "Sony α7 III · 24mm f/1.4" },
  { id: "jiron-de-la-union", name: "jiron-de-la-union", width: 1067, height: 1600, caption: "Jirón de la Unión", alt: "Evening on the pedestrian street", location: "Lima, Peru", date: "January 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "cusco-cathedral", name: "cusco-cathedral", width: 1067, height: 1600, caption: "Bell tower", alt: "A colonial church tower in silhouette against a pale sky", location: "Cusco, Peru", date: "January 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "san-francisco", location: "San Francisco", name: "san-francisco", width: 1152, height: 1600, caption: "San Francisco", alt: "Me and friends out for a walk", date: "September 8, 2023", camera: "iPhone 13 Pro" },
  { id: "backlit-maple", name: "backlit-maple", width: 1067, height: 1600, caption: "Late autumn", alt: "Sun breaking through a red maple by the river", location: "Sumida River, Tokyo", date: "December 2024", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "beach", name: "beach", width: 1200, height: 886, caption: "By the sea", alt: "Me at the beach in Las Terrenas", location: "Las Terrenas, Dominican Republic", date: "July 9, 2023", camera: "iPhone 13 Pro" },
  { id: "shared-umbrella", name: "shared-umbrella", width: 1067, height: 1600, caption: "One umbrella", alt: "Two people sharing an umbrella on a rain-slick street at night", location: "New York", date: "May 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "terrenas-palms", name: "terrenas-palms", width: 1067, height: 1600, caption: "Dusk", alt: "Palm silhouettes over the sea at dusk", location: "Las Terrenas, Dominican Republic", date: "July 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "mountain-bike", name: "mountain-bike", width: 1200, height: 1502, caption: "Trail ride", alt: "Me buckling my helmet before heading out", location: "Punta Rucia, Dominican Republic", date: "February 25, 2024", camera: "GoPro HERO11 Black" },
  { id: "citi-bikes", name: "citi-bikes", width: 1067, height: 1600, caption: "Docked", alt: "Citi Bikes along a leafy sidewalk", location: "New York", date: "May 2025", camera: "Sony α6700 · 35mm f/1.8" },
  { id: "rainy-night", name: "rainy-night", width: 1067, height: 1600, caption: "Rainy night", alt: "Sharing an umbrella on a walk through Midtown", location: "Midtown, New York", date: "October 23, 2023", camera: "Fujifilm X100V · 23mm f/2" },
]

export { personalPhotoItems }
