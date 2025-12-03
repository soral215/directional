import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { postsApi } from '../api'
import type { Post, Category, SortField, SortOrder } from '../api'
import { useTableStore, useModalStore } from '../stores'
import { Button, SearchInput } from '../components'
import { PostDetailContent, PostForm, DeleteConfirmContent } from '../components/posts'
import { postColumns, categories } from '../constants/posts'
import { useDebounce } from '../hooks'

export const PostsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | undefined>(undefined)
  const [sortField, setSortField] = useState<SortField | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [showColumnMenu, setShowColumnMenu] = useState(false)

  const columnMenuRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const debouncedSearch = useDebounce(searchTerm, 300)

  const columnSizing = useTableStore((state) => state.columnSizing)
  const setColumnSizing = useTableStore((state) => state.setColumnSizing)
  const columnVisibility = useTableStore((state) => state.columnVisibility)
  const setColumnVisibility = useTableStore((state) => state.setColumnVisibility)
  const { openModal, closeModal } = useModalStore()

  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', debouncedSearch, categoryFilter, sortField, sortOrder],
    queryFn: ({ pageParam }) =>
      postsApi.getAll({
        limit: 10,
        search: debouncedSearch || undefined,
        category: categoryFilter || undefined,
        sort: sortField,
        order: sortField ? sortOrder : undefined,
        nextCursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    placeholderData: (previousData) => previousData,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      closeModal()
    },
  })

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data.items) ?? [],
    [data]
  )

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
    columns: postColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    state: {
      columnSizing,
      columnVisibility,
    },
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
  })

  useEffect(() => {
    if (Object.keys(columnSizing).length === 0) {
      const initialSizing: Record<string, number> = {}
      postColumns.forEach((col) => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false)
      }
    }

    if (showColumnMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColumnMenu])

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
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <div className="relative" ref={columnMenuRef}>
          <Button
            variant="secondary"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
          >
            컬럼 항목 설정
          </Button>
          {showColumnMenu && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-40">
              {table.getAllLeafColumns().map((column) => (
                <label
                  key={column.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  {typeof column.columnDef.header === 'string' 
                    ? column.columnDef.header 
                    : column.id}
                </label>
              ))}
            </div>
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
                          className={`absolute top-0 right-0 w-0.5 h-full cursor-col-resize select-none touch-none transition-colors ${
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
