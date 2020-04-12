import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './views/Login'
import Panel from './views/Panel'

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Panel} />
                <Route exact path="/login" component={Login} />
            </Switch>
        </BrowserRouter>
    )
}