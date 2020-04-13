import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './views/Login'
import Panel from './views/Panel'
import Dashboard from './views/Dashboard'
import NewPhysician from './views/NewPhysician'

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Panel} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/new" component={NewPhysician} />
                <Route exact path="/dashboard" component={Dashboard} />
            </Switch>
        </BrowserRouter>
    )
}