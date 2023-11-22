import { useNavigate } from 'react-router-dom'
// import '../GroupList.css'

export default function ListItems({ event }) {
    const navigate = useNavigate();
    // todo: TIME AND DATES NEED WORK!
    // todo: figure out how to get dot
    // console.log(event)
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
    // console.log(checkPrivacy())

    return (
        <div className='list-items-container' onClick={onClick} style={{cursor: 'pointer'}}>
            <img className='preview-image' src={event.previewImage} />
            <div className='list-items'>
                {/* Somehow check private status */}
                <span>{event.startDate}</span> {/* {event.endDate} */}
                <span>{event.name}</span>
                <span>{event.Group.city}, {event.Group.state}</span>
                <span>{event.Group.about}</span>
                {/* <span>## events (dot) {checkPrivacy()} </span> */}
            </div>
        </div>
    )
}