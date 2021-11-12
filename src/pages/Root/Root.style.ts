import styled from 'styled-components'

interface DivProps {
  isDarkTheme?: boolean
}

export const Container = styled.div`
  position: fixed;
  top: 48px;
  background: ${(props: DivProps) => (props.isDarkTheme ? '#333' : '#eee')};
  height: calc(100vh - 48px);
  padding: 20px 0 50px 0;
  width: 100vw;
  overflow: auto;
`
