import { MdEdit } from 'react-icons/md';
import RewardProgressCard from '../../../components/RewardProgressCard/RewardProgressCard';
import { profileHeroImage, profileAvatarImage } from '../../../services/settingsPageData';
import styles from './ProfileHeroBanner.module.css';

function ProfileHeroBanner({ user }) {
    return (
        <section className={styles.section}>
            <div className={styles.bgWrapper}>
                <img src={profileHeroImage} alt="" className={styles.bgImage} />
                <div className={styles.gradient} />
            </div>
            <div className={styles.content}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatarCircle}>
                        <img src={profileAvatarImage} alt={user.fullName} className={styles.avatarImage} />
                    </div>
                    <button type="button" className={styles.editButton} aria-label="Edit photo">
                        <MdEdit size={18} />
                    </button>
                </div>

                <div className={styles.info}>
                    <div className={styles.nameRow}>
                        <h1 className={styles.name}>{user.fullName}</h1>
                        <span className={styles.tierBadge}>{user.tier} Status</span>
                    </div>
                    <p className={styles.meta}>
                        Member Since {user.memberSince} • {user.location}
                    </p>
                </div>

                <RewardProgressCard points={user.rewardPoints} completion={user.profileCompletion} />
            </div>
        </section>
    );
}

export default ProfileHeroBanner;