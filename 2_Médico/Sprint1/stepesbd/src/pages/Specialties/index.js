import React, { useState, useEffect } from 'react'
import { Grid, IconButton } from '@material-ui/core'
import { AddCircle } from '@material-ui/icons'
import Dashboard from '../../templates/Dashboard'
import SpecialtyCard from '../../components/SpecialtyCard'
import SpecialtyInsert from '../../components/SpecialtyInsert'
import api from '../../services/api'

export default function Specialties() {
    const [specialties, setSpecialties] = useState([])
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        api.get(`specialties`)
            .then(response => {
                setSpecialties(response.data.msg)
            })
    }, [open, handleClose])

    return (
        <React.Fragment>
            <Dashboard>
                <div>
                    <h1>Especialidade</h1>
                    <IconButton onClick={handleClickOpen}>
                        <AddCircle />
                    </IconButton>
                </div>
                <Grid container spacing={3}>
                    {specialties.map(specialty => (
                        <Grid key={specialty.id} item xs={3}>
                            <SpecialtyCard
                                id={specialty.id}
                                name={specialty.name} />
                        </Grid>
                    ))}
                </Grid>
                <SpecialtyInsert open={open} close={handleClose} />
            </Dashboard>
        </React.Fragment>
    )
}