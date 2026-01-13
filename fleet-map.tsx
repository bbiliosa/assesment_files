"use client"

import { useRef, useState, useEffect, useMemo, useCallback } from "react"
import type { VehicleGroupFilters } from "./vehicle-group-filter"
import VehicleGroupFilter from "@/components/vehicle-group-filter" // Added import for VehicleGroupFilter
import type { ReactElement } from "react"

const vehicleMarkers = [
  {
    id: "W71-55",
    position: [12.138507, -68.874308] as [number, number],
    speed: 70,
    status: "MOVING",
    driver: "Kevin Maduro",
    location: "Emmastad",
    heading: 0,
    address: "Kaya Nanzi Koko",
    neighbourhood: "Seru di Mahuma",
    lastUpdate: new Date("2026-01-08T14:23:00"),
    model: "Toyota Hiace",
  },
  {
    id: "D45-44",
    position: [12.138607, -68.874408] as [number, number],
    speed: 65,
    status: "MOVING",
    driver: "Maria Santos",
    location: "Emmastad",
    heading: 45,
    address: "Kaya Diamanta",
    neighbourhood: "Emmastad",
    lastUpdate: new Date("2026-01-08T14:22:45"),
    model: "Rolstoel Caddy",
  },
  {
    id: "D45-33",
    position: [12.105, -68.93] as [number, number],
    speed: 35,
    status: "MOVING",
    driver: "John Peterson",
    location: "Otrobanda",
    heading: 90,
    address: "Kaya Grandi",
    neighbourhood: "Punda",
    lastUpdate: new Date("2026-01-08T13:30:00"),
    model: "Toyota Corolla",
  },
  {
    id: "E23-86",
    position: [12.125, -68.895] as [number, number],
    speed: 72,
    status: "MOVING",
    driver: "Sarah Williams",
    location: "Saliña",
    heading: 180,
    address: "Schottegatweg West",
    neighbourhood: "Saliña",
    lastUpdate: new Date("2026-01-08T14:15:30"),
    model: "Nissan Patrol",
  },
  {
    id: "K48-24",
    position: [12.115, -68.85] as [number, number],
    speed: 85,
    status: "OVERSPEED",
    driver: "Kevin Maduro",
    location: "Willemstad",
    heading: 53,
    address: "Schottegatweg Oost",
    neighbourhood: "Willemstad",
    lastUpdate: new Date("2026-01-08T14:24:10"),
    model: "Mercedes Sprinter",
  },
  {
    id: "H18-80",
    position: [12.074461, -68.873196] as [number, number],
    speed: 0,
    status: "PARKED",
    driver: "Kevin Maduro",
    location: "Emmastad",
    heading: 270,
    address: "Kaya Agatha",
    neighbourhood: "Emmastad",
    lastUpdate: new Date("2026-01-08T13:45:00"),
    model: "Rolstoel Caddy",
  },
  {
    id: "H18-95",
    position: [12.117226, -68.886307] as [number, number],
    speed: 0,
    status: "PARKED",
    driver: "Kevin Maduro",
    location: "Willemstad",
    heading: 0,
    address: "Kaya Grandi",
    neighbourhood: "Punda",
    lastUpdate: new Date("2026-01-08T13:30:00"),
    model: "Rolstoel Caddy",
  },
  {
    id: "G62-07",
    position: [12.19, -69.0] as [number, number],
    speed: 92,
    status: "OVERSPEED",
    driver: "Kevin Maduro",
    location: "Willemstad",
    heading: 45,
    address: "Weg naar Westpunt",
    neighbourhood: "Groot Santa Martha",
    lastUpdate: new Date("2026-01-08T14:25:00"),
    model: "Panel Van",
  },
  {
    id: "T15-22",
    position: [12.079606, -68.812327] as [number, number],
    speed: 0,
    status: "PARKED",
    driver: "Kevin Maduro",
    location: "Seru Grandi",
    heading: 45,
    address: "Kaya Seru Grandi",
    neighbourhood: "Seru Grandi",
    lastUpdate: new Date("2026-01-08T12:15:00"),
    model: "Iveco Daily",
  },
  {
    id: "C11-58",
    position: [12.165, -68.96] as [number, number],
    speed: 0,
    status: "PARKED",
    driver: "Kevin Maduro",
    location: "Emmastad",
    heading: 135,
    address: "Kaya Anjer",
    neighbourhood: "Brievengat",
    lastUpdate: new Date("2026-01-08T11:50:00"),
    model: "Toyota Hiace",
  },
  {
    id: "D93-64",
    position: [12.1024, -68.8324] as [number, number],
    speed: 45,
    status: "MOVING",
    driver: "Kevin Maduro",
    location: "Willemstad",
    heading: 225,
    address: "Kaya Flamboyan",
    neighbourhood: "Otrobanda",
    lastUpdate: new Date("2026-01-08T14:20:30"),
    model: "Mercedes Sprinter",
  },
  {
    id: "K68-68",
    position: [12.0924, -68.8624] as [number, number],
    speed: 0,
    status: "PARKED",
    driver: "Kevin Maduro",
    location: "Emmastad",
    heading: 315,
    address: "Kaya Senekal",
    neighbourhood: "Emmastad Centro",
    lastUpdate: new Date("2026-01-08T10:30:00"),
    model: "Panel Van",
  },
]

