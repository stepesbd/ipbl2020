import React, { useState, useEffect } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import api from '../../services/api'

export default function PhysicianDelete(props) {
    const physicianId = props.id
    const [physician, setPhysician] = useState('')

    useEffect(() => {
        if (physicianId !== null) {
            api.get(`physicians/${physicianId}`)
                .then(response => {
                    setPhysician(response.data.msg)
                })
        }
    }, [physicianId])

    const handleDeletePhysician = () => {
        api.delete(`physicians/${physicianId}`)
        props.close()
    }

    return (
        <React.Fragment>
            <Dialog
                open={props.open}
                onClose={props.close}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deseja excluir o médico {physician.name} ?
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.close} color="primary">
                        NÃO
          </Button>
                    <Button onClick={handleDeletePhysician} color="primary" autoFocus>
                        SIM
          </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}