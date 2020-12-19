import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { removeItem } from '../../store/sacredThings';
import deleteItem from '../../api/deleteItem';
import { deleteImageFile } from '../../api/imageFile';
import YesNoModal from '../common/YesNoModal';
import styles from './EditMenu.module.scss';

const EditMenu = ({ category, id }) => {
  const dispatch = useDispatch();
  const sacredThings = useSelector(state => state.entities.sacredThings);
  const [modal, setModal] = useState('');
  const history = useHistory();

  const handleEditButtonClick = () => {
    history.push({
      pathname: '/editor',
      state: { category, id }
    });
  };

  const handleTrashButtonClick = () => {
    setModal('remove');
  };

  const requestRemoveItem = async () => {
    const result = await deleteItem(id);
    if (result.error) return alert(result.error.message);
    const [item] = sacredThings[category].items.filter(item => item.id === id);
    const result2 = await deleteImageFile(`sacred-things/${category}/${item.mainImage}`);
    if (result2.error) return alert(result2.error.message);
    dispatch(removeItem({ category, id }));
  };

  const showRemoveModal = () => (
    <YesNoModal 
      text="정말로 삭제하시겠습니까?"
      yes={() => requestRemoveItem()} 
      no={() => setModal('')} 
    />
  );

  // if (account === 'admin') {
    return ( 
      <>
        <div className={styles.wrap}>
          <p className={styles.icon} onClick={() => handleEditButtonClick()}>
            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
          </p>
          <p className={styles.icon} onClick={() => handleTrashButtonClick()}>
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </p>
        </div> 

        {modal === 'remove' && showRemoveModal()}
      </>
    );
  // }

  return null;
}
 
export default EditMenu;