import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Container } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import GlobalStyles from '../../styles'
import Header from '../../components/layout/Header'

export default function Dashboard(props) {
    return (
        <React.Fragment>
            <ThemeProvider theme={{ mode: 'light' }}>
                <CssBaseline>
                    <GlobalStyles />
                    <Header />
                    <Container>
                        {props.children}
                    </Container>
                </CssBaseline>
            </ThemeProvider>
        </React.Fragment >
    )
}