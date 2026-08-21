import { FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import SocialMediaCard from '../../../components/SocialMediaCard/SocialMediaCard';
import { socialLinks } from '../../../services/contactPageData';
import styles from './SocialMediaSection.module.css';

const ICON_MAP = {
    instagram: FaInstagram,
    facebook: FaFacebookF,
    twitter: FaXTwitter,
};

function SocialMediaSection() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Join Our Community</h2>
            <div className={styles.grid}>
                {socialLinks.map((social) => (
                    <SocialMediaCard
                        key={social.id}
                        icon={ICON_MAP[social.id]}
                        label={social.label}
                        handle={social.handle}
                        href={social.href}
                    />
                ))}
            </div>
        </section>
    );
}

export default SocialMediaSection;