export const getEnv = (variableName: string) => {
  const runtimeValue = (globalThis as unknown as Window).__env__?.[variableName]
  const processValue = import.meta.env[variableName]

  return runtimeValue || processValue
}
