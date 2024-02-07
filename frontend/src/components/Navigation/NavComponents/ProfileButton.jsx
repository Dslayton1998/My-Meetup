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
    navigate('/')
  };

  const viewGroups = (e) => {
    e.preventDefault();
    navigate('/groups')
  }

  const viewEvents = (e) => {
    e.preventDefault();
    navigate('/events')
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='user-info-options' onClick={toggleMenu}>
        <i className="fas fa-user-circle" /> 
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
        {user ? (
          <>
            <div>Hello {user.firstName}</div>
            <div>{user.username}</div>
            <div>{user.firstName} {user.lastName}</div>
            <div>{user.email}</div>
            {/* View groups (here) */}
            <div>
              <button onClick={viewGroups}>View groups</button>
            </div>
            <div>
              <button onClick={viewEvents}>View Events</button>
            </div>
            <div>
              <button onClick={logout}>Log Out</button>
            </div>
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
      )}
    </>
  );
}

export default ProfileButton;