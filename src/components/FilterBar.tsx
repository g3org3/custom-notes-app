import { Flex, Button, Link, Divider } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { FC, memo, useCallback } from 'react'
import { FiMinusSquare, FiFolder, FiLink } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'modules/Note'

interface Props {}

const FilterBar: FC<Props> = (props) => {
  const dispatch = useDispatch()
  const tags = useSelector(selectors.selectTags)
  const isFilterNotFinished = useSelector(selectors.selectIsFilterNotFinished)

  const onClickDNF = useCallback(() => {
    dispatch(actions.toggleNotFinished())
  }, [dispatch])

  return (
    <Flex direction="column" mr={4} gap={4} height="calc(100vh - 88px)" overflow="auto">
      <Button justifyContent="left" leftIcon={<FiFolder />} _hover={{ boxShadow: 'md' }}>
        All Notes
      </Button>
      <Button
        leftIcon={<FiMinusSquare />}
        isActive={isFilterNotFinished}
        onClick={onClickDNF}
        _hover={{ boxShadow: 'md' }}
      >
        Not Finished
      </Button>
      <Divider color="gray.200" />
      {tags.map(([tag, id]) => (
        <Link display="flex" flexDirection="column" key={id} as={ReachLink} to={`/notes/${id}`}>
          <Button justifyContent="left" leftIcon={<FiLink />} _hover={{ boxShadow: 'md' }} key={tag}>
            {tag}
          </Button>
        </Link>
      ))}
    </Flex>
  )
}

export default memo(FilterBar)
