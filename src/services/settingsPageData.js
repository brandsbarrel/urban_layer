import { MdPerson, MdLock, MdNotifications } from 'react-icons/md';

export const settingsNavItems = [
    { id: 'personal-info', label: 'Personal Info', icon: MdPerson },
    { id: 'security', label: 'Security', icon: MdLock },
    { id: 'communications', label: 'Communications', icon: MdNotifications },
];

export const currencyOptions = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
];

export const languageOptions = [
    { value: 'EN', label: 'English' },
    { value: 'FR', label: 'French' },
    { value: 'DE', label: 'German' },
];

export const initialActiveDevices = [
    {
        id: 'device-laptop',
        icon: 'laptop',
        name: 'MacBook Pro 16"',
        meta: 'Gurugram, India • Current Session',
        isCurrent: true,
    },
    {
        id: 'device-phone',
        icon: 'phone',
        name: 'iPhone 15 Pro',
        meta: 'Gurugram, India • 2 hours ago',
        isCurrent: false,
    },
];

export const profileHeroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDHoL9WXBJv8XJeZp5rMXdZECZq5-qsRu3j8h6scAcx3G_Qp64s0oGSwjNF3op9s6vZ1_HKWqikgBjPBPSo8X8X3TXClOZsmpULHaQIygv5OVK5ZwzLvtZksEXkAWnYl87SQVtYaGwcWKxMZBdAuhSAUTdQcqHOh4Eubej3dVPgmR3715hUeSjyT4DEIg4Ail9UZ0USf8VzCThgwjlTao0zU3ZYMSMZ5u6zgmr5sB77gxBEmxTFh78MUom2W56S9hHvfmcNOqYbxyU';

export const profileAvatarImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB8sA1hvvP9G7uHOGYn8QGZ8GzwZllzPbF1Kkn-adEHdDC31jXG0fjbVTZmj9q6VJX6KSO8iUpsrkK3IIefCNRjKGjuhSrMiA2r8hx6e5iKF-yjPb8EkioIJnz68QpSA_ECkFWn2rL9G8CNeV8xJqCB5ZFdeVfdPtOVX8yq1t4O-2PfEtQKtMKrnMIduO7ITGP0cipt9dvhoIIiGARbxPfk0a3vYtuNhYoDoI_cD6tHYEYRPyg2y1p7eyZ7vYGMqu7E1C8jMC1-UEc';