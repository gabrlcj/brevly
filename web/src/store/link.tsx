import axios from 'axios'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { downloadUrl } from '../utils/download-url'
import type { LinkFormSchema } from '../components/link-form'
import type { ILink, ILinkList } from '../shared/interfaces/link'

const API_URL = import.meta.env.VITE_BACKEND_URL;

type LinkState = {
  links: ILinkList
  isLoading: boolean
  fetchLinks: () => void
  createLink: ({ originalUrl, shortUrl }: LinkFormSchema) => Promise<void>
  deleteLink: (shortUrl: string) => void
  getLinkByShortUrl: (shortUrl: string) => Promise<ILink>
  downloadCsv: () => Promise<void>
}

export const useLinks = create<LinkState, [['zustand/immer', never]]>(
  immer((set, get) => {

    async function fetchLinks() {
      set((state) => {
        state.isLoading = true;
      })

      const res = await axios.get<ILinkList>(`${API_URL}/links`)

      set(state => {
        state.links = res.data
        state.isLoading = false
      })
    }

    async function createLink({ originalUrl, shortUrl }: LinkFormSchema) {
      const res = await axios.post<ILink>(
        `${API_URL}/links`,
        { originalUrl, shortUrl }
      )

      set(state => {
        state.links.links.unshift(res.data)
        state.links.total += 1
      })
    }

    async function deleteLink(shortUrl: string) {
      const result = confirm(`Deseja realmente apagar o link ${shortUrl}?`);

      if (result) {
        await axios.delete(`${API_URL}/${shortUrl}`)

        set(state => {
          state.links.links = state.links.links.filter(link => link.shortUrl !== shortUrl)
          state.links.total -= 1
        })
      }
    }

    async function getLinkByShortUrl(shortUrl: string) {
      await axios.put(`${API_URL}/${shortUrl}/increment`)

      const { data } = await axios.get<ILink>(`${API_URL}/${shortUrl}`)

      set(state => {
        const index = get().links.links.findIndex(link => link.shortUrl === shortUrl)

        state.links.links[index] = data
      })

      return data
    }

    async function downloadCsv() {
      const { data: { url }} = await axios.post<{ url: string }>(`${API_URL}/links/export`)

      await downloadUrl(url)
    }

    return {
      links: { links: [], total: 0 },
      isLoading: false,
      fetchLinks,
      createLink,
      deleteLink,
      getLinkByShortUrl,
      downloadCsv
    }
  })
)