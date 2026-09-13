import { MdStar, MdLocationOn, MdWorkspacePremium } from 'react-icons/md';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel';
import LoginForm from './sections/LoginForm';
import styles from './LoginPage.module.css';

const BRAND_IMAGE =
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=88';

const LOGIN_FEATURES = [
  { icon: MdStar, label: 'Exclusive Offers' },
  { icon: MdLocationOn, label: 'Order Tracking' },
  { icon: MdWorkspacePremium, label: 'Reward Points' },
];

function LoginPage() {
  return (
    <>
      <AuthHeader
        variant="overlay"
        brandText="URBAN LAYERS"
        showBack={false}
      />
      <main className={styles.page}>
        <AuthBrandPanel
          image={BRAND_IMAGE}
          imageAlt="Urban Layers premium phone case"
          heading={
            <>
              Luxury Meets <span className={styles.accent}>Protection</span>
            </>
          }
          subtitle="Elevate your digital essentials with armor that whispers elegance. Experience the fusion of urban durability and artisanal craftsmanship."
          features={LOGIN_FEATURES}
          featureVariant="label"
          mobileVisible
        />
        <section className={styles.formSection}>
          <LoginForm />
        </section>
      </main>
    </>
  );
}

export default LoginPage;
