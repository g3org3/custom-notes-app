import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'

interface Props {
  items: Array<string>
  onItemClick?: (value: string, index: number) => void
}

interface PlainObject {
  [key: string]: boolean
}

const CheckboxList = ({ items, onItemClick }: Props) => {
  const [checked, setChecked] = React.useState<PlainObject>({})

  const handleToggle = (
    value: string,
    isChecked: boolean,
    index: number
  ) => () => {
    setChecked({ ...checked, [value]: !isChecked })
    if (!!onItemClick) onItemClick(value, index)
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {items.map((value, index) => {
        const labelId = `checkbox-list-label-${value}`
        const isChecked =
          checked[value] === undefined
            ? value.indexOf('(done)') !== -1
            : checked[value]

        return (
          <ListItem key={value} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value, isChecked, index)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={isChecked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}

export default CheckboxList
