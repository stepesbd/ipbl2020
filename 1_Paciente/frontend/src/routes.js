import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import Dashboard from "./views/Dashboard";
import UserProfile from "./views/UserProfile";
import Errors from "./views/Help/Errors";
import ComponentsOverview from "./views/Help/ComponentsOverview";
import Tables from "./views/Help/Tables";


import PatientList from "./views/Registration/PatientList";
import PatientForm from "./views/Registration/PatientForm";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/patient-list" />
  },
  {
    path: "/patient-list",
    layout: DefaultLayout,
    component: PatientList
  },
  {
    path: "/patient-form",
    layout: DefaultLayout,
    component: PatientForm
  },
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: Dashboard
  },
  {
    path: "/user-profile",
    layout: DefaultLayout,
    component: UserProfile
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  }
];
