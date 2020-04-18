import styled from 'styled-components'
import { AppBar, Toolbar } from '@material-ui/core'


export const AppBarStyled = styled(AppBar)`
    background-color: rgb(33,150,243)
`

export const ToolbarStyled = styled(Toolbar)`
    flex: 1;
    box-shadow: 0 2px 4px rgb(36,81,181);
    flex-direction: row;
    justify-content: space-between;
`