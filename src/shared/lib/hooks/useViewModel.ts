/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from 'react'
import { IViewModel } from 'src/shared/config/types.ts'
import { container } from 'src/shared/lib'

export const useViewModel = <T extends IViewModel>(
  Class: new (...args: any[]) => T,
  ...initArgs: Parameters<NonNullable<T['init']>>
) => {
  const instanceRef = useRef<T | null>(null)

  const [previousArgs, setPreviousArgs] = useState<Parameters<NonNullable<T['init']>>>(initArgs)

  const memoizedInitArgs = useMemo(() => {
    if (previousArgs.length !== initArgs.length || previousArgs.some((arg, index) => arg !== initArgs[index])) {
      setPreviousArgs(initArgs)
      return initArgs
    }
    return previousArgs
  }, [initArgs, previousArgs])

  if (!instanceRef.current) {
    instanceRef.current = container.get(Class)
  }

  useEffect(() => {
    const instance = instanceRef.current
    instance?.init?.(...memoizedInitArgs)

    return () => {
      instance?.dispose?.()
    }
  }, [memoizedInitArgs])

  return instanceRef.current
}
