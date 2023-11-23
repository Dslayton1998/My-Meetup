import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DeleteModal from '../Modal/DeleteModal'
import '../GroupDetails.css'
import { useNavigate } from 'react-router-dom';

export default function GroupDetailsHeading({ group, groupId }) {
    const [openModal, setOpenModal] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const sessionUser = useSelector(state => state.session.user);
    const organizer = useSelector(state => state.Groups.CurrentGroupDetails ? state.Groups.CurrentGroupDetails.Organizer: null)
    const organizerId = organizer ? organizer.id : null
    const events = useSelector(state => state.Events[0] ? Object.values(state.Events): null)
    const event = events ? events.find(event => event.groupId == groupId) : null
    const eventArr = [];
    if(event) {
        eventArr.push(event)
    }
    // console.log(groupId)
    // console.log('organizer',organizerInfo)
    // console.log(sessionUser)
    

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


    const checkAuth = () => {
        if(sessionUser) {
            if(sessionUser.id === organizerId) {
                return <div> 
                <button onClick={() => navigate(`/groups/${group.id}/events/new`)}>Create event</button>
                 <button onClick={() => updateRedirect()}>Update</button> 
                 <button onClick={() => setOpenModal(true)}>Delete</button>
                <DeleteModal group={group} open={openModal} onClose={() => setOpenModal(false)}/> </div>
            } else {
                return <button onClick={onClick}>Join this group</button>
                
            }
        } else {
            return <button onClick={onClick}>Join this group</button>
        }
    }

// todo: Need events by groupId and ## events needs double digits
    return (
        <div className='details-container'>
            <img className='details-image' src={group ? group.previewImage: null} /> 
            <div>
                <h1>{group ? group.name: null}</h1>
                <p>{group ? group.city: null}, {group ? group.state: null}</p>
                <p>{eventArr ? eventArr.length: null} events </p>
                <p>Organized by {organizer ? organizer.firstName: null} {organizer ? organizer.lastName: null}</p>
                <span onClick={onClick}>{checkAuth()}</span>
            </div>
        </div>
    )
}