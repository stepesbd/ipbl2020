import React, { useState, useEffect } from 'react'
import { Grid, Paper, TableContainer, IconButton, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import { Edit, Delete } from '@material-ui/icons'
import { AddCircle } from '@material-ui/icons'
import PhisicianInsert from '../PhysicianInsert'
import PhysicianUpdate from '../PhysicianUpdate'
import PhysicianDelete from '../PhysicianDelete'
import api from '../../services/api'

export default function PhysicianTable() {
    const [physicians, setPhysicians] = useState([])
    const [physicianId, setPhysicianId] = useState(null)
    const [insert, setInsert] = useState(false)
    const [update, setUpdate] = useState(false)
    const [drop, setDrop] = useState(false)

    const handleOpenInsert = () => {
        setInsert(true)
    }

    const handleCloseInsert = () => {
        setInsert(false)
    }

    const handleCloseUpdate = () => {
        setPhysicianId(null)
        setUpdate(false)
    }

    function handleOpenUpdate(id) {
        setPhysicianId(id)
        setUpdate(true)
    }

    const handleCloseDrop = () => {
        setPhysicianId(null)
        setDrop(false)
    }

    function handleOpenDrop(id) {
        setPhysicianId(id)
        setDrop(true)
    }

    useEffect(() => {
        api.get(`physicians`)
            .then(response => {
                setPhysicians(response.data.msg)
            })
    }, [insert, update, drop, handleCloseDrop])

    return (
        <React.Fragment>
            <div>
                <h1>Médicos</h1>
                <IconButton onClick={handleOpenInsert}>
                    <AddCircle />
                </IconButton>
            </div>
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
                                            <IconButton onClick={() => handleOpenUpdate(physician.id)}><Edit style={{ color: '#2196f3' }} /></IconButton >
                                            <IconButton onClick={() => handleOpenDrop(physician.id)}><Delete style={{ color: '#dc004e' }} /></IconButton >
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <PhysicianUpdate open={update} close={handleCloseUpdate} id={physicianId} />
            <PhysicianDelete open={drop} close={handleCloseDrop} id={physicianId} />
            <PhisicianInsert open={insert} close={handleCloseInsert} />
        </React.Fragment>
    )
}