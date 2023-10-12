export function formatNumber(number: number, locale?: string, options?: Intl.NumberFormatOptions) {
  return Intl.NumberFormat(locale, options).format(number)
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}

export function shortenNumber(num: number) {
  if (num < 1000) {
    return num.toString()
  }

  const suffixes = ["", "K", "M", "B", "T"]

  let magnitude = 0
  while (num >= 1000 && magnitude < 4) {
    num /= 1000
    magnitude++
  }

  if (magnitude > 0) {
    num = Math.floor(num * 10) / 10
  }

  return num.toString() + suffixes[magnitude]
}
