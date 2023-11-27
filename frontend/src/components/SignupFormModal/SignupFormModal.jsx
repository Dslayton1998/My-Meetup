import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log('data:',data)
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1 className='sign-up-heading'>Sign Up</h1>
      <span className='error-messages'>{errors.confirmPassword && (<p>{errors.confirmPassword}</p>)}</span>
      <span className='error-messages'>{errors.email && <p>{errors.email}</p>}</span>
      <span className='error-messages'>{errors.username && <p>{errors.username}</p>}</span>
      <span className='error-messages'>{errors.firstName && <p>{errors.firstName}</p>}</span>
      <span className='error-messages'>{errors.lastName && <p>{errors.lastName}</p>}</span>
      <span className='error-messages'>{errors.password && <p>{errors.password}</p>}</span>
      <form className='sign-up-modal' onSubmit={handleSubmit}>
        <span>Email</span>
        <label>
          <input
            className='sign-up-inputs'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <span>Username</span>
        <label>
          <input
            className='sign-up-inputs'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{marginBottom: 35}}
          />
        </label>
        <span>First Name</span>
        <label>
          <input
            className='sign-up-inputs'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <span>Last Name</span>
        <label>
          <input
            className='sign-up-inputs'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{marginBottom: 35}}
          />
        </label>
        <span>Password</span>
        <label>
          <input
            className='sign-up-inputs'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <span>Confirm Password</span>
        <label>
          <input
            className='sign-up-inputs'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{marginBottom: 35}}
          />
        </label>
        <button className='sign-up-button' type="submit" disabled={!confirmPassword || !password || !lastName || !firstName || !email || username.length < 4 || password.length < 6 } style={{cursor: 'pointer'}}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;