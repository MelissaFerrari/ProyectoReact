import { useEffect, useState } from 'react';
import api from './api/api';

function App() {
  const [communities, setCommunities] = useState<any[]>([]);

  useEffect(() => {
    api.get('/communities')
      .then(res => {
        setCommunities(res.data);
      })
      .catch(err => {
        console.error('Error al conectar con el backend', err);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Comunidades</h1>

      {communities.length === 0 && (
        <p>No hay comunidades</p>
      )}

      <ul>
        {communities.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

