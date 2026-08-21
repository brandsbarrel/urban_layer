import styles from './Pagination.module.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);

    return (
        <div className={styles.pagination}>
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={styles.pageButton}
            >
                Previous
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={page === currentPage ? `${styles.pageButton} ${styles.pageButtonActive}` : styles.pageButton}
                >
                    {page}
                </button>
            ))}
            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={styles.pageButton}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
