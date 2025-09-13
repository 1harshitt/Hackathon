import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../project/index.jsx";
import DashboardLayout from "../project/layout/index.jsx";
import NotFound from "../common/notFound/index.jsx";
import Profile from "../project/module/profile/index.jsx";
import Lead from "../project/module/crm/lead/index.jsx";
import Contact from "../project/module/crm/contact/index.jsx";
import CRMSystem from "../project/module/crm/system/index.jsx";
import Role from "../project/module/role/index.jsx";
import User from "../project/module/user/index.jsx";
import ApiGenerator from "../project/module/apiGenerator/index.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            {
                path: "",
                element: <Dashboard />
            },
            {
                path: "dashboard",
                element: <Dashboard />
            },
            {
                path: "role",
                element: <Role />
            },
            {
                path: "user",
                element: <User />
            },
            {
                path: "api-generator",
                element: <ApiGenerator />
            },
            {
                path: "crm",
                children: [
                    {
                        path: "lead",
                        element: <Lead />
                    },
                    {
                        path: "contact",
                        element: <Contact />
                    },
                    {
                        path: "system",
                        element: <CRMSystem />
                    }
                ]
            },
            {
                path: "profile",
                element: <Profile />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />,
    }
]);

export default router;
