import { Heading, Flex, Icon, Link, useMediaQuery } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { Emoji } from 'emoji-mart'
import { FC } from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { FiHome } from 'react-icons/fi'

import CheckList from 'components/CheckList'
import NoteContent from 'components/NoteContent'
import ShowIf from 'components/Show'
import { NoteDBType } from 'modules/Note'

import FilterBar from './FilterBar'
import { fullHeight } from './Layout'
import NoteViewMeta from './NoteViewMeta'

interface Props {
  note: NoteDBType
  onClickDoubt: (index: number, value: string) => void
  onClickHome?: (e: any) => void
  onClickNextStep: (index: number, value: string) => void
  readOnly?: boolean
}

const NoteView: FC<Props> = ({ onClickHome, note, onClickNextStep, onClickDoubt, readOnly }) => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)')

  return (
    <Flex height={fullHeight} overflow="auto">
      {isDesktop ? <FilterBar isCompacted /> : null}
      <Flex direction="column">
        <Flex
          bg="rgba(0,0,0,0)"
          backdropFilter="blur(4px)"
          alignItems="center"
          pt={4}
          position="sticky"
          zIndex="3"
          top="0"
          left="0"
        >
          <Link as={ReachLink} to="/notes" onClick={onClickHome}>
            <Icon as={FiHome} fontSize={30} />
          </Link>
          <Icon as={BsChevronRight} color="gray.300" fontSize={30} />
          <Heading as="h2" gap={2} display="flex">
            {note.emoji ? <Emoji set="google" emoji={note.emoji} size={40} /> : null}
            {note.subject}
          </Heading>
        </Flex>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'unset', md: 'flex-start' }}
          gap={{ base: 0, md: 10 }}
        >
          <Flex direction={{ base: 'column', md: 'row' }} alignItems="flex-start" gap={4}>
            <NoteViewMeta isReadOnly={readOnly} note={note} />
            <NoteContent notes={note.notes} />
            <Flex direction="column" ml={10}>
              <ShowIf value={!!note.doubts}>
                <Heading as="h3" size="md" mt={5} mb={2}>
                  Doubts
                </Heading>
                <CheckList values={note.doubts} onClick={onClickDoubt} />
              </ShowIf>

              <ShowIf value={!!note.next_steps}>
                <Heading as="h3" size="md" mt={5} mb={2}>
                  Next Steps
                </Heading>
                <CheckList values={note.next_steps} onClick={onClickNextStep} />
              </ShowIf>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default NoteView
