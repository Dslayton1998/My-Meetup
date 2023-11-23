import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { getAllGroupsThunk } from "../../../store/groups"
import DeleteModal from "../Modal/DeleteModal"

export default function Details({ event }) {
    // todo: needs group information
    //* Consider braking this up into smaller components
    const [openModal, setOpenModal] = useState(false)
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);
    const groups = useSelector(state => Object.values(state.Groups))
    const group = groups.find(group => event ? group.id === event.groupId: null)
    console.log(event)
    // console.log(groups)
    console.log(group)

    useEffect(() => {
        dispatch(getAllGroupsThunk())
    }, [ dispatch ])


    const checkAuth = () => {
        if(sessionUser) {
            if(group ? sessionUser.id === group.organizerId : null) {
                return <div> 
                    <button onClick={() => setOpenModal(true)}>Delete</button>
                    <DeleteModal group={group} event={event} open={openModal} onClose={() => setOpenModal(false)}/>
                     </div>
            } 
        } 
    }

    return (
        <div>
            <img src={event ? event.previewImage : null} />
            <div>
                {/* GROUP DETAILS CARD */}
            <h1>{event ? event.Group.name : null}</h1>
            </div>
            <div>
                {/* EVENT DATES/PRICE/TYPE */}
            <p>START {event ? event.startDate : null}</p>
            <p>END {event ? event.endDate : null}</p>
            <span>{event ? event.price : null}</span>
            <span>{event ? event.type : null}</span>
            {checkAuth()}
            </div>
            
        </div>
    )
}