import { MdVerifiedUser, MdLock, MdPrivacyTip, MdShoppingCart } from 'react-icons/md';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel';
import MinimalFooter from '../../components/MinimalFooter/MinimalFooter';
import ForgotPasswordForm from './sections/ForgotPasswordForm';
import styles from './ForgotPasswordPage.module.css';

const BRAND_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB-kfqGjn1LdrCs1XI9vu-5Y8LYdAVh969R9OVfG9wLMOR2Tp0AMlilNXjAwJwPCYgzzP8olejCu3DUdWSFRtmEnztmhw8jwODFG0fyQ6bkoY11TuKKBlQC9YQ1BcsP32c4McE0FKWspU66QpZ-uGAE8seJsK7ou-pjW9xLzntKk46nkPRMyFnI_OjPfzAriBWVkq1Z8d1DxoWO71EUQBd-DPPRwOrg6n0Zg3lqkzxI-UyUzvZNfMuCtbc4AyLQoSnkYnWyBLpCVmI';

const SECURITY_BADGES = [
    { icon: MdVerifiedUser, label: 'Secure Recovery' },
    { icon: MdLock, label: 'Encrypted Verification' },
    { icon: MdPrivacyTip, label: 'Privacy Protected' },
];

function ForgotPasswordPage() {
    return (
        <div className={styles.page}>
            <AuthHeader
                variant="solid"
                backLabel="Back to Cart"
                backIcon={MdShoppingCart}
                backPath="/cart"
                brandText="Urban Layers Co."
            />
            <main className={styles.main}>
                <AuthBrandPanel
                    image={BRAND_IMAGE}
                    imageAlt="Professional holding a titanium smartphone on a high-rise terrace at sunset"
                    heading="Forgot Your Password?"
                    subtitle="Recover your account securely and continue shopping in just a few simple steps."
                    badges={SECURITY_BADGES}
                    headingVariant="headline"
                    gradientVariant="top-bottom"
                    enableParallax={false}
                    heightOffset={72}
                    mobileVisible
                />
                <section className={styles.formSection}>
                    <ForgotPasswordForm />
                </section>
            </main>
            <MinimalFooter />
        </div>
    );
}

export default ForgotPasswordPage;