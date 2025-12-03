import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../../api'
import type { Post, CreatePostRequest, Category } from '../../api'
import { Button } from '../../components'
import { categoryStyles, categories, containsForbiddenWord } from '../../constants/posts'

interface PostFormProps {
  post?: Post
  onSuccess: () => void
  onCancel: () => void
}

export const PostForm = ({ post, onSuccess, onCancel }: PostFormProps) => {
  const isEdit = !!post
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: post?.title ?? '',
    body: post?.body ?? '',
    category: post?.category ?? ('FREE' as Category),
    tags: post?.tags.join(', ') ?? '',
  })
  const [forbiddenError, setForbiddenError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: CreatePostRequest) =>
      isEdit ? postsApi.update(post.id, data) : postsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      onSuccess()
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setForbiddenError(null)

    const titleForbidden = containsForbiddenWord(formData.title)
    if (titleForbidden) {
      setForbiddenError(`제목에 금칙어 "${titleForbidden}"이(가) 포함되어 있습니다.`)
      return
    }

    const bodyForbidden = containsForbiddenWord(formData.body)
    if (bodyForbidden) {
      setForbiddenError(`내용에 금칙어 "${bodyForbidden}"이(가) 포함되어 있습니다.`)
      return
    }

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    mutation.mutate({
      title: formData.title,
      body: formData.body,
      category: formData.category,
      tags,
    })
  }

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
          placeholder="제목을 입력하세요"
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
          placeholder="내용을 입력하세요"
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

      {forbiddenError && (
        <p className="text-red-400 text-sm">{forbiddenError}</p>
      )}

      {mutation.isError && (
        <p className="text-red-400 text-sm">
          {isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.
        </p>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" variant="primary" isLoading={mutation.isPending}>
          {isEdit ? '저장' : '등록'}
        </Button>
      </div>
    </form>
  )
}

