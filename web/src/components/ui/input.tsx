import type { ComponentProps } from 'react';

interface InputRootProps extends ComponentProps<'input'> {
  error?: boolean
}

export function InputRoot({ error = false, ...props }: InputRootProps) {
  return (
    <div
      className='flex items-center border border-gray-300 rounded-lg p-4 focus-within:border-blue-base data-[error=true]:border-feedback disabled:opacity-50'
      data-error={error}
      { ...props }
    />
  )
}

interface InputFieldProps extends ComponentProps<'input'> {}

export function InputField({...props }: InputFieldProps) {
  return <input className='flex-1 outline-0 placeholder:text-gray-400 disabled:opacity-50' { ...props } />
}