import { Link } from 'react-router-dom';
import { MdSmartphone, MdPhoneAndroid, MdWatch, MdArrowForward } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import DeviceCategoryCard from '../../../components/DeviceCategoryCard/DeviceCategoryCard';
import { shopByDeviceCategories } from '../../../services/productsService';
import styles from './ShopByDeviceSection.module.css';

const ICON_MAP = {
    smartphone: MdSmartphone,
    phone_android: MdPhoneAndroid,
    google: FaGoogle,
    watch: MdWatch,
};

function ShopByDeviceSection() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.heading}>Shop By Device</h3>
                    <div className={styles.underline} />
                </div>
                <Link to="/compatibility" className={styles.viewAllLink}>
                    View Compatibility <MdArrowForward size={18} />
                </Link>
            </div>
            <div className={styles.grid}>
                {shopByDeviceCategories.map((device) => (
                    <DeviceCategoryCard
                        key={device.id}
                        icon={ICON_MAP[device.icon]}
                        label={device.label}
                        path={device.path}
                    />
                ))}
            </div>
        </section>
    );
}

export default ShopByDeviceSection;