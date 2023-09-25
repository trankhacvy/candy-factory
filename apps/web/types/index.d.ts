export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export interface ServerActionResponse<T> {
  success: boolean
  data?: T;
  error?: string;
}