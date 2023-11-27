import { useDispatch } from "react-redux";
import { deleteGroupThunk } from "../../store/groups";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import './DeleteModal.css'

export default function DeleteModal({ group, navigate }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    // console.log(navigate)
    // const navigate = useNavigate();

    // console.log(group)
    // console.log(open)

    const deleteGroup = async () => {
        await dispatch(deleteGroupThunk(group))

        closeModal()

        navigate('/groups')
    }

    const cancel = () => {
        closeModal()
    }

    // todo: add css to put modal in the middle of the screen
    return (
        <div className="delete-modal-container">
            <div>
                <h1 className="delete-modal-title">Confirm Delete</h1>
                <p>Are you sure you want to remove this group?</p>
                <div className="delete-modal-buttons-container">
                    <button className="modal-button-yes" onClick={deleteGroup}>Yes (delete group)</button>
                    <button className="modal-button-no" onClick={cancel}>No (Keep group)</button>
                </div>
            </div>
        </div>
    )
}