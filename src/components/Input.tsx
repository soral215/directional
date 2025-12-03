import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  inputSize?: InputSize
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-2 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, inputSize = 'md', className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            ${sizeStyles[inputSize]}
            bg-gray-800 border rounded outline-none transition
            text-white placeholder-gray-500
            ${error ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'

