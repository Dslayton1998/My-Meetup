import { useDispatch } from "react-redux";
import { deleteEventThunk } from "../../store/events";
import { useModal } from "../../context/Modal";
import './DeleteModal.css'
import { useParams } from "react-router-dom";

export default function DeleteModal({ event, navigate }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const eventId = event.id
    const groupId = event ? event.Group.id: null
    // console.log(navigate)
    // const navigate = useNavigate();

    // console.log(group)
    // console.log(open)

    const deleteGroup = async () => {
        
        await dispatch(deleteEventThunk(eventId))
        navigate(`/groups/${groupId}`)
        closeModal()
    }

    const cancel = () => {
        closeModal()
    }

    return (
        <div className="delete-modal-container">
            <div>
                <h1 className="delete-modal-title">Confirm Delete</h1>
                <p>Are you sure you want to remove this event?</p>
                <div className="delete-modal-buttons-container">
                    <button className="modal-button-yes" onClick={deleteGroup}>Yes (delete event)</button>
                    <button className="modal-button-no" onClick={cancel}>No (Keep event)</button>
                </div>
            </div>
        </div>
    )
}