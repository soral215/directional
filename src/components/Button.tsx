import { useRef, useCallback } from 'react'
import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  throttleMs?: number
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  throttleMs = 300,
  disabled,
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const isThrottled = useRef(false)

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (isThrottled.current) return

      isThrottled.current = true
      onClick?.(e)

      setTimeout(() => {
        isThrottled.current = false
      }, throttleMs)
    },
    [onClick, throttleMs]
  )

  const isDisabled = disabled || isLoading

  return (
    <button
      disabled={isDisabled}
      onClick={handleClick}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded font-medium transition cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {isLoading ? '로딩중...' : children}
    </button>
  )
}
