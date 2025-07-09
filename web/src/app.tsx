import { Toaster } from 'react-hot-toast'
import { Home } from './components/home'

export function App() {

  return (
    <main className='h-dvh max-w-[1240px] mx-auto px-5 py-8 md:py-0'>
      <Home />
      <Toaster />
    </main>
  )
}

export default App
