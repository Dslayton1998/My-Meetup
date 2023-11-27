import { useNavigate } from 'react-router-dom'
import '../GroupList.css'

// todo: might not need this, but "Events" and "Groups" headings need to be links
export default function ListHeading() {
    const navigate = useNavigate()

    const onClick = () => {
        navigate('/events')
    }
    return (
        <>
        <h1 onClick={onClick} className='unselected-heading'>Events</h1>
        <h1 className='selected-heading'>Groups</h1>
        </>
    )
}