import styles from './SocialLoginButtons.module.css';

function SocialLoginButtons({ providers, showLabels = false }) {
    const handleClick = (provider) => {
        // Mock — real OAuth integration baad mein yahan aayega
        console.log(`${provider} login clicked`);
    };

    return (
        <div className={styles.grid}>
            {providers.map((provider) => (
                <button
                    key={provider.id}
                    type="button"
                    className={styles.button}
                    onClick={() => handleClick(provider.id)}
                    aria-label={`Login with ${provider.label}`}
                >
                    <provider.icon size={showLabels ? 18 : 22} />
                    {showLabels && <span className={styles.label}>{provider.label}</span>}
                </button>
            ))}
        </div>
    );
}

export default SocialLoginButtons;