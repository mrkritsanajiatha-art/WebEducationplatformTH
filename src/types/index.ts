import type { Timestamp } from 'firebase/firestore'

// ─── Roles ────────────────────────────────────────────────
export type UserRole = 'guest' | 'member' | 'vip' | 'staff' | 'admin' | 'superadmin'

// ─── Site Settings ────────────────────────────────────────
export interface SiteSettings {
  orgNameTh: string
  orgNameEn: string
  description: string
  address: {
    street: string
    subdistrict: string
    district: string
    province: string
    postalCode: string
  }
  phone: string
  email: string
  lineOaName: string
  lineId: string
  lineUrl: string
  logoUrl: string
  faviconUrl: string
  ogImageUrl: string
}

export interface ThemeSettings {
  colors: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    bg: string
    card: string
    text: string
  }
  fontHeading: string
  fontBody: string
  radius: number
  shadowStyle: 'neomorphism' | 'flat' | 'elevated'
}

// ─── User ────────────────────────────────────────────────
export interface User {
  uid: string
  email: string
  displayName: string
  photoUrl: string | null
  phone: string
  role: UserRole
  vipMemberId: string | null
  province: string
  school: string
  status: 'active' | 'suspended'
  lastLoginAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── VIP Member ──────────────────────────────────────────
export interface VipMember {
  memberId: string
  firstName: string
  lastName: string
  nameSearch: string[]
  photoUrl: string
  province: string
  faculty: string
  startDate: Timestamp
  expireDate: Timestamp
  status: 'active' | 'expired'
  source: 'sheet1' | 'sheet2'
  syncedAt: Timestamp
}

// ─── Course ──────────────────────────────────────────────
export type AccessLevel = 'guest' | 'member' | 'vip'
export type CourseStatus = 'draft' | 'published' | 'archived'
export type LessonType = 'video' | 'pdf' | 'pptx' | 'docx' | 'text' | 'quiz'

export interface Course {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  categoryId: string
  coverUrl: string
  gallery: string[]
  instructors: { name: string; title: string; photoUrl: string; bio: string }[]
  price: number
  accessLevel: AccessLevel
  startDate: Timestamp | null
  endDate: Timestamp | null
  zoomUrl: string
  youtubeUrl: string
  enrollmentOpen: boolean
  capacity: number
  enrollCount: number
  lessonCount: number
  durationMin: number
  status: CourseStatus
  tags: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── News ────────────────────────────────────────────────
export type NewsStatus = 'draft' | 'scheduled' | 'published'

export interface News {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverUrl: string
  category: string
  tags: string[]
  author: { uid: string; name: string; photoUrl: string }
  status: NewsStatus
  publishAt: Timestamp | null
  viewCount: number
  pinned: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Download ────────────────────────────────────────────
export type FileType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip'

export interface Download {
  id: string
  title: string
  description: string
  category: string
  fileUrl: string
  fileName: string
  fileType: FileType
  fileSize: number
  accessLevel: AccessLevel
  downloadCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Menu ────────────────────────────────────────────────
export type MenuLocation = 'header' | 'footer' | 'bottomnav'

export interface MenuItem {
  id: string
  label: string
  icon: string
  href: string
  type: 'internal' | 'external' | 'page'
  parentId: string | null
  order: number
  roles: UserRole[]
  visible: boolean
  location: MenuLocation
}

// ─── Banner ──────────────────────────────────────────────
export interface Banner {
  id: string
  title: string
  imageUrl: string
  mobileImageUrl: string
  link: string
  position: 'hero' | 'strip' | 'popup'
  order: number
  active: boolean
  startAt: Timestamp | null
  endAt: Timestamp | null
}

// ─── Page Builder ─────────────────────────────────────────
export type BlockType = 'hero' | 'section' | 'cards' | 'cta' | 'html' | 'gallery' | 'stats' | 'faq' | 'partners'

export interface PageBlock {
  type: BlockType
  props: Record<string, unknown>
  order: number
}

export interface Page {
  id: string
  slug: string
  title: string
  blocks: PageBlock[]
  seo: { title: string; description: string; ogImage: string }
  status: 'draft' | 'published'
  template: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Community ────────────────────────────────────────────
export type CommunityCategory = 'ai' | 'canva' | 'gemini' | 'notebooklm' | 'research' | 'innovation' | 'wpa'

export interface CommunityPost {
  id: string
  authorId: string
  author: { name: string; photoUrl: string; role: UserRole }
  category: CommunityCategory
  content: string
  media: { type: 'image' | 'video'; url: string; w: number; h: number }[]
  likeCount: number
  commentCount: number
  shareCount: number
  status: 'published' | 'hidden' | 'removed'
  pinned: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Analytics ───────────────────────────────────────────
export interface AnalyticsRealtime {
  onlineUsers: number
  updatedAt: Timestamp
}

export interface AnalyticsDaily {
  members: number
  vipMembers: number
  learners: number
  courses: number
  revenue: number
  downloads: number
  signups: number
}
