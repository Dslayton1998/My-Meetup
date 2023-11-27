import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import DeleteModal from "../DeleteModal"
// import { getGroupByIdThunk } from "../../../store/groups"
import { useNavigate } from "react-router-dom"
import OpenModalMenuItem from "../../Navigation/NavComponents/OpenModalMenuItem"


export default function Details({ event }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // todo: needs group information
    //* Consider braking this up into smaller components
    const sessionUser = useSelector(state => state.session.user);
    const groups = useSelector(state => Object.values(state.Groups))
    const group = groups.find(group => event ? group.id === event.groupId: null)
    const eventImg = event ? event.EventImages.find(img => img.preview === true) : null
    
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
            <img className="event-details-image" src={eventImg ? eventImg.url : null} />
            <div>
            <div className="group-details" onClick={onClick} style={{cursor: 'pointer'}}>
                {/* GROUP DETAILS CARD */}
            <img className="group-details-image" src={group ? group.previewImage: null} />
                <div>
                    <h2>{event ? event.Group.name : null}</h2>
                    <span>{checkPrivacy()}</span>
                </div>
            </div>
            <div className="event-sub-container">
                {/* EVENT DATES/PRICE/TYPE */}
                <div className="event-sub-info">
                <p>START: {event ? startEventDate : null}  &#183;  {event ? startEventTime : null} </p>
                <p>END {event ? endEventDate : null}  &#183;  {event ? endEventTime : null}</p>
                <span>$ {event ? event.price : null}</span>
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