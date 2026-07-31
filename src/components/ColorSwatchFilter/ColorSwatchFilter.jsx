import styles from './ColorSwatchFilter.module.css';

function ColorSwatchFilter({
    title = 'Color Aesthetic',
    colors,
    selectedId,
    onSelect,
    size = 'md',
    mode = 'filter',
    showSelectedLabel = false,
}) {
    const selectedColor = colors.find((c) => c.id === selectedId);
    const displayTitle =
        showSelectedLabel && selectedColor ? `${title}: ${selectedColor.label}` : title;

    const handleClick = (colorId) => {
        if (mode === 'select') {
            onSelect(colorId);
        } else {
            onSelect(colorId === selectedId ? null : colorId);
        }
    };

    const sizeClass = size === 'lg' ? styles.swatchLg : size === 'sm' ? styles.swatchSm : '';

    return (
        <div className={styles.group}>
            <h3 className={styles.title}>{displayTitle}</h3>
            <div className={styles.swatches}>
                {colors.map((color) => (
                    <button
                        key={color.id}
                        type="button"
                        onClick={() => handleClick(color.id)}
                        className={`${styles.swatch} ${sizeClass} ${color.id === selectedId ? styles.swatchActive : ''
                            }`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={color.label}
                        title={color.label}
                    />
                ))}
            </div>
        </div>
    );
}

export default ColorSwatchFilter;