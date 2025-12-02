import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from './api'
import { useAuthStore } from './stores'

function App() {
  const [email, setEmail] = useState('sora901215@gmail.com')
  const [password, setPassword] = useState('U7pQ9rS8T5')
  
  const { setAuth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { token, user } = response.data
      setAuth(token, user)
    },
  })

  const handleLogin = () => {
    loginMutation.mutate({ email, password })
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default App
