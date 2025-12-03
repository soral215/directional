import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { devApi, postsApi } from '../api'
import { Button } from './Button'

const SAMPLE_TITLES = [
  '오늘의 개발 일지',
  'React 성능 최적화 팁',
  '타입스크립트 꿀팁 모음',
  '프론트엔드 면접 준비',
  '코드 리뷰 문화 만들기',
  'CSS Grid vs Flexbox',
  '상태 관리 라이브러리 비교',
  'API 설계 베스트 프랙티스',
  '테스트 코드 작성법',
  '클린 코드 원칙',
]

const SAMPLE_BODIES = [
  '오늘은 새로운 기능을 구현했습니다. 생각보다 복잡했지만 재미있었어요.',
  '성능 최적화를 위해 useMemo와 useCallback을 적절히 사용하는 것이 중요합니다.',
  '타입스크립트를 사용하면 런타임 에러를 미리 잡을 수 있어서 좋습니다.',
  '면접에서 자주 나오는 질문들을 정리해봤습니다. 도움이 되셨으면 좋겠네요.',
  '코드 리뷰는 팀의 성장에 필수적입니다. 건설적인 피드백이 중요해요.',
  'Grid는 2차원 레이아웃에, Flexbox는 1차원 레이아웃에 적합합니다.',
  'Redux, Zustand, Jotai 등 다양한 상태 관리 라이브러리를 비교해봤습니다.',
  'RESTful API 설계 시 일관성과 직관성을 유지하는 것이 중요합니다.',
  '테스트 코드는 미래의 나를 위한 선물입니다. 꼭 작성하세요!',
  '함수는 한 가지 일만 해야 하고, 이름은 그 일을 명확히 나타내야 합니다.',
]

const CATEGORIES = ['NOTICE', 'QNA', 'FREE'] as const

export const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [postCount, setPostCount] = useState(5)
  const [isCreating, setIsCreating] = useState(false)

  const queryClient = useQueryClient()

  const deleteAllMutation = useMutation({
    mutationFn: () => devApi.deleteAllMyPosts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      alert('모든 포스트가 삭제되었습니다.')
    },
    onError: () => {
      alert('삭제 중 오류가 발생했습니다.')
    },
  })

  const handleCreateRandom = async () => {
    setIsCreating(true)
    try {
      for (let i = 0; i < postCount; i++) {
        await postsApi.create({
          title: SAMPLE_TITLES[Math.floor(Math.random() * SAMPLE_TITLES.length)],
          body: SAMPLE_BODIES[Math.floor(Math.random() * SAMPLE_BODIES.length)],
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          tags: [],
        })
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      alert(`${postCount}개의 포스트가 생성되었습니다.`)
    } catch {
      alert('생성 중 오류가 발생했습니다.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition cursor-pointer"
        title="DevTools"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="text-white font-medium">DevTools</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <p className="text-gray-400 text-xs mb-2">랜덤 포스트 생성</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={postCount}
                  onChange={(e) => setPostCount(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                />
                <span className="text-gray-400 text-sm">개</span>
                <Button
                  size="sm"
                  onClick={handleCreateRandom}
                  disabled={isCreating}
                >
                  {isCreating ? '생성중...' : '생성'}
                </Button>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-2">데이터 초기화</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (confirm('정말 모든 포스트를 삭제하시겠습니까?')) {
                    deleteAllMutation.mutate()
                  }
                }}
                disabled={deleteAllMutation.isPending}
                className="w-full !bg-red-600/20 !text-red-400 hover:!bg-red-600/30"
              >
                {deleteAllMutation.isPending ? '삭제중...' : '내 포스트 전체 삭제'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

