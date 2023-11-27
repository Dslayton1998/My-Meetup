import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { updateGroupThunk, getAllGroupsThunk } from "../../../store/groups";
import { useNavigate, useParams } from "react-router-dom";
import '../GroupDetails.css'


export default function UpdateGroupForm( props ) {
    // console.log('data', props)
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

    // console.log(location)
    // console.log(name)
    // console.log(type)

    const groups = useSelector(state => Object.values(state.Groups))
    let group;
    if(groups) {
        group =  groups.find(group => group.id == groupId)

    }
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
            id: groupId,
            name: name,
            city: locationArr[0],
            state: locationArr[1],
            about: description,
            type: type,
            isPrivate: isPrivate
        };
        // console.log('newGroup',newGroup)
        // console.log('NEW_GROUP', newGroup)
        await dispatch(updateGroupThunk(newGroup));

        reset();
        // console.log(groups)
        // const groupId = groups[groups.length].id
        // console.log('groupId',groupId)
        navigate(`/groups/${groupId}`) 
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
        <div className="update-group-form-container">
            {/* <title>Start a New Group</title>
        <p>BECOME AN ORGANIZER</p>
        <h1>We&apos;ll walk you through a few steps to build your local community</h1> */}
        <h1 style={{borderBottom: '2px solid #808080', marginBottom: 0, paddingBottom: 2, width: 800}}>Update your group</h1>
        <form className="update-group-form" onSubmit={handleSubmit}>
            <div className="update-form-info-containers">
                <h2>Set your group&apos;s location</h2>
                <p>Meetup groups meet locally, in person and online. We&apos;ll connect you with people
                    in your area.</p>
                    <div className="input-and-validation">
                <input
                    type="text"
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    placeholder={combined ? combined: null} 
                    name="location"
                />
                {hasSubmitted && validations.location && `*${validations.location}`}
                    </div>
            </div>
                {/* Validation err's go here */}
            <div className="update-form-info-containers">
                <h2>What will your group&apos;s name be?</h2>
                <p>Choose a name that will give people a clear idea of what the group is about. </p>
                <p>Feel free to get creative! You can edit this later if you change your mind</p>
                <div className="input-and-validation">
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder={group ? group.name : null}
                    name="name"
                />
            {hasSubmitted && validations.name && `*${validations.name}`}
                </div>
            </div>
            <div className="update-form-info-containers">
                <h2>Describe the purpose of your group</h2>
                <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
                <ol>
                    <li>What&apos;s the purpose of the group? </li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <div className="input-and-validation">
                <textarea
                    // type="textarea"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder={group ? group.about: null}
                    name="description"
                    style={{width: '400px', height: '150px'}}
                />
            {hasSubmitted && validations.description && `*${validations.description}`}
                </div>
            </div>
            <div className="update-form-info-containers">
                <h2>Final steps...</h2>
                <p>Is this an in person or online group?</p>
                <div className="input-and-validation-select">
                <select onChange={(e) => setType(e.target.value)}>
                    <option defaultValue="" selected disabled hidden>{group ? group.type : null}</option>
                    <option value={'Online'} >Online</option>
                    <option value={'In person'} >In-Person</option>
                </select>
                {hasSubmitted && validations.type && `*${validations.type}`}
                </div>
                <p>Is this group private or public?</p>
                <div className="input-and-validation-select">
                <select onChange={(e) => setPrivate(e.target.value)}>
                    <option defaultValue="" selected disabled hidden>{privacy}</option>
                    <option value={true} >Private</option>
                    <option value={false} >Public</option>
                </select>
                {hasSubmitted && validations.isPrivate && `*${validations.isPrivate}`}
                </div>
                {/* <p>Please add an image url for your group below:</p>
                <input placeholder={group ? group.previewImage: null}/>  */}
            </div>
            <button style={{marginTop: 10}} type="submit">Update group</button>
        </form>
        </div>
    )
}