const dismissedAlarms = new Set<string>()
const dismissedOutside = new Set<string>()

function createVehicleIcon(speed: number, heading: number, vehicleId: string, status: string) {
  if (typeof window === "undefined" || !(window as any).L) return null

  const L = (window as any).L

  let color = "#666f88" // Default/Parked color (unchanged - works well)
  let labelBg = "#047857" // Emerald-700 for much deeper, richer green
  let labelText = "#f0fdf4" // Light green text
  let labelBorder = "" // No border by default (for colored moving vehicles)

  if (status === "ALARM" || status === "GENERATOR") {
    color = "#d1d5db" // Changed from #ffffff to light gray for better map visibility
    labelBg = "rgba(243, 244, 246, 1.00)" // Light gray at 100% opacity
    labelText = "#3d4150"
    labelBorder = "border: 1px solid rgba(0, 0, 0, 0.25);" // Add border for white/gray markers
  } else if (speed === 0) {
    color = "#666f88"
    labelBg = "rgba(251, 251, 255, 1.00)" // Very light gray at 100% opacity
    labelText = "#3d4150" // Darker gray text
    labelBorder = "border: 1px solid rgba(0, 0, 0, 0.25);" // Add border for white/gray markers
  } else if (speed >= 10 && speed < 60) {
    color = "#047857" // Updated arrow color to match darker emerald-700 green
    labelBg = "#047857" // Emerald-700 background
    labelText = "#f0fdf4" // Light green text
  } else if (speed >= 60 && speed < 80) {
    color = "#e19507" // Very slightly darker amber for better visibility
    labelBg = "#e19507"
    labelText = "#ffffff" // White text
  } else if (speed >= 80) {
    color = "#ef4444"
    labelBg = "#ef4444" // Red-500 background
    labelText = "#fef2f2" // Light red text
  }

  const iconSize = status === "ALARM" || status === "GENERATOR" ? 53 : 26
  const containerWidth = 95
  const containerHeight = status === "ALARM" || status === "GENERATOR" ? 114 : 92
  const labelOffset = status === "ALARM" || status === "GENERATOR" ? 2 : 1

  const showAlarm = vehicleId === "SOS-01" && !dismissedAlarms.has(vehicleId)
  const showOutside = vehicleId === "D93-64" && !dismissedOutside.has(vehicleId)

  const sosIcon =
    status === "ALARM"
      ? `
    <div style="
      width: ${iconSize}px;
      height: ${iconSize}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    ">
      <img src="/images/sosicon.png" alt="SOS" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  `
      : status === "GENERATOR"
        ? `
    <div style="
      width: ${iconSize}px;
      height: ${iconSize}px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    ">
      <img src="/images/generator.png" alt="Generator" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `
        : `
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <!-- Removed shadow filter, restored original arrow with just stroke -->
      <path d="M12 2 L18 12 L13 10 L13 14 L11 14 L11 10 L6 12 Z" fill="${color}" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" strokeLinejoin="round"/>
    </svg>
  `

  const labelPosition = status === "ALARM" || status === "GENERATOR" ? "bottom" : "top"

  // For regular vehicles: label is on top, icon below it
  // For SOS/Generator: icon on top, label below it
  const labelHeight = 20 // Approximate height of label badge
  const iconAnchorY =
    labelPosition === "top"
      ? labelHeight + labelOffset + iconSize / 2 // Label on top: offset by label height + icon center
      : iconSize / 2 // Label on bottom: just icon center from top

  return L.divIcon({
    html: `
      <div class="vehicle-marker-container" style="
        position: relative;
        width: ${containerWidth}px;
        height: ${containerHeight}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.12));
        opacity: 0.95;
        pointer-events: none;
      ">
        ${
          showAlarm
            ? `
        <div style="
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
        ">
          <div class="alarm-balloon-${vehicleId}" style="
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            padding: 20px 24px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
            color: #3d4251;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.3);
            white-space: nowrap;
            letter-spacing: 0.3px;
            animation: redFlash 2s ease-in-out infinite;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          ">
            <div style="font-size: 13px; letter-spacing: 0.5px; font-weight: 700;">HELP</div>

            <button style="
              background: #dc2626;
              color: #ffffff;
              padding: 6px 14px;
              border-radius: 5px;
              font-size: 10px;
              font-weight: 600;
              border: none;
              cursor: pointer;
              letter-spacing: 0.5px;
            ">10 MIN</button>
          </div>
        </div>
        <style>
          @keyframes redFlash {
            0%, 100% {
              box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
            }
            50% {
              box-shadow: 0 4px 16px rgba(220, 38, 38, 0.5), 0 0 20px rgba(220, 38, 38, 0.3);
            }
          }
        </style>
        `
            : ""
        }

        ${
          showOutside
            ? `
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="outside-title-9364"
          style="
            position: absolute;
            top: -125px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1001;
            width: 103px;
            min-height: 75px;
          "
        >
          <div class="outside-balloon-9364" style="
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            padding: 20px 24px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
            color: #3d4251;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.3);
            white-space: nowrap;
            letter-spacing: 0.3px;
            animation: redFlash 2s ease-in-out infinite;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          ">
            <div style="font-size: 13px; letter-spacing: 0.5px; font-weight: 700;">OUTSIDE</div>

            <button style="
              background: #dc2626;
              color: #ffffff;
              padding: 6px 14px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 600;
              border: none;
              cursor: pointer;
              letter-spacing: 0.5px;
            ">10 MIN</button>
          </div>
        </div>
        `
            : ""
        }

        ${
          labelPosition === "top"
            ? `
        <div class="vehicle-label" style="
          background: ${labelBg};
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          color: ${labelText};
          ${labelBorder}
          box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12);
          margin-bottom: ${labelOffset}px;
          white-space: nowrap;
          text-align: center;
          z-index: 500;
          letter-spacing: 0.5px;
          position: relative;
        ">
          ${vehicleId}
        </div>
        `
            : ""
        }

        <div class="vehicle-icon" style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 400;
          transform: rotate(${status === "ALARM" || status === "GENERATOR" ? 0 : heading}deg);
          pointer-events: auto;
        ">
          ${sosIcon}
        </div>

        ${
          labelPosition === "bottom"
            ? `
        <div class="vehicle-label" style="
          background: ${labelBg};
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          color: ${labelText};
          ${labelBorder}
          box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12);
          margin-top: ${labelOffset}px;
          white-space: nowrap;
          text-align: center;
          z-index: 500;
          letter-spacing: 0.5px;
          position: relative;
        ">
          ${status === "ALARM" ? "Bryan Maximo" : status === "GENERATOR" ? "Generator SCP" : vehicleId}
        </div>
        `
            : ""
        }

        ${status === "ALARM" ? `<style>@keyframes sosFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } } .sos-alarm-flash { animation: sosFlash 1.5s ease-in-out infinite; }</style>` : ""}
      </div>
    `,
    className: "custom-vehicle-marker",
    iconSize: [iconSize, iconSize],
    iconAnchor: [containerWidth / 2, iconSize / 2],
    popupAnchor: [0, 0],
  })
}

