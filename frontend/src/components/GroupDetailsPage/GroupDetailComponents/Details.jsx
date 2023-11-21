import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllGroupsThunk } from '../../../store/groups';
import '../GroupDetails.css'

export default function Details() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const groups = useSelector(state => Object.values(state.groups.Groups))
    const group = groups.find(group => groupId == group.id)
    console.log(groups)
    // console.log(group)

    // if(!group) return null;


    useEffect(() => {
        dispatch(getAllGroupsThunk())
    }, [ dispatch ])

// todo: Need events by groupId and organizer data
    return (
        <div className='details-container'>
            <img className='details-image' src={group ? group.previewImage: null} /> 
            <h1>{group ? group.name: null}</h1>
            <p>{group ? group.city: null}, {group ? group.state: null}</p>
            <p>## events </p>
            <p>Organized by ...</p>
        </div>
    )
}