import { MdShield, MdAnimation, MdArchitecture } from 'react-icons/md';
import IconFeatureCard from '../../../components/IconFeatureCard/IconFeatureCard';
import styles from './EngineeringFeaturesSection.module.css';

const ICON_MAP = {
    shield: MdShield,
    animation: MdAnimation,
    architecture: MdArchitecture,
};

function EngineeringFeaturesSection({ features }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.heading}>Engineering Luxury</h2>
                    <p className={styles.subtitle}>
                        Where artisanal craftsmanship meets high-performance protection. Designed to age with
                        character.
                    </p>
                </div>
                <div className={styles.grid}>
                    {features.map((feature) => (
                        <IconFeatureCard
                            key={feature.title}
                            icon={ICON_MAP[feature.icon]}
                            title={feature.title}
                            description={feature.description}
                            variant="bento"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default EngineeringFeaturesSection;