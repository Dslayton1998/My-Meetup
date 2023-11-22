import { NavLink } from 'react-router-dom'
// import seeGroups from '../../../../../images/LP-see-groups.jpg'
import { useSelector } from 'react-redux';
import '../LandingPage.css'

export default function LandingLinks() {
    // todo: give functionality to start-groups/find-events Navlink's
    // todo: Figure out how to gray-out Start-groups if user is not logged in. (see ProfileButton)
    const sessionUser = useSelector(state => state.session.user);
    const checkUser = () => {
        if(sessionUser === null) {
            return 'isDisabled'
        }
    }

    const handleClick = (e) => {
        if(sessionUser === null) {
            e.preventDefault()
        }
    }
    return (
        <div className='nav-container'>

            <div className='see-groups'>
                <img className='see-groups-img' src='https://www.meetup.com/blog/wp-content/uploads/2020/08/holding-hands.jpg'/>
                <NavLink to='/groups'>See all groups</NavLink> 
                <p>Look through existing groups, to find the right one for you!</p>
            </div>


            <div className='find-events'>
                <img/>
                <NavLink to='/events'>Find an event</NavLink>
                <p>Plenty of events to be apart of, far away or in your area! </p>
            </div>


            <div className='start-groups'>
                <img/>
                <NavLink to='/groups/new' className={checkUser} onClick={handleClick}>Start a new group</NavLink>
                <p>Wanting to organize an event in your area? Create a group for like minded people!</p>
            </div>

        </div>
    )
}