import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from '@material-ui/core'

export default function SpecialtyInsert(props) {

    return (
        <React.Fragment>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nova Especialidade</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Digite o nome para a nova especialidade
          </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Nome"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancelar
          </Button>
                    <Button onClick={props.handleClose} variant="contained" color="primary">
                        Inserir
          </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}