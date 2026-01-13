"use client"
import { X, Car } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface VehicleDetailsProps {
  vehicleId: string
  onClose: () => void
  position?: { x: number; y: number }
  onNavigateToHistory?: (vehicleId: string) => void
}

export default function VehicleDetails({ vehicleId, onClose, position, onNavigateToHistory }: VehicleDetailsProps) {
  const vehicle = vehicleData[vehicleId] || vehicleData["W71-19"]
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return
      const deltaX = e.clientX - dragRef.current.startX
      const deltaY = e.clientY - dragRef.current.startY
      setDragPosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      dragRef.current = null
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div
      className={`fixed z-[1001] bg-white/[0.875] backdrop-blur-md rounded-xl transition-transform duration-300 ${
        isMobile
          ? "w-full max-w-full left-0 right-0 bottom-0 rounded-b-none flex flex-col"
          : "w-[350px] overflow-hidden"
      }`}
      style={
        isMobile
          ? { maxHeight: "85vh" }
          : {
              left: "50%",
              top: "92px",
              transform: `translateX(calc(-50% + ${dragPosition.x}px)) translateY(${dragPosition.y}px)`,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }
      }
    >
      {isMobile && (
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
      )}

      <div
        className={`flex items-center gap-2 px-4 py-3 border-b border-[#fbddd2] bg-gradient-to-r from-[#FFE1CC] via-[#FFEDE4] to-[#FFFAF8] ${
          isMobile ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        onMouseDown={() => {
          if (!isMobile) {
            setIsDragging(true)
            dragRef.current = {
              startX: window.event.clientX,
              startY: window.event.clientY,
              initialX: dragPosition.x,
              initialY: dragPosition.y,
            }
          }
        }}
      >
        <Car className="h-4 w-4 text-[#DA6330]" />
        <h2 className="text-sm font-bold text-[#3D4252] uppercase">{vehicle.id}</h2>
        <button onClick={onClose} className="ml-auto p-1 hover:bg-[#DA6330]/10 rounded transition-colors">
          <X className="h-5 w-5 text-[#3D4252]" />
        </button>
      </div>

      <div
        className="p-4 pb-6 space-y-8 overflow-y-auto scrollbar-hide"
        style={
          isMobile
            ? { flex: "1 1 0", minHeight: 0 }
            : {
                maxHeight: "calc(100vh - 140px)",
              }
        }
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase mb-1 font-medium">Current Speed</p>
            <span
              className="inline-block text-sm font-bold px-2 py-1 rounded"
              style={{
                backgroundColor: "rgba(15, 118, 110, 0.08)",
                color: "#0F766E",
              }}
            >
              {vehicle.currentSpeed} km/h
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase mb-1 font-medium">Engine</p>
            <span
              className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                vehicle.engineOn ? "text-[#0F766E] bg-[rgba(15,118,110,0.08)]" : "text-[#dc2626] bg-[#fef2f2]"
              }`}
            >
              {vehicle.engineOn ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        <div className="overflow-hidden shadow-sm border border-border relative">
          <img
            src={vehicle.image || "/placeholder.svg"}
            alt={`${vehicle.brand}`}
            className="w-full h-32 object-cover"
          />
        </div>

        {/* Today's summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-2.5 text-center border border-zinc-200">
            <p className="text-base font-semibold text-foreground">8:34am</p>
            <p className="text-xs text-muted-foreground uppercase mt-1 font-medium">Active Since</p>
          </div>
          <div className="rounded-lg p-2.5 text-center border border-zinc-200">
            <p className="text-base font-semibold text-foreground">{vehicle.kmDriven}</p>
            <p className="text-xs text-muted-foreground uppercase mt-1 font-medium">KM Driven</p>
          </div>
          <div className="rounded-lg p-2.5 text-center border border-zinc-200">
            <p className="text-base font-semibold text-foreground">{vehicle.stopsMade}</p>
            <p className="text-xs text-muted-foreground uppercase mt-1 font-medium">Stops Made</p>
          </div>
          <div className="rounded-lg p-2.5 text-center border border-zinc-200">
            <p className="text-base font-semibold text-red-600">105</p>
            <p className="text-xs text-muted-foreground uppercase mt-1 font-medium">Highest Speed</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">Last Stop</h3>
            <span className="text-red-600 text-sm font-semibold">10:45</span>
          </div>
          {/* Last Visit Information */}
          <div className="space-y-1.5 text-sm rounded-lg p-2.5 border border-zinc-200">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Street</span>
              <span className="font-semibold text-foreground">Emmastraat 45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Neighbourhood</span>
              <span className="font-semibold text-foreground">Pietermaai</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Spent</span>
              <span className="font-semibold text-[#c25829]">12 min</span>
            </div>
          </div>
        </div>

        <div className="-mt-4">
          {/* History Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                onClose()
                onNavigateToHistory?.(vehicleId)
              }}
              className="bg-[#c25829] hover:bg-[#a94820] text-white font-medium py-1.5 px-8 rounded-[6px] transition-colors flex items-center justify-center gap-2 text-sm"
            >
              History
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock data - in production, fetch based on vehicleId
const vehicleData: Record<string, any> = {
  "W71-19": {
    id: "W71-19",
    number: "W71-19",
    brand: "Toyota Hiace",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 70,
    engineOn: true,
    driver: "Kevin Maduro",
    location: "Emmastad",
    hoursActive: "8.5",
    kmDriven: "142",
    stopsMade: "7",
    avgSpeed: "45",
    licensePlate: "W71-19",
    lastSeen: "Just now",
  },
  "W48-23": {
    id: "W48-23",
    number: "W48-23",
    brand: "Mercedes Sprinter",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 85,
    engineOn: true,
    driver: "Kevin Maduro",
    location: "Willemstad",
    hoursActive: "12.3",
    kmDriven: "287",
    stopsMade: "15",
    avgSpeed: "62",
    licensePlate: "W48-23",
    lastSeen: "Just now",
  },
  "K48-23": {
    id: "K48-23",
    number: "K48-23",
    brand: "Rolstoel Caddy",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 45,
    engineOn: true,
    driver: "Kevin Maduro",
    location: "Emmastad",
    hoursActive: "23.0",
    kmDriven: "186",
    stopsMade: "16",
    avgSpeed: "52",
    licensePlate: "K48-23",
    lastSeen: "Just now",
  },
  "W68-82": {
    id: "W68-82",
    number: "W68-82",
    brand: "Renault Master",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 35,
    engineOn: true,
    driver: "Kevin Maduro",
    location: "Weg naar Hato",
    hoursActive: "21.20",
    kmDriven: "223",
    stopsMade: "13",
    avgSpeed: "38",
    licensePlate: "W68-82",
    lastSeen: "2 minutes ago",
  },
  "W62-07": {
    id: "W62-07",
    number: "W62-07",
    brand: "Ford Transit",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 92,
    engineOn: true,
    driver: "Kevin Maduro",
    location: "Willemstad",
    hoursActive: "15.7",
    kmDriven: "312",
    stopsMade: "18",
    avgSpeed: "68",
    licensePlate: "W62-07",
    lastSeen: "Just now",
  },
  "C62-07": {
    id: "C62-07",
    number: "C62-07",
    brand: "Electric Vehicle",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 92,
    engineOn: true,
    driver: "Kevin Maduro",
    location: "Willemstad",
    hoursActive: "15.7",
    kmDriven: "312",
    stopsMade: "18",
    avgSpeed: "68",
    licensePlate: "C62-07",
    lastSeen: "Just now",
  },
  "B62-07": {
    id: "B62-07",
    number: "B62-07",
    brand: "Volkswagen Caddy",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 70,
    engineOn: true,
    driver: "Kevin Maduro",
    location: "Emmastad",
    hoursActive: "23.1",
    kmDriven: "195",
    stopsMade: "12",
    avgSpeed: "48",
    licensePlate: "B62-07",
    lastSeen: "Just now",
  },
  "G63-64": {
    id: "G63-64",
    number: "G63-64",
    brand: "Toyota HiAce Passenger",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 55,
    engineOn: true,
    driver: "Kevin Maduro",
    location: "Willemstad",
    hoursActive: "18.5",
    kmDriven: "245",
    stopsMade: "14",
    avgSpeed: "52",
    licensePlate: "G63-64",
    lastSeen: "Just now",
  },
  "K68-86": {
    id: "K68-86",
    number: "K68-86",
    brand: "Mercedes Sprinter Passenger",
    image: "/images/sema1350-detail.jpg",
    currentSpeed: 0,
    engineOn: false,
    driver: "Kevin Maduro",
    location: "Emmastad",
    hoursActive: "23.1",
    kmDriven: "198",
    stopsMade: "11",
    avgSpeed: "46",
    licensePlate: "K68-86",
    lastSeen: "5 minutes ago",
  },
}
