import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { getAllEventsThunk } from '../../store/events';
import ListHeading from './EventListComponents/ListHeading';
import ListItems from './EventListComponents/ListItems';

export default function EventList() {
    const dispatch = useDispatch();
    const events = useSelector(state => Object.values(state.Events));
    // console.log(groups)

    useEffect(() => {
        dispatch(getAllEventsThunk())
    }, [ dispatch ])

    // todo: just passed the group info to ListItems !still need to format! and finish listItems
    return (
        <div>
            <div className='list-headings'>
            <ListHeading />
            </div>
            <h5 className='list-sub-heading'>Events in Meetup</h5>
            <ul>
                {/* {.map trough groups state and create listItem (nav-links) for every group} */}
                {events.map(event => (
                    <div key={event.id} to={`/events/${event.id}`}>
                        <ListItems event={event} />
                    </div>
                    
                ))}
            </ul>
        </div>
    )
}