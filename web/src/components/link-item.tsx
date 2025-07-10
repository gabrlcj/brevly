import { CopyIcon, TrashIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { toast } from 'react-hot-toast'
import { Button } from './ui/button'
import { useLinks } from '../store/link'
import type { ILink } from '../shared/interfaces/link'

const FRONT_URL = import.meta.env.VITE_FRONTEND_URL

interface LinkItemProps {
  link: ILink
}

export function LinkItem({ link }: LinkItemProps) {
  const deleteLink = useLinks(store => store.deleteLink)
  const registerAccess = useLinks(store => store.registerAccess)

  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(`${FRONT_URL}/${link.shortUrl}`)
      toast.success('Link copiado com sucesso!')
    } catch (err) {
      toast.error('Erro ao copiar')
    }
  }

  return (
    <div className='flex justify-between items-center py-4 pe-4 border-t border-gray-200'>
      <Link
        to={link.shortUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='flex flex-col gap-1'
        onClick={() => registerAccess(link.shortUrl)}
      >
        <p className='text-md font-semibold text-blue-base'>
          brev.ly/{link.shortUrl}
        </p>

        <p className='text-sm text-gray-500'>{link.originalUrl}</p>
      </Link>

      <div className='flex items-center gap-5'>
        <p className='text-sm text-gray-500'>{link.accessCount} acessos</p>

        <div className='flex justify-center items-center gap-1'>
          <Button size='icon-sm' colors='secondary' onClick={() => copyToClipBoard()}>
            <CopyIcon size={16} />
          </Button>

          <Button
            size='icon-sm'
            colors='secondary'
            onClick={() => deleteLink(link.shortUrl)}
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}