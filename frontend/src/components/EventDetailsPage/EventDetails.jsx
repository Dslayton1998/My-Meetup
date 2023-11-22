import { NavLink, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllEventsThunk } from '../../store/events';
import Heading from './EventDetailComponents/Heading';
import Details from './EventDetailComponents/Details';

export default function EventDetails() {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const events = useSelector(state => state.Events ? Object.values(state.Events) : null)
    // todo: cannot read property of null reading events
    const event = events.find(event => eventId == event.id)
    console.log(events)
    // console.log(event)

    // if(!event) return null;


    useEffect(() => {
        dispatch(getAllEventsThunk())
    }, [ dispatch ])


    const qtCarrot = '<'
    // todo: dynamic portion <button>
    // todo: UpcomingEvents
    return (
        <div>
        <NavLink to='/events'>{qtCarrot} Events</NavLink>
        <Heading event={event} />
        <Details event={event}/> {/* contains 2 smaller cards for Group and (time/price/type info) */}
        
        {/* <UpcomingEvents /> */}
        </div>
    )
}