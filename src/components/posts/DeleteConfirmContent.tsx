import { Button } from '../../components'

interface DeleteConfirmProps {
  postTitle: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export const DeleteConfirmContent = ({ postTitle, onConfirm, onCancel, isLoading }: DeleteConfirmProps) => {
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

