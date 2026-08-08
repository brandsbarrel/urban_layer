import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdVerified, MdReplay, MdDownload, MdChevronRight } from 'react-icons/md';
import MiniOrderTimeline from '../MiniOrderTimeline/MiniOrderTimeline';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatOrderDate } from '../../utils/orderHelpers';
import styles from './OrderListItemCard.module.css';

function OrderListItemCard({ order, variant }) {
    const dispatch = useDispatch();
    const primaryItem = order.items[0];

    const handleBuyAgain = () => {
        order.items.forEach((item) => {
            dispatch(addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }));
        });
    };

    const handleDownloadInvoice = () => {
        // Mock — real PDF invoice generation would connect here
        console.log(`Downloading invoice for order ${order.id}`);
    };

    if (variant === 'compact') {
        return (
            <div className={styles.compactCard}>
                <div className={styles.compactHeader}>
                    <div className={styles.headerGroup}>
                        <div>
                            <p className={styles.metaLabel}>Order ID</p>
                            <p className={styles.orderId}>#{order.id}</p>
                        </div>
                        <div>
                            <p className={styles.metaLabel}>Delivered On</p>
                            <p className={styles.metaValue}>{formatOrderDate(order.deliveredAt)}</p>
                        </div>
                    </div>
                    <span className={styles.deliveredBadgeMuted}>Delivered</span>
                </div>
                <div className={styles.compactBody}>
                    <div className={styles.imageWrapperCompact}>
                        <img src={primaryItem.image} alt={primaryItem.name} className={styles.image} />
                    </div>
                    <div className={styles.compactInfo}>
                        <h3 className={styles.itemTitle}>{primaryItem.name}</h3>
                        <p className={styles.itemMeta}>
                            Quantity: {primaryItem.quantity} • Total: ₹{order.totals.total.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <Link
                        to={`/account/orders/${order.id}`}
                        className={styles.chevronButton}
                        aria-label="View order details"
                    >
                        <MdChevronRight size={22} />
                    </Link>
                </div>
            </div>
        );
    }

    if (variant === 'delivered') {
        return (
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.headerGroup}>
                        <div>
                            <p className={styles.metaLabel}>Order ID</p>
                            <p className={styles.orderId}>#{order.id}</p>
                        </div>
                        <div>
                            <p className={styles.metaLabel}>Delivered On</p>
                            <p className={styles.metaValue}>{formatOrderDate(order.deliveredAt)}</p>
                        </div>
                    </div>
                    <span className={styles.deliveredBadge}>
                        <MdVerified size={14} />
                        Delivered
                    </span>
                </div>
                <div className={styles.body}>
                    <div className={styles.imageWrapper}>
                        <img src={primaryItem.image} alt={primaryItem.name} className={styles.image} />
                    </div>
                    <div className={styles.infoRow}>
                        <div>
                            <h3 className={styles.itemTitle}>{primaryItem.name}</h3>
                            <p className={styles.itemMeta}>
                                Quantity: {primaryItem.quantity} • Total: ₹
                                {order.totals.total.toLocaleString('en-IN')}
                            </p>
                            <div className={styles.actionLinks}>
                                <button type="button" onClick={handleBuyAgain} className={styles.buyAgainLink}>
                                    <MdReplay size={18} /> Buy Again
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownloadInvoice}
                                    className={styles.invoiceLink}
                                >
                                    <MdDownload size={18} /> Download Invoice
                                </button>
                            </div>
                        </div>
                        {order.items.length > 1 && (
                            <div className={styles.stackedThumbs}>
                                {order.items.slice(0, 2).map((item) => (
                                    <div key={item.id} className={styles.thumbAvatar}>
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                ))}
                                {order.items.length > 2 && (
                                    <div className={styles.thumbAvatarMore}>+{order.items.length - 2}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // variant === 'active'
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.headerGroup}>
                    <div>
                        <p className={styles.metaLabel}>Order ID</p>
                        <p className={styles.orderId}>#{order.id}</p>
                    </div>
                    <div>
                        <p className={styles.metaLabel}>Shipped Date</p>
                        <p className={styles.metaValue}>{formatOrderDate(order.shippedAt || order.placedAt)}</p>
                    </div>
                </div>
                <span className={styles.transitBadge}>
                    <span className={styles.pulseDot} />
                    In Transit
                </span>
            </div>
            <div className={styles.body}>
                <div className={styles.imageWrapper}>
                    <img src={primaryItem.image} alt={primaryItem.name} className={styles.image} />
                </div>
                <div className={styles.activeInfo}>
                    <h3 className={styles.itemTitle}>{primaryItem.name}</h3>
                    <p className={styles.itemMeta}>
                        Quantity: {primaryItem.quantity} • Total: ₹{order.totals.total.toLocaleString('en-IN')}
                    </p>
                    <MiniOrderTimeline status={order.status} />
                </div>
            </div>
            <div className={styles.footer}>
                <Link to="/track-order" className={styles.trackButton}>
                    Track Order
                </Link>
                <Link to={`/account/orders/${order.id}`} className={styles.detailsButton}>
                    Order Details
                </Link>
            </div>
        </div>
    );
}

export default OrderListItemCard;