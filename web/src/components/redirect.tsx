import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import LogoIcon from '../assets/Logo_Icon.svg'
import { useLinks } from '../store/link'

const FRONT_URL = import.meta.env.VITE_FRONTEND_URL

export function Redirect() {
  const { shortUrl } = useParams()
  const [originalUrl, setOriginalUrl] = useState('')
  const getLinkByShortUrl = useLinks(store => store.getLinkByShortUrl)

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const url = await navigator.clipboard.readText()
        const isClipboard = url === `${FRONT_URL}/${shortUrl}` ? true : false

        const { originalUrl } = await getLinkByShortUrl(shortUrl!, isClipboard)

        setOriginalUrl(originalUrl)

        window.location.replace(originalUrl)
      } catch (error) {
        window.location.replace('not-found')
      }
    }

    fetchAndRedirect()
  }, [shortUrl])

  return (
    <div className='min-h-dvh flex items-center justify-center mx-auto px-5 py-8 md:py-0'>
      <div className='w-full max-w-[580px] flex flex-col justify-center items-center gap-6 bg-white rounded-lg py-16 px-12'>
        <img src={LogoIcon} alt='Logo icon' width={48} height={48} />

        <h1 className='text-xl font-bold text-center text-gray-600'>
          Redirecionando...
        </h1>

        <div className='flex flex-col gap-1 text-md font-semibold text-center text-gray-500'>
          <p>
            O link será aberto automaticamente em alguns instantes.
          </p>

          <p>Não foi redirecionado?
            <Link to={originalUrl} className='text-blue-base underline'>
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
