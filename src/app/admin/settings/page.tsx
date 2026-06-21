'use client'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS, SETTINGS_DOCS } from '@/lib/firebase/collections'
import { NeoCard } from '@/components/neo/NeoCard'
import { NeoInput } from '@/components/neo/NeoInput'
import { NeoButton } from '@/components/neo/NeoButton'
import { defaultSiteConfig } from '@/config/site'
import type { SiteSettings } from '@/types'

type PartialSettings = Partial<SiteSettings & { lineId: string; lineUrl: string; lineOaName: string }>

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PartialSettings>({
    orgNameTh: defaultSiteConfig.orgNameTh,
    orgNameEn: defaultSiteConfig.orgNameEn,
    description: defaultSiteConfig.description,
    logoUrl: defaultSiteConfig.logoUrl,
    phone: defaultSiteConfig.phone,
    email: defaultSiteConfig.email,
    lineId: defaultSiteConfig.lineId,
    lineUrl: defaultSiteConfig.lineUrl,
    lineOaName: defaultSiteConfig.lineOaName,
    address: defaultSiteConfig.address,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.settings, SETTINGS_DOCS.site))
        if (snap.exists()) {
          setSettings((prev) => ({ ...prev, ...snap.data() }))
        }
      } catch {
        // First time — use defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await setDoc(doc(db, COLLECTIONS.settings, SETTINGS_DOCS.site), {
        ...settings,
        updatedAt: serverTimestamp(),
      }, { merge: true })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save settings failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const set = (key: keyof PartialSettings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const setAddress = (key: keyof NonNullable<SiteSettings['address']>, value: string) =>
    setSettings((prev) => ({
      ...prev,
      address: { ...((prev.address) ?? defaultSiteConfig.address), [key]: value },
    }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">⚙️ ตั้งค่าเว็บไซต์</h1>
          <p className="text-[var(--color-text-muted)]">แก้ไขข้อมูลองค์กร โลโก้ และข้อมูลติดต่อ</p>
        </div>
        <NeoButton variant="primary" onClick={handleSave} loading={saving}>
          {saved ? '✓ บันทึกแล้ว' : 'บันทึก'}
        </NeoButton>
      </div>

      <div className="flex flex-col gap-6">
        {/* Organization */}
        <NeoCard hover={false}>
          <h2 className="font-bold mb-4">ข้อมูลองค์กร</h2>
          <div className="flex flex-col gap-4">
            <NeoInput
              label="ชื่อองค์กร (ภาษาไทย)"
              value={settings.orgNameTh ?? ''}
              onChange={(e) => set('orgNameTh', e.target.value)}
            />
            <NeoInput
              label="ชื่อองค์กร (ภาษาอังกฤษ)"
              value={settings.orgNameEn ?? ''}
              onChange={(e) => set('orgNameEn', e.target.value)}
            />
            <div>
              <label className="text-sm font-medium block mb-1.5">คำอธิบายองค์กร</label>
              <textarea
                className="w-full bg-[var(--color-card)] text-[var(--color-text)]
                  rounded-[var(--radius-sm)] border border-[var(--color-border)]
                  [box-shadow:var(--shadow-neo-inset)] px-4 py-2.5 text-base outline-none
                  focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-shadow resize-none"
                rows={3}
                value={settings.description ?? ''}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
            <NeoInput
              label="URL โลโก้"
              type="url"
              placeholder="https://..."
              value={settings.logoUrl ?? ''}
              onChange={(e) => set('logoUrl', e.target.value)}
            />
          </div>
        </NeoCard>

        {/* Contact */}
        <NeoCard hover={false}>
          <h2 className="font-bold mb-4">ข้อมูลติดต่อ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NeoInput
              label="เบอร์โทรศัพท์"
              type="tel"
              value={settings.phone ?? ''}
              onChange={(e) => set('phone', e.target.value)}
            />
            <NeoInput
              label="อีเมล"
              type="email"
              value={settings.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
            />
            <NeoInput
              label="LINE OA ชื่อ"
              value={settings.lineOaName ?? ''}
              onChange={(e) => set('lineOaName', e.target.value)}
            />
            <NeoInput
              label="LINE ID"
              placeholder="@xxxxxxxx"
              value={settings.lineId ?? ''}
              onChange={(e) => set('lineId', e.target.value)}
            />
            <div className="sm:col-span-2">
              <NeoInput
                label="LINE OA URL"
                type="url"
                placeholder="https://lin.ee/..."
                value={settings.lineUrl ?? ''}
                onChange={(e) => set('lineUrl', e.target.value)}
              />
            </div>
          </div>
        </NeoCard>

        {/* Address */}
        <NeoCard hover={false}>
          <h2 className="font-bold mb-4">ที่อยู่</h2>
          <div className="flex flex-col gap-4">
            <NeoInput
              label="ที่อยู่ (บ้านเลขที่ ซอย ถนน)"
              value={settings.address?.street ?? ''}
              onChange={(e) => setAddress('street', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <NeoInput
                label="ตำบล/แขวง"
                value={settings.address?.subdistrict ?? ''}
                onChange={(e) => setAddress('subdistrict', e.target.value)}
              />
              <NeoInput
                label="อำเภอ/เขต"
                value={settings.address?.district ?? ''}
                onChange={(e) => setAddress('district', e.target.value)}
              />
              <NeoInput
                label="จังหวัด"
                value={settings.address?.province ?? ''}
                onChange={(e) => setAddress('province', e.target.value)}
              />
              <NeoInput
                label="รหัสไปรษณีย์"
                value={settings.address?.postalCode ?? ''}
                onChange={(e) => setAddress('postalCode', e.target.value)}
              />
            </div>
          </div>
        </NeoCard>

        {/* Save button bottom */}
        <div className="flex justify-end">
          <NeoButton variant="primary" size="lg" onClick={handleSave} loading={saving}>
            {saved ? '✓ บันทึกสำเร็จ!' : '💾 บันทึกการตั้งค่า'}
          </NeoButton>
        </div>
      </div>
    </div>
  )
}
