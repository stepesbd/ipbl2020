import React from 'react'
import { useHistory } from 'react-router-dom'
import { Typography, IconButton, Button, ButtonGroup } from '@material-ui/core'
import Night from '@material-ui/icons/Brightness3';
import Day from '@material-ui/icons/Brightness5'
import { AppBarStyled, ToolbarStyled } from './styles'


export default function Header(props) {

    const history = useHistory()

    function setIcons(theme) {
        if (theme === 'dark') {
            return <Night style={{ color: '#fff' }} />
        } else {
            return <Day style={{ color: '#fff' }} />
        }
    }

    return (
        <React.Fragment>
            <AppBarStyled position="static">
                <ToolbarStyled>
                    <Typography variant="h6">STEPES-BD</Typography>
                    <ButtonGroup>
                        <Button onClick={() => history.push('/')} style={{ marginRight: 5 }} variant="contained" color="primary">Médicos</Button >
                        <Button onClick={() => history.push('/specialties')} variant="contained" color="primary">Especialidades</Button >
                    </ButtonGroup>
                    <IconButton onClick={props.setTheme}>
                        {setIcons(props.Icon)}
                    </IconButton>
                </ToolbarStyled>
            </AppBarStyled>
        </React.Fragment>
    )
}