import React from 'react'
import { Typography, Link } from '@material-ui/core'

export default function Copyright() {
    return (
        <React.Fragment>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://github.com/stepesbd/ipbl2020">
                    STEPES-BD
        </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </React.Fragment>
    )
}