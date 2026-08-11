import { useState } from 'react';
import { MdDelete, MdShare } from 'react-icons/md';
import styles from './BulkActionsBar.module.css';

function BulkActionsBar({ allSelected, onToggleSelectAll, onRemoveSelected, onMoveAllToCart }) {
    const [shareStatus, setShareStatus] = useState('idle');

    const handleShare = async () => {
        const shareData = { title: 'My Urban Layers Wishlist', url: window.location.href };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2000);
            }
        } catch {
            // User cancelled share — no action needed
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.left}>
                <label className={styles.selectAllLabel}>
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={onToggleSelectAll}
                        className={styles.checkbox}
                    />
                    <span>Select All Items</span>
                </label>
                <span className={styles.divider}>|</span>
                <button type="button" onClick={onRemoveSelected} className={styles.textButton}>
                    <MdDelete size={18} />
                    Remove Selected
                </button>
            </div>

            <div className={styles.right}>
                <button type="button" onClick={handleShare} className={styles.textButton}>
                    <MdShare size={18} />
                    {shareStatus === 'copied' ? 'Link Copied!' : 'Share Wishlist'}
                </button>
                <button type="button" onClick={onMoveAllToCart} className={styles.primaryButton}>
                    Move All to Cart
                </button>
            </div>
        </section>
    );
}

export default BulkActionsBar;