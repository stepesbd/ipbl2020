import React from 'react'
import { Grid } from '@material-ui/core'
import Dashboard from '../../templates/Dashboard'
import SpecialtyCard from '../../components/SpecialtyCard'

export default function Specialties() {
    return (
        <React.Fragment>
            <Dashboard>
                <h1>Specialties</h1>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <SpecialtyCard />
                    </Grid>
                    <Grid item xs={3}>
                        <SpecialtyCard />
                    </Grid>
                    <Grid item xs={3}>
                        <SpecialtyCard />
                    </Grid>
                    <Grid item xs={3}>
                        <SpecialtyCard />
                    </Grid>
                </Grid>
            </Dashboard>
        </React.Fragment>
    )
}