import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();

      if (data) {
        setErrors(data);
      }
    });
  };

  const DemoUser = () => {
    return dispatch(sessionActions.login({
      credential: 'Demo-lition',
      password: 'password'
    }))
    .then(closeModal)
  }

  console.log('here',errors)
  return (
    <div className='login-modal'>
      <h1>Log In</h1>
      <form  className='modal-form' onSubmit={handleSubmit}>
          <div className='login-error-container'>
            <span style={{color: '#ff0000'}}>{errors.message && `* The provided credentials were invalid *`}</span>
          </div>
          <span style={{marginTop: 10}}>Username or Email:</span> 

        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            style={{width: 300, marginTop: 10, marginBottom: 20}}
          />
        </label>

        <span>Password:</span>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{width: 300, marginTop: 10}}
          />
        </label>

        <div>
        <button className='submit-button' disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>
        </div>

        <button className='demo-user' onClick={DemoUser} style={{cursor: 'pointer'}}>Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;