import { ReactNode } from "react"
import Header from "./header"
import Nav from "./nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="bg-blur-image flex min-h-full w-full">
        <Nav />
        <main className="w-full py-[72px] lg:w-[calc(100vw-160px)] lg:grow lg:px-4 lg:py-[100px]">
          <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">{children}</div>
        </main>
      </div>
    </>
  )
}
