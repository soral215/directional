import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { postsApi } from '../api'
import type { Post, PostsParams } from '../api'
import { useTableStore } from '../stores'

const columnHelper = createColumnHelper<Post>()

const columns = [
  columnHelper.accessor('category', {
    header: '카테고리',
    size: 100,
    minSize: 80,
  }),
  columnHelper.accessor('title', {
    header: '제목',
    size: 200,
    minSize: 150,
  }),
  columnHelper.accessor('body', {
    header: '내용',
    size: 300,
    minSize: 200,
  }),
  columnHelper.accessor('tags', {
    header: '태그',
    size: 150,
    minSize: 100,
    cell: (info) => info.getValue().join(', '),
  }),
  columnHelper.accessor('createdAt', {
    header: '작성일',
    size: 120,
    minSize: 100,
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
]

export function PostsPage() {
  const [params] = useState<PostsParams>({ limit: 10 })
  const { columnSizing, setColumnSizing } = useTableStore()

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

  if (isLoading) return <p className="text-white">로딩중...</p>
  if (error) return <p className="text-red-500">에러 발생</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">게시판</h2>
      <table className="w-full text-white table-fixed">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left p-2 border-b border-gray-700 relative"
                  style={{
                    width: header.getSize(),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute top-0 right-0 w-1 h-full cursor-col-resize select-none touch-none ${header.column.getIsResizing() ? 'bg-blue-500' : 'bg-gray-600 hover:bg-blue-400'
                        }`}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-2 border-b border-gray-800"
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
        <p className="text-gray-400 text-center py-8">게시글이 없습니다.</p>
      )}
    </div>
  )
}
