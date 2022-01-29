import {
  Avatar,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { Emoji } from 'emoji-mart'
import { FC, ReactNode } from 'react'

export interface MenuOption {
  label: string
  emoji?: string
  command?: string
  path?: string
  onClick?: (event: any) => void
}

interface Props {
  avatarUrl?: string | null
  userDisplayName?: string | null
  menuOptions?: Array<MenuOption>
  authenticatedMenuOptions?: Array<MenuOption>
  isAuthenticated?: boolean
  isStateEmpty?: boolean
  onClickReset: (event: any) => void
  onClickAuth: (event: any) => void
}

interface ConditionalLinkProps {
  path?: string | null
  children: ReactNode
}

const ConditionalLink: FC<ConditionalLinkProps> = ({ path, children }) =>
  path ? (
    <Link as={ReachLink} to={path}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )

const LayoutMenu: FC<Props> = (props) => {
  const {
    authenticatedMenuOptions,
    avatarUrl,
    isAuthenticated,
    isStateEmpty,
    menuOptions,
    onClickAuth,
    onClickReset,
    userDisplayName,
  } = props
  const dividerColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Menu>
      <MenuButton
        _hover={{ background: 'whiteAlpha.300' }}
        _active={{ background: 'whiteAlpha.500' }}
        variant="ghost"
        as={Button}
      >
        <Avatar src={avatarUrl || undefined} name={userDisplayName || undefined} size="sm" />
      </MenuButton>
      <MenuList>
        {!!menuOptions?.length && (
          <>
            {menuOptions.map((item) => {
              return (
                <ConditionalLink path={item.path}>
                  <MenuItem
                    key={item.label}
                    onClick={item.onClick}
                    icon={!!item.emoji ? <Emoji set="google" emoji={item.emoji} size={24} /> : undefined}
                  >
                    {item.label}
                  </MenuItem>
                </ConditionalLink>
              )
            })}
            <MenuDivider color={dividerColor} />
          </>
        )}

        {!!authenticatedMenuOptions?.length && (
          <>
            {authenticatedMenuOptions.map((item) => {
              return (
                <ConditionalLink path={item.path}>
                  <MenuItem
                    key={item.label}
                    onClick={item.onClick}
                    icon={!!item.emoji ? <Emoji set="google" emoji={item.emoji} size={24} /> : undefined}
                    command={item.command}
                  >
                    {item.label}
                  </MenuItem>
                </ConditionalLink>
              )
            })}
            <MenuDivider color={dividerColor} />
          </>
        )}

        {!isStateEmpty && typeof onClickReset === 'function' && (
          <>
            <MenuItem onClick={onClickReset} icon={<Emoji set="google" emoji=":construction:" size={24} />}>
              Reset
            </MenuItem>
            <MenuDivider color={dividerColor} />
          </>
        )}
        <MenuItem icon={<Emoji set="google" emoji=":lock:" size={24} />} onClick={onClickAuth}>
          {isAuthenticated ? 'Log out' : 'Log in'}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default LayoutMenu
