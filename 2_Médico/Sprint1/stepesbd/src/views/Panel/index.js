import React from 'react';
import { AppBar, Toolbar, Typography, Link, Button } from '@material-ui/core'
import styles from './styles'

export default function Panel() {
    const classes = styles()

    return (
        <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h6" color="primary" noWrap className={classes.toolbarTitle}>
                    STEPES-BD
          </Typography>
                <Button href="#" color="primary" variant="outlined" className={classes.link}>
                    NOVO
          </Button>
            </Toolbar>
        </AppBar>
    );
}
