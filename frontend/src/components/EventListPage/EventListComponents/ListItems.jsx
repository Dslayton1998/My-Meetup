import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getEventByIdThunk } from '../../../store/events';
import { useEffect } from 'react';

export default function ListItems({ event }) {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const events = useSelector(state => state.Events)
    const eventDetails = events[event.id]
    
    const modTime = Date.parse(eventDetails.startDate)
    const date = new Date(modTime)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const bigHours = date.getHours()
    const min = date.getMinutes()
    const hours  = ((bigHours + 11) % 12 + 1)
    let EventTime;
    if(bigHours > 12) {
        EventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${min < 10 ? `0${min}` : `${min}`} P.M.`;
    } else {
        EventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${min < 10 ? `0${min}` : `${min}`} A.M.`;
    }
    const EventDate = `${year}-${Number(month) < 10 ? `0${month + 1}`: `${month + 1}`}-${day < 10 ? `0${day}`: `${day}`}`


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
    
    return (
        <>
        <div className='event-list-items-container' onClick={onClick} style={{cursor: 'pointer'}}>
            <img className='preview-image' src={getImage()} />
            <div className='event-list-items'>
                <span>{EventDate}  &#183;  {EventTime}</span>
                <h2 style={{margin: 0}}>{event.name}</h2>
                <span style={{color: '#808080'}}>{event.Group.city}, {event.Group.state}</span> 
                <span>{event.description}</span>
            </div>
        </div>
        
        </>
    )
}