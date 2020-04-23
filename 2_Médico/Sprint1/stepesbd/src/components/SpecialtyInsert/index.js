import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from '@material-ui/core'
import api from '../../services/api'


export default function SpecialtyInsert(props) {
    const [name, setName] = useState('')

    function handleNewSpecialty(event) {
        event.preventDefault()

        const data = {
            name
        }

        try {
            api.post('specialties', data)
                .then(response => {
                    setName('')
                })
            props.handleClose()
        } catch (error) {
            alert('erro ao tentar inserir novo incidente')
        }
    }

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
                        value={name}
                        onChange={e => setName(e.target.value)}
                        label="Nome"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancelar
          </Button>
                    <Button onClick={handleNewSpecialty} variant="contained" color="primary">
                        Inserir
          </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    )
}