import EditorPickItem from '../../../components/EditorPickItem/EditorPickItem';
import { editorPicks } from '../../../services/journalPageData';
import styles from './EditorsSelectionSection.module.css';

function EditorsSelectionSection() {
    const scrollToGrid = () => {
        document.getElementById('articles-grid')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>Curated Focus</span>
                        <h2 className={styles.heading}>Editor's Selection</h2>
                    </div>
                    <button type="button" onClick={scrollToGrid} className={styles.viewAllButton}>
                        View All Picks
                    </button>
                </div>
                <div className={styles.grid}>
                    {editorPicks.map((pick) => (
                        <EditorPickItem key={pick.slug} {...pick} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default EditorsSelectionSection;