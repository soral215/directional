import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { postsApi } from '../api'
import type { Post, Category, PostsParams } from '../api'
import { useTableStore, useModalStore } from '../stores'
import { Chip, Button, SearchInput } from '../components'
import { PostDetailContent, PostForm, DeleteConfirmContent } from '../components/posts'
import { categoryVariant } from '../constants/posts'
import { useDebounce } from '../hooks'

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

// ... existing code ...
// Remove PostDetailContent, PostForm, DeleteConfirmContent components and interfaces
// They are now imported from '../components/posts'

type SortField = 'title' | 'createdAt'
type SortOrder = 'asc' | 'desc'

export function PostsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | undefined>(undefined)
  const [sortField, setSortField] = useState<SortField | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const params = useMemo<PostsParams>(() => ({
    limit: 10,
    search: debouncedSearch || undefined,
    category: categoryFilter || undefined,
    sort: sortField,
    order: sortField ? sortOrder : undefined,
  }), [debouncedSearch, categoryFilter, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'desc') {
        setSortOrder('asc')
      } else {
        setSortField(undefined)
        setSortOrder('desc')
      }
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const columnSizing = useTableStore((state) => state.columnSizing)
  const setColumnSizing = useTableStore((state) => state.setColumnSizing)
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
        const id = (col.id || col.accessorKey) as string
        if (id && col.minSize) {
          initialSizing[id] = col.minSize
        }
      })
      if (Object.keys(initialSizing).length > 0) {
        setColumnSizing(initialSizing)
      }
    }
  }, [])

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: ({ pageParam }) =>
      postsApi.getAll({ ...params, nextCursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    placeholderData: (previousData) => previousData,
  })

  const posts = useMemo(() => 
    data?.pages.flatMap((page) => page.data.items) ?? [],
    [data]
  )

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

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

  const handleCreate = () => {
    openModal({
      title: '새 글 작성',
      content: (
        <PostForm
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      ),
    })
  }

  const handleEdit = (post: Post) => {
    openModal({
      title: '게시글 수정',
      content: (
        <PostForm
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">게시판</h2>
        <Button onClick={handleCreate}>
          + 새 글 작성
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="제목, 내용 검색..."
          isLoading={isFetching}
          className="w-80"
        />

        <select
          value={categoryFilter ?? ''}
          onChange={(e) => {
            const value = e.target.value
            setCategoryFilter(value === '' ? undefined : value as Category)
          }}
          className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          <option value="">전체 카테고리</option>
          <option value="NOTICE">NOTICE</option>
          <option value="QNA">QNA</option>
          <option value="FREE">FREE</option>
        </select>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 w-fit">
        <table className="w-full text-white table-fixed">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-700">
                {headerGroup.headers.map((header, index) => {
                  const isLastColumn = index === headerGroup.headers.length - 1
                  const columnId = header.column.id
                  const isSortable = columnId === 'title' || columnId === 'createdAt'
                  const isCurrentSort = sortField === columnId

                  return (
                    <th
                      key={header.id}
                      className={`text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider relative ${
                        isSortable ? 'cursor-pointer hover:text-gray-200 select-none' : ''
                      }`}
                      style={{ width: header.getSize() }}
                      onClick={isSortable ? () => handleSort(columnId as SortField) : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {isSortable && (
                          <span className="ml-1">
                            {isCurrentSort ? (
                              sortOrder === 'desc' ? '▼' : '▲'
                            ) : (
                              <span className="text-gray-600">⇅</span>
                            )}
                          </span>
                        )}
                      </div>
                      {header.column.getCanResize() && !isLastColumn && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onClick={(e) => e.stopPropagation()}
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

        {/* 무한 스크롤 트리거 및 로딩 표시 */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="flex items-center justify-center py-4 border-t border-gray-700/30"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>불러오는 중...</span>
              </div>
            ) : (
              <span className="text-gray-600 text-sm">스크롤하여 더 보기</span>
            )}
          </div>
        )}

        {!hasNextPage && posts.length > 0 && (
          <div className="flex items-center justify-center py-4 border-t border-gray-700/30">
            <span className="text-gray-600 text-sm">모든 게시글을 불러왔습니다</span>
          </div>
        )}
      </div>
    </div>
  )
}
