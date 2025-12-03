import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from './api'
import { useAuthStore } from './stores'
import { Button, Input } from './components'

function App() {
  const [email, setEmail] = useState('sora901215@gmail.com')
  const [password, setPassword] = useState('U7pQ9rS8T5')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const { setAuth, logout, isAuthenticated, user } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { token, user } = response.data
      setAuth(token, user)
      setEmail('')
      setPassword('')
      setErrors({})
    },
    onError: () => {
      setErrors({ password: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = '이메일을 입력하세요.'
    if (!password) newErrors.password = '비밀번호를 입력하세요.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    loginMutation.mutate({ email, password })
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">환영합니다!</h1>
          <p className="text-gray-300 mb-6">{user?.email}</p>
          <Button variant="danger" onClick={logout} className="w-full">
            로그아웃
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-8">로그인</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button
            type="submit"
            isLoading={loginMutation.isPending}
            className="w-full mt-6"
          >
            로그인
          </Button>
        </form>
      </div>
    </div>
  )
}

export default App
