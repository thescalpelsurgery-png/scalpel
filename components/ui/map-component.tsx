
"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"

// Fix for default marker icon not showing
// See: https://github.com/PaulLeCam/react-leaflet/issues/453
const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconRetinaUrl: "/images/marker-icon-2x.png",
    shadowUrl: "/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
})

// We need to override the default Leaflet icon paths
// But since we can't easily rely on node_modules assets being served, we might use CDNs or just simple colored divs if this fails.
// For now, let's try using a standard CDN icon as a fallback if local ones don't load,
// or actually, let's just make a custom div icon or use the CDN directly to be safe.

const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    lat: number
    lng: number
    popupText?: string
}

export default function MapComponent({ lat, lng, popupText }: MapComponentProps) {

    // Center map on the provided coordinates
    const position: [number, number] = [lat, lng]

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 z-0 relative">
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        {popupText || "Event Location"}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
