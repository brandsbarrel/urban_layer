import styles from './WelcomeHeader.module.css';

function WelcomeHeader({ name }) {
    return (
        <header className={styles.header}>
            <h1 className={styles.heading}>Welcome Back, {name}!</h1>
            <p className={styles.subtitle}>
                Your exclusive Urban Layers portal is ready. Here's your latest overview.
            </p>
        </header>
    );
}

export default WelcomeHeader;