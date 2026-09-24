"use client";
import type { Microservice } from "@/types"
import { useState } from "react"
import ServiceDetail from "./ServiceDetail"
export default function ServiceCard({service}: {service: Microservice}) {
    const [modal, setModal] = useState(false)
    return (
        <>
        <div key={service.id} onClick={() => setModal(true)} className="flex w-full h-lg p-2 bg-green-200 border border-green-400 hover:bg-green-400">
            <div className="flex flex-col gap-2">
                <p className="font-bold text-black text-xl">{service.name}</p>
                <div className="flex gap-1 text-black">
                    {service.status} - {service.environment} - {service.version}
                </div>
            </div>
        </div>
        
        {modal && (
            <ServiceDetail service={service} isOpen={() => setModal(modal)}/>
        )}
        </>
    )
}