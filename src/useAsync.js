import { useReducer, useEffect, useCallback } from 'react';

// LOADING, SUCCESS, ERROR
function reducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return {
                loading: true,
                data: null,
                error: null,
            };
        case 'SUCCESS':
            return {
                loading: false,
                data: action.data,
                error: null,
            };
        case 'ERROR':
            return {
                loading: false,
                data: null,
                error: action.error,
            };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// callback -> api를 호출하는 함수 / deps -> useEffect
export default function useAsync(callback, deps = [], skip = false) {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        data: null,
        error: null,
    });

    const fetchData = useCallback(async () => {
        dispatch({ type: 'LOADING' });
        try {
            const data = await callback();
            dispatch({ type: 'SUCCESS', data });
        } catch (error) {
            dispatch({ type: 'ERROR', error: error });
        }
    }, [callback]);
    useEffect(() => {
        if (skip) {
            return;
        }
        fetchData();
        // eslint-disable-next-line
    }, deps);
    return [state, fetchData];
}
