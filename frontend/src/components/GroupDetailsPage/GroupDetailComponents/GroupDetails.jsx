import { useDispatch, useSelector } from "react-redux"
import {  getEventByIdThunk } from '../../../store/currentEvent';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Details({ group, events }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // console.log('Details, group:', group)
    // console.log('Details, events:', events)
    let firstName;
    let lastName;
    let futureEventDate;
    let futureEventTime;
    let pastEventDate;
    let pastEventTime;
    // let groupEvents = group && group.Events && group.Events.filter(event => event.groupId === group.id)
    let futureEvents = group && group.Events && group.Events.filter(event => Date.parse(event.startDate) > Date.now());
    let pastEvents = group && group.Events && group.Events.filter(event => Date.parse(event.startDate) < Date.now());
    let eventsArr = []
    // console.log()
    // const test = useSelector(state => console.log(state))
    // console.log('here',futureEvents)
    // console.log(pastEvents)
    // console.log(events)
    // console.log(group)
    console.log(events)
    if(group) {
        if(group.Organizer) {
            firstName = group.Organizer.firstName
            lastName = group.Organizer.lastName
        }
    }

    const onClick = () => {
        navigate(`/events/${event.id}`)
    }

    
    const fixFutureDates = () => {
        let component;
        if(futureEvents) {
            futureEvents.map(event => {
                
                const date = new Date(event.startDate);
                const year = date.getFullYear()
                const month = date.getMonth()
                const day = date.getDay()
                const hours = date.getHours()
                const min = date.getMinutes()
                
                futureEventDate = `${year}-${Number(month) < 10 ? `0${month + 1}`: `${min + 1}`} -${day < 10 ? `0${day}`: `${day}`}`
                futureEventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${min < 10 ? `0${min}` : `${min}`}`;
                
                
                const onClick = () => {
                    navigate(`/events/${event.id}`)
                }

                component = <div className="event-card" onClick={onClick} style={{cursor: 'pointer'}}>
                    <img className="event-image" src={event.previewImage} />
                        <div>
                            <span>{futureEventDate}  &#183;  {futureEventTime}</span>
                            <p>{event.name}</p>
                            <p>{event.Venue.city}, {event.Venue.state}</p>
                            <p>{event.description}</p>
                        </div>
                    </div>
            })
            return component
        }
    }

    const fixPastDates = () => {
        let component
        if(pastEvents) {
            pastEvents.map(event => {
                // console.log('hoi',event)
                const date = new Date(event.startDate);
                const year = date.getFullYear()
                const month = date.getMonth()
                const day = date.getDay()
                const hours = date.getHours()
                const min = date.getMinutes()

                pastEventDate = `${year}-${Number(month) < 10 ? `0${month + 1}`: `${mm + 1}`} -${day < 10 ? `0${day}`: `${day}`}`
                pastEventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${min < 10 ? `0${min}` : `${min}`}`;


                const onClick = () => {
                    navigate(`/events/${event.id}`)
                }

                component = <div className="event-card"  onClick={onClick} style={{cursor: 'pointer'}}>
                    <img className="event-image" src={event.previewImage}/>
                        <div>
                            <span>{pastEventDate}  &#183;  {pastEventTime}</span>
                            <p>{event.name}</p>
                            <p>{event.Venue.city}, {event.Venue.state}</p>
                            <p>{event.description}</p>
                        </div>
                </div>
            })
            return component
        }
    }
    
    // useEffect(() => {
    //     if(groupEvents) {
    //         if(groupEvents.length > 1) {
    //             eventsArr.forEach(event => {
    //                 console.log(event)
    //                 const func = async () => {
    //                     await dispatch(getEventByIdThunk( event ))
    //                 }
    //                 func()
    //             })
    //         }
    //     }

    // }, [dispatch])


    // todo: need an array of past and future events map through and create a component for each element
    
    return (
        <div className="event-details-container">
            <div className="event-details">
                <h2>Organizer</h2>
                <p>{firstName} {lastName}</p>
                <h2>What we&apos;re about</h2>
                <p>{group ? group.about: null}</p>

                ********************************** Maybe create new component *******************************
                <div>
                {futureEvents && futureEvents.length > 0 && <p>Upcoming Events ({futureEvents.length})</p>}
                {fixFutureDates()}
                {pastEvents && pastEvents.length > 0 && <p>Past Events ({pastEvents.length})</p>}
                <span>
                    {fixPastDates()} // todo
                </span>

                <p>{events.length ? events[1].description : null}</p>
                </div>
                //! ^ hard coded figure out that logic MONDAY! (GroupDetails) still need location
                **************************************************************************************************
            </div>
        </div>
    )
}