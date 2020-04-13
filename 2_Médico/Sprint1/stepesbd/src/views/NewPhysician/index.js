import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, Box } from '@material-ui/core'
import Copyright from '../../components/layouts/Copyright'
import PhysicianTable from '../../components/layouts/PhysicianTable'

import styles from './styles'

export default function NewPhysician() {
    const classes = styles()

    return (
        <div className={classes.root}>
            <AppBar position="absolute" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" color="primary" noWrap className={classes.toolbarTitle}>
                        STEPES-BD
          </Typography>
                    <Button href="#" color="primary" variant="outlined" className={classes.link}>
                        NOVO
          </Button>
                </Toolbar>
            </AppBar>

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <PhysicianTable />
                            </Paper>
                        </Grid>
                    </Grid>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    );
}
