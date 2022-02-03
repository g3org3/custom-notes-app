export interface FileSystemWritableFileStream {
  write: (content: string) => Promise<any>
  close: () => Promise<any>
}
export interface FileSystemFileHandle {
  readonly kind: 'file' | 'directory'
  readonly name: string
  getFile: () => Promise<File>
  createWritable: () => Promise<FileSystemWritableFileStream>
}

type Extensions = Array<string>
interface TypeOption {
  description?: string
  accept: { [mime: string]: Extensions }
}
interface ShowFilePickerOptions {
  types?: Array<TypeOption>
  excludeAcceptAllOption?: boolean
  multiple?: boolean
}

declare global {
  interface Window {
    showOpenFilePicker?: (options: ShowFilePickerOptions) => Promise<Array<FileSystemFileHandle>>
    showSaveFilePicker?: (options: ShowFilePickerOptions) => Promise<FileSystemFileHandle>
  }
}

export const openAndChooseFile = async () => {
  if (typeof window.showOpenFilePicker !== 'function') {
    throw new Error('Your browser does not support this feature')
  }

  const options = {
    types: [
      {
        description: 'Text',
        accept: { 'text/*': ['.txt', '.yaml', '.yml'] },
      },
    ],
    multiple: false,
  }

  const [fileHandle] = await window.showOpenFilePicker(options)
  console.log(fileHandle)

  if (fileHandle.kind !== 'file') {
    return Promise.reject(`Could not open the "${fileHandle.kind}", because is not a file.`)
  }

  const file = await fileHandle.getFile()
  console.log(file)
  const content = await file.text()
  const { lastModified } = file

  return { fileHandle, content, file, lastModified }
}

export const openAndSaveToFile = async (content: string) => {
  if (typeof window.showSaveFilePicker !== 'function') {
    throw new Error('Your browser does not support this feature')
  }

  const options = {
    types: [
      {
        description: 'Text',
        accept: { 'text/*': ['.txt', '.yaml', '.yml'] },
      },
    ],
  }

  const fileHandler = await window.showSaveFilePicker(options)
  const writableStream = await fileHandler.createWritable()
  await writableStream.write(content)
  await writableStream.close()

  return fileHandler
}

export const readFileContent = async (fileHandle: FileSystemFileHandle | null) => {
  if (!fileHandle) return ''

  const file = await fileHandle.getFile()
  const content = await file.text()

  return content
}

export const saveToFile = async (fileHandle: FileSystemFileHandle, content: string) => {
  const writableStream = await fileHandle.createWritable()
  await writableStream.write(content)
  writableStream.close()
}
