import React from 'react'
import Dashboard from '../../templates/Dashboard'
import PhysicianTable from '../../components/PhysicianTable'

export default function Home() {

    return (
        <React.Fragment>
            <Dashboard>
                <h1>Médicos</h1>
                <PhysicianTable />
            </Dashboard>
        </React.Fragment>
    )
}