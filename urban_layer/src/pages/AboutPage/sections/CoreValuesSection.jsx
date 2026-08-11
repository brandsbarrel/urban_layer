import { MdVerified, MdLightbulb, MdEco } from 'react-icons/md';
import SectionHeading from '../../../components/SectionHeading/SectionHeading';
import IconFeatureCard from '../../../components/IconFeatureCard/IconFeatureCard';
import { coreValues } from '../../../services/aboutPageData';
import styles from './CoreValuesSection.module.css';

const ICON_MAP = {
    verified: MdVerified,
    lightbulb: MdLightbulb,
    eco: MdEco,
};

function CoreValuesSection() {
    return (
        <section className={styles.section}>
            <SectionHeading title="Our Core Principles" underline />
            <div className={styles.grid}>
                {coreValues.map((value) => (
                    <IconFeatureCard
                        key={value.id}
                        icon={ICON_MAP[value.icon]}
                        title={value.title}
                        description={value.description}
                    />
                ))}
            </div>
        </section>
    );
}

export default CoreValuesSection;