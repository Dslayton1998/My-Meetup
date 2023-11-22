import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validate, setValidations] = useState({}); //!
  const [login, setLogin] = useState(false)
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      // console.log(data)
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
  };


  useEffect(() => {
    const err = {};
    const login = {};
    let noSubmit = {};

    if(credential.length < 4) {
      err.credential = "Username or email, must be longer than 4 character."
    }
  
    if(password.length < 6) {
      err.password = 'Password is required, must be at least 6 characters.'
    }

    if(err.credential || err.password) {
      login.access = false
    } else {
      login.access = true
    }

    if(errors.message) {
      // console.log(errors, 'here')
      noSubmit = errors.message
      setErrors(noSubmit)
    }
      setValidations(err);
      setLogin(login)
  
    }, [credential, password, errors])
    // console.log(errors)
  
  const checkLoginButton = ( ) => {
    if(login.access === false) {
      return 'isDisabled'
    } else {
      return 'submit-button'
    }
  }

  return (
    <div className='login-modal'>
      <h1>Log In</h1>
        {errors.message ? <div>{errors.message}</div> : null}
      <form  className='modal-form' onSubmit={handleSubmit}>
        <label>
          Username or Email: 
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          {validate.credential && `* ${validate.credential}`}
        </label>
        <label>
          Password: 
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {validate.password && `* ${validate.password}`}
        </label>
        {errors.message && ` *${errors.message}` }

        <button className={checkLoginButton()} type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;