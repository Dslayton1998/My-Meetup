// import '../GroupList.css'

import { useNavigate } from "react-router-dom"

// todo: might not need this, but "Events" and "Groups" headings need to be links
export default function ListHeading() {
    // todo: change CSS to be selected heading*
    const navigate = useNavigate()
    const onClick = () => {
        navigate('/groups')
    }
    return (
        <>
        <h1 className='selected-heading'>Events</h1>
        <h1 onClick={onClick} className='unselected-heading'>Groups</h1>
        </>
    )
}