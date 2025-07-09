import axios from 'axios'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { ILink, LinkList } from '../shared/interfaces/link'
import type { LinkFormSchema } from '../components/link-form'
import { downloadUrl } from '../utils/download-url'

type LinksState = {
  links: LinkList
  isLoading: boolean
  fetchLinks: () => void
  createLink: ({ originalUrl, shortUrl }: LinkFormSchema) => Promise<void>
  deleteLink: (shortUrl: string) => void
  registerAccess: (shortUrl: string) => Promise<string>
  downloadCsv: () => Promise<void>
}

export const useLinks = create<LinksState>()(
  immer((set) => ({
    links: { links: [], total: 0 },
    isLoading: false,
    fetchLinks: async () => {
      set((state) => {
        state.isLoading = true;
      })

      const res = await axios.get<LinkList>('http://localhost:3333/links')

      set(state => {
        state.links = res.data
        state.isLoading = false
      })
    },
    createLink: async ({ originalUrl, shortUrl }: LinkFormSchema) => {
      const res = await axios.post<ILink>(
        'http://localhost:3333/links',
        { originalUrl, shortUrl }
      )

      set(state => {
        state.links.links.unshift(res.data)
        state.links.total += 1
      })
    },
    deleteLink: async (shortUrl: string) => {
      await axios.delete(`http://localhost:3333/${shortUrl}`)

      const result = confirm(`Deseja realmente apagar o link ${shortUrl}?`);

      if (result) {
        set(state => {
          state.links.links = state.links.links.filter(link => link.shortUrl !== shortUrl)
          state.links.total -= 1
        })
      }
    },
    registerAccess: async (shortUrl: string) => {
      const res = await axios.get<ILink>(`http://localhost:3333/${shortUrl}`)

      set(state => {
        const index = state.links.links.findIndex(x => x.shortUrl === shortUrl)

        state.links.links[index] = res.data
      })

      return res.data.originalUrl
    },
    downloadCsv: async () => {
      const { data: { url }} = await axios.post<{ url: string }>('http://localhost:3333/links/export')

      await downloadUrl(url)
    }
  }))
)