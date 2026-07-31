import { MdBolt, MdStars, MdLocationOn, MdWorkspacePremium } from 'react-icons/md';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel';
import RegisterForm from './sections/RegisterForm';
import styles from './RegisterPage.module.css';

const BRAND_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB7qpowOwp7NBd7X2I0nUy_a-G6MtShGq6u9TvaihEgUEcxjafQ08bqOafou2J0EDoV6g8TIhX0c7GJHkRMDpLPAofIZGm1_ztyrMpU1EDqJgNG4O0w0Vpl9IjRUPAGT1EwGO37QKG6mDZlUT6-DXZ8ZV1puhQaC_u3Bp7T4UD0CubTZvUJFOwd4btEcpAQEJ1WWlWp5RTS8MkjPTMdPWF0YKOst1M1IgJ7gNI2e5Lw8IOon_L79vS-jfMriY-Mio-pEWlgkLiJiqA';

const REGISTER_FEATURES = [
  { icon: MdBolt, label: 'Faster Checkout' },
  { icon: MdStars, label: 'Exclusive Early Access' },
  { icon: MdLocationOn, label: 'Order Tracking' },
  { icon: MdWorkspacePremium, label: '5% Reward Points' },
];

function RegisterPage() {
  return (
    <>
      <AuthHeader variant="overlay" backLabel="Back to Store" backPath="/" brandText="URBAN LAYERS" />
      <main className={styles.page}>
        <AuthBrandPanel
          image={BRAND_IMAGE}
          imageAlt="Professional holding a luxury carbon-fiber phone case on a rooftop skyline"
          heading={
            <>
              Join the <br /> Urban Circle
            </>
          }
          features={REGISTER_FEATURES}
          featureVariant="title"
          footerText="© 2024 Urban Layers Co."
        />
        <section className={styles.formSection}>
          <div className={styles.formWrapper}>
            <RegisterForm />
          </div>
        </section>
      </main>
    </>
  );
}

export default RegisterPage;