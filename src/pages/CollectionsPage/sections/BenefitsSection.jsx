import { MdShield, MdBolt, MdHandshake } from 'react-icons/md';
import IconFeatureCard from '../../../components/IconFeatureCard/IconFeatureCard';
import { benefitsData } from '../../../services/collectionsPageData';
import styles from './BenefitsSection.module.css';

const ICON_MAP = {
    shield: MdShield,
    bolt: MdBolt,
    handshake: MdHandshake,
};

function BenefitsSection() {
    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {benefitsData.map((benefit) => (
                    <IconFeatureCard
                        key={benefit.id}
                        icon={ICON_MAP[benefit.icon]}
                        title={benefit.title}
                        description={benefit.description}
                        variant="plain"
                    />
                ))}
            </div>
        </section>
    );
}

export default BenefitsSection;