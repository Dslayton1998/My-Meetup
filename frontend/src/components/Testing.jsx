import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getEventByIdThunk } from "../store/currentEvent";
import { getAllEventsThunk } from "../store/events";
import { NavLink } from "react-router-dom";


export default function Testing() {
    const dispatch = useDispatch();

    let events;
    let event;

    useEffect(() => {
        const getEventInfo = async () => {
            events = await dispatch(getAllEventsThunk())
            console.log(events[1])
            if(events) {
                if(events[1]) {
                    event = await dispatch(getEventByIdThunk(events[1].id))
                    console.log(event)
                }
            }

        }
        getEventInfo()
    }, [dispatch])
    return (
        <NavLink to='/testing' events={events}>TESTING</NavLink>
    )
}