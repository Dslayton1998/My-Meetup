import { useState, useEffect } from "react"
import { useDispatch } from "react-redux";
import { createGroupThunk, getAllGroupsThunk } from "../../store/groups";
import { useNavigate } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
import './CreateGroup.css'


export default function CreateGroupForm() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');          
    const [isPrivate, setPrivate] = useState('');    
    const [ url, setUrl ] = useState(''); 
    const [validations, setValidations] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllGroupsThunk())
        const urlArr = url.split('.')
        const validSuffix = ['jpg', 'png', 'jpeg']
        const suffix = urlArr[urlArr.length - 1]
        const validations = {};

        if(!location) {
            validations.location = 'Location is required'
        }

        if(location && !location.includes(',')) {
            validations.location = 'Location values must be separated by a comma.'
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

        if(!validSuffix.includes(suffix)) {
            validations.url = 'Image URL must end in .png, .jpg, .jpeg'
        }  

        setValidations(validations)

    }, [ dispatch, name, description, location, type, isPrivate, url ])

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true)
        const locationArr = location.split(', ')


        const img = {
            url,
            preview: true
        }

        const newGroup = {
            name,
            city: locationArr[0],
            state: locationArr[1],
            about: description,
            type,
            isPrivate
        };

        const newGroupData = await dispatch(createGroupThunk(newGroup));
        const newGroupId = newGroupData.id
        await csrfFetch(`/api/groups/${newGroupId}/images`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(img)
        })
        reset();
        navigate(`/groups/${newGroupId}`) 
    }
    
    const reset = () => {
        setName('');
        setLocation('');
        setDescription('');
        setType('');
        setPrivate('');
        setUrl('');
        setHasSubmitted(false);
        setValidations({});
      };



    return (
        <div className="create-group-form-container">
        <h1 style={{borderBottom: '2px solid #808080', marginBottom: 0, paddingBottom: 2, width: 1000}}>Start a New Group</h1>
        <form className="create-group-form" onSubmit={handleSubmit}>
            <div className="form-info-containers">
                <h2>Set your group&apos;s location</h2>
                <p>Meetup groups meet locally, in person and online. We&apos;ll connect you with people
                    in your area.</p>
                    <div className="input-and-validation">
                <input
                    type="text"
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    placeholder="City, STATE"
                    name="location"
                />
                {hasSubmitted && validations.location && `*${validations.location}`}
                    </div>
            </div>

            <div className="form-info-containers">
                <h2>What will your group&apos;s name be?</h2>
                <p>Choose a name that will give people a clear idea of what the group is about. </p>
                <p>Feel free to get creative! You can edit this later if you change your mind</p>
                <div className="input-and-validation">
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="What is your group name?"
                    name="name"
                />
            {hasSubmitted && validations.name && `*${validations.name}`}
                </div>
            </div>
            <div className="form-info-containers">
                <h2>Describe the purpose of your group</h2>
                <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
                <ol>
                    <li>What&apos;s the purpose of the group? </li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <div className="input-and-validation">
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Please write at least 30 characters"
                    name="description"
                    style={{width: '400px', height: '150px'}} 
                    />
                    {hasSubmitted && validations.description && `*${validations.description}`}
                </div>
            </div>
            <div className="form-info-containers">
                <h2>Final steps...</h2>
                <p>Is this an in person or online group?</p>
                <div className="input-and-validation-select">
                <select onChange={(e) => setType(e.target.value)}>
                    <option defaultValue="" selected disabled hidden>(select one)</option>
                    <option value={'Online'} >Online</option>
                    <option value={'In person'} >In-Person</option>
                </select>
                {hasSubmitted && validations.type && `*${validations.type}`}
                </div>
                <p>Is this group private or public?</p>
                <div className="input-and-validation-select">
                <select onChange={(e) => setPrivate(e.target.value)}>
                    <option value="" selected disabled hidden>(select one)</option>
                    <option value={true} >Private</option>
                    <option value={false} >Public</option>
                </select>
                {hasSubmitted && validations.isPrivate && `*${validations.isPrivate}`}
                </div>
                <p>Please add an image url for your group below:</p>
                <div className="input-and-validation">
                <input onChange={(e) => setUrl(e.target.value)} value={url} placeholder="Image Url"/> 
                {hasSubmitted && validations.url && `*${validations.url}`}
                </div>
            </div>
            <button type="submit" style={{marginTop: 10}}>Create group</button>
        </form>
        </div>
    )
}