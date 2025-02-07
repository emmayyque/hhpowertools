import React from 'react'
import * as Icons from 'react-icons/fa6'


const Pagination = ({totalProducts, prodPerPage, setCurrentPage, currentPage}) => {
    let pages = []    
    let i = 1;

    // console.log("Total Products: ", totalProducts)
    // console.log("Products Per Page: ", prodPerPage)

    for (i = 1; i <= Math.ceil(totalProducts/prodPerPage); i++) {
        pages.push(i)
    }

    const prevPageHandler = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const nextPageHandler = () => {
        if (currentPage < pages.length) {
            setCurrentPage(currentPage + 1)
        }
    }

    const createPagination = () => {
        const pagination = []

        if (pages.length <= 4) {
            for (let i=1; i <= pages.length; i++) {
                pagination.push(i)
            }
        } else {
            pagination.push(1, 2);
    
            if (pages.length > 5) {
                pagination.push("...")
            }
    
            if (currentPage > 2 && currentPage < pages.length - 2) {
                pagination.push(currentPage)
            }
    
            
            pagination.push(pages.length - 1, pages.length)
        }

        return pagination
    }

    


  return (
    <div className='pagination row'>
        <div className="prev row">
            <Icons.FaChevronLeft className='icon' onClick={prevPageHandler} />
        </div>
        <div className="pages row">
            {
                createPagination().map((pageNum, index) => (
                    <button key={index} onClick={() => setCurrentPage(pageNum)} className={ pageNum == currentPage ? 'active' : ''}>{pageNum}</button>
                ))
            }
        </div>        
        <div className="next row">
            <Icons.FaChevronRight className='icon' onClick={nextPageHandler} />
        </div>
    </div>
  )
}

export default Pagination
