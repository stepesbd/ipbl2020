import React from 'react'
import Dashboard from '../../templates/Dashboard'
import PhysicianTable from '../../components/PhysicianTable'

export default function Home() {
    return (
        <React.Fragment>
            <Dashboard>
                <PhysicianTable />
            </Dashboard>
        </React.Fragment >
    )
}