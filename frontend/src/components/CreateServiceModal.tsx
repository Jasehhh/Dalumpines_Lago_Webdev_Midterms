import { API_BASE } from "@/api/authService";
import { ServiceProvider, useServices } from "@/context/MicroserviceContext";
import { Environment, ServiceStatus } from "@/types";
import { FormEvent, useState } from "react";

function ServiceForm() {
    const {state, dispatch} = useServices()
    const [name, setName] = useState("")
    const [endpointUrl, setEndpointUrl] = useState("")
    const [environment, setEnvironment] = useState<Environment>("HEALTHY")
    const [status, setStatus] = useState<ServiceStatus>("HEALTHY")
    const [version, setVersion]= useState("")

    const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
    
            const res = await fetch(`${API_BASE}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                Authorization: `Bearer ${state.token}`
             },
            body: JSON.stringify({ name, endpointUrl, environment, status, version}),
            });
            const data = await res.json();
    
            if (!res.ok) {
            dispatch({ type: 'SET_ERROR', payload: data.errors?.[0] || data.message });
            return;
            }
        }

        return (
            <section className="h-lg w-xl border border-red-500 p-3">
            <div className="flex items-end text-2xl">X</div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 text-black text-lg">
                    <label>Name <input value={name} onChange={(e) => setName(e.target.value)} /></label>
                    <label>Endpoint Url <input value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} /></label>
                    <label>Environment 
                        <select value={environment} onChange={(e) => setEnvironment(e.target.value as Environment)}>
                            <option value={"HEALTHY"}>Healthy</option>
                            <option value={"STAGING"}>Staging</option>
                            <option value={"PRODUCTION"}>Prodution</option>
                        </select>
                    </label>
                    <label>Status 
                        <select value={status} onChange={(e) => setStatus(e.target.value as ServiceStatus)}>
                            <option value={"HEALTHY"}>Healthy</option>
                            <option value={"DEGRADED"}>Degraded</option>
                            <option value={"DOWN"}>Down</option>
                        </select>
                    </label>
                    <label>Version <input value={version} onChange={(e) => setVersion(e.target.value)} /></label>
                </div>
                <button type="submit">Submit</button>
            </form>
        </section>
        )
}

export default function CreateServiceModal({isOpen}: {isOpen: () => void}) {
    return (
        <ServiceProvider>
            <ServiceForm />
        </ServiceProvider>
    )
}