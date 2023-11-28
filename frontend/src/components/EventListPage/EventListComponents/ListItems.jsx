import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getEventByIdThunk } from '../../../store/events';
import { useEffect } from 'react';
// import '../GroupList.css'

export default function ListItems({ event }) {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    // todo: TIME AND DATES NEED WORK!
    // console.log(event)
    const events = useSelector(state => state.Events)
    const eventDetails = events[event.id]
    
    // todo: figure out how to get dot time is a little funny
    const modTime = Date.parse(eventDetails.startDate)
    const date = new Date(modTime)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDay()
    const hours = date.getHours()
    const min = date.getMinutes()
    const EventDate = `${year}-${Number(month) < 10 ? `0${month + 1}`: `${min + 1}`} -${day < 10 ? `0${day}`: `${day}`}`
    const EventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${min < 10 ? `0${min}` : `${min}`}`;
    // console.log(date)
    // console.log(modTime)
    // console.log(eventDetails)


    useEffect(() => {
        const getEvents = async () => {
            await dispatch(getEventByIdThunk(event.id))

        }
        getEvents()
    }, [dispatch])


    const onClick = () => {
        navigate(`/events/${event.id}`)
    }


    const checkPrivacy = () => {
        if(event.isPrivate === true) {
            return 'Private'
        } else {
            return 'Public'
        }
    }

    const getImage = () => {
        if(event) {
            if(event.previewImage) {
                return event.previewImage
            }
        }

        if(event) {
            if(event.EventImages) {
                if(event.EventImages.length) {
                    const arr = event.EventImages
                    const img = arr.find(img => img.preview === true)
                    return img.url
                }
            }
        }
    }
    
    // console.log(checkPrivacy())
    console.log(event)
    return (
        <>
        <div className='event-list-items-container' onClick={onClick} style={{cursor: 'pointer'}}>
            <img className='preview-image' src={getImage()} />
            <div className='event-list-items'>
                {/* Somehow check private status */}
                <span>{EventDate}  &#183;  {EventTime}</span> {/* {event.endDate} */}
                <h2 style={{margin: 0}}>{event.name}</h2>
                <span style={{color: '#808080'}}>{event.Group.city}, {event.Group.state}</span> 
                {/* <span>## events (dot) {checkPrivacy()} </span> */}
                <span>{event.description}</span>
            </div>
        </div>
        
        </>
    )
}