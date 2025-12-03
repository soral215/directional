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

const columnHelper = createColumnHelper<Post>()

const columns = [
  columnHelper.accessor('category', {
    header: '카테고리',
  }),
  columnHelper.accessor('title', {
    header: '제목',
  }),
  columnHelper.accessor('body', {
    header: '내용',
  }),
  columnHelper.accessor('tags', {
    header: '태그',
    cell: (info) => info.getValue().join(', '),
  }),
  columnHelper.accessor('createdAt', {
    header: '작성일',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
]

export function PostsPage() {
  const [params] = useState<PostsParams>({ limit: 10 })

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.getAll(params),
  })

  const posts = data?.data.items ?? []

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <p className="text-white">로딩중...</p>
  if (error) return <p className="text-red-500">에러 발생</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">게시판</h2>

      <table className="w-full text-white">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left p-2 border-b border-gray-700">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border-b border-gray-800">
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
