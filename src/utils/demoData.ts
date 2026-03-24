// Demo data for DonghuaLand - used when DB is empty or unavailable

export const DEMO_VIDEO_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
]

// Open source/CC licensed poster images using picsum (random but consistent)
// Using Picsum with seeds for consistent images
function picsum(seed: string, w = 300, h = 450): string {
  // Use a numeric seed from the string
  let n = 0
  for (let i = 0; i < seed.length; i++) n += seed.charCodeAt(i)
  const id = (n % 900) + 100
  return `https://picsum.photos/id/${id}/${w}/${h}`
}

function banner(seed: string): string {
  let n = 0
  for (let i = 0; i < seed.length; i++) n += seed.charCodeAt(i)
  const id = (n % 900) + 100
  return `https://picsum.photos/id/${id}/1280/720`
}

export const DEMO_ANIME: any[] = [
  {
    id: 1, slug: 'renegade-immortal',
    title: 'Renegade Immortal', title_native: '仙逆', title_english: 'Renegade Immortal',
    description: 'Wang Lin is a very smart boy with loving parents. Although he and his parents are shunned by the rest of their relatives, his parents have always held high hope for him. Wang Lin works hard to become an immortal but fails to enter a cultivation school. He eventually finds a dimension-splitting stone and starts his long journey to become an immortal.',
    cover_image: 'https://image.tmdb.org/t/p/w500/9vBqv4a2KArKzjS0oHLYj7u2Q4e.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/9vBqv4a2KArKzjS0oHLYj7u2Q4e.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2023,
    genres: '["Action","Adventure","Fantasy","Historical"]',
    studios: '["Sparkly Key Animation"]',
    rating: 8.5, vote_count: 12500, view_count: 85000,
    is_featured: 1, is_trending: 1, is_popular: 1,
    latest_ep: 56, total_episodes: 56
  },
  {
    id: 2, slug: 'battle-through-the-heavens-season-5',
    title: 'Battle Through The Heavens Season 5', title_native: '斗破苍穹年番', title_english: 'Battle Through the Heavens S5',
    description: 'Fifth season of Doupo Cangqiong. Xiao Yan continues his cultivation journey, facing new enemies and challenges as he searches for his missing mother.',
    cover_image: 'https://image.tmdb.org/t/p/w500/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2022,
    genres: '["Action","Adventure","Fantasy","Martial Arts"]',
    studios: '["B.C May Animation"]',
    rating: 8.4, vote_count: 18900, view_count: 120000,
    is_featured: 1, is_trending: 1, is_popular: 1,
    latest_ep: 48, total_episodes: 48
  },
  {
    id: 3, slug: 'swallowed-star',
    title: 'Swallowed Star', title_native: '吞噬星空', title_english: 'Swallowed Star',
    description: 'After a global catastrophe, monsters emerged and humanity had to evolve or perish. Luo Feng, an exceptional young talent, survives and must now build his power in a new dangerous world.',
    cover_image: 'https://image.tmdb.org/t/p/w500/7QMsOTMUSwF0Q8e5BV7kS1GMSQK.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/7QMsOTMUSwF0Q8e5BV7kS1GMSQK.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2023,
    genres: '["Action","Adventure","Fantasy","Sci-Fi"]',
    studios: '["Sparkly Key Animation"]',
    rating: 8.4, vote_count: 15300, view_count: 98000,
    is_featured: 1, is_trending: 1, is_popular: 1,
    latest_ep: 42, total_episodes: 42
  },
  {
    id: 4, slug: 'soul-land-2',
    title: 'Soul Land 2: The Peerless Tang Clan', title_native: '斗罗大陆Ⅱ绝世唐门', title_english: 'Soul Land II',
    description: 'A strange continent in another world. No magic, no battle qi, no martial arts, only martial spirits. Ten thousand years after the Tang clan was founded on the Douluo Continent.',
    cover_image: 'https://image.tmdb.org/t/p/w500/5mTrTWwI0iHs97BAGanCQa2D7Gb.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/5mTrTWwI0iHs97BAGanCQa2D7Gb.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2023,
    genres: '["Action","Adventure","Fantasy","Martial Arts"]',
    studios: '["Sparkly Key Animation"]',
    rating: 8.1, vote_count: 9800, view_count: 76000,
    is_featured: 0, is_trending: 0, is_popular: 1,
    latest_ep: 36, total_episodes: 36
  },
  {
    id: 5, slug: 'tales-of-herding-gods',
    title: 'Tales of Herding Gods', title_native: '牧神记', title_english: 'Celestial Shepherd Chronicles',
    description: 'In the Disabled Elderly Village, there live nine elderly people with unpredictable origins and the young man Qin Mu they raised. One day, the cows that Qin Mu was herding came across a piece of divine metal, initiating the young man\'s journey to the outside world.',
    cover_image: 'https://image.tmdb.org/t/p/w500/vB8o2p4ETnrfiWEgVxHmHWP9yRl.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/vB8o2p4ETnrfiWEgVxHmHWP9yRl.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2024,
    genres: '["Action","Adventure","Fantasy","Historical"]',
    studios: '["Tencent Animation"]',
    rating: 8.3, vote_count: 7600, view_count: 54000,
    is_featured: 0, is_trending: 1, is_popular: 1,
    latest_ep: 24, total_episodes: 24
  },
  {
    id: 6, slug: 'sword-and-fairy-3',
    title: 'Sword and Fairy 3', title_native: '仙剑奇侠传三', title_english: 'Chinese Paladin 3',
    description: 'A thousand years ago, the divine general Fei Peng and the Demon Sovereign Chong Lou engaged in a fierce battle in the New Immortal Realm. A millennium later, Jing Tian and his companions embark on an adventure to collect the Five Spirit Orbs.',
    cover_image: 'https://image.tmdb.org/t/p/w500/9dJfDFg6Lgm9xBOaJxqkXqcjn6k.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/9dJfDFg6Lgm9xBOaJxqkXqcjn6k.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2025,
    genres: '["Action","Adventure","Fantasy","Historical","Martial Arts"]',
    studios: '["WeTV"]',
    rating: 8.7, vote_count: 5200, view_count: 42000,
    is_featured: 1, is_trending: 1, is_popular: 1,
    latest_ep: 16, total_episodes: 16
  },
  {
    id: 7, slug: 'soul-land',
    title: 'Soul Land', title_native: '斗罗大陆', title_english: 'Douluo Dalu',
    description: 'Tang San, a proud disciple of the Tang Outer Sect, is expelled after stealing core knowledge of the sect. He sacrifices himself by jumping off the forbidden area cliff. Unexpectedly, he is reincarnated in the Douluo Continent, a world where everyone possesses a Martial Soul.',
    cover_image: 'https://image.tmdb.org/t/p/w500/kEf8PjYXFbQ1hfMNPNQNI1KJdXh.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/kEf8PjYXFbQ1hfMNPNQNI1KJdXh.jpg',
    status: 'Completed', type: 'ONA', release_year: 2018,
    genres: '["Action","Adventure","Fantasy","Martial Arts"]',
    studios: '["Tencent Animation"]',
    rating: 8.8, vote_count: 45000, view_count: 320000,
    is_featured: 0, is_trending: 0, is_popular: 1,
    latest_ep: 240, total_episodes: 240
  },
  {
    id: 8, slug: 'daily-life-immortal-king',
    title: 'The Daily Life of the Immortal King', title_native: '仙王的日常生活', title_english: 'Daily Life of the Immortal King',
    description: 'Wang Ling, a cultivation genius who has defeated powerful enemies since he was a baby, now just wants to eat instant noodles and get through high school. But the universe refuses to leave him alone.',
    cover_image: 'https://image.tmdb.org/t/p/w500/2JVwxlNBpKJFkWnkfTq3EiWJRiv.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/2JVwxlNBpKJFkWnkfTq3EiWJRiv.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2020,
    genres: '["Action","Fantasy","Comedy","Slice of Life"]',
    studios: '["Bilibili Animation"]',
    rating: 8.0, vote_count: 22000, view_count: 180000,
    is_featured: 0, is_trending: 0, is_popular: 1,
    latest_ep: 40, total_episodes: 40
  },
  {
    id: 9, slug: 'heaven-officials-blessing',
    title: "Heaven Official's Blessing", title_native: '天官赐福', title_english: "Heaven Official's Blessing",
    description: 'Eight hundred years ago, Xie Lian was the Crown Prince of the Xian Le kingdom. Now he ascends to the heavens for the third time as a nameless god, starting his journey in the divine realm.',
    cover_image: 'https://image.tmdb.org/t/p/w500/pGJGmJJXlEFLrAn1kx9A1K1BPNW.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/pGJGmJJXlEFLrAn1kx9A1K1BPNW.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2023,
    genres: '["Fantasy","Romance","Historical","Adventure"]',
    studios: '["Bilibili Animation"]',
    rating: 9.0, vote_count: 38000, view_count: 260000,
    is_featured: 1, is_trending: 1, is_popular: 1,
    latest_ep: 24, total_episodes: 24
  },
  {
    id: 10, slug: 'btth-season-4',
    title: 'Battle Through The Heavens Season 4', title_native: '斗破苍穹 第四季', title_english: 'BTTH S4',
    description: 'The fourth season continues the epic cultivation journey of Xiao Yan as he faces even more powerful enemies and discovers the secrets behind his mother\'s disappearance.',
    cover_image: 'https://image.tmdb.org/t/p/w500/3V3foEEzRjcVmjFjxh7BpKoBpxN.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/3V3foEEzRjcVmjFjxh7BpKoBpxN.jpg',
    status: 'Completed', type: 'ONA', release_year: 2021,
    genres: '["Action","Adventure","Fantasy","Martial Arts"]',
    studios: '["B.C May Animation"]',
    rating: 8.2, vote_count: 16000, view_count: 145000,
    is_featured: 0, is_trending: 0, is_popular: 1,
    latest_ep: 16, total_episodes: 16
  },
  {
    id: 11, slug: 'martial-universe',
    title: 'Martial Universe', title_native: '武动乾坤', title_english: 'Martial Universe',
    description: 'Lin Dong, a young man from the Lin family. He accidentally obtains a mysterious stone talisman and begins his journey as a cultivator to become the strongest in the martial world.',
    cover_image: 'https://image.tmdb.org/t/p/w500/bKMd56tXxCHXaLO2JKDdtQvlFRa.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/bKMd56tXxCHXaLO2JKDdtQvlFRa.jpg',
    status: 'Completed', type: 'ONA', release_year: 2019,
    genres: '["Action","Adventure","Fantasy","Martial Arts"]',
    studios: '["BaseFx Animation"]',
    rating: 7.8, vote_count: 14000, view_count: 112000,
    is_featured: 0, is_trending: 0, is_popular: 1,
    latest_ep: 40, total_episodes: 40
  },
  {
    id: 12, slug: 'the-king-of-the-world',
    title: 'Throne of Seal', title_native: '斗罗大陆之绝世唐门外传', title_english: 'Throne of Seal',
    description: 'A young man born with an unusual talent enters the world of ancient seals and martial arts. He must train under mysterious circumstances to become the strongest.',
    cover_image: 'https://image.tmdb.org/t/p/w500/6KErczPBROKMWkP5y8lXS0BgDpV.jpg',
    banner_image: 'https://image.tmdb.org/t/p/original/6KErczPBROKMWkP5y8lXS0BgDpV.jpg',
    status: 'Ongoing', type: 'ONA', release_year: 2024,
    genres: '["Action","Fantasy","Adventure"]',
    studios: '["Tencent Animation"]',
    rating: 7.9, vote_count: 8200, view_count: 67000,
    is_featured: 0, is_trending: 1, is_popular: 1,
    latest_ep: 20, total_episodes: 20
  }
]

// Demo episodes - 12 episodes per anime using open source videos
export function getDemoEpisodes(animeId: number, slug: string, count: number = 12): any[] {
  const videos = DEMO_VIDEO_URLS
  return Array.from({ length: count }, (_, i) => ({
    id: animeId * 100 + i + 1,
    anime_id: animeId,
    episode_number: i + 1,
    title: `Episode ${i + 1}`,
    description: `Watch episode ${i + 1} of this amazing donghua series.`,
    video_url: videos[i % videos.length],
    embed_url: null,
    thumbnail: `https://picsum.photos/seed/${slug}${i}/320/180`,
    air_date: `2024-0${Math.min(i + 1, 9)}-01`,
    duration: '24 min',
    view_count: Math.floor(Math.random() * 50000) + 5000,
    created_at: new Date(Date.now() - (count - i) * 7 * 24 * 60 * 60 * 1000).toISOString()
  }))
}

// Demo schedule data
export const DEMO_SCHEDULE = [
  { anime_id: 1, title: 'Renegade Immortal', slug: 'renegade-immortal', cover_image: 'https://image.tmdb.org/t/p/w500/9vBqv4a2KArKzjS0oHLYj7u2Q4e.jpg', day_of_week: 'Monday', air_time: '20:00', status: 'Ongoing' },
  { anime_id: 2, title: 'Battle Through The Heavens S5', slug: 'battle-through-the-heavens-season-5', cover_image: 'https://image.tmdb.org/t/p/w500/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg', day_of_week: 'Tuesday', air_time: '21:00', status: 'Ongoing' },
  { anime_id: 3, title: 'Swallowed Star', slug: 'swallowed-star', cover_image: 'https://image.tmdb.org/t/p/w500/7QMsOTMUSwF0Q8e5BV7kS1GMSQK.jpg', day_of_week: 'Wednesday', air_time: '20:30', status: 'Ongoing' },
  { anime_id: 6, title: 'Sword and Fairy 3', slug: 'sword-and-fairy-3', cover_image: 'https://image.tmdb.org/t/p/w500/9dJfDFg6Lgm9xBOaJxqkXqcjn6k.jpg', day_of_week: 'Thursday', air_time: '20:00', status: 'Ongoing' },
  { anime_id: 5, title: 'Tales of Herding Gods', slug: 'tales-of-herding-gods', cover_image: 'https://image.tmdb.org/t/p/w500/vB8o2p4ETnrfiWEgVxHmHWP9yRl.jpg', day_of_week: 'Friday', air_time: '21:30', status: 'Ongoing' },
  { anime_id: 9, title: "Heaven Official's Blessing", slug: 'heaven-officials-blessing', cover_image: 'https://image.tmdb.org/t/p/w500/pGJGmJJXlEFLrAn1kx9A1K1BPNW.jpg', day_of_week: 'Saturday', air_time: '19:00', status: 'Ongoing' },
  { anime_id: 12, title: 'Throne of Seal', slug: 'the-king-of-the-world', cover_image: 'https://image.tmdb.org/t/p/w500/6KErczPBROKMWkP5y8lXS0BgDpV.jpg', day_of_week: 'Sunday', air_time: '20:00', status: 'Ongoing' },
]
