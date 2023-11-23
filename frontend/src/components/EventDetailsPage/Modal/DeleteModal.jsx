import { useDispatch } from "react-redux";
import { deleteEventThunk } from "../../../store/events";
import { useNavigate } from "react-router-dom";

export default function DeleteModal({ open, onClose, event, group }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // console.log('group',group)

    if(!open) return null
    // console.log(group)
    // console.log(open)

    const deleteEvent = async (e) => {
        e.preventDefault()
        await dispatch(deleteEventThunk(event))

        navigate(`/groups/${group.id}`)
    }

    // todo: add css to put modal in the middle of the screen
    return (
        <div onClick={(e) => {e.stopPropagation()}}>
            <div>
                <h1>Confirm Delete</h1>
                <p>Are you sure you want to remove this group?</p>
            <button onClick={deleteEvent}>Yes (delete group)</button>
            <button onClick={onClose}>No (Keep group)</button>
            </div>
        </div>
    )
}