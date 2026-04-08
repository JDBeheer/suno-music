export interface WordData {
  word: string
  count: number
  songCount: number
  songs: string[]
}

export const catalogWords: WordData[] = [
  { word: "fire", count: 15, songCount: 4, songs: ["She's Got My Fire", "Red Wine Rebel", "That Line", "Welcome to My Country"] },
  { word: "love", count: 14, songCount: 6, songs: ["Better Than Before", "Blame", "Custody War", "The Man They Think I Am", "Red Wine Rebel", "Thank God There's Still Whiskey"] },
  { word: "heart", count: 13, songCount: 7, songs: ["Custody War", "She's Got My Fire", "The Man They Think I Am", "Red Wine Rebel", "Thank God There's Still Whiskey", "That Line", "Wealthiest Man"] },
  { word: "light", count: 12, songCount: 4, songs: ["Red Wine Rebel", "Thank God There's Still Whiskey", "That Line", "Wealthiest Man"] },
  { word: "loud", count: 11, songCount: 4, songs: ["Custody War", "Red Wine Rebel", "That Line", "Welcome to My Country"] },
  { word: "dark", count: 10, songCount: 4, songs: ["Blame", "She's Got My Fire", "Red Wine Rebel", "Wealthiest Man"] },
  { word: "wild", count: 10, songCount: 5, songs: ["Not Your Typical Countryboy", "She's Got My Fire", "Red Wine Rebel", "That Line", "Welcome to My Country"] },
  { word: "life", count: 9, songCount: 5, songs: ["The Man They Think I Am", "Red Wine Rebel", "That Line", "Wealthiest Man", "Welcome to My Country"] },
  { word: "line", count: 9, songCount: 5, songs: ["Blame", "Custody War", "She's Got My Fire", "That Line", "Welcome to My Country"] },
  { word: "peace", count: 9, songCount: 6, songs: ["Better Than Before", "The Man They Think I Am", "Red Wine Rebel", "Thank God There's Still Whiskey", "That Line", "Welcome to My Country"] },
  { word: "whiskey", count: 9, songCount: 3, songs: ["Red Wine Rebel", "Thank God There's Still Whiskey", "That Line"] },
  { word: "country", count: 8, songCount: 2, songs: ["Not Your Typical Countryboy", "Welcome to My Country"] },
  { word: "free", count: 8, songCount: 5, songs: ["Better Than Before", "Blame", "Thank God There's Still Whiskey", "That Line", "Welcome to My Country"] },
  { word: "god", count: 8, songCount: 2, songs: ["Thank God There's Still Whiskey", "That Line"] },
  { word: "nights", count: 8, songCount: 4, songs: ["Custody War", "She's Got My Fire", "Thank God There's Still Whiskey", "That Line"] },
  { word: "proud", count: 8, songCount: 4, songs: ["She's Got My Fire", "Red Wine Rebel", "That Line", "Welcome to My Country"] },
  { word: "world", count: 8, songCount: 4, songs: ["She's Got My Fire", "Thank God There's Still Whiskey", "That Line", "Wealthiest Man"] },
  { word: "wrong", count: 8, songCount: 3, songs: ["Thank God There's Still Whiskey", "That Line", "Welcome to My Country"] },
  { word: "dirt", count: 7, songCount: 3, songs: ["Not Your Typical Countryboy", "Wealthiest Man", "Welcome to My Country"] },
  { word: "door", count: 7, songCount: 4, songs: ["Not Your Typical Countryboy", "Custody War", "The Man They Think I Am", "Wealthiest Man"] },
  { word: "lost", count: 7, songCount: 4, songs: ["Better Than Before", "Thank God There's Still Whiskey", "That Line", "Welcome to My Country"] },
  { word: "neon", count: 7, songCount: 2, songs: ["Red Wine Rebel", "That Line"] },
  { word: "pain", count: 7, songCount: 5, songs: ["Better Than Before", "Blame", "Custody War", "Thank God There's Still Whiskey", "That Line"] },
  { word: "rebel", count: 7, songCount: 2, songs: ["Red Wine Rebel", "That Line"] },
  { word: "road", count: 7, songCount: 2, songs: ["Wealthiest Man", "Welcome to My Country"] },
  { word: "sky", count: 7, songCount: 4, songs: ["She's Got My Fire", "Red Wine Rebel", "Thank God There's Still Whiskey", "Wealthiest Man"] },
  { word: "soul", count: 7, songCount: 4, songs: ["Not Your Typical Countryboy", "Red Wine Rebel", "Thank God There's Still Whiskey", "Wealthiest Man"] },
  { word: "spark", count: 7, songCount: 2, songs: ["She's Got My Fire", "Red Wine Rebel"] },
  { word: "time", count: 7, songCount: 4, songs: ["Blame", "Custody War", "The Man They Think I Am", "Thank God There's Still Whiskey"] },
  { word: "storm", count: 6, songCount: 4, songs: ["Better Than Before", "Custody War", "She's Got My Fire", "The Man They Think I Am"] },
  { word: "silence", count: 6, songCount: 5, songs: ["Blame", "Custody War", "The Man They Think I Am", "Thank God There's Still Whiskey", "Wealthiest Man"] },
  { word: "blame", count: 6, songCount: 2, songs: ["Better Than Before", "Blame"] },
  { word: "kids", count: 6, songCount: 1, songs: ["Custody War"] },
  { word: "war", count: 6, songCount: 1, songs: ["Custody War"] },
  { word: "bruised", count: 5, songCount: 3, songs: ["Better Than Before", "Blame", "Wealthiest Man"] },
  { word: "clean", count: 5, songCount: 3, songs: ["Red Wine Rebel", "Thank God There's Still Whiskey", "That Line"] },
  { word: "dry", count: 5, songCount: 3, songs: ["She's Got My Fire", "Thank God There's Still Whiskey", "Wealthiest Man"] },
  { word: "rain", count: 4, songCount: 3, songs: ["Custody War", "Not Your Typical Countryboy", "Better Than Before"] },
]

