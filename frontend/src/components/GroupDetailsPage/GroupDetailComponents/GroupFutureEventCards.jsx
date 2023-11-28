import { useNavigate } from "react-router-dom";
import '../GroupDetails.css'

export default function GroupFutureEventCard({ event, group }) {
    const navigate = useNavigate()
    const date = new Date(event.startDate);
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDay()
    const hours = date.getHours()
    const min = date.getMinutes()
    let futureEventDate;
    let futureEventTime;
    
    futureEventDate = `${year}-${Number(month) < 10 ? `0${month + 1}`: `${min + 1}`} -${day < 10 ? `0${day}`: `${day}`}`
    futureEventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${min < 10 ? `0${min}` : `${min}`}`;
    
    
    const onClick = () => {
        navigate(`/events/${event.id}`)
    }

    return (
        <div className="event-card" onClick={onClick}>
        <img className="event-image" src={event.previewImage} style={{borderRadius: 5}} />
            <div className="event-card-info">
                <span>{futureEventDate}  &#183;  {futureEventTime}</span>
                <h3>{event.name}</h3>
                <p>{event.Venue.city}, {event.Venue.state}</p>
                <p>{event.description}</p>
            </div>
        </div>
    )
}           