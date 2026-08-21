import LocationMapCard from '../../../components/LocationMapCard/LocationMapCard';
import BusinessHoursCard from '../../../components/BusinessHoursCard/BusinessHoursCard';
import EmergencyContactCard from '../../../components/EmergencyContactCard/EmergencyContactCard';
import { contactLocationMapImage, businessHours, flagshipStoreAddress } from '../../../services/contactPageData';
import styles from './LocationInfoSection.module.css';

function LocationInfoSection() {
    return (
        <div id="location-info" className={styles.wrapper}>
            <LocationMapCard
                image={contactLocationMapImage}
                storeName={flagshipStoreAddress.name}
                addressLine={flagshipStoreAddress.line}
            />
            <div className={styles.grid}>
                <BusinessHoursCard hours={businessHours} />
                <EmergencyContactCard />
            </div>
        </div>
    );
}

export default LocationInfoSection;