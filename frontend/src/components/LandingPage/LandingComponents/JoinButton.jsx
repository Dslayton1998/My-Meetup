import { useSelector } from "react-redux"

export default function JoinButton() {
    // todo: open sign up modal
    const checkUser = () => {
        const user = useSelector(state => state.session.user)
        if(user === null) {
            return <button className="join-button" style={{cursor: 'pointer'}}>Join Meetup</button>
        } else {
            return null
        }
    }

    return (
        <>
        {checkUser()}
        </>
    )
}