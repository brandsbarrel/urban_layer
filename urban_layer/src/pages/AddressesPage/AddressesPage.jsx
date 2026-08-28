import AddressManager from '../../components/AddressManager/AddressManager';
import styles from './AddressesPage.module.css';

function AddressesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Addresses</h1>
        <p className={styles.subtitle}>Manage your saved delivery addresses.</p>
      </header>

      <AddressManager title="Saved Addresses" />
    </div>
  );
}

export default AddressesPage;
