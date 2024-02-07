import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getGroupByIdThunk } from '../../../store/currentGroup';
import '../GroupList.css'

export default function ListItems({ group }) {
    const id = Number(group.id)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentGroupEvents = useSelector(state => state.currentGroup[id])

    useEffect(() => {
        const getGroupDetails = async () => {
            await dispatch(getGroupByIdThunk(id))
        }

        getGroupDetails()
    }, [dispatch])



    const onClick = () => {
        navigate(`/groups/${group.id}`)
    }


    const checkPrivacy = () => {
        if(group.isPrivate === true) {
            return 'Private'
        } else {
            return 'Public'
        }
    }


    const checkGroup = () => {
        if(group) {
            if(group.previewImage) {
                return group.previewImage
            }
        }

        if(currentGroupEvents) {
            if(currentGroupEvents.GroupImages) {
                if(currentGroupEvents.GroupImages.length) {
                    const img = currentGroupEvents.GroupImages.find(img => img.preview === true)
                    // console.log(img.url)
                    return img.url
                }
            }
        }
    }

    const numEvents = () => {
        if(currentGroupEvents) {
            const eventArr = currentGroupEvents.Events
            if(eventArr) {
                if(eventArr.length < 10) {
                    return <span>{`0${eventArr.length} event(s)`}</span>
                }
        
                if(eventArr.length > 10 ) {
                    return <span>{`${eventArr.length} event(s)`}</span>
                }
            } else {
                return 'No recorded events'
            }
        }
    }
    

    return (
        <div className='list-items-container' onClick={onClick} style={{cursor: 'pointer'}}>
            <img className='preview-image' src={checkGroup()} />
            <div className='list-items'>
                {/* Somehow check private status */}
                <h2 style={{marginBottom: 5, marginTop: 5}}>{group.name}</h2>
                <span className='misc'>{group.city}, {group.state}</span>
                <span style={{paddingBottom: 5}}>{group.about}</span>
                {/* <span>## events (dot) {checkPrivacy()} </span> */}
                <span className='misc'>{numEvents()} &#183; {checkPrivacy()}</span>
            </div>
        </div>
    )
}