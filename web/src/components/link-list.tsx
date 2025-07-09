import { useEffect } from "react";
import { DownloadSimpleIcon, LinkIcon, SpinnerIcon } from "@phosphor-icons/react";
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { Button } from "./ui/button";
import { LinkItem } from "./link-item";
import { useLinks } from "../store/link";

export function LinkList() {
  const fetchLinks = useLinks(store => store.fetchLinks)
  const downloadCsv = useLinks(store => store.downloadCsv)
  const links = useLinks(store => store.links)
  const isLoading = useLinks(store => store.isLoading)

  useEffect(() => {
    fetchLinks()
  }, [])

  return (
    <div className='flex flex-col justify-center p-8 rounded-lg bg-white'>
      <div className="flex justify-between items-center pb-5">
        <h1 className="text-lg text-gray-600 font-bold">Meus links</h1>

        <Button disabled={!links.total} size="icon" colors="secondary" onClick={() => {
          if (links.total > 0) {
            downloadCsv()
          }
        }}>
          <DownloadSimpleIcon size={16} />
          Baixar CSV
        </Button>
      </div>

      <ScrollArea.Root className='overflow-hidden'>
        <ScrollArea.Viewport className='max-h-[380px]'>
          {isLoading
            ? <div className="flex flex-col justify-center items-center gap-3 py-6 border-t border-gray-200">
                <SpinnerIcon className="animate-spin" size={32} />
                <p className="text-lg font-medium text-gray-400">Carregando links...</p>
              </div>
            : <>
                {links.total === 0
                  ? <div className="flex flex-col justify-center items-center gap-3 py-6 border-t border-gray-200">
                      <LinkIcon className="text-gray-400" size={32} />
                      <p className="text-xs text-gray-500 m-0">AINDA NÃO EXISTEM LINKS CADASTRADOS</p>
                    </div>
                  : <div className="w-full space-y-2">
                      {links.links.map((link, _total) => {
                        return <LinkItem key={link.id} link={link} />
                      })}
                    </div>
                }
              </>
          }
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          className="flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-blue-dark before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}