interface FleetMapProps {
  selectedVehicle: string | null
  onSelectVehicle: (vehicleId: string | null) => void
  isSidebarCollapsed?: boolean
  onToggleSidebar?: (collapsed: boolean) => void
  legendItems?: Array<{ id: string; label: string; color: string }> // Added legendItems prop
  showLegend?: boolean // Added showLegend prop to control legend visibility
  showSosMarkers?: boolean // Added props to control SOS and Generator marker visibility
  showGeneratorMarkers?: boolean
  showVehicleD9364?: boolean // Added prop to control vehicle D93-64 visibility
  showVehicleGroupFilter?: boolean // Added prop to control VehicleGroupFilter visibility
  selectedLocation?: string
  selectedProject?: string
  center?: [number, number]
  zoom?: number
}

function ClusterMarker({
  cluster,
  onSelectVehicle,
}: {
  cluster: {
    id: string
    position: [number, number]
    vehicles: typeof vehicleMarkers
    isCluster: boolean
  }
  onSelectVehicle?: (vehicle: (typeof vehicleMarkers)[0]) => void
}) {
  if (!cluster.isCluster) {
    return (
      <MemoizedMarker key={cluster.vehicles[0].id} vehicle={cluster.vehicles[0]} onSelectVehicle={onSelectVehicle} />
    )
  }

  const count = cluster.vehicles.length
  const clusterIcon = createClusterIcon(count)

  return (
    <window.L.Marker position={cluster.position} icon={clusterIcon}>
      {/* Cluster popup showing all vehicles */}
    </window.L.Marker>
  )
}

