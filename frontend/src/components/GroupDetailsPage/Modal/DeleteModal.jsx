import { useDispatch } from "react-redux";
import { deleteGroupThunk } from "../../../store/groups";
import { useNavigate } from "react-router-dom";

export default function DeleteModal({ open, onClose, group }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if(!open) return null
    // console.log(group)
    // console.log(open)

    const deleteGroup = async (e) => {
        e.preventDefault()
        await dispatch(deleteGroupThunk(group))

        navigate('/groups')
    }

    // todo: add css to put modal in the middle of the screen
    return (
        <div onClick={(e) => {e.stopPropagation()}}>
            <div>
                <h1>Confirm Delete</h1>
                <p>Are you sure you want to remove this group?</p>
            <button onClick={deleteGroup}>Yes (delete group)</button>
            <button onClick={onClose}>No (Keep group)</button>
            </div>
        </div>
    )
}