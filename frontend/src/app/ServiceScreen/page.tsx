"use client";
import { API_BASE } from "@/api/authService";
import CreateServiceModal from "@/components/CreateServiceModal";
import ServiceCard from "@/components/ServiceCard";
import { ServiceProvider, useServices } from "@/context/MicroserviceContext";
import { FormEvent, useEffect, useState } from "react";

function ServiceScreen() {
    const {state, dispatch} = useServices()
    const [openCreate, setOpenCreate] = useState(false)
    const [error, setError] = useState("")
    const [create, setCreate] = useState(false)

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch(`${API_BASE}/services`, {headers: {
                    Authorization: `Bearer ${state.token}`
                }})
                if (!res) {
                    dispatch({type: 'SET_ERROR', payload: res})
                }
                const data = await res.json()
                dispatch({type: 'FETCH_SERVICES_SUCCESS', payload: data})
            } catch (err) {
                dispatch({type: 'SET_ERROR', payload: (err as Error).message})
            }
        fetchServices()
    }})

    

    return (
        <div className="bg-blue-400">
        {create && (
            <CreateServiceModal isOpen={() => setCreate(false)} />
        )}
        <button onClick={() => dispatch({type: 'LOGOUT'})} className="bg-gray-400 rounded-full p-5">Logout</button>
        <button onClick={() => setCreate(true)} >Create Services</button>
        {...state.services.map((items) => (
            <ServiceCard service={items} />
        ))}
        </div>
    )
}

export default function ServicePage() {
    return (
        <ServiceProvider>
        <ServiceScreen />
        </ServiceProvider>
    )
}