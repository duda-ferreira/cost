import loading from '../../img/loading.svg';
import styles from './Carregando.module.css';

function Loading() {
    return(
        <div className={styles.loader_container}>
            <img src={loading} alt='Loading' />
        </div>
    )
}

export default Loading;