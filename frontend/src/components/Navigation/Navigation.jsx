import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navbar'>
      <li>
        <NavLink exact to="/">
            <img className='home-logo'/> {/* needs a logo img */}
        </NavLink>
      </li>
      {isLoaded && (
        <li className='user-info-options'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;