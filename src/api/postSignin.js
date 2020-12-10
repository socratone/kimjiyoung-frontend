import { url } from '../config/env';

const headers = new Headers();
headers.append("Content-Type", "application/json");

const postSignin = async (email, password) => {
  try {
    const raw = JSON.stringify({ email, password });
    const res = await fetch(url + '/api/signin', {
      method: 'POST',
      headers,
      body: raw,
      redirect: 'follow'
    });

    const { status, ok } = res;
    const { message, token } = await res.json();
    if (token) localStorage.setItem('token', token);
    return { status, ok, message };
  } catch (error) {
    return { status: null, ok: false, message: error };
  }
};

export default postSignin;