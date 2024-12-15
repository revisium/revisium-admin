export const getEnv = (variableName: string) => {
  const windowValue = window.__env__?.[variableName]
  const processValue = import.meta.env[variableName]

  return windowValue || processValue
}
