import { Link } from 'react-router-dom';
import { MdLocalShipping, MdInventory2 } from 'react-icons/md';
import OrderTrackingSummaryCard from '../../../components/OrderTrackingSummaryCard/OrderTrackingSummaryCard';
import JourneyLogTimeline from '../../../components/JourneyLogTimeline/JourneyLogTimeline';
import LiveTrackingMap from '../../../components/LiveTrackingMap/LiveTrackingMap';
import InfoDetailCard from '../../../components/InfoDetailCard/InfoDetailCard';
import { mapImage } from '../../../services/trackOrderData';
import styles from './TrackingResultSection.module.css';

function TrackingResultSection({ result }) {
    if (!result) {
        return (
            <section className={styles.notFoundSection}>
                <div className={styles.notFoundCard}>
                    <h2 className={styles.notFoundHeading}>No Order Found</h2>
                    <p className={styles.notFoundText}>
                        We couldn't find an order matching that number. Please check and try again, or view
                        all your orders from your account.
                    </p>
                    <Link to="/account/orders" className={styles.notFoundLink}>
                        View My Orders
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.leftColumn}>
                <OrderTrackingSummaryCard
                    orderId={result.orderId}
                    status={result.status}
                    estimatedDelivery={result.estimatedDelivery}
                />
                <JourneyLogTimeline steps={result.steps} />
            </div>

            <div className={styles.rightColumn}>
                <LiveTrackingMap mapImage={mapImage} isLive={result.isLive} checkpoint={result.checkpoint} />

                <div className={styles.detailsGrid}>
                    <InfoDetailCard icon={MdLocalShipping} title="Shipping Details">
                        <div className={styles.detailRows}>
                            <div className={styles.detailRow}>
                                <span>Courier</span>
                                <span className={styles.detailValue}>{result.courier}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Service</span>
                                <span className={styles.detailValue}>{result.service}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Destination</span>
                                <span className={styles.detailValue}>{result.destination}</span>
                            </div>
                        </div>
                    </InfoDetailCard>

                    <InfoDetailCard icon={MdInventory2} title="Ordered Items">
                        <div className={styles.itemsList}>
                            {result.items.map((item) => (
                                <div key={item.id} className={styles.itemRow}>
                                    <div className={styles.itemImageWrapper}>
                                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                                    </div>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <span className={styles.itemQty}>x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </InfoDetailCard>
                </div>
            </div>
        </section>
    );
}

export default TrackingResultSection;