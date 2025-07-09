export interface ILinkList {
  links: {
    id: string
    shortUrl: string
    originalUrl: string
    accessCount: number
    createdAt: Date
  }[],
  total: number
}

export interface ILink {
  id: string
  shortUrl: string
  originalUrl: string
  accessCount: number
  createdAt: Date
}
