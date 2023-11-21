import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../../LoginFormModal/LoginFormModal';
import SignupFormModal from '../../SignupFormModal/SignupFormModal';
import '../Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const viewGroups = (e) => {
    e.preventDefault();
    navigate('/groups')
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
// todo: add button to logged users option list "View groups"
  return (
    <>
      <button className='user-info-options' onClick={toggleMenu}>
        <i className="fas fa-user-circle" /> {user ? user.username : null}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            {/* View groups (here) */}
            <li>
              <button onClick={viewGroups}>View groups</button>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              style={{cursor: 'pointer'}}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              style={{cursor: 'pointer'}}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;