import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { getAllEventsThunk } from '../../store/events';
import ListHeading from './EventListComponents/ListHeading';
import ListItems from './EventListComponents/ListItems';
import './EventList.css'

export default function EventList() {
    //! Need to figure out how to order by date
    const dispatch = useDispatch();
    const events = useSelector(state => Object.values(state.Events));
    // const ordered = events.sort()
    // console.log(ordered)
    // console.log(events)

    useEffect(() => {
        dispatch(getAllEventsThunk())

        // dispatch(getEventByIdThunk(events[0]))
    }, [ dispatch ])


    return (
        <div className='container'>
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
        </div>
    )
}