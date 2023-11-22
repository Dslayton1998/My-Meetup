import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './NavComponents/ProfileButton';
import './Navigation.css';
import homeLogo from '../../../../images/homeLogo.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const handleClick = (e) => {
    if(sessionUser === null) {
        e.preventDefault()
    }
  }

  const checkUser = () => {
    if(sessionUser === null) {
        return 'isDisabled'
    }
  }

  return (
    <ul className='navbar'>
      <li>
        <NavLink exact to="/">
            <img className='home-logo' src={homeLogo}/> 
        </NavLink>
      </li>
      <li>
        <NavLink className={checkUser} onClick={handleClick} to='/groups/new' >
          Start a new group
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