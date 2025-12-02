import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from './api'

function App() {
  const [email, setEmail] = useState('sora901215@gmail.com')
  const [password, setPassword] = useState('U7pQ9rS8T5')

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      console.log('response', response)
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
