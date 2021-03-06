import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { disableBars } from '../../store/isBars';
import InstagramIcon from '../icon/InstagramIcon';
import KakaoIcon from '../icon/KakaoIcon';
import XIcon from '../icon/XIcon';
import styles from './BarsNav.module.scss';

const BarsNav = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.entities.user.id);

  const removeNav = () => {
    dispatch(disableBars());
  };

  return ( 
    <div className={styles.navWrap}>
      <div className={styles.nonNav} onClick={() => removeNav()}/>
      <nav className={styles.nav}>
        <button className={styles.xButton} onClick={() => removeNav()}>
          <XIcon size={16} />
        </button>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <Link to="/profile" onClick={() => removeNav()}>Profile</Link>
          </li>
          {!userId && <li className={styles.li}>
            <Link to="/signin" onClick={() => removeNav()}>Signin</Link>
          </li>}
          {userId && <li className={styles.li}>
            <Link to="/signout" onClick={() => removeNav()}>Signout</Link>
          </li>}
          <li className={styles.li} onClick={() => removeNav()}>
            <Link to="/item/statue">성상</Link>
          </li>
          <li className={styles.li} onClick={() => removeNav()}>
            <Link to="/item/cross">십자가</Link>
          </li>
          <li className={styles.li} onClick={() => removeNav()}>
            <Link to="/item/tools">기도소품</Link>
          </li>
          <li className={styles.li} onClick={() => removeNav()}>
          <a href="http://blog.naver.com/larahouse" target="_blank" rel="noreferrer">블로그</a>
          </li>
          <li className={styles.li} onClick={() => removeNav()}>
            <a href="https://www.instagram.com/lara_house" target="_blank" rel="noreferrer">
              <InstagramIcon size={14} />
            </a>
          </li>
          <li className={styles.li} onClick={() => removeNav()}>
            <a href="https://pf.kakao.com/_aCPLxl" target="_blank" rel="noreferrer">
              <KakaoIcon size={14} />
            </a>
          </li>
        </ul>
      </nav> 
    </div>
  );
}
 
export default BarsNav;