export const songCatalog = [
  { title: "Better Than Before", listeners: 46371, streams: 146119, saves: 7150, saveRate: 4.89, releaseDate: "2025-10-18", category: "emotional ballad", theme: "persoonlijke groei" },
  { title: "The Man They Think I Am", listeners: 40859, streams: 109075, saves: 4426, saveRate: 4.06, releaseDate: "2025-11-22", category: "emotional ballad", theme: "identiteit, masker" },
  { title: "That Line", listeners: 35089, streams: 82110, saves: 3277, saveRate: 3.99, releaseDate: "2025-12-27", category: "country-trap/rebel", theme: "outlaw, vrijheid" },
  { title: "Thank God There's Still Whiskey", listeners: 14932, streams: 29160, saves: 941, saveRate: 3.23, releaseDate: "2025-07-28", category: "dark country ballad", theme: "eenzaamheid, coping" },
  { title: "Karma Don't Forget", listeners: 11557, streams: 22582, saves: 708, saveRate: 3.14, releaseDate: "2025-07-28", category: "country rock", theme: "karma, gerechtigheid" },
  { title: "Red Wine Rebel", listeners: 9639, streams: 18693, saves: 842, saveRate: 4.50, releaseDate: "2026-02-01", category: "rebel/party", theme: "dualiteit, wild leven" },
  { title: "Custody War", listeners: 10206, streams: 18054, saves: 1031, saveRate: 5.71, releaseDate: "2026-02-19", category: "emotional ballad", theme: "vaderschap, scheiding" },
  { title: "Not Your Typical Country Boy", listeners: 6939, streams: 13793, saves: 723, saveRate: 5.24, releaseDate: "2025-07-28", category: "rebel/party", theme: "humor, autobiografisch" },
  { title: "Wealthiest Man", listeners: 6661, streams: 12422, saves: 953, saveRate: 7.67, releaseDate: "2026-03-21", category: "emotional ballad", theme: "vaderschap, dankbaarheid" },
  { title: "She's Got My Fire", listeners: 5200, streams: 10251, saves: 640, saveRate: 6.24, releaseDate: "2025-07-28", category: "emotional/uplifting", theme: "vaderschap, dochter" },
  { title: "Blame", listeners: 4204, streams: 8841, saves: 216, saveRate: 2.44, releaseDate: "2025-06-21", category: "emotional ballad", theme: "toxische relatie" },
  { title: "Welcome To My Country", listeners: 3251, streams: 7521, saves: 372, saveRate: 4.95, releaseDate: "2025-09-07", category: "rebel/party", theme: "vrijheid, rebel" },
]
