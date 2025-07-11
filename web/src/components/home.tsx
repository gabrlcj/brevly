import { LinkForm } from './link-form'
import { LinkList } from './link-list'

export function Home() {
  return (
    <div className='h-full flex flex-col md:justify-center md:items-center'>
      <div className='h-[680px] w-full flex flex-col items-center gap-5 md:justify-center md:items-start md:flex-row md:mt-auto'>
        <div className='w-full md:max-w-[440px]'>
          <LinkForm />
        </div>
        <div className='w-full pb-5 md:pb-0 md:max-w-[580px]'>
          <LinkList />
        </div>
      </div>
    </div>
  )
}