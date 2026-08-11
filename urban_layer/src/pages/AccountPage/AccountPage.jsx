import { useSelector } from 'react-redux';
import WelcomeHeader from './sections/WelcomeHeader';
import StatsGridSection from './sections/StatsGridSection';
import MembershipSection from './sections/MembershipSection';
import RecentOrderSection from './sections/RecentOrderSection';
import RecommendedSection from './sections/RecommendedSection';
import WishlistHighlightsSection from './sections/WishlistHighlightsSection';
import { selectAuth } from '../../redux/slices/authSlice';
import styles from './AccountPage.module.css';

function AccountPage() {
    const { user } = useSelector(selectAuth);

    return (
        <div className={styles.content}>
            <WelcomeHeader name={user.name} />
            <StatsGridSection user={user} />
            <MembershipSection user={user} />
            <RecentOrderSection />
            <RecommendedSection />
            <WishlistHighlightsSection />
        </div>
    );
}

export default AccountPage;