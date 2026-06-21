'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { NeoButton } from '@/components/neo/NeoButton'
import { getLessonsByCourse, deleteLesson } from '@/lib/firebase/services/lessons'
import { getCourseById } from '@/lib/firebase/services/courses'
import type { CourseLesson } from '@/types'

const TYPE_ICON: Record<string, string> = { video: '🎬', pdf: '📄', pptx: '📑', docx: '📝', text: '📃', quiz: '❓' }

export default function AdminLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params)
  const [lessons, setLessons] = useState<CourseLesson[]>([])
  const [courseTitle, setCourseTitle] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([
      getLessonsByCourse(courseId),
      getCourseById(courseId),
    ]).then(([ls, course]) => {
      setLessons(ls)
      setCourseTitle(course?.title ?? '')
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [courseId])

  const handleDelete = async (lessonId: string, title: string) => {
    if (!confirm(`ลบบทเรียน "${title}"?`)) return
    await deleteLesson(lessonId)
    setLessons(prev => prev.filter(l => l.id !== lessonId))
  }

  return (
    <div>
      <AdminPageHeader
        title={`บทเรียน: ${courseTitle}`}
        backHref="/admin/courses"
        backLabel="← หลักสูตร"
        createHref={`/admin/courses/${courseId}/lessons/new`}
        createLabel="+ เพิ่มบทเรียน"
      />

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-[var(--color-card)] rounded-[var(--radius)] animate-pulse" />)}</div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <p className="text-4xl mb-3">📚</p>
          <p className="mb-4">ยังไม่มีบทเรียน</p>
          <Link href={`/admin/courses/${courseId}/lessons/new`}>
            <NeoButton variant="primary">+ เพิ่มบทเรียนแรก</NeoButton>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {lessons.map((lesson, idx) => (
            <div key={lesson.id} className="flex items-center gap-4 bg-[var(--color-card)] rounded-[var(--radius)] px-4 py-3 [box-shadow:var(--shadow-neo-sm)]">
              <span className="text-[var(--color-text-muted)] font-mono text-sm w-6">{idx + 1}</span>
              <span className="text-xl">{TYPE_ICON[lesson.type] ?? '📃'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{lesson.title}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{lesson.durationMin > 0 ? `${lesson.durationMin} นาที` : ''} {lesson.isPreview ? '· ตัวอย่างฟรี' : ''}</p>
              </div>
              <StatusBadge status={lesson.status as 'draft' | 'published'} />
              <div className="flex gap-2">
                <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}`}>
                  <NeoButton variant="ghost" size="sm">แก้ไข</NeoButton>
                </Link>
                <NeoButton variant="danger" size="sm" onClick={() => handleDelete(lesson.id, lesson.title)}>ลบ</NeoButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
