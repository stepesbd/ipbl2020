import React from 'react'
import { Typography, Grid, TextField, FormControlLabel, Checkbox } from '@material-ui/core'
import Dashboard from '../../../templates/Dashboard'

export default function Insert() {
    return (
        <React.Fragment>
            <Dashboard>
                <Typography variant="h6" gutterBottom>
                    Novo Médico
      </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="Nome Completo"
                            fullWidth
                            autoComplete="name"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            id="cpf"
                            name="cpf"
                            label="CPF"
                            fullWidth
                            autoComplete="cpf"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            id="crm"
                            name="crm"
                            label="CRM"
                            fullWidth
                            autoComplete="crm"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="address1"
                            name="address1"
                            label="Address line 1"
                            fullWidth
                            autoComplete="billing address-line1"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="address2"
                            name="address2"
                            label="Address line 2"
                            fullWidth
                            autoComplete="billing address-line2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="city"
                            name="city"
                            label="City"
                            fullWidth
                            autoComplete="billing address-level2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField id="state" name="state" label="State/Province/Region" fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="zip"
                            name="zip"
                            label="Zip / Postal code"
                            fullWidth
                            autoComplete="billing postal-code"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="country"
                            name="country"
                            label="Country"
                            fullWidth
                            autoComplete="billing country"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                            label="Use this address for payment details"
                        />
                    </Grid>
                </Grid>
            </Dashboard>
        </React.Fragment>
    )
}