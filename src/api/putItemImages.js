const url = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const putItem = async (id, subImages) => {
  const headers = new Headers();
  const token = localStorage.getItem('token')
  headers.append('x-auth-token', token);
  headers.append('Content-Type', 'application/json');

  try {
    const raw = JSON.stringify({ subImages });

    const res = await fetch(url + `/api/item/images/${id}`, {
      method: 'PUT',
      headers,
      body: raw,
      redirect: 'follow'
    });

    const result = await res.json();
    return result;
  } catch (error) {
    return { error };
  }
};

export default putItem;