const url = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const putItem = async (id, { title, description, price, storeLink }) => {
  const headers = new Headers();
  const token = localStorage.getItem('token')
  headers.append('x-auth-token', token);
  headers.append('Content-Type', 'application/json');

  try {
    const raw = JSON.stringify({ 
      title, 
      description, 
      price, 
      storeLink
    });

    const res = await fetch(url + `/api/item/${id}`, {
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