import { MdStar, MdLocationOn, MdWorkspacePremium } from 'react-icons/md';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel';
import LoginForm from './sections/LoginForm';
import styles from './LoginPage.module.css';

const BRAND_IMAGE =
  'https://lh3.googleusercontent.com/aida/AP1WRLt7thBJUn8X6xSBCAvjxy4IJvwBx0SM83TnjRqBHMRNdvP5jZZNsvX_g82m_ChXvNN_wo10myMuiOf52R5QqgKsOTI-v6KaWiwOkIt02zL31nAXUvBApi4WmleL4Ym-__KMzDEL0mPkSjCHOHT-5d4lWX_d7xd8Er_lKMBBBmrY1BhLG1DeK6HDJZ7zDaSJxEBSHcfXoe_JINtKBI05zLeemHVe9VjIFiDVDfHCGqiuidpWLBkQGqDe9zI';

const LOGIN_FEATURES = [
  { icon: MdStar, label: 'Exclusive Offers' },
  { icon: MdLocationOn, label: 'Order Tracking' },
  { icon: MdWorkspacePremium, label: 'Reward Points' },
];

function LoginPage() {
  return (
    <>
      <AuthHeader variant="overlay" backLabel="Back to Store" backPath="/" brandText="URBAN LAYERS" />
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
        />
        <section className={styles.formSection}>
          <LoginForm />
        </section>
      </main>
    </>
  );
}

export default LoginPage;