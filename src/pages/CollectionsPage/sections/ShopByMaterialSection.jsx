import { MdTexture, MdWaves, MdGridOn, MdEco } from 'react-icons/md';
import IconCircleCard from '../../../components/IconCircleCard/IconCircleCard';
import { materialCategories } from '../../../services/collectionsPageData';
import styles from './ShopByMaterialSection.module.css';

const ICON_MAP = {
    texture: MdTexture,
    waves: MdWaves,
    grid_on: MdGridOn,
    eco: MdEco,
};

function ShopByMaterialSection() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Shop by Material</h2>
                <p className={styles.subtitle}>The finest textures for the modern nomad.</p>
            </div>
            <div className={styles.grid}>
                {materialCategories.map((material) => (
                    <IconCircleCard
                        key={material.id}
                        icon={ICON_MAP[material.icon]}
                        label={material.label}
                        path={`/shop?material=${material.id}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default ShopByMaterialSection;