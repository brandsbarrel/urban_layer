import styles from './QuickContactCard.module.css';

function QuickContactCard({ icon: Icon, title, subtitle, actionLabel, href, onClick }) {
    return (
        <div className={styles.card}>
            <div className={styles.iconCircle}>
                <Icon size={24} />
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.subtitle}>{subtitle}</p>
            {href ? (
                <a
                    href={href}
                    className={styles.action}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                    {actionLabel}
                </a>
            ) : (
                <button type="button" onClick={onClick} className={styles.action}>
                    {actionLabel}
                </button>
            )
            }
        </div >
    );
}

export default QuickContactCard;