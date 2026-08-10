import { MdVerifiedUser, MdDiamond, MdWorkspacePremium } from 'react-icons/md';
import IconFeatureCard from '../../../components/IconFeatureCard/IconFeatureCard';
import { whyChooseFeatures } from '../../../services/productsService';
import styles from './WhyChooseSection.module.css';

const ICON_MAP = {
    verified_user: MdVerifiedUser,
    diamond: MdDiamond,
    workspace_premium: MdWorkspacePremium,
};

function WhyChooseSection() {
    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {whyChooseFeatures.map((feature) => (
                    <IconFeatureCard
                        key={feature.id}
                        icon={ICON_MAP[feature.icon]}
                        title={feature.title}
                        description={feature.description}
                        variant="dark"
                    />
                ))}
            </div>
        </section>
    );
}

export default WhyChooseSection;