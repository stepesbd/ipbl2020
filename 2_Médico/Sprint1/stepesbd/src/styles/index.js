import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`

*{
    padding: 0;
    margin: 0;
}

body{
    background-color: ${props => props.theme.mode === 'dark' ? '#1d1d1d' : '#fff'};
    color: ${props => props.theme.mode === 'dark' ? '#fff' : '#1d1d1d'};
}

`