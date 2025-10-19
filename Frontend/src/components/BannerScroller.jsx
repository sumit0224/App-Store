import React, { useMemo } from 'react'

export default function BannerScroller({ items }) {
  const data = useMemo(() => items && items.length ? items : [
    { label: 'Trusted by 1,000+ developers' },
    { label: 'Fast, secure, and scalable' },
    { label: 'New apps added weekly' },
    { label: 'Built with ❤️ for the community' },
  ], [items])

  return (
    <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900" />
      <div className="whitespace-nowrap flex gap-8 py-3 animate-[scroll_30s_linear_infinite]">
        {[...data, ...data].map((item, idx) => (
          <span key={idx} className="text-sm text-gray-600 dark:text-gray-400">
            {item.label}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}


