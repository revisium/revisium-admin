// Simplified toast container for Chakra UI v3 migration
export const StandaloneToastContainer = () => null

// Basic toast implementation - can be enhanced later
export const standaloneToast = (options: any) => {
  console.log('Toast:', options)
}

// Add methods to the function object
standaloneToast.create = (options: any) => console.log('Toast create:', options)
standaloneToast.success = (message: string) => console.log('Success:', message)
standaloneToast.error = (message: string) => console.log('Error:', message)
standaloneToast.info = (message: string) => console.log('Info:', message)
