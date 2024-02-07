import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { getAllEventsThunk } from '../../store/events';
import ListHeading from './EventListComponents/ListHeading';
import ListItems from './EventListComponents/ListItems';
import './EventList.css'

export default function EventList() {
    const dispatch = useDispatch();
    const events = useSelector(state => Object.values(state.Events));

    const sortedEvents = events.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate)
    }).reverse()

    useEffect(() => {
        dispatch(getAllEventsThunk())

    }, [ dispatch ])


    return (
        <div className='container'>
            <div className='event-list-container'>
                <div className='event-list-headings'>
                <ListHeading />
                </div>
                <h5 className='list-sub-heading'>Events in Meetup</h5>
                <ul>
                    {sortedEvents.map(event => (
                        <div key={event.id} to={`/events/${event.id}`}>
                            <ListItems key={event.id} event={event} />
                        </div>
                        
                    ))}
                </ul>
            </div>
        </div>
    )
}