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
      <main className="space-y-40 mb-40">
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
    <footer className="py-20 md:py-40">
      <Container>
        <div className="m-auto md:w-10/12 lg:w-8/12 xl:w-6/12">
          <div className="flex flex-wrap items-center justify-between md:flex-nowrap">
            <div className="flex w-full justify-center space-x-12 text-gray-600 dark:text-gray-300 sm:w-7/12 md:justify-start">
              <ul className="list-inside list-disc space-y-8">
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Blocks
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Terms of Use
                  </a>
                </li>
              </ul>
              <ul role="list" className="space-y-8">
                <li>
                  <a href="#" className="flex items-center space-x-3 transition hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <span>Github</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 transition hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5" viewBox="0 0 16 16">
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                    </svg>
                    <span>Twitter</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 transition hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5" viewBox="0 0 16 16">
                      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                    </svg>
                    <span>YouTube</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 transition hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 transition hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5" viewBox="0 0 16 16">
                      <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8zm4.95 0c0 2.34-1.01 4.236-2.256 4.236-1.246 0-2.256-1.897-2.256-4.236 0-2.34 1.01-4.236 2.256-4.236 1.246 0 2.256 1.897 2.256 4.236zM16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795z" />
                    </svg>
                    <span>Medium</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 transition hover:text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z" />
                    </svg>
                    <span>Pintrest</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 transition hover:text-primary">
                    <img
                      className="h-5 w-5"
                      width={32}
                      height={32}
                      src="https://c5.patreon.com/external/favicon/favicon.ico?v=69kMELnXkB"
                      alt="patreon icon"
                    />
                    <span>Patreon</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-3 transition hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5" viewBox="0 0 16 16">
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="m-auto mt-16 w-10/12 space-y-6 text-center sm:mt-auto sm:w-5/12 sm:text-left">
              <span className="block text-gray-500 dark:text-gray-400">The easiest way to airdrop cNFTs at scale</span>
              <span className="block text-gray-500 dark:text-gray-400">
                Candy Factory © <span id="year" />
              </span>
              <span className="flex justify-between text-gray-600 dark:text-white">
                <a href="#" className="font-medium">
                  Terms of Use{" "}
                </a>
                <a href="#" className="font-medium">
                  {" "}
                  Privacy Policy
                </a>
              </span>
              <span className="block text-gray-500 dark:text-gray-400">
                Need help?{" "}
                <a href="#" className="font-semibold text-gray-600 dark:text-white">
                  {" "}
                  Contact Us
                </a>
              </span>
            </div>
          </div>
        </div>
      </Container>
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
                <p className="mt-2 text-gray-600">Airdrop 1,000 cNFTs with only 0.1 SOL</p>
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
                  Easily integrate the airdrop API and wallet management API into your business workflow.
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
                <p className="text-slate-600 dark:text-gray-300">Airdrop 1,000 cNFTs with only 0.1 SOL.</p>
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
            <div className="flex flex-wrap justify-center gap-6">
              <LandingSignUpButton />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
