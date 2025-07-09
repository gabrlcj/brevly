import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Slot } from '@radix-ui/react-slot'

const buttonVariants = tv({
  base: 'cursor-pointer border text-md font-semibold transition disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed',

  variants: {
    colors: {
      primary: 'rounded-lg text-white bg-blue-base border-blue-base hover:bg-blue-dark',
      secondary: 'flex items-center gap-2 rounded-sm text-gray-500 bg-gray-200 border-gray-200 hover:border-blue-base'
    },
    size: {
      default: 'p-3',
      icon: 'p-2',
      'icon-sm': 'p-1.5'
    },
  },

  defaultVariants: {
    colors: 'primary',
    size: 'default'
  }
})

type ButtonProps = ComponentProps<'button'> &
VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ size, colors, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'

  return <Component className={buttonVariants({ size, colors })} { ...props } />
}