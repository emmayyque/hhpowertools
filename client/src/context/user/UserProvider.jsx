import React from 'react'
import UserContext from './UserContext'
import { useState } from 'react'
import { useEffect } from 'react'

const baseURL = import.meta.env.VITE_NODE_URL

const UserProvider = (props) => {

    const [ user, setUser ] = useState(null)
    const [ role, setRole ] = useState(0)
    const [ isLoading, setIsLoading ] = useState(true)

    const getUser = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const resp = await fetch(`${baseURL}/api/auth/getuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            })

            const json = await resp.json()

            if (json.success) {
                setIsLoading(false)
                setUser(json.data)
            } else {
                setIsLoading(false)
                setUser(null)
            }
        } else {
            setIsLoading(false)
            setUser(null)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

  return (
    <UserContext.Provider value={{ user, setUser, getUser }}>
        {props.children}
    </UserContext.Provider>
  )
}

export default UserProvider
