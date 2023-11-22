import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { updateGroupThunk, getAllGroupsThunk } from "../../../store/groups";
import { useNavigate, useParams } from "react-router-dom";


export default function UpdateGroupForm( props ) {
    console.log('data', props)
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('')          
    const [isPrivate, setPrivate] = useState('');     
    const [validations, setValidations] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    

    // console.log('type:', type)
    // console.log('private:', isPrivate)

    const groups = useSelector(state => Object.values(state.Groups))
    const group = groups.find(group => group.id == groupId)
    // console.log('currentGroup', group)
    // console.log(groups, 'GROUPS')
    useEffect(() => {
        dispatch(getAllGroupsThunk())

        const validations = {};

        if(!location) {
            validations.location = 'Location is required'
        }

        if(!name) {
            validations.name = 'Name is required'
        }

        if(description.length < 30) {
            validations.description = 'Description must be at least 30 characters long'
        }

        if(!type) {
            validations.type = 'Group Type is required'
        }

        if(!isPrivate) {
            validations.isPrivate = 'Visibility Type is required'
        }

        setValidations(validations)

    }, [ dispatch, name, description, location, type, isPrivate ])

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true)
        const locationArr = location.split(', ')
        
        const newGroup = {
            id: group.id,
            name: name,
            city: locationArr[0],
            state: locationArr[1],
            about: description,
            type: type,
            isPrivate: isPrivate
        };
        console.log('newGroup',newGroup)
        // console.log('NEW_GROUP', newGroup)
        await dispatch(updateGroupThunk(newGroup));

        reset();
        // console.log(groups)
        // const groupId = groups[groups.length].id
        // console.log('groupId',groupId)
        // navigate(`/groups/${groupId}`) 
    // todo: figure out how to redirect to the new page \\
    }

    const reset = () => {
        setName('');
        setLocation('');
        setDescription('');
        setType('')
        setPrivate('')
        setHasSubmitted(false)
        setValidations({})
      };

      let combined;
      if(group) {
        combined = group.city + ', ' + group.state
      }

      let privacy;
      if(!isPrivate) {
        privacy = 'Public'
      } else {
        privacy = 'Private'
      }

    return (
        <div>
            {/* <title>Start a New Group</title>
        <p>BECOME AN ORGANIZER</p>
        <h1>We&apos;ll walk you through a few steps to build your local community</h1> */}
        <h1>Update your group</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <h1>Set your group&apos;s location</h1>
                <p>Meetup groups meet locally, in person and online. We&apos;ll connect you with people
                    in your area.</p>
                <input
                    type="text"
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    placeholder={combined ? combined: null} 
                    name="location"
                />
            </div>
                {/* Validation err's go here */}
                {hasSubmitted && validations.location && `*${validations.location}`}
            <div>
                <h1>What will your group&apos;s name be?</h1>
                <p>Choose a name that will give people a clear idea of what the group is about. </p>
                <p>Feel free to get creative! You can edit this later if you change your mind</p>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder={group ? group.name : null}
                    name="name"
                />
            </div>
            {hasSubmitted && validations.name && `*${validations.name}`}
            <div>
                <h1>Describe the purpose of your group</h1>
                <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
                <ol>
                    <li>What&apos;s the purpose of the group? </li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <textarea
                    // type="textarea"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder={group ? group.about: null}
                    name="description"
                />
            </div>
            {hasSubmitted && validations.description && `*${validations.description}`}
            <div>
                <h1>Final steps...</h1>
                <p>Is this an in person or online group?</p>
                <select onChange={(e) => setType(e.target.value)}>
                    <option defaultValue="" selected disabled hidden>{group ? group.type : null}</option>
                    <option value={'Online'} >Online</option>
                    <option value={'In person'} >In-Person</option>
                </select>
                {hasSubmitted && validations.type && `*${validations.type}`}
                <p>Is this group private or public?</p>
                <select onChange={(e) => setPrivate(e.target.value)}>
                    <option defaultValue="" selected disabled hidden>{privacy}</option>
                    <option value={true} >Private</option>
                    <option value={false} >Public</option>
                </select>
                {hasSubmitted && validations.isPrivate && `*${validations.isPrivate}`}
                <p>Please add an image url for your group below:</p>
                <input placeholder={group ? group.previewImage: null}/> 
            </div>
            <button type="submit">Update group</button>
        </form>
        </div>
    )
}