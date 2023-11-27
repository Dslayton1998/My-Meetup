import { useDispatch } from "react-redux";
import { deleteEventThunk } from "../../store/events";
import { useModal } from "../../context/Modal";
import './DeleteModal.css'

export default function DeleteModal({ event, navigate }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    // console.log(navigate)
    // const navigate = useNavigate();

    // console.log(group)
    // console.log(open)

    const deleteGroup = async () => {
        await dispatch(deleteEventThunk(event))

        closeModal()

        navigate('/events')
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