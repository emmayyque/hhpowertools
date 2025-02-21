import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
const baseURL = import.meta.env.VITE_NODE_URL


const ProtectedRoute = ({ children }) => {
    const [ user, setUser ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(true)

    const getUser = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            const resp = await fetch(`${baseURL}/api/auth/getuser`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })

            const json = await resp.json()
            if (json.success) {
                setUser(json.data)
            } else {
                console.log(json.error)
            }
            
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    if (isLoading) {
        return null
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user && user.role !== 2) {
        return <Navigate to="/Admin/Dashboard" />;
    }

    return children
};

export default ProtectedRoute;