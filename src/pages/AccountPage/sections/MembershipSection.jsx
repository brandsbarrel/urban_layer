import { MdLocalShipping, MdSupportAgent } from 'react-icons/md';
import MembershipProgressCard from '../../../components/MembershipProgressCard/MembershipProgressCard';

const PERKS = [
    { icon: MdLocalShipping, label: 'Priority Shipping' },
    { icon: MdSupportAgent, label: 'VIP Concierge' },
];

function MembershipSection({ user }) {
    return (
        <MembershipProgressCard
            badgeLabel={`${user.nextTier} Level Path`}
            heading="Elevate Your Presence"
            description={`You are ${user.pointsToNextTier} points away from unlocking ${user.nextTier} Tier and early access to our Bespoke Heritage collection.`}
            progress={user.tierProgress}
            currentLabel={`${user.tier} (Current)`}
            goalLabel={`${user.nextTier} Goal`}
            perks={PERKS}
        />
    );
}

export default MembershipSection;