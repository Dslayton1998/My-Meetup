import { csrfFetch } from './csrf';

// TYPES
//todo: edit types and actions
const READ_ALL_GROUPS = 'groups/READ_ALL_GROUPS'
// const EVENTS_GROUP_ID = 'groups/EVENTS_GROUP_ID'
const READ_GROUP_ID = 'groups/READ_GROUP_ID'
const CREATE_GROUP = 'groups/CREATE_GROUP'
const UPDATE_GROUP = 'groups/UPDATE_GROUP'
const DELETE_GROUP = 'groups/DELETE_GROUP'


// ACTIONS
// todo: Full CRUD   READ - CREATE - UPDATE - DELETE 
export const readAllGroupsAction = ( group ) => {
    return {
        type: READ_ALL_GROUPS,
        group
    }
}

export const readGroupByIdAction = ( group, events, groupDetails ) => {
    return {
        type: READ_GROUP_ID,
        group,
        events,
        groupDetails
    }
}

// export const readEventsByGroupIdAction = ( events ) => {
//     return {
//         type: EVENTS_GROUP_ID,
//         events
//     }
// }

export const createGroupAction = ( group, img ) => {
    return {
        type: CREATE_GROUP,
        group,
        img
    }
}

export const updateGroupAction = ( group ) => {
    return {
        type: UPDATE_GROUP,
        group
    }
}

export const deleteGroupAction = ( response ) => {
    return {
        type: DELETE_GROUP,
        response
    }
}


// todo: THUNKS!!!!--------------------------------------------------------------

export const getAllGroupsThunk = () => async (dispatch, getState) => {
    const state = getState().Groups
    if(Object.keys(state).length === 0) {
        const res = await fetch('/api/groups');
        const groups = await res.json();
        dispatch(readAllGroupsAction(groups));
        return groups
    }
    return state
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const getGroupByIdThunk = ( groupId ) => async (dispatch, getState) => {
    const state = getState().Groups
    if(Object.keys(state).length === 0) {
        const res = await fetch(`/api/groups`)
        const groups = await res.json();
        await dispatch(readAllGroupsAction(groups))
    }

    const groupRes = await csrfFetch(`/api/groups/${groupId}`)
    const groupDetails = await groupRes.json();
    const eventRes = await fetch(`/api/groups/${groupId}/events`)
    const eventDetails = await eventRes.json();
    let group = state[groupId] || groupDetails;
    dispatch(readGroupByIdAction(group, eventDetails, groupDetails))
}



// export const getEventByGroupIdThunk = ( groupId ) => async (dispatch, getState) => {
//     const state = getState().Groups
//     // if(Object.keys(state).length === 0) {
//         const res = await fetch(`/api/groups/${groupId}/events`)
//         const data = await res.json()
//         await dispatch(readEventsByGroupIdAction(data))
//     // }

//  }
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


export const createGroupThunk = ( groupData, imgData ) => async (dispatch) => {
//    try {
    // console.log('groupData:',groupData)
       const groupRes = await csrfFetch('/api/groups', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json'},
           body: JSON.stringify(groupData)
       })

       
       if(groupRes.ok) {
           const group = await groupRes.json();
        //    const groupId  = group.id
        //    const imgRes = await csrfFetch(`/api/groups/${groupId}`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json'},
        //     body: JSON.stringify(imgData)
        //    })
        //    const img = await imgRes.json()
        dispatch(createGroupAction(group))
        return group
    } 
//    } catch (err) {
//        // todo: handle errors
//             //    console.log('err here', err)
//                const error = await err.json()
//                console.log('err here', error)
//    }

}


export const deleteGroupThunk = ( group ) => async (dispatch) => {
    // console.log(group)
    const res = await csrfFetch(`/api/groups/${group.id}`, { method: 'DELETE'} )
    
    if(res.ok) {
        const data = await res.json();
        // console.log('here', data)
        dispatch(deleteGroupAction(data))
    } else {
        const err = await res.json()
        // console.log(err)
    }
}


export const updateGroupThunk = ( updates ) => async (dispatch) => {
    console.log('updatedData',updates)
    // try {
        const res = await csrfFetch(`/api/groups/${updates.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(updates)
        })
        if(res.ok) {
            const data = await res.json();
            console.log('res',data)
            dispatch(updateGroupAction(data))
        }
    // } catch(err) {
    //     const errors = await err.json()
    //     console.log('err',errors)

    // }
}





// todo: REDUCER!!!!--------------------------------------------------------------------
const initial = { }; // todo: see if this makes things look funky
const groupsReducer = (state = initial, action) => {
    switch (action.type) {
        
        case READ_ALL_GROUPS: {
            // console.log('state!',state)
            console.log('action!',action.group.Groups)
            const normalized = {};
            Object.values(action.group.Groups).forEach(group => {
                normalized[group.id] = group;
            })
            const newState = { ...state, ...normalized };
            // console.log('newState',newState)
            return newState
        }

        case READ_GROUP_ID: {
            // console.log('state!',state)
            // console.log('action!',action.groupDetails)
            const group = action.group
            const events = action.events;
            const details = action.groupDetails
            const GroupImages = details.GroupImages
            const Organizer = details.Organizer
            const Venues = details.Venues
            const newState = { ...state, [group.id]: {...state[group.id], ...group, ...events, GroupImages, Organizer, Venues} };
            // console.log('newState',newState)
            return newState
        }


        // case EVENTS_GROUP_ID: {
        //     // console.log('state!',state)
        //     // console.log('action!',action.events.Events)
        //     // const event = action.events.Events
        //     // const test = Object.entries(event[0])
        //     // const test2 = Object.values(test)
        //     // const data = test.forEach(test => {
        //     //     console.log(test)
        //     //     const key = test[0]
        //     //     const value = test[1]
        //     //     const newObj = {[key]: value}
        //     //     console.log(newObj)
        //     // })
        //     // console.log(data)
        //     // const eventDetails = event
        //     // console.log(event)
        //     // console.log( test)
        //     // console.log('test2', test2)
            
        //     const newState = {...state, ...action.events.Events[0]}
        //     console.log(newState)
        //     return newState
        // }




        case CREATE_GROUP: {
            // console.log('state', state)
            // console.log('action', action)
            const newState = { ...state, ...action.group.Groups };
            // console.log('newState', newState)
            
            return newState
        }

        case UPDATE_GROUP: {
            return state
        }

        case DELETE_GROUP: {
            // console.log('hello from reducer')
            // console.log('state', state)
            // console.log('action',action)
            console.log('hello from reducer')
            const newState = { ...state };
            // console.log(newState)
            return newState
        }


        default:
            return state
    }
}

export default groupsReducer;