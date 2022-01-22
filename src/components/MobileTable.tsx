import { FC } from 'react'
import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { useSelector } from 'react-redux'

import { selectors } from 'modules/Note'

interface Props {
  //
}

const MobileTable: FC<Props> = () => {
  const notes = useSelector(selectors.selectNotesWithSearch)
  const stripedTableBackground = useColorModeValue('gray.100', 'gray.700')

  return (
    <Flex
      display={{ base: 'inline-flex', md: 'none' }}
      direction="column"
      borderTop="1px solid black"
      borderColor={stripedTableBackground}
      mt={2}
    >
      {notes?.map((note, i) => (
        <Box
          key={note.id}
          display="flex"
          flexDirection="column"
          background={i % 2 === 0 ? stripedTableBackground : ''}
          pl={2}
          pb={2}
          cursor="pointer"
          as={ReachLink}
          _hover={{ background: 'gray.300' }}
          to={`/notes/${note.id}`}
        >
          <Text fontSize="24px">{note.subject || 'Untitled'}</Text>
          <Text>{note.date?.toISODate()}</Text>
        </Box>
      ))}
    </Flex>
  )
}

export default MobileTable
