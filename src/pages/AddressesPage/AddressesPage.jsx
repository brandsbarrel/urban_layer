import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import AddressFormModal from '../../components/AddressFormModal/AddressFormModal';
import AddressesHeaderSection from './sections/AddressesHeaderSection';
import AddressStatsSection from './sections/AddressStatsSection';
import AddressGridSection from './sections/AddressGridSection';
import QuickCheckoutBanner from '../../components/QuickCheckoutBanner/QuickCheckoutBanner';
import AddressTipsSection from './sections/AddressTipsSection';
import {
    selectAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setSelectedForCheckout,
} from '../../redux/slices/addressesSlice';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectOrdersCount } from '../../redux/slices/ordersSlice';
import styles from './AddressesPage.module.css';

function AddressesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const addresses = useSelector(selectAddresses);
    const { user } = useSelector(selectAuth);
    const ordersCount = useSelector(selectOrdersCount);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingAddress, setEditingAddress] = useState(null);

    const defaultAddress = addresses.find((a) => a.isDefault);

    const handleAddClick = () => {
        setModalMode('add');
        setEditingAddress(null);
        setModalOpen(true);
    };

    const handleEditClick = (address) => {
        setModalMode('edit');
        setEditingAddress(address);
        setModalOpen(true);
    };

    const handleFormSubmit = (formData) => {
        if (modalMode === 'edit' && editingAddress) {
            dispatch(updateAddress({ id: editingAddress.id, ...formData }));
        } else {
            dispatch(addAddress(formData));
        }
        setModalOpen(false);
    };

    const handleUseForCheckout = (id) => {
        dispatch(setSelectedForCheckout(id));
        navigate('/checkout');
    };

    return (
        <div className={styles.content}>
            <Breadcrumb
                items={[
                    { label: 'Home', path: '/' },
                    { label: 'My Account', path: '/account' },
                    { label: 'Saved Addresses' },
                ]}
            />

            <AddressesHeaderSection name={user?.name} count={addresses.length} />

            <AddressStatsSection
                savedCount={addresses.length}
                defaultLabel={defaultAddress ? `${defaultAddress.label} (Primary)` : 'None set'}
                ordersCount={ordersCount}
            />

            <AddressGridSection
                addresses={addresses}
                onEdit={handleEditClick}
                onDelete={(id) => dispatch(deleteAddress(id))}
                onSetDefault={(id) => dispatch(setDefaultAddress(id))}
                onUseForCheckout={handleUseForCheckout}
                onAddNew={handleAddClick}
            />

            <QuickCheckoutBanner
                heading="Ready to elevate your collection?"
                subtitle="Enjoy seamless checkout with your saved preferences."
                ctaLabel="Continue Shopping"
                ctaPath="/shop"
            />

            <AddressTipsSection />

            <AddressFormModal
                isOpen={modalOpen}
                mode={modalMode}
                initialData={editingAddress}
                onClose={() => setModalOpen(false)}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
}

export default AddressesPage;