import React from 'react'

const Auth = () => {
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
                setIsLoading(true)
                setUser(null)
            }
        } else {
            setIsLoading(true)
            setUser(null)
        }
    }

    const loadUser = async () => {
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
                return json.data.role
            } else {    
                return null
            }
        }
    }
    
    useEffect(() => {
        getUser()
    }, [])
    
}

export default Auth
