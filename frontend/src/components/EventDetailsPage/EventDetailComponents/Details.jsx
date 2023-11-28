import { useSelector } from "react-redux"
import DeleteModal from "../DeleteModal"
// import { getGroupByIdThunk } from "../../../store/groups"
import { useNavigate, useParams } from "react-router-dom"
import OpenModalMenuItem from "../../Navigation/NavComponents/OpenModalMenuItem"


export default function Details({ event }) {
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const { eventId } = useParams()
    const fixId = Number(eventId)
    // todo: needs group information
    //* Consider braking this up into smaller components
    // const fixedEventId = Number(eventId)
    const sessionUser = useSelector(state => state.session.user);
    const currentEvent = useSelector(state => state.currentEvent[eventId])
    const currentGroups = useSelector(state => state.currentGroup)
    const groups = useSelector(state => Object.values(state.Groups))
    const group = groups.find(group => event ? group.id === event.groupId: null)
    const organizerId = sessionUser? sessionUser.id : null
    const eventImg = event ? event.EventImages : null
    const groupImg = group ? group.previewImage : null
    const currentGroup = currentGroups[group.id]
    console.log(currentGroup)
    

    const getPrice = () => {
        if(currentEvent) {
            return currentEvent.price
        }
    }


    const getImg = () => {
        if(event) {
            let img;
            if(event.previewImage) {
                img = event.previewImage
                // console.log('event.previewImage')
                return img
            }
        if(eventImg) {
            if(eventImg.length < 1) {
                console.log('eventImg.length')
                img = event.EventImages[0]
                // console.log(img)
                return img 
            } else {
                console.log('else')
                const truePreview = event.EventImages.find(event => event.preview === true)
                console.log(truePreview)
                img = truePreview.url
                return img
            }
        }
        }

    }

    const checkGroup = () => {
        if(group) {
            if(group.previewImage) {
                // console.log('previewImage',group.previewImage)
                return group.previewImage
            }
        }

        if(currentGroup) {
            if(currentGroup.GroupImages) {
                if(currentGroup.GroupImages.length) {
                    const img = currentGroup.GroupImages.find(img => img.preview === true)
                    // console.log(img.url)
                    return img.url
                }
            }
        }
    }
    // console.log(getImg())
    // console.log(event)
    
    let startEventDate;
    let startEventTime;
    let endEventDate;
    let endEventTime;
    if(event) {
        if(event.startDate) {
            const modTime = Date.parse(event.startDate)
            const date = new Date(modTime)
            const year = date.getFullYear()
            const month = date.getMonth()
            const day = date.getDay()
            const hours = date.getHours()
            const min = date.getMinutes()
            startEventDate = `${year}-${Number(month) < 10 ? `0${month + 1}`: `${min + 1}`} -${day < 10 ? `0${day}`: `${day}`}`
            startEventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${min < 10 ? `0${min}` : `${min}`}`;
        }
    
        if(event.endDate) {
            const modTime = Date.parse(event.endDate)
            const date = new Date(modTime)
            const year = date.getFullYear()
            const month = date.getMonth()
            const day = date.getDay()
            const hours = date.getHours()
            const min = date.getMinutes()
            endEventDate = `${year}-${Number(month) < 10 ? `0${month + 1}`: `${min + 1}`} -${day < 10 ? `0${day}`: `${day}`}`
            endEventTime = `${hours < 10 ? `0${hours}` : `${hours}`}:${min < 10 ? `0${min}` : `${min}`}`;
        }
    }

    const checkPrivacy = () => {
        if(group) {
            if(group.isPrivate === true) {
                return 'Private'
            }
            if(group.isPrivate === false) {
                return 'Public'
            }
        }
    }

    const onClick = () => {
        navigate(`/groups/${event.Group.id}`)
    }
    const update = () => {
        if(sessionUser) {
            if(sessionUser.id === organizerId) {
                return;
            } else {
               return  alert('Feature coming soon!')
            }
        } else {
            return  alert('Feature coming soon!')
        }
    }

    const moreOptions = () => {
        if(sessionUser) {
            if(group ? sessionUser.id === group.organizerId : null) {
                return <div className="event-organizer-options">
                <button><OpenModalMenuItem itemText='Delete' modalComponent={<DeleteModal event={event} navigate={navigate}/>} /></button>
                <button onClick={update} style={{margin: 10}}>Update</button>
                </div>
            } 
        } 
    }

    // todo: small edits to price ##
    return (
        <>
        <div className="event-details-container">
            <img className="event-details-image" src={getImg()} />
            <div>
            <div className="group-details" onClick={onClick} style={{cursor: 'pointer'}}>
                {/* GROUP DETAILS CARD */}
            <img className="group-details-image" src={checkGroup()} />
                <div>
                    <h2>{group ? group.name : null}</h2>
                    <span>{checkPrivacy()}</span>
                </div>
            </div>
            <div className="event-sub-container">
                {/* EVENT DATES/PRICE/TYPE */}
                <div className="event-sub-info">
                <p>START: {event ? startEventDate : null}  &#183;  {event ? startEventTime : null} </p>
                <p>END {event ? endEventDate : null}  &#183;  {event ? endEventTime : null}</p>
                <span>$ {getPrice()}</span>
                <span style={{paddingTop: 10}}>{event ? event.type : null}</span>
                </div>
                {/* // Still need some icons */}
                {/* {checkAuth()} */}
                <span className="event-delete-button">{moreOptions()}</span>
            </div>
            </div>
        </div>
            <div className="event-description">
                <h3>Description</h3>
            <span>{event ? event.description: null}</span>
            </div>
        </>
    )
}