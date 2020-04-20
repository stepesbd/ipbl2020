import React, { useState } from 'react'
import { Card, Typography, CardContent, IconButton } from '@material-ui/core'
import { Delete } from "@material-ui/icons"
import SpecialtyUpdate from '../../components/SpecialtyUpdate'

export default function SpecialtyCard(props) {
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Card>
                <CardContent onClick={handleClickOpen}>
                    <Typography>
                        {props.name}
                    </Typography>
                </CardContent>
                <IconButton>
                    <Delete style={{ color: '#dc004e' }} />
                </IconButton>
            </Card>
            <SpecialtyUpdate id={props.id} name={props.name} open={open} handleClose={handleClose} />
        </React.Fragment>
    )
}