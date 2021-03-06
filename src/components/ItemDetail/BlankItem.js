import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { setItems } from '../../store/sacredThings';
import { putImageFile, listImageFiles } from '../../api/imageFile';
import putItemImages from '../../api/putItemImages';
import getSacredThings from '../../api/getSacredThings';
import ConfirmModal from '../common/ConfirmModal';
import Loading from '../common/Loading';
import PlusIcon from '../icon/PlusIcon';
import ImageIcon from '../icon/ImageIcon';
import UploadIcon from '../icon/UploadIcon';
import styles from './BlankItem.module.scss';
import { useDispatch } from 'react-redux';

const BlankItem = ({ subImages }) => {
  const { category, id } = useParams();
  const [isAddClick, setIsAddClick] = useState(false);
  const [modal, setModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageURI, setImageURI] = useState('');

  const inputFile = useRef(null);
  const dispatch = useDispatch();

  const handleAddButton = () => {
    if (!isAddClick) setIsAddClick(true);
  };

  const createModal = message => {
    setIsLoading(false);
    setModal({ message });
  };

  const showModal = () => (
    <ConfirmModal 
      text={modal.message}
      yes={() => setModal(null)} 
    />
  );

  const showLoading = () => (
    <Loading size="48" />
  );

  const previewImageFile = ({ target }) => {
    if (target.files && target.files[0]) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        setIsLoading(false);
        setImageURI(target.result);
      }
      reader.readAsDataURL(target.files[0]);
    }
  };

  const uploadImageFile = async () => {
    setIsLoading(true);

    const file = inputFile.current.files[0];
    if (!file) return createModal('이미지 파일을 선택해야 합니다.');

    // 같은 이름의 이미지 파일이 S3에 있는지 확인
    const s3Files = await listImageFiles(`/sacred-things/${category}`);
    if (s3Files.error) {
      return createModal('다음 에러가 발생했습니다.\\' + s3Files.error.message);
    }
    const [sameFile] = s3Files.filter(s3File => s3File.Key === `sacred-things/${category}/${file.name}`);
    if (sameFile) return createModal('같은 이름의 이미지 파일이 이미 존재합니다.\\파일 이름을 다른 이름으로 수정하거나\\다른 이미지 파일을 선택해 주세요.');

    // 문자 데이터 업로드
    let images;
    if (subImages) {
      images = subImages + ',' + file.name;
    } else {
      images = file.name;
    }
    const result = await putItemImages(id, images);
    if (result.error) {
      return createModal('다음 에러가 발생했습니다.\\' + result.error.message);
    }

    // S3에 이미지 파일 업로드
    const result3 = await putImageFile(file, category, file.name);
    if (result3.error) {
      return createModal('다음 에러가 발생했습니다.\\' + result3.error.message);
    }
    
    // sacredThings 업데이트
    const result2 = await getSacredThings();
    if (result2.error) {
      return createModal('다음 에러가 발생했습니다.\\' + result2.error.message);
    }
    dispatch(setItems(result2));

    setIsAddClick(false);
    setImageURI('');
    setIsLoading(false);
  };

  return (  
    <>
      <article className={styles.item}>
        <div className={styles.imageWrap}>
          <div 
            className={styles.image} 
            onClick={() => handleAddButton()}
            style={{ backgroundImage: `url('${imageURI}')` }}
          >
            {!isAddClick && <PlusIcon size="32" />}
            {isAddClick && <div className={styles.wrap}>
              <div className={styles.imageInputWrap}>
                <p className={styles.icon} onClick={() => inputFile.current.click()}>
                  <ImageIcon size={20} />
                </p>
                <input 
                  ref={inputFile} 
                  style={{ display: 'none' }}
                  className={styles.imageInput} 
                  type="file" 
                  accept="image/png, image/jpeg"
                  onChange={e => {
                    previewImageFile(e);
                  }}
                />
              </div>
              <p className={styles.icon} onClick={() => uploadImageFile()}>
                <UploadIcon size={20} />
              </p>
            </div>}
          </div>
        </div>
      </article> 
      {modal && showModal()}
      {isLoading && showLoading()}
    </>
  );
}
 
export default BlankItem;