import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, Default2Layout } from "./layouts";

// Route Views
import Dashboard from "./views/Dashboard";
import UserProfile from "./views/UserProfile";
import Errors from "./views/Help/Errors";
import ComponentsOverview from "./views/Help/ComponentsOverview";
import Tables from "./views/Help/Tables";
import Step1 from "./views/Attendance/Step1";
import Step2 from "./views/Attendance/Step2";
import Step3 from "./views/Attendance/Step3";
import Register from "./views/Attendance/Register";

import PatientList from "./views/Registration/PatientList";
import PatientForm from "./views/Registration/PatientForm";

//Physicians
import PhysicianList from './views/Physicians/PhysicianList';
import PhysicianForm from './views/Physicians/PhysicianForm';
import SpecialtyList from './views/Specialties/SpecialtyList';

//Scheduling
import Schedule from './views/Scheduling/Schedule'
import AttendanceForm from './views/Scheduling/AttendanceForm'
import NewAttendanceForm from './views/Scheduling/NewAttendanceForm'

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
    path: "/physician-list",
    layout: DefaultLayout,
    component: PhysicianList
  },
  {
    path: "/physician-form",
    layout: DefaultLayout,
    component: PhysicianForm
  },
  {
    path: "/specialties",
    layout: DefaultLayout,
    component: SpecialtyList
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
  },
  {
    path: "/step1",
    layout: Default2Layout,
    component: Step1
  },
  {
    path: "/step2",
    layout: Default2Layout,
    component: Step2
  },
  {
    path: "/step3",
    layout: Default2Layout,
    component: Step3
  },
  {
    path: "/register",
    layout: Default2Layout,
    component: Register
  },
  {
    path: "/schedule",
    layout: Default2Layout,
    component: Schedule
  },
  {
    path: "/new-attendance",
    layout: DefaultLayout,
    component: NewAttendanceForm
  },
  {
    path: "/attendance-form",
    layout: Default2Layout,
    component: AttendanceForm
  }
];
