import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import { fetchGroupsThunk } from '../../store/groups';
import { NavLink } from 'react-router-dom'
import ListItems from './ListItems';

export default function GroupList() {
    const dispatch = useDispatch();
    const groups = useSelector(state => Object.values(state.groupState.Groups));

    useEffect(() => {
        dispatch(fetchGroupsThunk())
    }, [ dispatch ])

    // todo: just passed the group info to ListItems !still need to format and make them links!
    return (
        <div>
            <h1>Events</h1>
            <h1>Groups</h1>
            <ul>
                {/* {.map trough groups state and create listItem nav-links for every group} */}
                {groups.map(group => (
                    <NavLink>
                        <ListItems group={group} />
                    </NavLink>
                    
                ))}
            </ul>
        </div>
    )
}