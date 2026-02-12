"use client"
import { useEffect, useState } from "react"
import GlassSurface from "@/components/ui/GlassSurface"
import Squares from "@/components/ui/Squares"
import { GlassCard } from "@/components/ui/glass-card"

type SessionRow = {
  id: string
  url: string
  session_name: string
  session_id: string
}

export default function AttackerPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<{ id: string; field: string } | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/attacker")
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (err) {
      console.error(err)
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, id: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied({ id, field })
      setTimeout(() => setCopied(null), 1400)
    } catch (err) {
      console.error('copy failed', err)
    }
  }

  return (
    <div className="w-full h-screen bg-red-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Squares hoverFillColor="transparent" />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <header className="px-4 md:px-6 h-14 flex items-center justify-between relative z-50">
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">Attacker Console</span>
            <span className="text-sm text-red-200/60">(read-only)</span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-hidden">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Attacker View</h1>
              <p className="text-red-200 text-sm">Lists sessions (for testing). Click a name/value to copy.</p>
            </div>

              <GlassCard className="w-full">
              {loading ? (
                <div className="py-12 text-center text-red-100">Loading...</div>
              ) : (
                <div className="max-h-[60vh] overflow-auto table-scroll">
                  <table className="w-full table-fixed text-left">
                    <thead>
                      <tr className="border-b border-red-600/40">
                        <th className="py-2 px-3 text-sm w-12">#</th>
                        <th className="py-2 px-3 text-sm w-1/3">URL</th>
                        <th className="py-2 px-3 text-sm w-1/3">Session ID Name</th>
                        <th className="py-2 px-3 text-sm w-1/3">Session ID Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-6 px-3 text-sm text-red-200">No sessions found</td>
                        </tr>
                      )}
                      {sessions.map((s, idx) => (
                        <tr key={s.id} className="odd:bg-red-900/20 hover:bg-red-800/40">
                          <td className="py-2 px-3 text-sm align-top w-12">{idx + 1}</td>
                          <td className="py-2 px-3 text-sm align-top w-1/3 truncate" title={s.url || ''}>
                            {s.url || '—'}
                          </td>
                          <td className="py-2 px-3 text-sm align-top w-1/3 truncate">
                            <button
                              onClick={() => handleCopy(s.session_name, s.id, 'name')}
                              className="text-red-200 hover:underline truncate"
                              title={s.session_name || ''}
                            >
                              {s.session_name || '—'}
                            </button>
                            {copied?.id === s.id && copied.field === 'name' && (
                              <span className="ml-2 text-xs text-red-100">Copied</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-sm align-top w-1/4 truncate">
                            <button
                              onClick={() => handleCopy(s.session_id,  s.id, 'value')}
                              className="text-red-100 hover:underline truncate"
                              title={s.session_id || "—"}
                            >
                              {s.session_id || "—"}
                            </button>
                            {copied?.id === s.id && copied.field === 'value' && (
                              <span className="ml-2 text-xs text-red-100">Copied</span>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </GlassCard>
          </div>
        </main>
      </div>
    </div>
  )
}
