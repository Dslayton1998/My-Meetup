import { csrfFetch } from './csrf';

// TYPES
//todo: edit types and actions
const READ_ALL_GROUPS = 'groups/LOAD_GROUPS'
const READ_GROUP_ID = 'groups/READ_GROUP_ID'
const CREATE_GROUP = 'groups/CREATE_GROUP'
const UPDATE_GROUP = 'groups/UPDATE_GROUP'
const DELETE_GROUP = 'groups/DELETE_GROUP'


// ACTIONS
// todo: Full CRUD   READ - CREATE - UPDATE - DELETE 
export const readAllGroupsAction = ( groups ) => {
    return {
        type: READ_ALL_GROUPS,
        groups
    }
}

export const readGroupByIdAction = ( group ) => {
    return {
        type: READ_GROUP_ID,
        group
    }
}

export const createGroupAction = ( group ) => {
    return {
        type: CREATE_GROUP,
        group
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

export const getAllGroupsThunk = () => async (dispatch) => {
    const res = await fetch('/api/groups');
    // console.log('HEEEEEEEEY',res)
    
    if(res.ok) {
        const groups = await res.json();
        dispatch(readAllGroupsAction(groups));
    } else {
        // console.log(res, "Hello")
    }
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const getGroupByIdThunk = ( groupId ) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`)

    if(res.ok) {
        const data = await res.json();
        dispatch(readGroupByIdAction(data))
    }
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


export const createGroupThunk = ( groupData ) => async (dispatch) => {
//    try {
       const res = await csrfFetch('/api/groups', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json'},
           body: JSON.stringify(groupData)
       })

       if(res.ok) {
        const data = await res.json();
        dispatch(createGroupAction(data))
        return data
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
const initial = { Groups: {} }; // todo: see if this makes things look funky
const groupsReducer = (state = initial, action) => {
    switch (action.type) {
        
        case READ_ALL_GROUPS: {
            // console.log('state!',state)
            // console.log('action!',action.groups)
            const newState = { ...action.groups.Groups };
            // console.log('newState',newState)
            return newState
        }

        case READ_GROUP_ID: {
            // console.log('state!',state)
            // console.log('action!',action.group)
            const newState = { ...state, CurrentGroupDetails:{...action.group} };
            // console.log('newState',newState)
            return newState
        }

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