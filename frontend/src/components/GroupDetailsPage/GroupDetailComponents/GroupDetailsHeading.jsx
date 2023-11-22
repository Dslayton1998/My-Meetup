import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllGroupsThunk } from '../../../store/groups';
import DeleteModal from '../Modal/DeleteModal'
import '../GroupDetails.css'
import { useNavigate } from 'react-router-dom';

export default function GroupDetailsHeading({ group }) {
    const [openModal, setOpenModal] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const sessionUser = useSelector(state => state.session.user);
    const organizerId = group ? group.organizerId : null
    // console.log(sessionUser)
    
        useEffect(() => {
            dispatch(getAllGroupsThunk())
        }, [ dispatch ])


    
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

// todo: Need events by groupId and organizer data
    return (
        <div className='details-container'>
            <img className='details-image' src={group ? group.previewImage: null} /> 
            <div>
                <h1>{group ? group.name: null}</h1>
                <p>{group ? group.city: null}, {group ? group.state: null}</p>
                <p>## events </p>
                <p>Organized by ...</p>
                <span onClick={onClick}>{checkAuth()}</span>
                {/* <DeleteModal open={openModal} onClose={() => setOpenModal(false)}/> */}
            </div>
        </div>
    )
}