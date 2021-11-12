import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'

interface Item {
  id?: string | null
  label: string
}

interface Props {
  items: Array<Item>
  onItemClick?: (index: number, item: Item) => void
}

const CheckboxList = ({ items, onItemClick }: Props) => {
  const handleToggle = (index: number, value: Item) => () => {
    if (!!onItemClick) onItemClick(index, value)
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {items.map((value, index) => {
        const labelId = `checkbox-list-label-${value}`
        const isChecked = value.label.indexOf('(done)') !== -1

        return (
          <ListItem key={`${index}-${value.label}`} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(index, value)}
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
              <ListItemText id={labelId} primary={value.label} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}

export default CheckboxList
