import { useNavigate } from 'react-router-dom'
import './GroupList.css'

export default function ListItems({ group }) {
    const navigate = useNavigate();
    // todo: add basic styles (font sizes/layout)
    // todo: add preview img

    const onClick = () => {
        navigate(`/groups/${group.id}`)
    }

    return (
        <div className='list-items-container' onClick={onClick} style={{cursor: 'pointer'}}>
            <img className='preview-image' src={group.previewImage} />
            <div className='list-items'>
                {/* Somehow check private status */}
                <span>{group.name}</span>
                <span>{group.city}, {group.state}</span>
                <span>{group.about}</span>
            </div>
        </div>
    )
}