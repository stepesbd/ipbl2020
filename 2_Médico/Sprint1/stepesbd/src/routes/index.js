import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from '../pages/Login'
import Home from '../pages/Home'
import Specialties from '../pages/Specialties'
import Insert from '../pages/Physicians/Insert'

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/" component={Home} />
                <Route exact path="/physicians/new" component={Insert} />
                <Route exact path="/specialties" component={Specialties} />
            </Switch>
        </BrowserRouter>
    )
}