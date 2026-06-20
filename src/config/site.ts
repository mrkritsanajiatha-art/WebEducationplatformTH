// Default site config — overridden by Firestore settings.site at runtime
export const defaultSiteConfig = {
  orgNameTh: 'สมาพันธ์แพลตฟอร์มการศึกษาและอาชีพแห่งประเทศไทย',
  orgNameEn: 'Thailand Education & Career Platform Federation',
  description: 'องค์กรด้านการพัฒนาครู การพัฒนาวิชาชีพ งานวิจัย นวัตกรรม เทคโนโลยี AI และการสร้างอาชีพแห่งอนาคต',
  logoUrl: 'https://img1.pic.in.th/images/154444111930db4ab18869e27.png',
  faviconUrl: 'https://img1.pic.in.th/images/154444111930db4ab18869e27.png',
  address: {
    street: '262/4 ซอยสุคนธวิท 20',
    subdistrict: 'ตำบลตลาดกระทุ่มแบน',
    district: 'อำเภอกระทุ่มแบน',
    province: 'จังหวัดสมุทรสาคร',
    postalCode: '74110',
  },
  phone: '',
  email: '',
  lineOaName: 'ทำ วPA ด้วยแพลตฟอร์ม',
  lineId: '@640ertge',
  lineUrl: 'https://lin.ee/p6890TZG',
  ogImageUrl: 'https://img1.pic.in.th/images/154444111930db4ab18869e27.png',
} as const

export const defaultThemeConfig = {
  colors: {
    primary:   '#2563EB',
    secondary: '#38BDF8',
    accent:    '#06B6D4',
    success:   '#22C55E',
    warning:   '#F59E0B',
    bg:        '#EEF2F7',
    card:      '#F8FAFC',
    text:      '#0F172A',
  },
  fontHeading: 'Kanit',
  fontBody:    'Sarabun',
  radius:      24,
} as const

export const NAV_ITEMS = [
  { label: 'หน้าแรก',          href: '/',           icon: '🏠' },
  { label: 'VIP Member',       href: '/vip',         icon: '👑' },
  { label: 'หลักสูตรอบรม',     href: '/courses',     icon: '🎓' },
  { label: 'ห้องเรียนออนไลน์', href: '/learn',       icon: '📚' },
  { label: 'AI Hub',           href: '/ai-hub',      icon: '🤖' },
  { label: 'ผลงานวิชาการ',    href: '/academic',    icon: '📄' },
  { label: 'ดาวน์โหลด',       href: '/downloads',   icon: '⬇' },
  { label: 'Community',        href: '/community',   icon: '👥' },
  { label: 'ข่าวสาร',          href: '/news',        icon: '📰' },
  { label: 'เกี่ยวกับองค์กร',  href: '/about',       icon: '🏢' },
  { label: 'ติดต่อเรา',        href: '/contact',     icon: '☎' },
] as const

export const BOTTOM_NAV_ITEMS = [
  { label: 'หน้าแรก', href: '/',         icon: '🏠' },
  { label: 'หลักสูตร', href: '/courses', icon: '🎓' },
  { label: 'VIP',      href: '/vip',     icon: '👑' },
  { label: 'Community',href: '/community',icon: '👥' },
  { label: 'เพิ่มเติม', href: '/more',   icon: '☰' },
] as const

export const THAI_FONTS = ['Kanit', 'Prompt', 'Sarabun', 'IBM Plex Thai', 'Anuphan'] as const
