import { NavLink } from 'react-router-dom'
import './LandingPage.css'

export default function LandingLinks() {
    // todo: give functionality to Navlink's
    return (
        <div className='nav-container'>
            <div>
                <img/>
                <NavLink to='/groups'>See all groups</NavLink> 
                <p>Look through existing groups, to find the right one for you!</p>
            </div>
            <div>
                <img/>
                <NavLink>Find an event</NavLink>
                <p>Plenty of events to be apart of, far away or in your area! </p>
            </div>
            <div>
                <img/>
                <NavLink>Start a new group</NavLink>
                <p>Wanting to organize an event in your area? Create a group for like minded people!</p>
            </div>
        </div>
    )
}