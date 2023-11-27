import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom";
import { getGroupByIdThunk } from "../../../store/groups";
import { useEffect } from "react";
import '../EventDetails.css'

export default function Heading({ event }) {
    // console.log(event)
    const dispatch = useDispatch();
    const groupId = event ? event.groupId : 1
    const organizer = useSelector(state => state.Groups[groupId] ? state.Groups[groupId].Organizer : null)
    // console.log('HEY',OrganizerInfo)
    if(groupId) {
        useEffect(() => {
            const getGroupById = async () => {
                await dispatch(getGroupByIdThunk(groupId))
            }

            getGroupById()
        }, [dispatch])
    }

    const qtCarrot = '<'
    return (
        <>
        <NavLink className='event-header-details-container' to='/events'>{qtCarrot} Events</NavLink>
        <div className="event-header-details-container">
            <h1 style={{margin: 0}}>{event ? event.name : null}</h1>
            <p style={{color: '#808080'}}>Hosted by {organizer ? organizer.firstName : null} {organizer ? organizer.lastName : null}</p>
            
        </div>
        </>
    )
}