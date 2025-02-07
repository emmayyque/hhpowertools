import react, { useEffect, useState } from "react";
import ProductContext from "./ProductContext";

const ProductState = (props) => {
    const baseURL = import.meta.env.VITE_JSON_SERVER_URL;
    
    const [ products, setProducts ] = useState([])
    const [ product, setProduct ] = useState({})
    const [ filteredProducts, setFilteredProducts ] = useState()

    useEffect(() => {
        fetch(`${baseURL}/products`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.log(err))
    }, [])


    const loadProduct = (id) => {
        fetch(`${baseURL}/products?id=${id}`)
        .then(res => res.json())
        .then(data => setProduct(data) )
        .catch(err => console.log(err))
    }
    
    // useEffect(() => {

    // }, [searchedProducts])

    const searchProducts = (searchTerm) => {
        setFilteredProducts(
            products.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }

    const searchByCategory = (category, searchTerm) => {
        setFilteredProducts(
            products.filter(i => i.category == category && i.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }
    

    return (
        <ProductContext.Provider value={{ products, product, loadProduct, setProducts, filteredProducts, setFilteredProducts, searchProducts, searchByCategory}}>
            {props.children}
        </ProductContext.Provider>
    )
}

export default ProductState