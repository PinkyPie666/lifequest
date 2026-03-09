export interface TemplateHabit {
  emoji: string;
  name: string;
  description: string;
  category: string;
  importance: number;
  reminder_time: string;
}

export interface HabitTemplate {
  id: string;
  emoji: string;
  name: string;
  description: string;
  category: TemplateCategory;
  habits: TemplateHabit[];
  popularity: number;
  isPopular?: boolean;
  gradient: string;
  tags: string[];
}

export type TemplateCategory =
  | "health"
  | "mind"
  | "finance"
  | "learning"
  | "productivity"
  | "lifestyle"
  | "challenge";

export const TEMPLATE_CATEGORIES: { id: TemplateCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "ทั้งหมด", emoji: "🔥" },
  { id: "health", label: "สุขภาพ", emoji: "💪" },
  { id: "mind", label: "จิตใจ", emoji: "🧘" },
  { id: "finance", label: "การเงิน", emoji: "💰" },
  { id: "learning", label: "การเรียนรู้", emoji: "📚" },
  { id: "productivity", label: "โปรดักทีฟ", emoji: "🎯" },
  { id: "lifestyle", label: "ไลฟ์สไตล์", emoji: "🌟" },
  { id: "challenge", label: "ชาเลนจ์", emoji: "⚔️" },
];

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // ─── POPULAR ────────────────────────
  {
    id: "30day-transform",
    emoji: "🔥",
    name: "30 วันเปลี่ยนชีวิต",
    description: "แพ็คเกจครบทุกด้าน ออกกำลัง กิน นอน สมาธิ — เปลี่ยนตัวเองใน 30 วัน",
    category: "challenge",
    popularity: 9800,
    isPopular: true,
    gradient: "from-orange-500 to-red-600",
    tags: ["ยอดฮิต", "ครบวงจร"],
    habits: [
      { emoji: "🏃", name: "ออกกำลังกาย 30 นาที", description: "วิ่ง เวท หรือโยคะ", category: "health", importance: 8, reminder_time: "07:00" },
      { emoji: "🥗", name: "กินอาหารสุขภาพ", description: "ลดน้ำตาล ลดของทอด", category: "health", importance: 7, reminder_time: "12:00" },
      { emoji: "💧", name: "ดื่มน้ำ 8 แก้ว", description: "ดื่มน้ำเปล่าให้ครบ", category: "health", importance: 5, reminder_time: "09:00" },
      { emoji: "😴", name: "นอน 4 ทุ่ม", description: "เข้านอนก่อน 4 ทุ่ม", category: "health", importance: 8, reminder_time: "21:30" },
      { emoji: "🧘", name: "ทำสมาธิ 10 นาที", description: "นั่งสมาธิหรือฝึกหายใจ", category: "mind", importance: 6, reminder_time: "06:30" },
    ],
  },
  {
    id: "boostfit",
    emoji: "💪",
    name: "BoostFit Challenge",
    description: "โปรแกรมฟิตเนสสำหรับคนที่อยากเริ่มต้นออกกำลังกายอย่างจริงจัง",
    category: "health",
    popularity: 8500,
    isPopular: true,
    gradient: "from-emerald-500 to-teal-600",
    tags: ["ยอดฮิต", "ฟิตเนส"],
    habits: [
      { emoji: "🏋️", name: "Workout 45 นาที", description: "เวทเทรนนิ่ง หรือ HIIT", category: "health", importance: 9, reminder_time: "06:30" },
      { emoji: "🥤", name: "โปรตีนหลังออกกำลัง", description: "กินโปรตีน 20-30g", category: "health", importance: 6, reminder_time: "08:00" },
      { emoji: "🧘", name: "ยืดเหยียด 10 นาที", description: "ยืดเหยียดหลังออกกำลัง", category: "health", importance: 5, reminder_time: "07:30" },
      { emoji: "💧", name: "ดื่มน้ำ 3 ลิตร", description: "ดื่มน้ำให้เพียงพอ", category: "health", importance: 7, reminder_time: "09:00" },
    ],
  },
  {
    id: "early-bird",
    emoji: "🌅",
    name: "Early Bird ตื่นเช้า",
    description: "เปลี่ยนตัวเองเป็นคนตื่นเช้า มี morning routine ที่ดี เริ่มวันอย่างมีพลัง",
    category: "lifestyle",
    popularity: 7200,
    isPopular: true,
    gradient: "from-amber-400 to-orange-500",
    tags: ["ยอดฮิต", "ตื่นเช้า"],
    habits: [
      { emoji: "⏰", name: "ตื่น 6 โมง", description: "ตั้งนาฬิกาปลุก ตื่นทันที", category: "health", importance: 9, reminder_time: "05:55" },
      { emoji: "🚿", name: "อาบน้ำเย็น", description: "อาบน้ำเย็นให้ตื่นตัว", category: "health", importance: 5, reminder_time: "06:05" },
      { emoji: "📝", name: "เขียน Morning Journal", description: "เขียน 3 สิ่งที่ขอบคุณ", category: "mind", importance: 6, reminder_time: "06:15" },
      { emoji: "☀️", name: "รับแดดเช้า 10 นาที", description: "ออกไปรับแสงแดด", category: "health", importance: 7, reminder_time: "06:30" },
    ],
  },
  // ─── HEALTH ────────────────────────
  {
    id: "eat-clean",
    emoji: "🥗",
    name: "Eat Clean กินคลีน",
    description: "ปรับนิสัยการกิน กินอาหารสุขภาพ ลดของหวาน ลดน้ำหนัก",
    category: "health",
    popularity: 5400,
    gradient: "from-green-400 to-emerald-600",
    tags: ["อาหาร", "ลดน้ำหนัก"],
    habits: [
      { emoji: "🥗", name: "กินผัก-ผลไม้", description: "กินผักหรือผลไม้ทุกมื้อ", category: "health", importance: 7, reminder_time: "12:00" },
      { emoji: "🚫", name: "งดน้ำหวาน", description: "ดื่มน้ำเปล่าแทน", category: "health", importance: 8, reminder_time: "10:00" },
      { emoji: "🍳", name: "ทำอาหารเอง", description: "ทำอาหารกินเองอย่างน้อย 1 มื้อ", category: "health", importance: 6, reminder_time: "17:00" },
      { emoji: "📊", name: "บันทึกแคลอรี่", description: "จดอาหารที่กินทุกมื้อ", category: "health", importance: 5, reminder_time: "20:00" },
    ],
  },
  {
    id: "sleep-master",
    emoji: "😴",
    name: "Sleep Master นอนหลับดี",
    description: "ปรับปรุงคุณภาพการนอน หลับง่ายขึ้น ตื่นมาสดชื่น",
    category: "health",
    popularity: 4800,
    gradient: "from-indigo-500 to-purple-700",
    tags: ["การนอน", "สุขภาพ"],
    habits: [
      { emoji: "📵", name: "วางมือถือก่อนนอน 1 ชม.", description: "ไม่ดูจอก่อนนอน", category: "health", importance: 8, reminder_time: "21:00" },
      { emoji: "🫖", name: "ดื่มชาก่อนนอน", description: "ชาคาโมมายล์หรือชาร้อน", category: "health", importance: 4, reminder_time: "21:30" },
      { emoji: "📖", name: "อ่านหนังสือก่อนนอน", description: "อ่านหนังสือ 15-30 นาที", category: "learning", importance: 6, reminder_time: "21:45" },
      { emoji: "😴", name: "เข้านอน 4 ทุ่ม", description: "ปิดไฟนอนตรงเวลา", category: "health", importance: 9, reminder_time: "22:00" },
    ],
  },
  {
    id: "running-club",
    emoji: "🏃",
    name: "Running Club วิ่งทุกวัน",
    description: "เริ่มต้นเป็นนักวิ่ง สร้างนิสัยวิ่งทุกวัน ฟิตร่างกาย",
    category: "health",
    popularity: 4200,
    gradient: "from-cyan-400 to-blue-600",
    tags: ["วิ่ง", "คาร์ดิโอ"],
    habits: [
      { emoji: "🏃", name: "วิ่ง 3-5 กม.", description: "วิ่งจ๊อกกิ้งหรือวิ่งเร็ว", category: "health", importance: 8, reminder_time: "06:00" },
      { emoji: "🧘", name: "วอร์มอัพ-คูลดาวน์", description: "ยืดเหยียดก่อนและหลังวิ่ง", category: "health", importance: 5, reminder_time: "05:50" },
      { emoji: "📊", name: "บันทึกระยะทาง", description: "จดระยะทางและเวลา", category: "health", importance: 4, reminder_time: "07:00" },
    ],
  },
  // ─── MIND ────────────────────────
  {
    id: "zen-mode",
    emoji: "🧘",
    name: "Zen Mode โหมดสงบ",
    description: "ฝึกสมาธิ ลดความเครียด สร้างจิตใจที่สงบและมั่นคง",
    category: "mind",
    popularity: 5100,
    gradient: "from-purple-400 to-violet-600",
    tags: ["สมาธิ", "ลดเครียด"],
    habits: [
      { emoji: "🧘", name: "ทำสมาธิ 15 นาที", description: "นั่งสมาธิ หรือใช้แอป", category: "mind", importance: 8, reminder_time: "06:30" },
      { emoji: "🌬️", name: "ฝึกหายใจลึก", description: "Box breathing 4-4-4-4", category: "mind", importance: 5, reminder_time: "12:00" },
      { emoji: "📝", name: "เขียนบันทึกความรู้สึก", description: "เขียนสิ่งที่รู้สึกในวันนี้", category: "mind", importance: 6, reminder_time: "21:00" },
      { emoji: "🙏", name: "ขอบคุณ 3 สิ่ง", description: "เขียน 3 สิ่งที่ขอบคุณ", category: "mind", importance: 7, reminder_time: "21:30" },
    ],
  },
  {
    id: "gratitude",
    emoji: "🙏",
    name: "Gratitude ฝึกขอบคุณ",
    description: "ฝึกมองโลกในแง่บวก ซาบซึ้งกับสิ่งเล็กๆ ในชีวิตประจำวัน",
    category: "mind",
    popularity: 3800,
    gradient: "from-pink-400 to-rose-600",
    tags: ["ขอบคุณ", "มองบวก"],
    habits: [
      { emoji: "🙏", name: "เขียนขอบคุณ 3 ข้อ", description: "เขียนตอนเช้า", category: "mind", importance: 7, reminder_time: "07:00" },
      { emoji: "💌", name: "ส่งข้อความดีๆ 1 คน", description: "ขอบคุณหรือชมใครสักคน", category: "mind", importance: 6, reminder_time: "10:00" },
      { emoji: "🌸", name: "สังเกตสิ่งสวยงาม", description: "หยุดชื่นชมสิ่งรอบตัว", category: "mind", importance: 4, reminder_time: "15:00" },
    ],
  },
  {
    id: "digital-detox",
    emoji: "📵",
    name: "Digital Detox ลดหน้าจอ",
    description: "ลดเวลาบนมือถือ เลิกติด social media มีเวลาให้ตัวเองมากขึ้น",
    category: "mind",
    popularity: 4500,
    gradient: "from-slate-400 to-gray-600",
    tags: ["ลดจอ", "สมดุล"],
    habits: [
      { emoji: "📵", name: "ไม่เล่นมือถือ 1 ชม. แรก", description: "ตื่นมาไม่หยิบมือถือ", category: "mind", importance: 8, reminder_time: "06:00" },
      { emoji: "⏱️", name: "จำกัด Social 30 นาที", description: "ใช้ screen time limit", category: "mind", importance: 7, reminder_time: "10:00" },
      { emoji: "🌅", name: "วางมือถือหลัง 3 ทุ่ม", description: "ไม่ใช้มือถือก่อนนอน", category: "mind", importance: 9, reminder_time: "21:00" },
    ],
  },
  // ─── FINANCE ────────────────────────
  {
    id: "money-wise",
    emoji: "💰",
    name: "Money Wise ออมเงิน",
    description: "สร้างนิสัยการเงินที่ดี ออมเงินทุกวัน รู้รายรับ-รายจ่าย",
    category: "finance",
    popularity: 5600,
    gradient: "from-yellow-400 to-amber-600",
    tags: ["ออมเงิน", "การเงิน"],
    habits: [
      { emoji: "📊", name: "บันทึกรายจ่าย", description: "จดรายจ่ายทุกรายการ", category: "finance", importance: 8, reminder_time: "20:00" },
      { emoji: "🐷", name: "ออมเงิน 50 บาท", description: "โอนเข้าบัญชีออม", category: "finance", importance: 7, reminder_time: "09:00" },
      { emoji: "🚫", name: "ไม่ซื้อของไม่จำเป็น", description: "คิดก่อนซื้อ 24 ชม.", category: "finance", importance: 6, reminder_time: "12:00" },
      { emoji: "📰", name: "อ่านข่าวการเงิน", description: "ติดตามข่าวการเงิน 10 นาที", category: "finance", importance: 4, reminder_time: "08:00" },
    ],
  },
  {
    id: "investor-starter",
    emoji: "📈",
    name: "นักลงทุนมือใหม่",
    description: "เริ่มต้นเรียนรู้การลงทุน DCA หุ้น กองทุน คริปโต",
    category: "finance",
    popularity: 3400,
    gradient: "from-emerald-400 to-green-600",
    tags: ["ลงทุน", "เรียนรู้"],
    habits: [
      { emoji: "📚", name: "อ่านบทความลงทุน", description: "อ่านบทความหรือหนังสือ 15 นาที", category: "finance", importance: 7, reminder_time: "08:00" },
      { emoji: "📊", name: "เช็คพอร์ต", description: "ดูพอร์ตลงทุน 5 นาที", category: "finance", importance: 4, reminder_time: "09:00" },
      { emoji: "📝", name: "จดสิ่งที่เรียนรู้", description: "เขียนสรุปสิ่งที่ได้เรียน", category: "finance", importance: 6, reminder_time: "20:00" },
    ],
  },
  // ─── LEARNING ────────────────────────
  {
    id: "english-daily",
    emoji: "🇬🇧",
    name: "English Daily ภาษาอังกฤษ",
    description: "ฝึกภาษาอังกฤษทุกวัน ฟัง พูด อ่าน เขียน ครบ 4 ทักษะ",
    category: "learning",
    popularity: 6100,
    gradient: "from-blue-400 to-indigo-600",
    tags: ["ภาษา", "อังกฤษ"],
    habits: [
      { emoji: "📖", name: "เรียนศัพท์ 10 คำ", description: "ท่องศัพท์ใหม่ทุกวัน", category: "learning", importance: 7, reminder_time: "08:00" },
      { emoji: "🎧", name: "ฟัง Podcast อังกฤษ", description: "ฟังอย่างน้อย 15 นาที", category: "learning", importance: 6, reminder_time: "12:00" },
      { emoji: "✍️", name: "เขียนไดอารี่อังกฤษ", description: "เขียน 5-10 ประโยค", category: "learning", importance: 8, reminder_time: "21:00" },
      { emoji: "🗣️", name: "พูดอังกฤษ 5 นาที", description: "ฝึกพูดกับตัวเอง/แอป", category: "learning", importance: 7, reminder_time: "18:00" },
    ],
  },
  {
    id: "bookworm",
    emoji: "📖",
    name: "Bookworm หนอนหนังสือ",
    description: "สร้างนิสัยการอ่าน อ่านหนังสืออย่างน้อย 1 เล่มต่อเดือน",
    category: "learning",
    popularity: 4600,
    gradient: "from-amber-400 to-yellow-600",
    tags: ["อ่านหนังสือ", "ความรู้"],
    habits: [
      { emoji: "📖", name: "อ่านหนังสือ 30 นาที", description: "อ่านหนังสือจริงๆ ไม่ใช่จอ", category: "learning", importance: 8, reminder_time: "21:00" },
      { emoji: "📝", name: "จดโน้ตสิ่งที่อ่าน", description: "สรุปสิ่งที่ได้เรียนรู้", category: "learning", importance: 5, reminder_time: "21:30" },
      { emoji: "💬", name: "แชร์ให้คนอื่นฟัง", description: "เล่าสิ่งที่อ่านให้เพื่อน/ครอบครัว", category: "learning", importance: 4, reminder_time: "19:00" },
    ],
  },
  {
    id: "code-daily",
    emoji: "💻",
    name: "Code Every Day โค้ดทุกวัน",
    description: "ฝึกเขียนโค้ดทุกวัน พัฒนาสกิล build projects จริง",
    category: "learning",
    popularity: 3900,
    gradient: "from-cyan-400 to-teal-600",
    tags: ["โปรแกรม", "เทค"],
    habits: [
      { emoji: "💻", name: "เขียนโค้ด 1 ชม.", description: "ทำโปรเจกต์ส่วนตัว", category: "learning", importance: 9, reminder_time: "19:00" },
      { emoji: "📚", name: "อ่าน Docs/Tutorial", description: "เรียนรู้เทคโนโลยีใหม่", category: "learning", importance: 6, reminder_time: "08:00" },
      { emoji: "🧩", name: "ทำโจทย์ Algorithm", description: "แก้โจทย์ LeetCode/HackerRank", category: "learning", importance: 7, reminder_time: "20:00" },
    ],
  },
  // ─── PRODUCTIVITY ────────────────────────
  {
    id: "productivity-beast",
    emoji: "🎯",
    name: "Productivity Beast สายโปรดัค",
    description: "ระบบจัดการเวลาและงานแบบมือโปร ทำได้มากขึ้นในเวลาน้อยลง",
    category: "productivity",
    popularity: 5800,
    gradient: "from-violet-400 to-purple-600",
    tags: ["จัดการเวลา", "โปรดักทีฟ"],
    habits: [
      { emoji: "📋", name: "วางแผนวัน (3 เป้าหมาย)", description: "เขียน 3 สิ่งที่ต้องทำวันนี้", category: "work", importance: 9, reminder_time: "07:00" },
      { emoji: "🍅", name: "Pomodoro 4 รอบ", description: "ทำงาน 25 นาที พัก 5 นาที", category: "work", importance: 8, reminder_time: "09:00" },
      { emoji: "📊", name: "Review สิ้นวัน", description: "สรุปสิ่งที่ทำได้วันนี้", category: "work", importance: 6, reminder_time: "20:00" },
      { emoji: "📵", name: "Deep Work 2 ชม.", description: "ทำงานลึกไม่มีสิ่งรบกวน", category: "work", importance: 9, reminder_time: "10:00" },
    ],
  },
  {
    id: "student-life",
    emoji: "📝",
    name: "Student Life ชีวิตนักเรียน",
    description: "จัดระเบียบการเรียน อ่านหนังสือ ทำการบ้าน สอบผ่านชิลล์",
    category: "productivity",
    popularity: 4100,
    gradient: "from-sky-400 to-blue-600",
    tags: ["นักเรียน", "การเรียน"],
    habits: [
      { emoji: "📖", name: "อ่านบทเรียน 1 ชม.", description: "ทบทวนสิ่งที่เรียนวันนี้", category: "learning", importance: 8, reminder_time: "18:00" },
      { emoji: "✍️", name: "ทำการบ้าน", description: "ทำการบ้านให้เสร็จ", category: "learning", importance: 9, reminder_time: "16:00" },
      { emoji: "📝", name: "สรุปสิ่งที่เรียน", description: "เขียน Mind Map หรือสรุป", category: "learning", importance: 6, reminder_time: "20:00" },
      { emoji: "⏰", name: "ตื่นแต่เช้า", description: "ตื่นก่อน 7 โมง", category: "health", importance: 7, reminder_time: "06:45" },
    ],
  },
  // ─── LIFESTYLE ────────────────────────
  {
    id: "self-care",
    emoji: "🌿",
    name: "Self-Care ดูแลตัวเอง",
    description: "ดูแลร่างกายและจิตใจ ให้เวลากับตัวเอง ผ่อนคลายและชาร์จพลัง",
    category: "lifestyle",
    popularity: 4300,
    gradient: "from-rose-400 to-pink-600",
    tags: ["ดูแลตัวเอง", "ผ่อนคลาย"],
    habits: [
      { emoji: "🧴", name: "Skincare เช้า-เย็น", description: "ทำขั้นตอน skincare", category: "health", importance: 5, reminder_time: "07:00" },
      { emoji: "🛁", name: "อาบน้ำอุ่นผ่อนคลาย", description: "ให้เวลาตัวเองผ่อนคลาย", category: "health", importance: 4, reminder_time: "20:00" },
      { emoji: "🎨", name: "ทำงานอดิเรก 30 นาที", description: "วาดรูป เล่นดนตรี ทำสิ่งที่ชอบ", category: "other", importance: 7, reminder_time: "19:00" },
      { emoji: "🌸", name: "ไม่ตำหนิตัวเอง", description: "พูดกับตัวเองดีๆ", category: "mind", importance: 6, reminder_time: "21:00" },
    ],
  },
  {
    id: "clean-life",
    emoji: "🧹",
    name: "Clean Life ชีวิตเป็นระเบียบ",
    description: "จัดบ้าน จัดห้อง จัดชีวิต — สะอาดจากข้างนอกถึงข้างใน",
    category: "lifestyle",
    popularity: 3200,
    gradient: "from-teal-400 to-emerald-600",
    tags: ["จัดระเบียบ", "ความสะอาด"],
    habits: [
      { emoji: "🛏️", name: "เก็บที่นอนทุกเช้า", description: "พับผ้าห่ม จัดหมอน", category: "other", importance: 5, reminder_time: "06:30" },
      { emoji: "🧹", name: "กวาด-ถูบ้าน", description: "ทำความสะอาดวันละ 15 นาที", category: "other", importance: 6, reminder_time: "18:00" },
      { emoji: "👕", name: "ซักผ้า จัดตู้เสื้อผ้า", description: "ซักผ้าไม่ให้ค้าง", category: "other", importance: 4, reminder_time: "09:00" },
      { emoji: "🗑️", name: "ทิ้งของไม่ใช้ 1 ชิ้น", description: "Declutter ทุกวัน", category: "other", importance: 5, reminder_time: "20:00" },
    ],
  },
  {
    id: "creative-hour",
    emoji: "🎨",
    name: "Creative Hour สร้างสรรค์",
    description: "ปลดปล่อยความคิดสร้างสรรค์ วาดรูป เขียน ทำเพลง ทุกวัน",
    category: "lifestyle",
    popularity: 3600,
    gradient: "from-fuchsia-400 to-pink-600",
    tags: ["ศิลปะ", "สร้างสรรค์"],
    habits: [
      { emoji: "🎨", name: "สร้างผลงาน 1 ชิ้น", description: "วาดรูป ถ่ายรูป เขียน ทำเพลง", category: "other", importance: 8, reminder_time: "19:00" },
      { emoji: "👀", name: "ดูผลงานสร้างแรงบันดาลใจ", description: "ดู Pinterest, Behance, YouTube", category: "learning", importance: 5, reminder_time: "12:00" },
      { emoji: "📝", name: "Sketch/Brainstorm", description: "สเก็ตช์ไอเดียลงสมุด", category: "other", importance: 6, reminder_time: "20:00" },
    ],
  },
  // ─── CHALLENGE ────────────────────────
  {
    id: "no-excuse",
    emoji: "⚔️",
    name: "No Excuse ไม่มีข้ออ้าง",
    description: "ชาเลนจ์สุดฮาร์ดคอร์ ไม่มีข้ออ้าง ทำทุกวันจนกลายเป็นนิสัย",
    category: "challenge",
    popularity: 4700,
    gradient: "from-red-500 to-rose-700",
    tags: ["ฮาร์ดคอร์", "ชาเลนจ์"],
    habits: [
      { emoji: "🏃", name: "ออกกำลังกายทุกวัน", description: "ไม่ว่าจะอะไรก็ออกกำลัง", category: "health", importance: 10, reminder_time: "06:00" },
      { emoji: "📖", name: "อ่านหนังสือ 30 นาที", description: "อ่านทุกวันไม่ขาด", category: "learning", importance: 8, reminder_time: "21:00" },
      { emoji: "💧", name: "ดื่มน้ำ 3 ลิตร", description: "ดื่มน้ำให้เพียงพอ", category: "health", importance: 6, reminder_time: "09:00" },
      { emoji: "📵", name: "ไม่เล่น Social 3 ชม.", description: "ลดเวลาบนโซเชียล", category: "mind", importance: 9, reminder_time: "10:00" },
      { emoji: "📝", name: "เขียนบันทึก", description: "สรุปวันนี้ก่อนนอน", category: "mind", importance: 5, reminder_time: "21:30" },
    ],
  },
];
