"use client"

import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("./map-component"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl" />
})

interface ClientMapProps {
    lat: number
    lng: number
    popupText?: string
}

export function ClientMap(props: ClientMapProps) {
    return <MapComponent {...props} />
}
