import React from "react";

import '../styles/Pagination.css';


export default function Pagination({ totalObjects, currentPage, onPageChange }) {
    let totalPages = totalObjects / 10;

    if (totalObjects <= 10) {
        totalPages = 1;
    }

    const pagesPerGroup = 10;
    const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
    const startPage = currentGroup * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );

    return (
        <div className="pagination">
            <button className="navigation" onClick={handlePrevious} disabled={currentPage === 1}>
                &lt;
            </button>
            {pages.map(page =>
                <button 
                    key = {page}
                    className = {currentPage === page ? 'current' : ''}
                    onClick = {() => onPageChange(page)}
                >
                    {page}
                </button>
            )}
            <button className="navigation" onClick={handleNext} disabled={currentPage === totalPages}>
                &gt;
            </button>
        </div>
    );
};