export interface ILinkList {
  links: ILink[],
  total: number
}

export interface ILink {
  id: string
  shortUrl: string
  originalUrl: string
  accessCount: number
  createdAt: Date
}
