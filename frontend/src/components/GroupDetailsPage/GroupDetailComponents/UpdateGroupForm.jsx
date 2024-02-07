import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { updateGroupThunk, getAllGroupsThunk } from "../../../store/groups";
import { useNavigate, useParams } from "react-router-dom";
import '../GroupDetails.css'


export default function UpdateGroupForm( props ) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams();
    const groups = useSelector(state => Object.values(state.Groups))
    
    let group;
    if(groups) {
        group =  groups.find(group => group.id == groupId)
    };

    let combined;
    if(group) {
      combined = group.city + ', ' + group.state
    };

    const [name, setName] = useState(group ? group.name : '');
    const [location, setLocation] = useState(group ? combined : '');
    const [description, setDescription] = useState(group ? group.about : '');
    const [type, setType] = useState(group ? group.type : '')          
    const [isPrivate, setPrivate] = useState(group ? group.isPrivate : '');     
    const [validations, setValidations] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false)


    useEffect(() => {
        const getGroups = async () => {
            const groups = await dispatch(getAllGroupsThunk());
            console.log(groups)
            const allGroups = Object.values(groups)
            let group;
            let combined;
            if(allGroups) {
                group =  allGroups.find(group => group.id == groupId)
            };

            if(group) {
              combined = group.city + ', ' + group.state
            };
            
            if(group) {
                setName(group.name)
                setLocation(combined)
                setDescription(group.about)
                setType(group.type)
                setPrivate(group.isPrivate)
            }
        }
        getGroups();
    }, [dispatch, groupId])

    useEffect(() => {
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

        if(description.length < 50) {
            validations.description = 'Description must be at least 50 characters long'
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
        await dispatch(updateGroupThunk(newGroup));

        reset();
        navigate(`/groups/${groupId}`) 
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


      let privacy;
      if(!isPrivate) {
        privacy = 'Public'
      } else {
        privacy = 'Private'
      }

    return (
        <div className="update-group-form-container">
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
                    <option defaultValue={isPrivate} selected disabled hidden>{privacy}</option>
                    <option value={true} >Private</option>
                    <option value={false} >Public</option>
                </select>
                {hasSubmitted && validations.isPrivate && `*${validations.isPrivate}`}
                </div>
            </div>
            <button style={{marginTop: 10}} type="submit">Update group</button>
        </form>
        </div>
    )
}