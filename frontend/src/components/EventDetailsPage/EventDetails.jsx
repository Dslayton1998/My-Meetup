import { NavLink, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllEventsThunk, getEventByIdThunk } from '../../store/events';
import Heading from './EventDetailComponents/Heading';
import Details from './EventDetailComponents/Details';
import { getAllGroupsThunk, getGroupByIdThunk } from '../../store/groups';

export default function EventDetails() {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const events = useSelector(state => Object.values(state.Events) )
    // todo: cannot read property of null reading events
    const event = events.find(event => eventId == event.id)
    // console.log(events)
    const id = Number(eventId)
    let test;
    let eventDetails;
    let thing;
    useEffect(() => {
        const getEventDetails = async () => {
            await dispatch(getEventByIdThunk(id))
        }

        const getGroupDetails = async () => {
            await dispatch(getAllGroupsThunk())
        }

        const getGroupById = async () => {
            if(eventLookUp && eventLookUp.Group) {
            test = await dispatch(getGroupByIdThunk(eventLookUp.groupId))
                // console.log('hi',test)
            }
        }

        getGroupById()
        getGroupDetails()
        getEventDetails()
    }, [ dispatch ])

    eventDetails = useSelector(state => state.Events)
    console.log('here',eventDetails)
    const eventLookUp = eventDetails[eventId]
    console.log(eventLookUp)

    const qtCarrot = '<'
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