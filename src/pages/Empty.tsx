import {
  Box,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalBody,
  ModalFooter,
  Button,
  Select,
} from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import yaml from 'js-yaml'
import { DateTime } from 'luxon'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { dbOnValue } from 'config/firebase'
import { useAuth } from 'lib/auth'
import { actions, NoteDBType } from 'modules/Note'
import { openAndChooseFile } from 'services/file'
import { inboundMapper } from 'services/notes'
import { exampleNotesYaml } from 'services/yaml.example'

interface Props {
  default?: boolean
  path?: string
}

interface FirebaseFile {
  id: string
  name: string
  notes: Array<NoteDBType>
}

const Empty: FC<Props> = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [fileid, setFileid] = useState<string>('')
  const [files, setFiles] = useState<Array<FirebaseFile>>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const theme = useColorModeValue(atomOneLight, atomOneDark)
  const toast = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) return

    dbOnValue(
      `users/${currentUser.uid}/notes`,
      (snapshot: any) => {
        const data = snapshot.val()
        if (!data) return
        const files: Array<FirebaseFile> = Object.values(data)
        if (files.length === 0) return
        setFiles(files)
        onOpen()
      },
      {}
    )
  }, [currentUser, onOpen])

  const handleSelectFileChange = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      // @ts-ignore
      setFileid(e.target.value)
    },
    [setFileid]
  )

  const readExternalFile = useCallback(() => {
    if (fileid) {
      const [file] = files.filter((f) => f.id === fileid)
      dispatch(actions.setFileName({ fileName: file.name, id: file.id }))
      dispatch(
        actions.replaceNotes({
          notes: file.notes.map((n) => ({
            ...n,
            // @ts-ignore
            date: DateTime.fromISO(n.date).isValid
              ? // @ts-ignore
                DateTime.fromISO(n.date)
              : null,
          })),
        })
      )
      toast({ title: 'Notes Loaded', status: 'success' })
      navigate('/notes')
    }
    onClose()
  }, [onClose, fileid, files, toast, dispatch, navigate])

  const openAndLoadNotesToApp = useCallback(
    (e: Event) => {
      e.preventDefault()
      // @ts-ignore
      openAndChooseFile()
        .then(({ fileHandle, content }) => {
          // @ts-ignore
          const result = yaml.loadAll(content)
          if (result instanceof Array) {
            const notes: Array<NoteDBType> = result.flat().map(inboundMapper)
            const fileName = fileHandle.name
            dispatch(actions.setFileName({ fileName }))
            dispatch(actions.setFileHandler({ fileHandler: fileHandle }))
            dispatch(actions.replaceNotes({ notes }))
            toast({ title: 'Notes Loaded', status: 'success' })
            navigate('/notes')
          } else {
            toast({
              title: 'Parse Error',
              description: 'Could not parse the given file',
              status: 'error',
            })
          }
        })
        .catch((error) => {
          toast({ title: 'Error', description: error.message, status: 'error' })
        })
    },
    [dispatch, toast, navigate]
  )

  useHotkeys('ctrl+o', openAndLoadNotesToApp)
  useHotkeys('command+o', openAndLoadNotesToApp)

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay zIndex="2" />
        <ModalContent>
          <ModalHeader>Select File</ModalHeader>
          <ModalBody>
            <Select onChange={handleSelectFileChange} placeholder="Select option">
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={readExternalFile}
              bg={useColorModeValue('teal.300', 'teal.800')}
              _hover={{ bg: useColorModeValue('teal.200', 'teal.700') }}
              _active={{ bg: useColorModeValue('teal.400', 'teal.900') }}
            >
              Choose
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <Heading as="h2">
          <span>👋🏼 </span> Welcome
        </Heading>
        <br />
        <Text>Here is an example of notes taken in yaml</Text>

        <SyntaxHighlighter
          customStyle={{
            width: '90vw',
            height: '50vh',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
            border: '1px solid #ccc',
          }}
          language="yaml"
          style={theme}
        >
          {exampleNotesYaml}
        </SyntaxHighlighter>
      </Box>
    </>
  )
}

export default Empty
