// Firestore collection names — single source of truth
export const COLLECTIONS = {
  settings:              'settings',
  users:                 'users',
  vipMembers:            'vipMembers',
  vipApplications:       'vipApplications',
  vipVerifications:      'vipVerifications',
  courseCategories:      'courseCategories',
  courses:               'courses',
  courseLessons:         'courseLessons',
  courseEnrollments:     'courseEnrollments',
  events:                'events',
  eventRegistrations:    'eventRegistrations',
  payments:              'payments',
  certificateTemplates:  'certificateTemplates',
  certificates:          'certificates',
  news:                  'news',
  downloads:             'downloads',
  communityPosts:        'communityPosts',
  communityComments:     'communityComments',
  promptCategories:      'promptCategories',
  prompts:               'prompts',
  aiArticles:            'aiArticles',
  notifications:         'notifications',
  banners:               'banners',
  menus:                 'menus',
  pages:                 'pages',
  partners:              'partners',
  analytics:             'analytics',
  auditLogs:             'auditLogs',
} as const

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS]

// Settings document IDs
export const SETTINGS_DOCS = {
  site:     'site',
  theme:    'theme',
  features: 'features',
  payment:  'payment',
  seo:      'seo',
} as const
