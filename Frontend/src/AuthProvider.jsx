import AuthContext from "../context/AuthContext";
import { useState,useEffect } from "react";
import api from './api/axios.js'

function AuthProvider({children})
{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function checkAuth()
    {
        try
        {
            const response = await api.get('/auth/me');
            setUser(response.data.User);
        }
        catch(err)
        {
            setUser(null);
        }
        finally{
            setLoading(false);
        }
    }


    useEffect(()=>{
        checkAuth();
    },[])

    return(
        <div>
            <AuthContext.Provider value={{user, setUser, loading}}>
                {children}
            </AuthContext.Provider>
        </div>
    )
}

export default AuthProvider;
