import React, { useEffect, useState } from "react";
import CategoryContext from "./CategoryContext";

const CategoryProvider = (props) => {
    const baseUrl = import.meta.env.VITE_NODE_URL
    const [ categories, setCategories ] = useState([])

    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = async () => {
        // const authToken = localStorage.getItem('token')
        const resp = await fetch(`${baseUrl}/api/category/getall`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'auth-token': authToken
            }
        })

        const json = await resp.json()

        if (json.success) {
            setCategories(json.data)
        } else {
            console.log(json.message)
        }
    }
    
  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
        {props.children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider
