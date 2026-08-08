import SupportConciergeCard from '../../../components/SupportConciergeCard/SupportConciergeCard';
import LifestyleVisualCard from '../../../components/LifestyleVisualCard/LifestyleVisualCard';
import { ordersLifestyleVisual } from '../../../services/ordersPageData';
import styles from './OrdersSidebar.module.css';

function OrdersSidebar() {
    return (
        <aside className={styles.sidebar}>
            <SupportConciergeCard />
            <LifestyleVisualCard {...ordersLifestyleVisual} />
        </aside>
    );
}

export default OrdersSidebar;