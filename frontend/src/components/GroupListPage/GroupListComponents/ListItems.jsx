import { useNavigate } from 'react-router-dom'
import '../GroupList.css'

export default function ListItems({ group }) {
    const navigate = useNavigate();
    // todo: add basic styles (font sizes/layout)
    // todo: figure out how to get num of events & dot

    const onClick = () => {
        navigate(`/groups/${group.id}`)
    }

    const checkPrivacy = () => {
        if(group.isPrivate === true) {
            return 'Private'
        } else {
            return 'Public'
        }
    }
    // console.log(checkPrivacy())

    return (
        <div className='list-items-container' onClick={onClick} style={{cursor: 'pointer'}}>
            <img className='preview-image' src={group.previewImage} />
            <div className='list-items'>
                {/* Somehow check private status */}
                <span>{group.name}</span>
                <span>{group.city}, {group.state}</span>
                <span>{group.about}</span>
                <span>## events (dot) {checkPrivacy()} </span>
            </div>
        </div>
    )
}