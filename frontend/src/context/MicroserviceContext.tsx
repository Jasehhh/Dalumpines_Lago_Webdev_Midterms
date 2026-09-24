'use client';

import { createContext, useContext, useEffect, useReducer, useState, ReactNode, Dispatch } from 'react';
import { State, Action } from '@/types';


const initialState: State = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    services: [],
    selectedEnvironment: 'ALL',
    loading: false,
    error: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_AUTH':
      localStorage.setItem("token", action.payload.token);
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'LOGOUT':
        localStorage.removeItem("token");
        return {...state, user: null, token: null, services: []}
    case 'SET_ENV_FILTER':
        return {...state, selectedEnvironment: action.payload}
    case 'FETCH_SERVICES_SUCCESS':
        return {...state, services: action.payload, loading: false};
    case 'CREATE_SERVICE_SUCCESS':
        return {...state, services: [action.payload, ...state.services], loading: false};
    case 'UPDATE_SERVICE_SUCCESS':
        return {...state, services: state.services.map((i) => (i.id === action.payload.id ? action.payload : i)),
            loading: false,
        };
    case 'DELETE_SERVICE_SUCCESS':
        return {...state,
        services: state.services.filter((i) => i.id !== action.payload),
        loading: false,}
    case 'SET_ERROR':
        return {...state, error: action.payload, loading: false};
    default:
      return state;
  }
}

export const MicroserviceContext = createContext<{state: State; dispatch: Dispatch<Action>} | null>(null);

export function ServiceProvider({ children }: {children: ReactNode}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [ready, setReady] = useState(false);

    useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({ type: 'SET_AUTH', payload: { user: JSON.parse(user), token } });
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return <MicroserviceContext.Provider value={{ state, dispatch }}>{children}</MicroserviceContext.Provider>;
}

export function useServices() {
    const context = useContext(MicroserviceContext);
    if (!context) throw new Error('useServices must be used inside IncidentProvider');
    return context;
}