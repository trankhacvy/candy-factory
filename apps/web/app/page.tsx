import { Typography } from "@/components/ui/typography"
import { PropsWithChildren } from "react"
import { AppHeader } from "@/components/landing/header"
import LandingSignUpButton from "@/components/landing/landing-signup-button"
import { Badge } from "@/components/ui/badge"
import { BotIcon, SendIcon, WalletIcon } from "lucide-react"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="space-y-40">
        <HeroSection />
        <Features />
        <Stats />
        <Testimonials />
        <CallToAction />
      </main>
      <AppFooter />
    </>
  )
}

const Container = ({ children }: PropsWithChildren) => {
  return <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">{children}</div>
}

const AppFooter = () => {
  return (
    <footer className="py-10 border-t border-gray-500/24">
      <Container>© {new Date().getFullYear()} cnftdrops.xyz</Container>
    </footer>
  )
}

const HeroSection = () => {
  return (
    <div className="relative" id="home">
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
      </div>
      <Container>
        <div className="relative pt-36 ml-auto">
          <div className="lg:w-2/3 text-center mx-auto">
            <h1 className="text-gray-900 tracking-tight leading-normal dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl">
              The easiest way to airdrop <span className="text-primary-500 dark:text-white">cNFTs</span> at scale
            </h1>
            <Typography as="p" color="secondary" className="mt-8 lg:max-w-lg mx-auto">
              Candy Factory simplifies the process of creating, airdropping, and managing cNFTs, all without the need
              for any coding.
            </Typography>
            <div className="mt-10 flex flex-wrap justify-center gap-y-4 gap-x-6">
              <div>
                <LandingSignUpButton />
              </div>
            </div>
            <div className="hidden py-8 mt-16 border-y border-gray-500/20 dark:border-gray-800 sm:flex justify-between gap-6">
              <div className="text-center flex-1">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">The lowest price</h6>
                <p className="mt-2 text-gray-600">Airdrop 1,000 cNFTs with only 1$</p>
              </div>
              <div className="text-center flex-1">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">No Code</h6>
                <p className="mt-2 text-gray-600">
                  Easy to launch your NFT airdrop without writing a single line of code.
                </p>
              </div>
              <div className="text-center flex-1">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">Powerful SDKs</h6>
                <p className="mt-2 text-gray-500">
                  Easily integrate the airdrop API and wallet management API into your business workflow. (Coming Soon)
                </p>
              </div>
            </div>
          </div>
          <div className="hidden mt-12 grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="https://astrolus.netlify.app/images/clients/microsoft.svg"
                className="h-12 w-auto mx-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="https://astrolus.netlify.app/images/clients/microsoft.svg"
                className="h-12 w-auto mx-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="p-4 flex grayscale transition duration-200 hover:grayscale-0">
              <img
                src="https://astrolus.netlify.app/images/clients/microsoft.svg"
                className="h-9 w-auto m-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="https://astrolus.netlify.app/images/clients/microsoft.svg"
                className="h-12 w-auto mx-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="p-4 flex grayscale transition duration-200 hover:grayscale-0">
              <img
                src="https://astrolus.netlify.app/images/clients/microsoft.svg"
                className="h-8 w-auto m-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
            <div className="p-4 grayscale transition duration-200 hover:grayscale-0">
              <img
                src="https://astrolus.netlify.app/images/clients/microsoft.svg"
                className="h-12 w-auto mx-auto"
                loading="lazy"
                alt="client logo"
                width=""
                height=""
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

const Features = () => {
  return (
    <div id="features">
      <Container>
        <div className="md:w-2/3 lg:w-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-primary-500"
          >
            <path
              fillRule="evenodd"
              d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="my-8 text-2xl font-bold text-slate-900 leading-relaxed dark:text-white md:text-4xl">
            Everything you need for launching a cNFT airdrop
          </h2>
          <Typography color="secondary">
            Our best-in-class tools provide all the features you need to successfully launch a cNFT airdrop.
          </Typography>
        </div>
        <div className="mt-16 grid divide-x divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden rounded-3xl border border-gray-500/20 text-gray-600 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4">
          <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-z16 hover:shadow-gray-600/10">
            <div className="relative space-y-8 py-12 p-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1495/1495118.png"
                className="w-12"
                width={512}
                height={512}
                alt="low price"
              />
              <div className="space-y-2">
                <h5 className="text-xl font-semibold text-gray-900 dark:text-white transition group-hover:text-primary-500">
                  The lowest price
                </h5>
                <p className="text-slate-600 dark:text-gray-300">
                  Airdrop <span className="text-primary-500 font-semibold">1,000 cNFTs</span> with only{" "}
                  <span className="text-primary-500 font-semibold">1$</span>.
                </p>
              </div>
              <a href="#" className="flex items-center justify-between group-hover:text-primary-500">
                <span className="text-sm">Read more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 -translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-z16 hover:shadow-gray-600/10">
            <div className="relative space-y-8 py-12 p-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6214/6214224.png"
                className="w-12"
                width={512}
                height={512}
                alt="No code"
              />
              <div className="space-y-2">
                <h5 className="text-xl font-semibold text-gray-700 dark:text-white transition group-hover:text-primary-500">
                  No Code
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Easy to launch your NFT airdrop without writing a single line of code.
                </p>
              </div>
              <a href="#" className="flex items-center justify-between group-hover:text-primary-500">
                <span className="text-sm">Read more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 -translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-z16 hover:shadow-gray-600/10">
            <div className="relative space-y-8 py-12 p-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2323/2323800.png"
                className="w-12"
                width={512}
                height={512}
                alt="Airdrop analytics"
              />
              <div className="space-y-2">
                <h5 className="text-xl font-semibold text-gray-700 dark:text-white transition group-hover:text-primary-500">
                  Airdrop analytics
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Keep track of your airdrops over time, know exactly which wallets recieved your airdrop.
                </p>
              </div>
              <a href="#" className="flex items-center justify-between group-hover:text-primary-500">
                <span className="text-sm">Read more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 -translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="group relative bg-gray-50 dark:bg-gray-900 transition hover:z-[1] hover:shadow-z16 hover:shadow-gray-600/10">
            <div className="relative space-y-8 py-12 p-8 transition duration-300 group-hover:bg-white dark:group-hover:bg-gray-800">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2921/2921201.png"
                className="w-12"
                width={512}
                height={512}
                alt="Generate a snapshot of token holders."
              />
              <div className="space-y-2">
                <h5 className="text-xl font-semibold text-gray-700 dark:text-white transition group-hover:text-primary-500">
                  Generate a snapshot of token holders.
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Easily create a snapshot of token holders based on the collection.
                </p>
              </div>
              <a href="#" className="flex items-center justify-between group-hover:text-primary-500">
                <span className="text-sm">Read more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 -translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

const Stats = () => {
  return (
    <div id="solution">
      <Container>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-primary-500"
        >
          <path
            fillRule="evenodd"
            d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
            clipRule="evenodd"
          />
        </svg>
        <div className="space-y-6 justify-between text-gray-600 md:flex flex-row-reverse md:gap-6 md:space-y-0 lg:gap-12 lg:items-center">
          <div className="relative flex md:5/12 lg:w-1/2">
            <div className="flex w-full justify-end mt-[-20%]">
              <div className="w-2/3">
                <AspectRatio>
                  <Image src="/assets/sdk.png" alt="image" fill />
                </AspectRatio>
              </div>
            </div>
            <div className="absolute z-[-1] w-2/3 top-[60%]">
              <img src="/assets/signup-form.jpg" alt="image" loading="lazy" width="" height="" className="w-full" />
            </div>
          </div>
          <div className="md:7/12 lg:w-1/2">
            <div className="flex items-start flex-col gap-2">
              <Badge variant="info">Coming soon</Badge>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">Easy and powerful SDKs</h2>
            </div>
            <Typography as="p" className="my-8 dark:text-gray-300" color="secondary">
              Easily integrate the airdrop API and wallet management API into your business workflow.
            </Typography>
            <div className="divide-y space-y-8 divide-gray-100 dark:divide-gray-800">
              <div className="flex gap-4 md:items-center">
                <div className="w-12 h-12 flex gap-4 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                  <BotIcon className="w-6 h-6 m-auto text-indigo-500" />
                </div>
                <div className="w-5/6">
                  <h4 className="font-semibold text-lg text-gray-700 dark:text-indigo-300">Automation</h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Automatically airdrop the cool NFT to new signup users.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:items-center">
                <div className="w-12 h-12 flex gap-4 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                  <SendIcon className="w-6 h-6 m-auto text-indigo-500 dark:text-indigo-400" />
                </div>
                <div className="w-5/6">
                  <h4 className="font-semibold text-lg text-gray-700 dark:text-indigo-300">
                    Using cNFTs as a marketing tool
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">Airdrop cNFTs as newsletters to your customers</p>
                </div>
              </div>

              <div className="flex gap-4 md:items-center">
                <div className="w-12 h-12 flex gap-4 rounded-full bg-teal-100 dark:bg-teal-900/20">
                  <WalletIcon className="w-6 h-6 m-auto text-teal-600 dark:text-teal-400" />
                </div>
                <div className="w-5/6">
                  <h4 className="font-semibold text-lg text-gray-700 dark:text-teal-300">Signup Form</h4>
                  <p className="text-gray-500 dark:text-gray-400">Collect user wallets through the signup form.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

const Testimonials = () => {
  return (
    <div className="text-gray-600 dark:text-gray-300" id="testimonials">
      <Container>
        <div className="mb-20 space-y-4 px-6 md:px-0">
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl">
            We have some fans.
          </h2>
        </div>
        <div className="md:columns-2 lg:columns-3 gap-8 space-y-8">
          <div className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="w-12 h-12 rounded-full"
                src="/assets/avatar1.png"
                alt="user avatar"
                width={400}
                height={400}
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">Daniella Doe</h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">Mobile dev</p>
              </div>
            </div>
            <p className="mt-8">
              Candy Factory has been a game-changer for us. With their tool, we airdropped 1,000 cNFTs for just 0.1 SOL,
              saving us time and money. It's a must-have for any cNFT project!
            </p>
          </div>
          <div className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="w-12 h-12 rounded-full"
                src="/assets/avatar2.png"
                alt="user avatar"
                width={200}
                height={200}
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">Jane doe</h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">Marketing</p>
              </div>
            </div>
            <p className="mt-8">
              As a non-techie, I was amazed at how easy it was to use Candy Factory. I launched my cNFT airdrop without
              any coding. It's user-friendly and efficient!"
            </p>
          </div>
          <div className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="w-12 h-12 rounded-full"
                src="/assets/avatar3.png"
                alt="user avatar"
                width={200}
                height={200}
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">Yanick Doe</h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">Developer</p>
              </div>
            </div>
            <p className="mt-8">
              The airdrop analytics from Candy Factory have been invaluable. I can now track our airdrops over time and
              identify which wallets received our airdrops. It's a game-changer for our sNFT project.
            </p>
          </div>
          <div className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="w-12 h-12 rounded-full"
                src="/assets/avatar4.png"
                alt="user avatar"
                width={200}
                height={200}
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">Jane Doe</h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">Mobile dev</p>
              </div>
            </div>
            <p className="mt-8">
              Generating snapshots of token holders based on collections has never been easier. Candy Factory simplifies
              the process, making it a breeze to manage our NFT community.
            </p>
          </div>
          <div className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="w-12 h-12 rounded-full"
                src="/assets/avatar5.png"
                alt="user avatar"
                width={200}
                height={200}
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">Andy Doe</h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">Manager</p>
              </div>
            </div>
            <p className="mt-8">
              Candy Factory's SDKs are a godsend for our business. We seamlessly integrated the airdrop API and wallet
              management API into our workflow. It's powerful and hassle-free!
            </p>
          </div>
          <div className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow-2xl shadow-gray-600/10 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="w-12 h-12 rounded-full"
                src="/assets/avatar6.png"
                alt="user avatar"
                width={400}
                height={400}
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">Yanndy Doe</h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">Mobile dev</p>
              </div>
            </div>
            <p className="mt-8">
              If you're looking for an cNFT airdrop tool that's cost-effective, user-friendly, and offers powerful
              analytics, Candy Factory is the solution. It's transformed the way we handle cNFT distribution.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

const CallToAction = () => {
  return (
    <div className="relative py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 h-max w-full m-auto grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
      </div>
      <Container>
        <div className="relative">
          <div className="flex items-center justify-center -space-x-2">
            <img
              loading="lazy"
              width={400}
              height={400}
              src="/assets/avatar5.png"
              alt="member photo"
              className="h-8 w-8 rounded-full object-cover"
            />
            <img
              loading="lazy"
              width={200}
              height={200}
              src="/assets/avatar4.png"
              alt="member photo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <img
              loading="lazy"
              width={200}
              height={200}
              src="/assets/avatar3.png"
              alt="member photo"
              className="z-10 h-16 w-16 rounded-full object-cover"
            />
            <img
              loading="lazy"
              width={200}
              height={200}
              src="/assets/avatar2.png"
              alt="member photo"
              className="relative h-12 w-12 rounded-full object-cover"
            />
            <img
              loading="lazy"
              width={200}
              height={200}
              src="/assets/avatar1.png"
              alt="member photo"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
          <div className="mt-6 m-auto space-y-6 md:w-8/12 lg:w-7/12">
            <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
              Get Started now
            </h1>
            <p className="text-center text-xl text-gray-600 dark:text-gray-300">
              Start launching your NFT airdrop today with Candy Factory
            </p>
            <div className="flex items-center justify-center gap-6">
              <LandingSignUpButton />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
