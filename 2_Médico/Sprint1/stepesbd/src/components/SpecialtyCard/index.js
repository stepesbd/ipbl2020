import React from 'react'
import { Card, Typography, CardContent } from '@material-ui/core'

export default function SpecialtyCard(props) {
    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    <Typography>
                        {props.name}
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}