import { MdBolt, MdStars, MdLocationOn, MdWorkspacePremium } from 'react-icons/md';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel';
import RegisterForm from './sections/RegisterForm';
import styles from './RegisterPage.module.css';

const BRAND_IMAGE =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=88';

const REGISTER_FEATURES = [
  { icon: MdBolt, label: 'Faster Checkout' },
  { icon: MdStars, label: 'Exclusive Early Access' },
  { icon: MdLocationOn, label: 'Order Tracking' },
  { icon: MdWorkspacePremium, label: '5% Reward Points' },
];

function RegisterPage() {
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
          imageAlt="Professional holding a luxury carbon-fiber phone case on a rooftop skyline"
          heading={
            <>
              Join the <br /> Urban Circle
            </>
          }
          features={REGISTER_FEATURES}
          featureVariant="title"
          mobileVisible
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
