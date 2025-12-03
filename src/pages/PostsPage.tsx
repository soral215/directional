import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { postsApi } from '../api'
import type { Post, PostsParams, Category } from '../api'
import { useTableStore } from '../stores'
import { Chip } from '../components'

const categoryVariant: Record<Category, 'red' | 'yellow' | 'green'> = {
  NOTICE: 'red',
  QNA: 'yellow',
  FREE: 'green',
}

const columnHelper = createColumnHelper<Post>()

const columns = [
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

export function PostsPage() {
  const [params] = useState<PostsParams>({ limit: 10 })
  const { columnSizing, setColumnSizing } = useTableStore()

  useEffect(() => {
    if (Object.keys(columnSizing).length === 0) {
      const initialSizing: Record<string, number> = {}
      columns.forEach((col) => {
        const id = col.accessorKey as string
        if (col.minSize) {
          initialSizing[id] = col.minSize
        }
      })
      setColumnSizing(() => initialSizing)
    }
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.getAll(params),
  })

  const posts = data?.data.items ?? []

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    state: {
      columnSizing,
    },
    onColumnSizingChange: setColumnSizing,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">로딩중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-400">에러 발생</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">게시판</h2>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 w-fit">
        <table className="w-full text-white table-fixed">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-700">
                {headerGroup.headers.map((header, index) => {
                  const isLastColumn = index === headerGroup.headers.length - 1
                  return (
                    <th
                      key={header.id}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider relative"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanResize() && !isLastColumn && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize select-none touch-none transition-colors ${
                            header.column.getIsResizing()
                              ? 'bg-blue-500'
                              : 'bg-gray-600 hover:bg-blue-400'
                          }`}
                        />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`
                  border-b border-gray-700/30 transition-colors cursor-pointer
                  ${index % 2 === 1 ? 'bg-gray-900/20' : ''}
                  hover:bg-gray-700/50
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
