import { Flex, Button, Link, Divider, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { FC, memo, useCallback } from 'react'
import { FiMinusSquare, FiFolder, FiLink } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

import { fullHeight } from 'components/Layout'
import { actions, selectors } from 'modules/Note'

interface Props {
  isCompacted?: boolean
}

const FilterBar: FC<Props> = ({ isCompacted }) => {
  const dispatch = useDispatch()
  const tags = useSelector(selectors.selectTags)
  const isFilterNotFinished = useSelector(selectors.selectIsFilterNotFinished)
  const screen = useBreakpointValue({ base: 0, md: 1, lg: 2, xl: 3, '2xl': 4 }) || 0
  const bg = useColorModeValue('white', 'gray.800')

  const compact = screen < 2 || isCompacted

  const onClickDNF = useCallback(() => {
    dispatch(actions.toggleNotFinished())
  }, [dispatch])

  return (
    <Flex
      direction="column"
      mr={4}
      gap={4}
      height={fullHeight}
      overflow="auto"
      position="sticky"
      top="0"
      left="0"
    >
      <Flex bg={bg} zIndex="4" direction="column" gap={4} position="sticky" top="0" boxShadow="sm">
        <Button
          isActive={!isFilterNotFinished}
          disabled={!isFilterNotFinished}
          justifyContent="left"
          onClick={onClickDNF}
          leftIcon={<FiFolder />}
          _hover={{ boxShadow: 'md' }}
        >
          {compact ? '' : 'All Notes'}
        </Button>
        <Button
          justifyContent="left"
          disabled={isFilterNotFinished}
          leftIcon={<FiMinusSquare />}
          isActive={isFilterNotFinished}
          onClick={onClickDNF}
          _hover={{ boxShadow: 'md' }}
        >
          {compact ? '' : 'Not Finished'}
        </Button>
        <Divider color="gray.200" />
      </Flex>
      {tags.map(([tag, id]) => (
        <Link display="flex" flexDirection="column" key={id} as={ReachLink} to={`/notes/${id}`}>
          <Button justifyContent="left" leftIcon={<FiLink />} _hover={{ boxShadow: 'md' }} key={tag}>
            {compact ? '' : tag}
          </Button>
        </Link>
      ))}
    </Flex>
  )
}

export default memo(FilterBar)
