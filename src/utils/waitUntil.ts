interface WaitUntilProps {
  tick?: number
  timeout?: number
}

export const waitUntil = (
  condition: () => boolean,
  options?: WaitUntilProps
) => {
  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      if (!condition()) return

      clearInterval(interval)
      resolve()
    }, options?.tick || 100)

    setTimeout(() => {
      clearInterval(interval)
      reject('your error msg')
    }, options?.timeout || 10000)
  })
}
