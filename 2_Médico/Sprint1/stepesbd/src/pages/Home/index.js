import React, { useState } from 'react'
import Dashboard from '../../templates/Dashboard'
import { IconButton } from '@material-ui/core'
import { AddCircle } from '@material-ui/icons'
import PhysicianTable from '../../components/PhysicianTable'
import PhisicianInsert from '../../components/PhysicianInsert'

export default function Home() {
    const [modalInsert, setModalInsert] = useState(false)

    const handleClickOpen = () => {
        setModalInsert(true)
    }

    const handleClickClose = () => {
        setModalInsert(false)
    }

    return (
        <React.Fragment>
            <Dashboard>
                <div>
                    <h1>Médicos</h1>
                    <IconButton onClick={handleClickOpen}>
                        <AddCircle />
                    </IconButton>
                </div>
                <PhysicianTable />
                <PhisicianInsert open={modalInsert} close={handleClickClose} />
            </Dashboard>
        </React.Fragment >
    )
}