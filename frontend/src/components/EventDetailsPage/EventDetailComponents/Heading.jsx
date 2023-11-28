import { useDispatch, useSelector } from "react-redux"
import { NavLink, useParams } from "react-router-dom";
import { getGroupByIdThunk } from "../../../store/currentGroup";
import { useEffect } from "react";
import '../EventDetails.css'

export default function Heading({ event }) {
    // console.log(event)
    const { eventId } = useParams() 
    const dispatch = useDispatch();
    const groupId = event ? event.groupId : eventId
    const organizer = useSelector(state => state.currentGroup[groupId] ? state.currentGroup[groupId].Organizer : undefined)
    // console.log(groupId)
    // console.log('HEY', organizer)

    useEffect(() => {
            const getGroupById = async () => {
                await dispatch(getGroupByIdThunk(groupId))
            }
            
            getGroupById()
        }, [dispatch, groupId])

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