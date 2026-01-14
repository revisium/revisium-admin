import {
  PiFileAudioLight,
  PiFileDocLight,
  PiFileLight,
  PiFilePdfLight,
  PiFileVideoLight,
  PiImageLight,
} from 'react-icons/pi'

export const getFileIcon = (mimeType: string, size: number = 40) => {
  if (mimeType.startsWith('image/')) {
    return <PiImageLight size={size} />
  }
  if (mimeType.startsWith('audio/')) {
    return <PiFileAudioLight size={size} />
  }
  if (mimeType.startsWith('video/')) {
    return <PiFileVideoLight size={size} />
  }
  if (mimeType === 'application/pdf') {
    return <PiFilePdfLight size={size} />
  }
  if (
    mimeType.startsWith('application/msword') ||
    mimeType.startsWith('application/vnd.') ||
    mimeType.startsWith('text/')
  ) {
    return <PiFileDocLight size={size} />
  }
  return <PiFileLight size={size} />
}
