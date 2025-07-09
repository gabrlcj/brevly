import { Link } from 'react-router'
import not_found from '../assets/404.svg'

export function NotFound() {
  return (
    <div className='min-h-dvh flex items-center justify-center mx-auto px-5 py-8 md:py-0'>
      <div className='w-full max-w-[580px] flex flex-col justify-center items-center gap-6 bg-white rounded-lg py-16 px-12'>
        <img src={not_found} alt='Status code 404' width={194} />

        <h1 className='text-lg font-bold text-center text-gray-600'>Link não encontrado</h1>

        <p className='text-md font-semibold text-center text-gray-500'>
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
          Saiba mais em <Link to='/' className='text-blue-base hover:underline'>brev.ly</Link>.
        </p>
      </div>
    </div>
  )
}