import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './NavComponents/ProfileButton';
import './Navigation.css';
import homeLogo from '../../../../images/homeLogo.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);


  const toggleButton = () => {
    if(sessionUser === null) {
      return null
    } else {
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
      const component = <li> <NavLink className={checkUser} onClick={handleClick} to='/groups/new' > Start a new group </NavLink> </li>
      return component
    }
  }

  return (
    <ul className='navbar'>
      <li>
        <NavLink exact to="/">
            <img className='home-logo' src={homeLogo}/> 
        </NavLink>
      </li>
      <div className='nav-right'>
      <li className='start-group-button'>
        {toggleButton()}
      </li>
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
      </div>
    </ul>
  );
}

export default Navigation;