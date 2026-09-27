import AuthContext from "../../context/AuthContext";
import { useContext, useState } from "react";
import { Navigate } from "react-router";
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({children, allowedRoles})
{

    const {user, loading} = useContext(AuthContext);

    if(loading)
    {
        return <LoadingSpinner/>
    }

    if(!user)
    {
        return <Navigate to="/login" replace />
    }

    if(!allowedRoles.includes(user.role))
    {
        return <Navigate to="/login" replace />
    }

    return children;
}

export default ProtectedRoute;