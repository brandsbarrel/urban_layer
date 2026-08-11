import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TrackOrderHero from './sections/TrackOrderHero';
import TrackOrderSearchForm from './sections/TrackOrderSearchForm';
import TrackingResultSection from './sections/TrackingResultSection';
import AssistanceBanner from '../../components/AssistanceBanner/AssistanceBanner';
import WhileYouWaitSection from './sections/WhileYouWaitSection';
import { selectOrders } from '../../redux/slices/ordersSlice';
import { demoTrackingResult } from '../../services/trackOrderData';
import { buildTrackingFromOrder } from '../../utils/orderHelpers';
import styles from './TrackOrderPage.module.css';

function TrackOrderPage() {
    const [searchParams] = useSearchParams();
    const orders = useSelector(selectOrders);
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState(demoTrackingResult);
    const [hasSearched, setHasSearched] = useState(false);

    const lookupOrder = (rawId) => {
        const id = rawId.trim().toUpperCase().replace(/^#/, '');
        if (!id) return demoTrackingResult;
        if (id === demoTrackingResult.orderId) return demoTrackingResult;

        const matchedOrder = orders.find((o) => o.id.toUpperCase() === id);
        if (matchedOrder) return buildTrackingFromOrder(matchedOrder);

        return null;
    };

    useEffect(() => {
        const orderParam = searchParams.get('order');
        if (orderParam) {
            const found = lookupOrder(orderParam);
            setResult(found);
            setHasSearched(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (orderNumber) => {
        setIsSearching(true);
        setTimeout(() => {
            setResult(lookupOrder(orderNumber));
            setHasSearched(true);
            setIsSearching(false);
        }, 800);
    };

    return (
        <div className={styles.page}>
            <TrackOrderHero />
            <TrackOrderSearchForm
                initialOrderNumber={searchParams.get('order') || ''}
                onSearch={handleSearch}
                isSearching={isSearching}
            />
            <TrackingResultSection result={result} />
            <div className={styles.assistanceWrapper}>
                <AssistanceBanner />
            </div>
            {(!hasSearched || result) && <WhileYouWaitSection />}
        </div>
    );
}

export default TrackOrderPage;