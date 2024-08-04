import { useState } from 'react';

const LoginForm = ({ handleCancel, userLogin }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    userLogin({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
           username
          <input
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
           password
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button type="submit">login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;