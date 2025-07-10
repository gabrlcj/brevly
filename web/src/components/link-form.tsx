import { useTransition } from 'react'
import { SpinnerIcon, WarningIcon } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod/v4'
import { Button } from './ui/button'
import Logo from '../assets/Logo.svg'
import { useLinks } from '../store/link'
import { InputField, InputRoot } from './ui/input'
import toast from 'react-hot-toast'

const linkFormSchema = z.object({
  originalUrl: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
    error: 'Informe uma url válida.'
  }),
  shortUrl: z.string().regex(/[a-zA-Z0-9]/g, {
    error: 'Informe uma url minúscula e sem espaço/caracter especial.'
  }),
})

export type LinkFormSchema = z.infer<typeof linkFormSchema>

export function LinkForm() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<LinkFormSchema>({ resolver: zodResolver(linkFormSchema) })
  const createLink = useLinks(store => store.createLink)
  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<LinkFormSchema> = async (
    { originalUrl, shortUrl }: LinkFormSchema
  ) => {
    startTransition(async () => {
      try {
        await createLink({ originalUrl, shortUrl })
        reset()
      } catch (error: any) {
        if (error.status === 409) {
          toast.error('Essa URL encurtada já existe!')
        }
      }
    })
  }

  return (
    <div className='flex flex-col items-center gap-8 md:relative'>
      <img
        className='md:absolute md:top-[-64px] md:left-0'
        src={Logo}
        width={96}
        height={24}
        alt='Logo brev.ly'
      />

      <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col justify-center gap-6 p-8 rounded-lg bg-white'>
        <h1 className='text-lg text-gray-600 font-bold'>Novo link</h1>

        <div className='space-y-3'>
          <div className='group space-y-2'>
            <label
              className='inline-block text-xs text-gray-500 group-focus-within:text-blue-base group-focus-within:font-semibold data-[error=true]:text-feedback'
              htmlFor='originalUrl'
            >
              LINK ORIGINAL
            </label>

            <InputRoot>
              <InputField
                id='originalUrl'
                type='text'
                placeholder='www.exemplo.com.br'
                disabled={isPending}
                {...register('originalUrl')}
              />
            </InputRoot>

            {errors.originalUrl && (
              <div className='flex items-center gap-2'>
                <WarningIcon className='text-feedback' />
                <p className='text-sm text-gray-500'>
                  {errors.originalUrl.message}
                </p>
              </div>
            )}
          </div>

          <div className='group space-y-2'>
            <label
              className='inline-block text-xs text-gray-500 group-focus-within:text-blue-base group-focus-within:font-semibold data-[error=true]:text-feedback'
              htmlFor='shortUrl'
            >
              LINK ENCURTADO
            </label>

            <InputRoot>
            <span className='text-gray-400'>brev.ly/</span>
              <InputField
                id='shortUrl'
                type='text'
                disabled={isPending}
                {...register('shortUrl')}
              />
            </InputRoot>

            {errors.shortUrl && (
              <div className='flex items-center gap-2'>
                <WarningIcon className='text-feedback' />
                <p className='text-sm text-gray-500'>
                  {errors.shortUrl.message}
                </p>
              </div>
            )}
          </div>
        </div>

        <Button type='submit' disabled={isPending}>
          {isPending
            ? <div className='flex items-center justify-center gap-2'>
                <SpinnerIcon className='animate-spin' size={16} />
                <p>Salvando...</p>
              </div>
            : 'Salvar link'
          }
        </Button>
      </form>
    </div>
  )
}