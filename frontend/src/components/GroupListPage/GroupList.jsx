import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { getAllGroupsThunk } from '../../store/groups';
// import { NavLink } from 'react-router-dom'
import ListItems from './GroupListComponents/ListItems.jsx';
import ListHeading from './GroupListComponents/ListHeading.jsx'

export default function GroupList() {
    const dispatch = useDispatch();
    const groups = useSelector(state => Object.values(state.Groups));
    // console.log(groups)

    useEffect(() => {
        const getGroups = async () => {
            await dispatch(getAllGroupsThunk())
        }
        

        getGroups()
    }, [dispatch])

    // todo: just passed the group info to ListItems !still need to format! and finish listItems
    return (
        <div className='container'>
            <div className='list-container'>
                <div className='list-headings'>
                <ListHeading />
                </div>
                <h5 className='list-sub-heading'>Groups in Meetup</h5>
                <ul>
                    {/* {.map trough groups state and create listItem (nav-links) for every group} */}
                    {groups.map(group => (
                        <div key={group.id} to={`/groups/${group.id}`}>
                            <ListItems key={group.id} group={group} />
                        </div>
                        
                    ))}
                </ul>
            </div>
        </div>
    )
}