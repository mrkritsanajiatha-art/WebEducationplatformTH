'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoBadge } from '@/components/neo/NeoBadge'
import { getAiArticlesList } from '@/lib/firebase/services/aiArticles'
import { getPromptsList } from '@/lib/firebase/services/prompts'
import { withFirestoreTimeout } from '@/lib/firebase/withTimeout'
import type { AiArticle, Prompt } from '@/types'

const AI_CATEGORIES = [
  { id: 'gemini', label: 'Gemini', emoji: '♊' },
  { id: 'chatgpt', label: 'ChatGPT', emoji: '🤖' },
  { id: 'notebooklm', label: 'NotebookLM', emoji: '📓' },
  { id: 'canva', label: 'Canva AI', emoji: '🎨' },
  { id: 'other', label: 'อื่นๆ', emoji: '✨' },
]

const PROMPT_CATEGORY_LABEL: Record<string, string> = {
  teaching: 'การสอน', research: 'วิจัย', admin: 'บริหาร', creative: 'สร้างสรรค์', ai: 'AI',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button onClick={handleCopy}
      className="text-xs px-3 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors font-medium">
      {copied ? '✓ คัดลอกแล้ว' : '📋 คัดลอก'}
    </button>
  )
}

export default function AiHubPage() {
  const [articles, setArticles]   = useState<AiArticle[]>([])
  const [prompts, setPrompts]     = useState<Prompt[]>([])
  const [activeTab, setActiveTab] = useState<'articles' | 'prompts'>('articles')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      withFirestoreTimeout(getAiArticlesList({ maxItems: 20 })).catch(() => []),
      withFirestoreTimeout(getPromptsList({ maxItems: 30 })).catch(() => []),
    ]).then(([a, p]) => { setArticles(a as typeof articles); setPrompts(p as typeof prompts) }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">🤖 AI Hub</h1>
        <p className="text-[var(--color-text-muted)] text-lg">รวมความรู้ AI สำหรับครู · Gemini · ChatGPT · NotebookLM · Canva AI</p>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {AI_CATEGORIES.map(cat => (
          <span key={cat.id}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-card)] [box-shadow:var(--shadow-neo-sm)] text-sm font-medium hover:scale-105 transition-transform cursor-pointer">
            {cat.emoji} {cat.label}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-[var(--color-card)] p-1 rounded-2xl w-fit mx-auto [box-shadow:var(--shadow-neo-sm)]">
        {([['articles', '📚 บทความ'], ['prompts', '💡 Prompt Hub']] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? 'gradient-primary text-white [box-shadow:var(--shadow-neo-sm)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-[var(--radius)] bg-[var(--color-card)] animate-pulse" />)}
        </div>
      ) : activeTab === 'articles' ? (
        articles.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <p className="text-4xl mb-3">🤖</p>
            <p>ยังไม่มีบทความ AI Hub — ผู้ดูแลระบบสามารถเพิ่มได้ที่ Admin Panel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link key={article.id} href={`/ai-hub/${article.slug}`} className="block">
                <NeoCard className="h-full flex flex-col gap-3">
                  {article.coverUrl && (
                    <img src={article.coverUrl} alt={article.title} className="w-full aspect-video object-cover rounded-xl" />
                  )}
                  <div className="flex items-center gap-2">
                    <NeoBadge variant="info">{AI_CATEGORIES.find(c => c.id === article.category)?.label ?? article.category}</NeoBadge>
                  </div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{article.summary}</p>
                </NeoCard>
              </Link>
            ))}
          </div>
        )
      ) : (
        prompts.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <p className="text-4xl mb-3">💡</p>
            <p>ยังไม่มี Prompt — ผู้ดูแลระบบสามารถเพิ่มได้ที่ Admin Panel</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {prompts.map(prompt => (
              <NeoCard key={prompt.id} hover={false} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{prompt.title}</span>
                      <NeoBadge variant="info">{PROMPT_CATEGORY_LABEL[prompt.category] ?? prompt.category}</NeoBadge>
                    </div>
                    {prompt.description && <p className="text-sm text-[var(--color-text-muted)]">{prompt.description}</p>}
                  </div>
                  <CopyButton text={prompt.content} />
                </div>
                <pre className="bg-[var(--color-bg)] rounded-xl p-4 text-sm text-[var(--color-text)] whitespace-pre-wrap font-mono leading-relaxed">
                  {prompt.content}
                </pre>
                {prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map(tag => <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">#{tag}</span>)}
                  </div>
                )}
              </NeoCard>
            ))}
          </div>
        )
      )}
    </div>
  )
}
