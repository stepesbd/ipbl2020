import React from 'react'
import { Grid, Paper, TableContainer, IconButton, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import { Edit, Delete } from '@material-ui/icons'

export default function PhysicianTable() {

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
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="right">
                                        <IconButton ><Edit style={{ color: '#2196f3' }} /></IconButton >
                                        <IconButton ><Delete style={{ color: '#dc004e' }} /></IconButton >
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </React.Fragment>
    )
}