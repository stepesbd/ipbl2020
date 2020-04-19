import React, { useState, useEffect } from 'react'
import { Grid, Paper, TableContainer, IconButton, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import { Edit, Delete } from '@material-ui/icons'
import api from '../../services/api'

export default function PhysicianTable() {
    const [physicians, setPhysicians] = useState([])

    useEffect(() => {
        api.get(`physicians`)
            .then(response => {
                setPhysicians(response.data.msg)
            })
    }, [])

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
                                    <TableCell>1º Especialidade</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {physicians.map(physician => (
                                    <TableRow key={physician.id}>
                                        <TableCell>{physician.id}</TableCell>
                                        <TableCell>{physician.name}</TableCell>
                                        <TableCell>{physician.crm}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell align="right">
                                            <IconButton ><Edit style={{ color: '#2196f3' }} /></IconButton >
                                            <IconButton ><Delete style={{ color: '#dc004e' }} /></IconButton >
                                        </TableCell>
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