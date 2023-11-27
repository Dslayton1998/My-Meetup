import { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getAllEventsThunk } from '../../store/events';
import { getGroupByIdThunk } from '../../store/currentGroup';
import GroupDetailsHeading from './GroupDetailComponents/GroupDetailsHeading';
import Details from './GroupDetailComponents/GroupDetails';
import './GroupDetails.css'


export default function GroupDetails( ) {
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const id = Number(groupId)
    let groups;
    let events;
    let event;
    let currentEvent;
    let eventId;

    useEffect(() => {
        const getAllEventDetails = async () => {
            events = await dispatch(getAllEventsThunk())
            // event = await dispatch(getEventByIdThunk(events.id))
        }
    //     let getCurrentEvents;
    //     getCurrentEvents = async () => {
    //         console.log(event)
    //         currentEvent = await dispatch(getEventByIdThunk(event.id))
    // } 

        const getGroupDetails = async () => {
            groups = await dispatch(getGroupByIdThunk(groupId)) 
            // if(eventId !== undefined) {
                // event = await dispatch(getEventByIdThunk(1))
                // }
                // todo:  ^ FIX THIS SO ITS NOT HARDCODED
                // console.log(groups)

                    // console.log('groups:',groups)    
                }
                console.log(groups)
                getGroupDetails()
                // getCurrentEvents()
        getAllEventDetails()
    }, [dispatch])


    groups = useSelector(state => state.currentGroup)
    events = useSelector(state => state.Events)
    // const test = useSelector(state => console.log(state))
    // console.log('hi',events)
    // eventId = events.Events[0].id
    // console.log('PPPP',event)

    let group = groups ? groups[id] : null
    if(group) {
        if(group.Events) {
            if(group.Events.length > 0) {
                eventId = group.Events[0].id
            }
        }
    }



    const qtCarrot = '<'
    // todo: UpcomingEvents

    // console.log(events)
    return (
        <div>
        <NavLink to='/groups' className='header-details-container'>{qtCarrot} Groups</NavLink>
        <GroupDetailsHeading group={group} events={events} />
        <Details group={group} events={events} />
        {/* <UpcomingEvents /> */}
        </div>
    )
}