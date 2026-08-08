import { MdShield, MdAccountBalanceWallet } from 'react-icons/md';
import ReferralCard from '../../../components/ReferralCard/ReferralCard';
import AccessoryHighlightItem from '../../../components/AccessoryHighlightItem/AccessoryHighlightItem';
import styles from './PostPurchaseSection.module.css';

const REFERRAL_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBCx3ZItq8eW_g0y5UJqE5y1JF2gEmr6CVGWAlkN5VcKiq_oxOFPMt-_ysjeLWg0OFiSCsTjxeBxuFF-iKkXGCSgzUbR-wfmBEXWM66J6c3l4HUE-2UpsbptSWWk_dvytVSL54pEER1ko2GmGnPIV31BOeWap7ICu5cCK2ktcZsmeRQolcXiDzFbef3lEU_3SW9KVvOnP6Sa4tyJuLzIYz953n0gAazY-ZPXP_LiFwKj52oBsN8G3DbIL3dbdHY-WcyUbiaTWNDoyE';

const ACCESSORY_HIGHLIGHTS = [
    {
        id: '9h-screen-guard',
        icon: MdShield,
        name: '9H Screen Guard',
        subtitle: 'Diamond Grade Protection',
        price: 35,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ZuOKYrOYFBBIlrQNjpctYyz_wKKeyghCOHXLwz8JS_i_2FwNlvoWnWs6f_wfJX8lYD6ALQxbX8hzuGKSNXi_JzDwvf1QUTO5IZf_xUsI8KPWn85En29M9T9235QAUzhEUjSzEnTUkpeptUkkC7rCe3QbK-u3S15zRF4gRF9MVH-3mS5kpRGUmrDZpTpwEGOKZqRjyyQN12Ytw3mm60ulKvNMLMT9rlG1hP4H4Z22Q3LmKqwNlL-Dm12W3zk-7XWq2jU6N8iUX9Q',
    },
    {
        id: 'magsafe-slim-wallet',
        icon: MdAccountBalanceWallet,
        name: 'MagSafe Slim Wallet',
        subtitle: 'Nappa Leather / Midnight',
        price: 59,
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDq6OY1A2o7Lqw75c2YqvzrxxqwAw6_Bm10Ai0jpMkQ3jlNiVt17q7DLk9duhqd8AQv8WEV3tUe7wOnztHRI1jONxDjjgDuIJYsOQipprx2GFJfi7oP_NJFIxjCO4j1ZJmd1b6MJ4le54KcdsM3GmYJQlCAo-mImZkbiOdvNYnOpDtJr-JShOVEiweIm41sYVc0YxoxnlWb-zDNhoY1XmrBjWjewPmVsDw_F7NRkFpyN87huIM2nkHk5Dejhkq1n9Obriooipb7dMA',
    },
];

function PostPurchaseSection() {
    const handleInvite = () => {
        // Mock — real referral flow will connect here later
        console.log('Invite friends clicked');
    };

    return (
        <section className={styles.section}>
            <ReferralCard
                image={REFERRAL_IMAGE}
                imageAlt="Person holding a phone on a rooftop terrace at dusk"
                badge="Exclusive Reward"
                heading="Invite Friends, Earn Credits"
                description="Give your friends 20% off their first order and earn ₹25 for every successful referral."
                ctaLabel="Invite Now"
                onInvite={handleInvite}
            />

            <div className={styles.accessoryCard}>
                <h3 className={styles.accessoryHeading}>Complete Your Collection</h3>
                <div className={styles.accessoryList}>
                    {ACCESSORY_HIGHLIGHTS.map((item) => (
                        <AccessoryHighlightItem key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PostPurchaseSection;