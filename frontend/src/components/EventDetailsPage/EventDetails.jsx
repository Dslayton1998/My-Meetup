import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getEventByIdThunk } from '../../store/currentEvent';
import Heading from './EventDetailComponents/Heading';
import Details from './EventDetailComponents/Details';
import { getAllGroupsThunk } from '../../store/groups';
import { getGroupByIdThunk } from '../../store/currentGroup';
import { getAllEventsThunk } from '../../store/events';

export default function EventDetails() {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const events = useSelector(state => Object.values(state.Events) )
    // todo: cannot read property of null reading events
    const event = events.find(event => eventId == event.id)
    // console.log(events)
    const id = Number(eventId)
    let eventDetails;
    eventDetails = useSelector(state => state.Events)
    // console.log('here',eventDetails)
    const eventLookUp = eventDetails[eventId]

    useEffect(() => {
        const getEventDetails = async () => {
            await dispatch(getEventByIdThunk(id))
        }

        const getAllEvents = async () => {
            await dispatch(getAllEventsThunk())
        }

        const getGroupDetails = async () => {
            await dispatch(getAllGroupsThunk())
        }

        const getGroupById = async () => {
            await dispatch(getGroupByIdThunk(eventLookUp.groupId))
        }

        // console.log(thing)
        getGroupById()
        getGroupDetails()
        getEventDetails()
        getAllEvents()
    }, [ dispatch ])


    // console.log(eventLookUp)

    // todo: dynamic portion <button>
    // todo: UpcomingEvents
    return (
        <div className='event-details-main-container'>
        <Heading event={event} />
        <Details event={event}/> {/* contains 2 smaller cards for Group and (time/price/type info) */}
        
        {/* <UpcomingEvents /> */}
        </div>
    )
}