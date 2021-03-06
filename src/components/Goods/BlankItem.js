import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PlusIcon from '../icon/PlusIcon';
import styles from './BlankItem.module.scss';

const BlankItem = () => {
  const { category } = useParams();
  const history = useHistory();

  const handleClick = () => {
    history.push({
      pathname: '/editor',
      state: { category }
    });
  };

  return (  
    <article className={styles.item}>
      <div className={styles.imageWrap}>
        <div className={styles.image} onClick={() => handleClick()}>
          <PlusIcon size="32" />
        </div>
      </div>
    </article> 
  );
}
 
export default BlankItem;