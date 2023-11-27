import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { getAllEventsThunk, getEventByIdThunk } from '../../store/events';
import ListHeading from './EventListComponents/ListHeading';
import ListItems from './EventListComponents/ListItems';
import './EventList.css'

export default function EventList() {
    //! BUG : if you refresh on EventDetails page and try to come back the data is not there
    const dispatch = useDispatch();
    const events = useSelector(state => Object.values(state.Events));
    // console.log(events)

    useEffect(() => {
        dispatch(getAllEventsThunk())

        // dispatch(getEventByIdThunk(events[0]))
    }, [ dispatch ])

    // todo: just passed the group info to ListItems !still need to format! and finish listItems
    return (
        <div className='event-list-container'>
            <div className='event-list-headings'>
            <ListHeading />
            </div>
            <h5 className='list-sub-heading'>Events in Meetup</h5>
            <ul>
                {/* {.map trough groups state and create listItem (nav-links) for every group} */}
                {events.map(event => (
                    <div key={event.id} to={`/events/${event.id}`}>
                        <ListItems key={event.id} event={event} />
                    </div>
                    
                ))}
            </ul>
        </div>
    )
}