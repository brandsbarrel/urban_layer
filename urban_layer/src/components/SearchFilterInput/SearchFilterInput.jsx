import { MdMic } from 'react-icons/md';
import styles from './SearchFilterInput.module.css';

function SearchFilterInput({
  value,
  onChange,
  placeholder = 'Search collections...',
  icon: Icon = MdMic,
  iconPosition = 'right',
}) {
  return (
    <div className={styles.wrapper}>
      {iconPosition === 'left' && <Icon size={20} className={styles.iconLeft} />}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={iconPosition === 'left' ? styles.inputWithLeftIcon : styles.input}
      />
      {iconPosition === 'right' && <Icon size={20} className={styles.icon} />}
    </div>
  );
}

export default SearchFilterInput;