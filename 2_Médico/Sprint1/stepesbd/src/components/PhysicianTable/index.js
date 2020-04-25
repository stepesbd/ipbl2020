import React, { useState, useEffect } from 'react'
import { Grid, Paper, TableContainer, IconButton, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import { Edit, Delete } from '@material-ui/icons'
import PhysicianUpdate from '../PhysicianUpdate'
import api from '../../services/api'

export default function PhysicianTable() {
    const [physicians, setPhysicians] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        api.get(`physicians`)
            .then(response => {
                setPhysicians(response.data.msg)
            })
    }, [])

    const handleClickOpen = (id = null) => {
        setOpen(true)
    }

    const handleClickClose = () => {
        setOpen(false)
    }


    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Paper elevation={3}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>CRM</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {physicians.map(physician => (
                                    <TableRow key={physician.id}>
                                        <TableCell>{physician.id}</TableCell>
                                        <TableCell>{physician.name}</TableCell>
                                        <TableCell>{physician.crm}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={handleClickOpen}><Edit style={{ color: '#2196f3' }} /></IconButton >
                                            <IconButton ><Delete style={{ color: '#dc004e' }} /></IconButton >
                                        </TableCell>
                                        <PhysicianUpdate open={open} close={handleClickClose} physician={physician.id} />
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </React.Fragment>
    )
}