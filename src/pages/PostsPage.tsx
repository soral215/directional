import { useState, useEffect, useMemo } from 'react'
import type { FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { postsApi } from '../api'
import type { Post, PostsParams, Category, UpdatePostRequest } from '../api'
import { useTableStore, useModalStore } from '../stores'
import { Chip, Button } from '../components'

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

interface PostDetailContentProps {
  post: Post
  onEdit: () => void
  onDelete: () => void
}

function PostDetailContent({ post, onEdit, onDelete }: PostDetailContentProps) {
  return (
    <div className="space-y-4">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-700">
          <tr>
            <td className="py-3 px-4 text-gray-400 w-24 bg-gray-900/50">카테고리</td>
            <td className="py-3 px-4 text-white">
              <Chip variant={categoryVariant[post.category]}>{post.category}</Chip>
            </td>
            <td className="py-3 px-4 text-gray-400 w-24 bg-gray-900/50">작성일</td>
            <td className="py-3 px-4 text-white">
              {new Date(post.createdAt).toLocaleString('ko-KR')}
            </td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-gray-400 bg-gray-900/50">제목</td>
            <td className="py-3 px-4 text-white font-medium" colSpan={3}>
              {post.title}
            </td>
          </tr>
          {post.tags.length > 0 && (
            <tr>
              <td className="py-3 px-4 text-gray-400 bg-gray-900/50">태그</td>
              <td className="py-3 px-4" colSpan={3}>
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <Chip key={tag} variant="blue">#{tag}</Chip>
                  ))}
                </div>
              </td>
            </tr>
          )}
          <tr>
            <td className="py-3 px-4 text-gray-400 bg-gray-900/50 align-top">내용</td>
            <td className="py-3 px-4 text-gray-300" colSpan={3}>
              <p className="whitespace-pre-wrap min-h-[100px]">{post.body}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-center gap-3 pt-2">
        <Button variant="primary" onClick={onEdit}>
          수정
        </Button>
        <Button variant="danger" onClick={onDelete}>
          삭제
        </Button>
      </div>
    </div>
  )
}

interface PostEditFormProps {
  post: Post
  onSuccess: () => void
  onCancel: () => void
}

function PostEditForm({ post, onSuccess, onCancel }: PostEditFormProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: post.title,
    body: post.body,
    category: post.category,
    tags: post.tags.join(', '),
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePostRequest) => postsApi.update(post.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      onSuccess()
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    updateMutation.mutate({
      title: formData.title,
      body: formData.body,
      category: formData.category,
      tags,
    })
  }

  const categoryStyles: Record<Category, { active: string; inactive: string }> = {
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

  const categories: Category[] = ['NOTICE', 'QNA', 'FREE']

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">카테고리</label>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat })}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                formData.category === cat
                  ? categoryStyles[cat].active
                  : categoryStyles[cat].inactive
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          제목 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          내용 <span className="text-red-400">*</span>
        </label>
        <textarea
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          required
          rows={6}
          className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">태그</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="쉼표(,)로 구분하여 입력"
          className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {updateMutation.isError && (
        <p className="text-red-400 text-sm">수정 중 오류가 발생했습니다.</p>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" variant="primary" isLoading={updateMutation.isPending}>
          저장
        </Button>
      </div>
    </form>
  )
}

interface DeleteConfirmProps {
  postTitle: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

function DeleteConfirmContent({ postTitle, onConfirm, onCancel, isLoading }: DeleteConfirmProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-500/20 rounded-full">
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
      
      <div className="text-center">
        <p className="text-gray-300 mb-1">다음 게시글을 삭제할까요?</p>
        <p className="text-white font-medium truncate">"{postTitle}"</p>
      </div>

      <p className="text-center text-sm text-gray-500">
        삭제 후에는 복구할 수 없습니다.
      </p>

      <div className="flex justify-center gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          취소
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          삭제
        </Button>
      </div>
    </div>
  )
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function PostsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const params = useMemo<PostsParams>(() => ({
    limit: 10,
    search: debouncedSearch || undefined,
  }), [debouncedSearch])

  const { columnSizing, setColumnSizing } = useTableStore()
  const { openModal, closeModal } = useModalStore()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      closeModal()
    },
  })

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

  const { data, isLoading, isFetching, error } = useQuery({
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

  const handleEdit = (post: Post) => {
    openModal({
      title: '게시글 수정',
      content: (
        <PostEditForm
          post={post}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      ),
    })
  }

  const handleDelete = (post: Post) => {
    openModal({
      title: '게시글 삭제',
      content: (
        <DeleteConfirmContent
          postTitle={post.title}
          onConfirm={() => deleteMutation.mutate(post.id)}
          onCancel={closeModal}
          isLoading={deleteMutation.isPending}
        />
      ),
    })
  }

  const handleRowClick = (post: Post) => {
    openModal({
      title: '게시글 상세',
      content: (
        <PostDetailContent
          post={post}
          onEdit={() => handleEdit(post)}
          onDelete={() => handleDelete(post)}
        />
      ),
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">게시판</h2>

      <div className="mb-4">
        <div className="relative w-80">
          {isFetching ? (
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 내용 검색..."
            className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

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
                onClick={() => handleRowClick(row.original)}
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

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-400">로딩중...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-red-400">에러가 발생했습니다.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>게시글이 없습니다.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
