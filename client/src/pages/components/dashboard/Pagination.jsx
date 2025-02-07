import React from 'react'
import styles from '../../Admin/Dash.module.css'
import * as Icons from 'react-icons/fa6'

const Pagination = ({totalItems, itemsPerPage, setCurrentPage, currentPage}) => {
    let pages = []    
    let i = 1;

    for (i = 1; i <= Math.ceil(totalItems/itemsPerPage); i++) {
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
    <div className={`${styles.pagination} ${styles.row}`}>
        <div className={`${styles.prev} ${styles.row}`}>
            <Icons.FaChevronLeft className={styles.icon} onClick={prevPageHandler} />
        </div>
        <div className={styles.pages}>
            {
                // pages.map((page, index) => (
                //     <button key={index} onClick={() => setCurrentPage(page)} className={ page == currentPage ? `${styles.active}` : ''}>{page}</button>
                // ))
                createPagination().map((pageNum, index) => (
                    <button key={index} onClick={() => setCurrentPage(pageNum)} className={ pageNum == currentPage ? `${styles.active}` : ''}>{pageNum}</button>
                ))
            }
        </div>        
        <div className={`${styles.next} ${styles.row}`}>
            <Icons.FaChevronRight className={styles.icon} onClick={nextPageHandler} />
        </div>
    </div>
  )
}

export default Pagination
