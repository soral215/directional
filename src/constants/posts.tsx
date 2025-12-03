import { createColumnHelper } from '@tanstack/react-table'
import type { Category, Post } from '../api'
import { Chip } from '../components'

export const categoryVariant: Record<Category, 'red' | 'yellow' | 'green'> = {
  NOTICE: 'red',
  QNA: 'yellow',
  FREE: 'green',
}

export const categoryStyles: Record<Category, { active: string; inactive: string }> = {
  NOTICE: {
    active: 'bg-red-500/30 text-red-400 border-red-500/50',
    inactive: 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-red-500/10 hover:text-red-400',
  },
  QNA: {
    active: 'bg-yellow-500/30 text-yellow-400 border-yellow-500/50',
    inactive: 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-yellow-500/10 hover:text-yellow-400',
  },
  FREE: {
    active: 'bg-green-500/30 text-green-400 border-green-500/50',
    inactive: 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-green-500/10 hover:text-green-400',
  },
}

export const categories: Category[] = ['NOTICE', 'QNA', 'FREE']

export const forbiddenWords = ['캄보디아', '프놈펜', '불법체류', '텔레그램']

export const containsForbiddenWord = (text: string): string | null => {
  for (const word of forbiddenWords) {
    if (text.includes(word)) {
      return word
    }
  }
  return null
}

const columnHelper = createColumnHelper<Post>()

export const postColumns = [
  columnHelper.accessor('category', {
    header: '카테고리',
    minSize: 80,
    cell: (info) => {
      const category = info.getValue()
      return <Chip variant={categoryVariant[category]}>{category}</Chip>
    },
  }),
  columnHelper.accessor('title', {
    header: '제목',
    minSize: 120,
    cell: (info) => (
      <span className="font-medium">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('body', {
    header: '내용',
    minSize: 150,
    cell: (info) => (
      <span className="text-gray-400 line-clamp-1">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('tags', {
    header: '태그',
    minSize: 100,
    cell: (info) => {
      const tags = info.getValue()
      if (tags.length === 0) return <span className="text-gray-600">-</span>
      return (
        <div className="flex gap-1 flex-wrap">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-xs text-gray-500">+{tags.length - 2}</span>
          )}
        </div>
      )
    },
  }),
  columnHelper.accessor('createdAt', {
    header: '작성일',
    minSize: 90,
    cell: (info) => (
      <span className="text-gray-500 text-sm">
        {new Date(info.getValue()).toLocaleDateString('ko-KR')}
      </span>
    ),
  }),
]

