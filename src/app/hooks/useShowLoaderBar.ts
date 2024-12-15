import { useEffect, useRef } from 'react'
import { useNavigation } from 'react-router-dom'
import { LoadingBarRef } from 'react-top-loading-bar'

export const useShowLoaderBar = (delay: number = 300) => {
  const ref = useRef<LoadingBarRef | null>(null)
  const navigation = useNavigation()

  useEffect(() => {
    const current = ref.current
    let timeout: number | typeof NaN = NaN
    let isRunning = false

    if (navigation.state === 'loading') {
      timeout = setTimeout(() => {
        isRunning = true
        current?.continuousStart()
      }, delay) as unknown as number
    }

    return () => {
      if (isRunning) {
        current?.complete()
      }

      clearTimeout(timeout)
    }
  }, [delay, navigation.state])

  return ref
}
