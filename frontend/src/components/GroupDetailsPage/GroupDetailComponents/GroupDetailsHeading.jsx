import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import DeleteModal from '../DeleteModal'
import '../GroupDetails.css'
import OpenModalMenuItem from '../../Navigation/NavComponents/OpenModalMenuItem';


export default function GroupDetailsHeading({ group }) {
    const navigate = useNavigate()
    const sessionUser = useSelector(state => state.session.user);
    let organizerId;
    let firstName;
    let lastName;
    const eventArr = group ? group.Events : []
    // todo: event data is a little to static could cause bugs later
    // console.log(eventArr)
    // console.log(group)

    if(group) {
        if(group.Organizer) {
            organizerId = group.Organizer.id
            firstName = group.Organizer.firstName
            lastName = group.Organizer.lastName
        }
    }
    
    const pluralEvents = () => {
        if(!eventArr) return 'No recorded events';

        if(eventArr.length < 10) {
            if(eventArr.length === 1) {
                const component = <span>{`0${eventArr.length} event`}</span>
                return component
            }
            const component = <span>{`0${eventArr.length} events`}</span>
            return component
        }

        if(eventArr.length >= 10) {
            const component = <span>{`${eventArr.length} events`}</span>
            return component
        }
    }


    const onClick = () => {
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

    const updateRedirect = () => {
        navigate(`/groups/${group.id}/edit`)
    }


    const moreOptions = () => {
        if(sessionUser) {
            if(sessionUser.id === organizerId) {
                return <div className='group-option-buttons'> 
                <button onClick={() => navigate(`/groups/${group.id}/events/new`)}>Create event</button>
                 <button onClick={() => updateRedirect()}>Update</button> 
                 <button> <OpenModalMenuItem itemText='Delete' modalComponent={<DeleteModal group={group} navigate={navigate}/>} /></button>
                 </div>
            } else {
                return <button onClick={onClick}>Join this group</button>
                
            }
        } else {
           if(sessionUser === null) {
            return null
           }
        }
    }

    // console.log(group)
    const isPrivate = () => {
        if(group) {
            if(group.isPrivate === true) {
                return 'Private'
            } else {
                return 'Public'
            }
        }
    }

   const groupImageArr = group ? group.GroupImages : null
    const groupImage = groupImageArr ? groupImageArr.find(img => img.preview === true) : null
//    console.log(groupImage)


// todo: Need events by groupId and ## events needs double digits
    return (
        <div className='header-details-container'>
            <img className='details-image' src={group ? groupImage.url: null} /> 
            <div>
                <h1>{group ? group.name: null}</h1>
                <p>{group ? group.city: null}, {group ? group.state: null}</p>
                <p>{pluralEvents(eventArr)} &#183; {isPrivate()}</p>
                <p>Organized by: {firstName} {lastName}</p>
                <span className='group-option-buttons' onClick={onClick}>{moreOptions()}</span>
            </div>
        </div>
    )
}
