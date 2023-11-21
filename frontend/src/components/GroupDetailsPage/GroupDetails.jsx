import { NavLink } from 'react-router-dom'
import './GroupDetails.css'
import Details from './GroupDetailComponents/Details';

export default function GroupDetails() {

    const qtCarrot = '<'
    
    return (
        <div>
        <NavLink to='/groups'>{qtCarrot} Groups</NavLink>
        <Details />
        </div>
    )
}