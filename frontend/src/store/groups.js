import { csrfFetch } from './csrf';

// TYPES
const READ_GROUPS = 'groups/LOAD_GROUPS'
const CREATE_GROUP = 'groups/CREATE_GROUP'
const UPDATE_GROUP = 'groups/UPDATE_GROUP'
const DELETE_GROUP = 'groups/DELETE_GROUP'


// ACTIONS
// todo: Full CRUD   READ - CREATE - UPDATE - DELETE 
export const readGroupsAction = ( groups ) => {
    return {
        type: READ_GROUPS,
        groups
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

export const deleteGroupAction = ( group ) => {
    return {
        type: DELETE_GROUP,
        group
    }
}


// todo: THUNKS!!!!--------------------------------------------------------------

export const getAllGroupsThunk = () => async (dispatch) => {
    const res = await fetch('/api/groups');
    // console.log('HEEEEEEEEY',res)
    
    if(res.ok) {
        const groups = await res.json();
        dispatch(readGroupsAction(groups));
    } else {
        // console.log(res, "Hello")
    }
}

export const createGroupThunk = ( groupData ) => async (dispatch) => {
    const res = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(groupData)
    })

    if(res.ok) {
        const data = await res.json();
        dispatch(createGroupAction(data))
        return data
    } else {
// todo: handle errors
        console.log('err here', res)
        const err = await res.json()
        console.log(err)
    }
}


// export const getDetailsThunk = ( payload ) => async (dispatch) => {
//     const res = await fetch(`api/groups/:groupId`)
//     console.log(payload)
//     console.log('oi', res)
//     if(res.ok) {
//         const groups = await res.json();
//         console.log(groups, 'made it')
//         dispatch(readGroupsAction(groups));
//         return groups
//     }
// }





// todo: REDUCER!!!!--------------------------------------------------------------------
const initial = { Groups: {} };
const groupsReducer = (state = initial, action) => {
    switch (action.type) {
        
        case READ_GROUPS: {
            // console.log(state)
            // console.log('HERE',action)
            const newState = { ...state, Groups: [...action.groups.Groups] };
            console.log(newState)
            return newState
        }

        case CREATE_GROUP: {
            // console.log('state', state)
            // console.log('action', action)
            return null;
        }

        // case UPDATE_GROUP: {
        //     return null;
        // }

        // case DELETE_GROUP: {
        //     return null;
        // }


        default:
            return state
    }
}

export default groupsReducer;