import { List, ListItem, ListIcon } from '@chakra-ui/react'
import { FC, memo } from 'react'
import { FiSquare, FiCheckSquare } from 'react-icons/fi'

import { isLineDone, cleanLine } from 'services/notes'

interface Props {
  values?: Array<string> | null
  onClick?: (index: number, line: string) => void
}

const CheckList: FC<Props> = ({ values, onClick }) => {
  const handleClick = (value: string, i: number) => () => {
    if (typeof onClick === 'function') onClick(i, value)
  }

  return (
    <List spacing={3}>
      {values?.map((value, i) => {
        const isDone = isLineDone(value)
        const Icon = isDone ? FiCheckSquare : FiSquare
        const color = isDone ? 'green.500' : 'tomato'

        return (
          <ListItem cursor="pointer" key={`${value}${i}`} onClick={handleClick(value, i)}>
            <ListIcon as={Icon} color={color} />
            {cleanLine(value)}
          </ListItem>
        )
      })}
    </List>
  )
}

export default memo(CheckList)
