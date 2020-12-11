import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activateAdmin, disableAdmin } from '../../store/isAdmin';
import Button from '../common/Button';
import TextInput from '../common/TextInput';
import postSignin from '../../api/postSignin';
import getUser from '../../helper/getUser';
import styles from './Signin.module.scss';

const Signin = () => {
  const [info, setInfo] = useState('페이지를 수정하려면 로그인 해주세요.');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const isAdmin = useSelector(state => state.entities.isAdmin);

  const isValidInput = (email, password) => {
    if (email.length < 1) {
      setInfo('아이디를 입력해주세요.');
      return false;
    } else if (password.length < 1) {
      setInfo('비밀번호를 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if(!isValidInput(email, password)) return;
    const { status, ok, message } = await postSignin(email, password);
    const user = getUser();
    if (ok && user.account === 'admin') dispatch(activateAdmin());
    setInfo(message);
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    setInfo('Admin 계정으로 로그인해주세요.');
    localStorage.setItem('token', '');
    dispatch(disableAdmin());
  };
  
  if (isAdmin) {
    return (
      <ul className={styles.wrap}>
        <li>
          <p className={styles.text}>Admin 계정으로 로그인됐습니다.</p>
        </li>
        <li>
          <Button width="100px" onClick={() => handleLogout()}>로그아웃</Button>
        </li>
      </ul>
    );
  }
  
  return ( 
    <ul className={styles.wrap}>
      <li>
        <p className={styles.text}>{info}</p>
      </li>
      <li>
        <TextInput 
          width="200px" 
          type="text" 
          placeholder="email"
          value={email} 
          onChange={({ target }) => setEmail(target.value)} 
        />
      </li>
      <li>
        <TextInput 
          width="200px" 
          type="password" 
          placeholder="password"
          value={password} 
          onChange={({ target }) => setPassword(target.value)} 
        />
      </li>
      <li>
        <Button width="100px" onClick={() => handleLogin()}>로그인</Button>
      </li>
    </ul> 
  );
}
 
export default Signin;