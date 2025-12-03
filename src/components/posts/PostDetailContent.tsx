import { Chip, Button } from '../../components'
import type { Post } from '../../api'
import { categoryVariant } from '../../constants/posts'

interface PostDetailContentProps {
  post: Post
  onEdit: () => void
  onDelete: () => void
}

export const PostDetailContent = ({ post, onEdit, onDelete }: PostDetailContentProps) => {
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


