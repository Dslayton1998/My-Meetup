import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getEventByIdThunk } from "../store/currentEvent";
import { getAllEventsThunk } from "../store/events";
import { NavLink } from "react-router-dom";


export default function Testing({ events }) {
    const dispatch = useDispatch();
    let currentEvent = useSelector(state => state.currentEvent ? state.currentEvent : null)
    // let events;
    let event;

            const getEventInfo = async () => {
                // events = await dispatch(getAllEventsThunk())
                // console.log(events
                    event = await dispatch(getEventByIdThunk(events[1].id))
                    console.log(event)
                
    
                }
                getEventInfo()
                // console.log(event)
    return (
        <NavLink >TESTING 2</NavLink>
    )
}