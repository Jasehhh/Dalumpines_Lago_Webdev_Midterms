import { useServices } from "@/context/MicroserviceContext"
import { Microservice } from "@/types"
import { useState } from "react"
import CreateServiceModal from "./CreateServiceModal"
export default function ServiceDetail({service, isOpen}: {service: Microservice, isOpen: () => void}) {
    const {dispatch} = useServices()
    return (
        <>
        <section className="h-lg w-xl border border-red-500 p-3">
            <p onClick={() => dispatch({type: 'DELETE_SERVICE_SUCCESS', payload: service.id})}>Trash</p>
            <div onClick={() => isOpen()} className="flex items-end text-2xl">X</div>
            <div className="flex flex-col gap-2 text-black text-lg">
                <p className="text-2xl font-bold">{service.name}</p>
                {service.endpointUrl}
                {service.environment}
                {service.status}
                {service.version}
                {service.ownerEmail}
                {service.createdAt}
            </div>
        </section>

        
        </>
    )
}