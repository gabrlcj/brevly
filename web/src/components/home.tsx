import { LinkForm } from './link-form';
import { LinkList } from './link-list';

export function Home() {
  return (
    <div className='min-h-dvh flex flex-col md:justify-center md:items-center'>
      <div className='w-full flex flex-col justify-center gap-5 md:flex-row'>
        <div className='w-full md:max-w-[440px]'>
          <LinkForm />
        </div>
        <div className='w-full md:max-w-[620px]'>
          <LinkList />
        </div>
      </div>
    </div>
  )
}