export interface Song {
  id: string
  title: string
  listeners: number
  streams: number
  saves: number
  save_rate: number
  release_date: string
  category: string
  theme: string
  suno_tags: string
  lyrics: string
  created_at: string
}

export interface Word {
  id: string
  word: string
  count: number
  song_count: number
  songs: string[]
  preference: 'avoid' | 'keep' | 'neutral'
}

export interface GeneratorSettings {
  category: string
  theme: string
  mood: string
  tempo: string
  avoided_words: string[]
  kept_words: string[]
  custom_prompt: string
}
