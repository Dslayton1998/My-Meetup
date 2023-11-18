// TYPES
const LOAD_GROUPS = 'groups/LOAD_GROUPS'


// ACTIONS
export const loadGroupsAction = ( groups ) => {
    return {
        type: LOAD_GROUPS,
        groups
    }
}


// THUNKS
export const fetchGroupsThunk = () => async (dispatch) => {
    const res = await fetch('/api/groups');
    const groups = await res.json();
    dispatch(loadGroupsAction(groups));
}


// REDUCER
const initial = { Groups: {} };
const groupsReducer = (state = initial, action) => {
    switch (action.type) {
        
        case LOAD_GROUPS: {
            const newState = { ...state, Groups: [...action.groups.Groups] };
            return newState
        }


        default:
            return state
    }
}

export default groupsReducer;