const MemoizedMarker = ({ vehicle, onSelectVehicle }: any) => {
  const icon = useMemo(
    () => createVehicleIcon(vehicle.speed, vehicle.heading, vehicle.id, vehicle.status),
    [vehicle.speed, vehicle.heading, vehicle.id, vehicle.status],
  )

  const zIndexOffset = useMemo(() => {
    return Math.round((90 - vehicle.position[0]) * 1000)
  }, [vehicle.position])

  if (!icon) return null

  return (
    <window.L.Marker
      key={vehicle.id}
      position={vehicle.position}
      icon={icon}
      zIndexOffset={zIndexOffset}
      onClick={() => {
        onSelectVehicle(vehicle.id)
      }}
    />
  )
}

export default function FleetMap({
  selectedVehicle,
  onSelectVehicle,
  isSidebarCollapsed = false,
  onToggleSidebar,
  legendItems,
  showLegend = false,
  showSosMarkers = true,
  showGeneratorMarkers = true,
  showVehicleD9364 = true,
  showVehicleGroupFilter = true,
  selectedLocation,
  selectedProject,
  center,
  zoom,
}: FleetMapProps): ReactElement {
  const [mounted, setMounted] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [currentZoom, setCurrentZoom] = useState<number>(12) // Set default zoom to 12 instead of undefined

  const [groupFilters, setGroupFilters] = useState<VehicleGroupFilters>({
    MOVING: true,
    PARKED: true,
    OVERSPEED: true,
    ALARM: true,
    GENERATOR: true,
  })

  const clusteringThresholds = {
    zoom9: 8.0, // ≤9 Country: 8.0 km
    zoom10: 5.0, // Region: 5.0 km
    zoom11: 2.0, // City: 2.0 km
    zoom12: 1.0, // District: 1.0 km
    zoom13: 0.4, // Neighborhood: 400m
    zoom14: 0.4, // Street: 400m
    // Zoom 15+: Clustering disabled
  }

  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  const getClusterThreshold = useCallback(
    (zoomLevel: number) => {
      if (zoomLevel <= 9) return clusteringThresholds.zoom9
      if (zoomLevel === 10) return clusteringThresholds.zoom10
      if (zoomLevel === 11) return clusteringThresholds.zoom11
      if (zoomLevel === 12) return clusteringThresholds.zoom12
      if (zoomLevel === 13) return clusteringThresholds.zoom13
      if (zoomLevel === 14) return clusteringThresholds.zoom14
      return null // Zoom 15+: No clustering
    },
    [clusteringThresholds],
  )

  const clusterVehiclesByProximity = useCallback(
    (vehicles: typeof vehicleMarkers, zoomLevel: number) => {
      if (vehicles.length === 0) return []

      if (zoomLevel >= 15) {
        // Return individual vehicles without clustering
        return vehicles.map((vehicle, index) => ({
          id: vehicle.id,
          position: [...vehicle.position] as [number, number],
          vehicles: [vehicle],
          isCluster: false,
        }))
      }

      const threshold = getClusterThreshold(zoomLevel)
      const clustered: Array<{
        id: string
        position: [number, number]
        vehicles: typeof vehicleMarkers
        isCluster: boolean
      }> = []
      const processed = new Set<number>()

      console.log("[v0] Clustering", vehicles.length, "vehicles at zoom", zoomLevel, "with threshold", threshold, "km")

      vehicles.forEach((vehicle, index) => {
        if (processed.has(index)) return

        const cluster = {
          id: `cluster-${index}`,
          position: [...vehicle.position] as [number, number],
          vehicles: [vehicle],
          isCluster: false,
        }

        for (let j = index + 1; j < vehicles.length; j++) {
          if (processed.has(j)) continue

          const otherVehicle = vehicles[j]
          const distance = calculateDistance(
            cluster.position[0],
            cluster.position[1],
            otherVehicle.position[0],
            otherVehicle.position[1],
          )

          if (distance <= threshold) {
            cluster.vehicles.push(otherVehicle)
            cluster.position[0] = (cluster.position[0] + otherVehicle.position[0]) / 2
            cluster.position[1] = (cluster.position[1] + otherVehicle.position[1]) / 2
            processed.add(j)
          }
        }

        processed.add(index)
        cluster.isCluster = cluster.vehicles.length > 1
        if (cluster.isCluster) {
          cluster.id = `cluster-${cluster.vehicles.map((v) => v.id).join("-")}`
        } else {
          cluster.id = vehicle.id
        }
        clustered.push(cluster)
      })

      console.log("[v0] Clustering result:", vehicles.length, "vehicles →", clustered.length, "markers")
      return clustered
    },
    [calculateDistance, getClusterThreshold],
  )

  const filteredVehicles = useMemo(() => {
    return vehicleMarkers.filter((vehicle) => {
      if (vehicle.id === "SOS-01" && !showSosMarkers) {
        return false
      }

      if (vehicle.status === "GENERATOR" && !showGeneratorMarkers) {
        return false
      }

      if (vehicle.id === "D93-64" && !showVehicleD9364) {
        return false
      }

      return groupFilters[vehicle.status as keyof VehicleGroupFilters]
    })
  }, [vehicleMarkers, groupFilters, showSosMarkers, showGeneratorMarkers, showVehicleD9364])

  const vehicleCounts = useMemo(() => {
    return vehicleMarkers.reduce(
      (acc, vehicle) => {
        const status = vehicle.status as keyof VehicleGroupFilters
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).dismissAlarm = (vehicleId: string) => {
        dismissedAlarms.add(vehicleId)
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).dismissAlarm
      }
    }
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains("alarm-close-SOS-01")) {
        dismissedAlarms.add("SOS-01")
      }
      if (target.classList.contains("outside-close-9364")) {
        dismissedOutside.add("D93-64")
      }
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !dismissedOutside.has("D93-64")) {
        dismissedOutside.add("D93-64")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[v0] Loading Leaflet from CDN...")
      if (document.querySelector('link[href*="leaflet"]')) {
        return
      }

      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.onload = () => {
        console.log("[v0] Leaflet loaded successfully!")
        const L = (window as any).L
        if (L) {
          delete L.Icon.Default.prototype._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          })
          setMounted(true)
          console.log("[v0] FleetMap mounted set to true")
        }
      }
      script.onerror = () => {
        console.error("[v0] Failed to load Leaflet script")
      }
      document.head.appendChild(script)
    }
  }, [])

  const defaultLegendItems = [
    { id: "parked", label: "Parked", color: "#666f88" },
    { id: "10-60", label: "10-60 km/h", color: "#047857" },
    { id: "60-80", label: "60-80 km/h", color: "#e19507" },
    { id: "80+", label: "80+ km/h", color: "#ef4444" },
    { id: "alarm", label: "Alarm", color: "#d1d5db" },
    { id: "generator", label: "Generator", color: "#d1d5db" },
  ]

  const displayLegendItems = legendItems || defaultLegendItems

  console.log("[v0] FleetMap rendered - mounted:", mounted, "filteredVehicles count:", filteredVehicles.length)

  const mapContent = useMemo(() => {
    // Return null - map is now created via useEffect with native Leaflet
    return null
  }, [])

  useEffect(() => {
    if (!mounted || !mapRef.current) return

    const L = (window as any).L
    if (!L) {
      console.log("[v0] Leaflet not available")
      return
    }

    console.log("[v0] Creating native Leaflet map...")

    // Clear previous map if exists
    if ((mapRef.current as any)._leaflet_id) {
      console.log("[v0] Map already exists, skipping creation")
      return
    }

    try {
      // Create native Leaflet map
      const map = L.map(mapRef.current, { zoomControl: false }).setView(center, zoom)
      console.log("[v0] Map created with center:", center, "zoom:", zoom)

      // Add tile layer - this is the key fix!
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)
      console.log("[v0] TileLayer added to map")

      // Track zoom changes
      map.on("zoomend", () => {
        const newZoom = map.getZoom()
        console.log("[v0] Zoom changed to:", newZoom)
        setCurrentZoom(newZoom)
      })

      // Store map instance for later use
      ;(mapRef.current as any)._leafletMap = map

      // Add markers
      const addMarkers = () => {
        // Clear existing markers
        map.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer)
          }
        })

        const clusters = clusterVehiclesByProximity(filteredVehicles, currentZoom)
        console.log("[v0] Adding", clusters.length, "markers/clusters")

        clusters.forEach((cluster) => {
          if (cluster.isCluster) {
            // Create cluster marker
            const count = cluster.vehicles.length
            const clusterIcon = createClusterIcon(count)

            const marker = L.marker(cluster.position, { icon: clusterIcon }).addTo(map)

            // Cluster markers now display without popups on click
          } else {
            // Create individual vehicle marker
            const vehicle = cluster.vehicles[0]
            const icon = createVehicleIcon(vehicle.speed, vehicle.heading, vehicle.id, vehicle.status)
            if (icon) {
              const marker = L.marker(vehicle.position, { icon }).addTo(map)

              const formatDate = (date: Date) => {
                return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
              }

              const formatTime = (date: Date) => {
                return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
              }

              const popupContent = `
                <div style="min-width: 240px; font-family: inherit;">
                  <!-- Vehicle ID with vibrant orange truck icon, bold and prominent like "Brievengat" or "528" -->
                  <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 16px; margin-bottom: 14px; color: #3D4252; letter-spacing: 0.3px;">
                    <!-- Enhanced truck icon with solid fill and vibrant orange color to be more "alive" -->
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" stroke="#DA6330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 18H9" stroke="#DA6330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" stroke="#DA6330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="17" cy="18" r="2" fill="#DA6330"/>
                      <circle cx="7" cy="18" r="2" fill="#DA6330"/>
                      <rect x="4" y="8" width="8" height="6" fill="#DA6330" fillOpacity="0.15" rx="1"/>
                    </svg>
                    ${vehicle.id}
                  </div>

                  <!-- Speed with colored badge similar to Company Locations status badges -->
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="address-label" style="margin-bottom: 0;">Speed</span>
                    <span style="
                      background: ${vehicle.speed >= 80 ? "#ef4444" : vehicle.speed >= 60 ? "#f59e0b" : vehicle.speed >= 10 ? "#0F766E" : "#e5e7eb"};
                      color: ${vehicle.speed >= 10 ? "#ffffff" : "#6B7280"};
                      padding: 4px 12px;
                      border-radius: 12px;
                      font-size: 13px;
                      font-weight: 700;
                      letter-spacing: 0.3px;
                      display: inline-flex;
                      align-items: center;
                      gap: 4px;
                    ">${vehicle.speed} <span style="font-size: 11px; font-weight: 600;">km/h</span></span>
                  </div>

                  <!-- Divider line like in Cycle Monitor -->
                  <div style="height: 1px; background: rgba(202, 203, 213, 0.4); margin: 12px 0;"></div>

                  <!-- Last Update with teal badge like "ETA" badge, right-aligned like time values in Cycle Monitor -->
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span class="address-label" style="margin-bottom: 0;">Last Update</span>
                    <span style="
                      background: rgba(15, 118, 110, 0.1);
                      color: #0F766E;
                      padding: 4px 10px;
                      border-radius: 6px;
                      font-size: 12px;
                      font-weight: 700;
                      letter-spacing: 0.3px;
                    ">${formatTime(vehicle.lastUpdate)}</span>
                  </div>

                  <!-- Date in subtle text, right-aligned -->
                  <div style="color: #9CA3AF; font-size: 11px; font-weight: 500; margin-bottom: 12px; text-align: right;">
                    ${formatDate(vehicle.lastUpdate)}
                  </div>

                  <!-- Divider line -->
                  <div style="height: 1px; background: rgba(202, 203, 213, 0.4); margin: 12px 0;"></div>

                  <!-- Updated to use CSS classes that match Company Locations exactly: address-label (14px/600) and address-value (12px/400) -->
                  <div style="padding: 12px; border-radius: 8px; border: 1px solid rgba(229, 231, 235, 0.8);">
                    <div style="margin-bottom: 10px;">
                      <div class="address-label">Address</div>
                      <div class="address-value">${vehicle.address}</div>
                    </div>
                    <div>
                      <div class="address-label">Neighbourhood</div>
                      <div class="address-value">${vehicle.neighbourhood}</div>
                    </div>
                  </div>
                </div>
              `

              marker.bindPopup(popupContent, {
                closeButton: false,
                offset: [0, -10],
                autoPanPadding: [10, 60], // 60px top padding to avoid navbar, 10px sides
                className:
                  vehicle.speed >= 80
                    ? "vehicle-hover-popup vehicle-hover-popup-red"
                    : vehicle.speed >= 60
                      ? "vehicle-hover-popup vehicle-hover-popup-yellow"
                      : vehicle.speed >= 10 && vehicle.speed < 60
                        ? "vehicle-hover-popup vehicle-hover-popup-green"
                        : "vehicle-hover-popup",
                keepInView: true,
              })

              marker.on("mouseover", function () {
                this.openPopup()
              })

              marker.on("mouseout", function () {
                this.closePopup()
              })

              // Keep existing click handler
              marker.on("click", () => {
                onSelectVehicle(vehicle.id)
              })
            }
          }
        })
      }

      addMarkers()

      // Cleanup
      return () => {
        console.log("[v0] Cleaning up map")
        map.remove()
      }
    } catch (error) {
      console.error("[v0] Error creating map:", error)
    }
  }, [mounted, center, zoom])

  useEffect(() => {
    if (!mounted || !mapRef.current) return

    const map = (mapRef.current as any)._leafletMap
    if (!map) return

    const L = (window as any).L
    if (!L) return

    console.log("[v0] Updating markers for", filteredVehicles.length, "vehicles at zoom", currentZoom)

    // Clear existing markers (but keep tile layer)
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    const clusters = clusterVehiclesByProximity(filteredVehicles, currentZoom)

    clusters.forEach((cluster) => {
      if (cluster.isCluster) {
        const count = cluster.vehicles.length
        const clusterIcon = createClusterIcon(count)

        const marker = L.marker(cluster.position, { icon: clusterIcon }).addTo(map)

        // Cluster markers now display without popups on click
      } else {
        const vehicle = cluster.vehicles[0]
        const icon = createVehicleIcon(vehicle.speed, vehicle.heading, vehicle.id, vehicle.status)
        if (icon) {
          const marker = L.marker(vehicle.position, { icon }).addTo(map)

          const formatDate = (date: Date) => {
            return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
          }

          const formatTime = (date: Date) => {
            return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          }

          const popupContent = `
            <div style="min-width: 240px; font-family: inherit;">
              <!-- Vehicle ID with vibrant orange truck icon, bold and prominent like "Brievengat" or "528" -->
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 16px; margin-bottom: 14px; color: #3D4252; letter-spacing: 0.3px;">
                <!-- Enhanced truck icon with solid fill and vibrant orange color to be more "alive" -->
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" stroke="#DA6330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 18H9" stroke="#DA6330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" stroke="#DA6330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="17" cy="18" r="2" fill="#DA6330"/>
                  <circle cx="7" cy="18" r="2" fill="#DA6330"/>
                  <rect x="4" y="8" width="8" height="6" fill="#DA6330" fillOpacity="0.15" rx="1"/>
                </svg>
                ${vehicle.id}
              </div>

              <!-- Speed with colored badge similar to Company Locations status badges -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="address-label" style="margin-bottom: 0;">Speed</span>
                <span style="
                  background: ${vehicle.speed >= 80 ? "#ef4444" : vehicle.speed >= 60 ? "#f59e0b" : vehicle.speed >= 10 ? "#0F766E" : "#e5e7eb"};
                  color: ${vehicle.speed >= 10 ? "#ffffff" : "#6B7280"};
                  padding: 4px 12px;
                  border-radius: 12px;
                  font-size: 13px;
                  font-weight: 700;
                  letter-spacing: 0.3px;
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                ">${vehicle.speed} <span style="font-size: 11px; font-weight: 600;">km/h</span></span>
              </div>

              <!-- Divider line like in Cycle Monitor -->
              <div style="height: 1px; background: rgba(202, 203, 213, 0.4); margin: 12px 0;"></div>

              <!-- Last Update with teal badge like "ETA" badge, right-aligned like time values in Cycle Monitor -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span class="address-label" style="margin-bottom: 0;">Last Update</span>
                <span style="
                  background: rgba(15, 118, 110, 0.1);
                  color: #0F766E;
                  padding: 4px 10px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 700;
                  letter-spacing: 0.3px;
                ">${formatTime(vehicle.lastUpdate)}</span>
              </div>

              <!-- Date in subtle text, right-aligned -->
              <div style="color: #9CA3AF; font-size: 11px; font-weight: 500; margin-bottom: 12px; text-align: right;">
                ${formatDate(vehicle.lastUpdate)}
              </div>

              <!-- Divider line -->
              <div style="height: 1px; background: rgba(202, 203, 213, 0.4); margin: 12px 0;"></div>

              <!-- Updated to use CSS classes that match Company Locations exactly: address-label (14px/600) and address-value (12px/400) -->
              <div style="padding: 12px; border-radius: 8px; border: 1px solid rgba(229, 231, 235, 0.8);">
                <div style="margin-bottom: 10px;">
                  <div class="address-label">Address</div>
                  <div class="address-value">${vehicle.address}</div>
                </div>
                <div>
                  <div class="address-label">Neighbourhood</div>
                  <div class="address-value">${vehicle.neighbourhood}</div>
                </div>
              </div>
            </div>
          `

          marker.bindPopup(popupContent, {
            closeButton: false,
            offset: [0, -10],
            autoPanPadding: [10, 60], // 60px top padding to avoid navbar, 10px sides
            className:
              vehicle.speed >= 80
                ? "vehicle-hover-popup vehicle-hover-popup-red"
                : vehicle.speed >= 60
                  ? "vehicle-hover-popup vehicle-hover-popup-yellow"
                  : vehicle.speed >= 10
                    ? "vehicle-hover-popup vehicle-hover-popup-green"
                    : "vehicle-hover-popup",
            keepInView: true,
          })

          marker.on("mouseover", function () {
            this.openPopup()
          })

          marker.on("mouseout", function () {
            this.closePopup()
          })

          // Keep existing click handler
          marker.on("click", () => {
            onSelectVehicle(vehicle.id)
          })
        }
      }
    })
  }, [filteredVehicles, currentZoom, mounted])

  return (
    <div className="relative h-full w-full pt-2">
      {/* Loading State */}
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-[1000]">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 bg-slate-200" />

      {/* Vehicle Group Filter */}
      {showVehicleGroupFilter && (
        <div
          className="absolute z-30"
          style={{ top: "92px", right: "max(1rem, calc((100vw - min(100vw - 2rem, 1675px)) / 2))" }}
        >
          <VehicleGroupFilter filters={groupFilters} onFiltersChange={setGroupFilters} vehicleCounts={vehicleCounts} />
        </div>
      )}

      {/* Legend */}
      {showLegend && legendItems && legendItems.length > 0 && (
        <div className="absolute bottom-6 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-[1000]">
          <div className="space-y-2">
            {legendItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function createClusterIcon(count: number) {
  if (typeof window === "undefined" || !(window as any).L) return null

  const L = (window as any).L

  // Size based on count for visual hierarchy
  const size = count < 5 ? 40 : count < 10 ? 48 : 56

  const bgColor = "rgba(251, 251, 255, 1.00)" // Same white as vehicle markers
  const textColor = "#3d4150" // Dark gray text for contrast

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bgColor};
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${count < 10 ? "16px" : "18px"};
        font-weight: 700;
        color: ${textColor};
        cursor: pointer;
        letter-spacing: 0.5px;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.12));
        opacity: 0.95;
        transition: all 0.2s ease;
      "
      class="cluster-marker-circle"
      onmouseover="this.style.filter='drop-shadow(0 2px 6px rgba(0,0,0,0.2))'; this.style.transform='scale(1.1)';"
      onmouseout="this.style.filter='drop-shadow(0 1px 3px rgba(0,0,0,0.12))'; this.style.transform='scale(1)';"
      >
        ${count}
      </div>
    `,
    className: "custom-cluster-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}
