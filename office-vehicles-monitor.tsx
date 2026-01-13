"use client"

import { useState } from "react"
import { Building2, Cog, ChevronRight, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PlantLocation {
  id: string
  name: string
  totalVehicles: number
  engineOn: number
  engineOff: number
}

interface VehicleAtPlant {
  id: string
  label: string
  plantName: string
  timeInside: string
  routesCompleted: number
  engineStatus: "on" | "off"
}

interface OfficeVehiclesMonitorProps {
  onVehicleClick?: (vehicleLabel: string) => void
  selectedVehicle?: string | null
}

export default function OfficeVehiclesMonitor({ onVehicleClick, selectedVehicle }: OfficeVehiclesMonitorProps) {
  const [expandedPlantId, setExpandedPlantId] = useState<string | null>(null)
  const [isPlantsCollapsed, setIsPlantsCollapsed] = useState(false)

  const plants: PlantLocation[] = [
    { id: "brievengat", name: "Brievengat", totalVehicles: 5, engineOn: 3, engineOff: 2 },
    { id: "mall-pais", name: "Mall Pais", totalVehicles: 23, engineOn: 12, engineOff: 11 },
    { id: "mijnmaatschappij", name: "Mijnmaatschappij", totalVehicles: 4, engineOn: 2, engineOff: 2 },
  ]

  const vehiclesAtPlants: VehicleAtPlant[] = [
    // Brievengat
    {
      id: "4",
      label: "3434 - Trekker",
      plantName: "Brievengat",
      timeInside: "2h 15min",
      routesCompleted: 7,
      engineStatus: "on",
    },
    {
      id: "2",
      label: "522 - Mixer",
      plantName: "Brievengat",
      timeInside: "1h 20min",
      routesCompleted: 5,
      engineStatus: "on",
    },
    {
      id: "1",
      label: "521 - Mixer",
      plantName: "Brievengat",
      timeInside: "45 min",
      routesCompleted: 3,
      engineStatus: "on",
    },
    {
      id: "3",
      label: "517 - Pomp Truck",
      plantName: "Brievengat",
      timeInside: "25 min",
      routesCompleted: 2,
      engineStatus: "off",
    },
    {
      id: "5",
      label: "523 - Mixer",
      plantName: "Brievengat",
      timeInside: "15 min",
      routesCompleted: 1,
      engineStatus: "off",
    },
    // Mall Pais
    {
      id: "7",
      label: "518 - Pomp Truck",
      plantName: "Mall Pais",
      timeInside: "1h 45min",
      routesCompleted: 6,
      engineStatus: "off",
    },
    {
      id: "6",
      label: "524 - Trekker",
      plantName: "Mall Pais",
      timeInside: "55 min",
      routesCompleted: 4,
      engineStatus: "on",
    },
    {
      id: "8",
      label: "525 - Mixer",
      plantName: "Mall Pais",
      timeInside: "30 min",
      routesCompleted: 2,
      engineStatus: "off",
    },
    {
      id: "13",
      label: "527 - Mixer",
      plantName: "Mall Pais",
      timeInside: "3h 10min",
      routesCompleted: 9,
      engineStatus: "on",
    },
    {
      id: "14",
      label: "528 - Pomp Truck",
      plantName: "Mall Pais",
      timeInside: "2h 45min",
      routesCompleted: 8,
      engineStatus: "on",
    },
    {
      id: "15",
      label: "529 - Trekker",
      plantName: "Mall Pais",
      timeInside: "2h 20min",
      routesCompleted: 7,
      engineStatus: "off",
    },
    {
      id: "16",
      label: "530 - Mixer",
      plantName: "Mall Pais",
      timeInside: "2h 5min",
      routesCompleted: 6,
      engineStatus: "on",
    },
    {
      id: "17",
      label: "531 - Trekker",
      plantName: "Mall Pais",
      timeInside: "1h 55min",
      routesCompleted: 6,
      engineStatus: "off",
    },
    {
      id: "18",
      label: "532 - Pomp Truck",
      plantName: "Mall Pais",
      timeInside: "1h 40min",
      routesCompleted: 5,
      engineStatus: "on",
    },
    {
      id: "19",
      label: "533 - Mixer",
      plantName: "Mall Pais",
      timeInside: "1h 30min",
      routesCompleted: 5,
      engineStatus: "off",
    },
    {
      id: "20",
      label: "534 - Trekker",
      plantName: "Mall Pais",
      timeInside: "1h 25min",
      routesCompleted: 4,
      engineStatus: "on",
    },
    {
      id: "21",
      label: "535 - Pomp Truck",
      plantName: "Mall Pais",
      timeInside: "1h 15min",
      routesCompleted: 4,
      engineStatus: "off",
    },
    {
      id: "22",
      label: "536 - Mixer",
      plantName: "Mall Pais",
      timeInside: "1h 10min",
      routesCompleted: 3,
      engineStatus: "on",
    },
    {
      id: "23",
      label: "537 - Trekker",
      plantName: "Mall Pais",
      timeInside: "1h 5min",
      routesCompleted: 3,
      engineStatus: "off",
    },
    {
      id: "24",
      label: "538 - Pomp Truck",
      plantName: "Mall Pais",
      timeInside: "58 min",
      routesCompleted: 3,
      engineStatus: "on",
    },
    {
      id: "25",
      label: "539 - Mixer",
      plantName: "Mall Pais",
      timeInside: "50 min",
      routesCompleted: 2,
      engineStatus: "off",
    },
    {
      id: "26",
      label: "540 - Trekker",
      plantName: "Mall Pais",
      timeInside: "45 min",
      routesCompleted: 2,
      engineStatus: "on",
    },
    {
      id: "27",
      label: "541 - Mixer",
      plantName: "Mall Pais",
      timeInside: "42 min",
      routesCompleted: 2,
      engineStatus: "off",
    },
    {
      id: "28",
      label: "542 - Pomp Truck",
      plantName: "Mall Pais",
      timeInside: "38 min",
      routesCompleted: 2,
      engineStatus: "on",
    },
    {
      id: "29",
      label: "543 - Trekker",
      plantName: "Mall Pais",
      timeInside: "35 min",
      routesCompleted: 1,
      engineStatus: "off",
    },
    {
      id: "30",
      label: "544 - Mixer",
      plantName: "Mall Pais",
      timeInside: "28 min",
      routesCompleted: 1,
      engineStatus: "on",
    },
    {
      id: "31",
      label: "545 - Pomp Truck",
      plantName: "Mall Pais",
      timeInside: "22 min",
      routesCompleted: 1,
      engineStatus: "off",
    },
    {
      id: "32",
      label: "546 - Trekker",
      plantName: "Mall Pais",
      timeInside: "18 min",
      routesCompleted: 1,
      engineStatus: "on",
    },
    // Mijnmaatschappij
    {
      id: "11",
      label: "3436 - Trekker",
      plantName: "Mijnmaatschappij",
      timeInside: "2h 30min",
      routesCompleted: 8,
      engineStatus: "on",
    },
    {
      id: "9",
      label: "3435 - Trekker",
      plantName: "Mijnmaatschappij",
      timeInside: "1h 5min",
      routesCompleted: 4,
      engineStatus: "on",
    },
    {
      id: "10",
      label: "526 - Mixer",
      plantName: "Mijnmaatschappij",
      timeInside: "40 min",
      routesCompleted: 3,
      engineStatus: "off",
    },
    {
      id: "12",
      label: "519 - Pomp Truck",
      plantName: "Mijnmaatschappij",
      timeInside: "20 min",
      routesCompleted: 1,
      engineStatus: "off",
    },
  ]

  const totalVehicles = plants.reduce((sum, plant) => sum + plant.totalVehicles, 0)
  const totalEngineOn = plants.reduce((sum, plant) => sum + plant.engineOn, 0)
  const totalEngineOff = plants.reduce((sum, plant) => sum + plant.engineOff, 0)

  const handleVehicleClick = (label: string) => {
    if (onVehicleClick) {
      onVehicleClick(label)
    }
  }

  const togglePlant = (plantId: string) => {
    setExpandedPlantId(expandedPlantId === plantId ? null : plantId)
  }

  return (
    <div
      className="absolute z-30"
      style={{
        width: "360px",
        left: "max(1rem, calc((100vw - min(100vw - 2rem, 1675px)) / 2))",
        top: "92px",
      }}
    >
      <div
        className="backdrop-blur-md bg-white/[0.875] rounded-[10px] border border-white/60 overflow-hidden p-4"
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          onClick={() => setIsPlantsCollapsed(!isPlantsCollapsed)}
          className="w-full transition-opacity hover:opacity-70"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 style={{ width: "16px", height: "16px", color: "#DA6330" }} />
              <h3 className="text-sm font-medium text-[#3D4252]">Company Locations</h3>
            </div>
            <Badge
              variant="secondary"
              className="rounded"
              style={{
                backgroundColor: "rgba(218, 99, 48, 0.08)",
                color: "#DA6330",
                border: "none",
                height: "22px",
                padding: "0 8px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {totalVehicles} VEHICLES
            </Badge>
          </div>
        </button>

        <div style={{ height: "1px", background: "rgba(202, 203, 213, 0.4)", marginBottom: "12px" }} />

        {isPlantsCollapsed ? (
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-[#3D4252]">All Vehicles</span>
              <span className="text-sm text-muted-foreground">{totalVehicles}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Cog className="h-3.5 w-3.5" style={{ color: "#0F766E" }} />
                <span className="text-sm font-medium" style={{ color: "#0F766E" }}>
                  Engine On
                </span>
              </div>
              <span className="text-sm font-medium" style={{ color: "#0F766E" }}>
                {totalEngineOn}
              </span>
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Cog className="h-3.5 w-3.5" style={{ color: "#ef4444" }} />
                <span className="text-sm font-medium" style={{ color: "#ef4444" }}>
                  Engine Off
                </span>
              </div>
              <span className="text-sm font-medium" style={{ color: "#ef4444" }}>
                {totalEngineOff}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {plants.map((plant, idx) => {
              const plantVehicles = vehiclesAtPlants.filter((v) => v.plantName === plant.name)
              const isExpanded = expandedPlantId === plant.id

              return (
                <div key={plant.id}>
                  <button
                    onClick={() => togglePlant(plant.id)}
                    className="w-full transition-all hover:bg-white/60 rounded-lg p-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-semibold text-[#3D4252]">{plant.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {plant.totalVehicles} vehicle{plant.totalVehicles !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Cog className="h-3.5 w-3.5" style={{ color: "#0F766E" }} />
                          <span className="text-sm font-medium" style={{ color: "#0F766E" }}>
                            {plant.engineOn}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Cog className="h-3.5 w-3.5" style={{ color: "#ef4444" }} />
                          <span className="text-sm font-medium" style={{ color: "#ef4444" }}>
                            {plant.engineOff}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-2 pl-2 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-[1px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {plantVehicles.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          onClick={() => handleVehicleClick(vehicle.label)}
                          className="w-full p-2.5 rounded-lg transition-all border border-white/30 bg-transparent hover:bg-white/20"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {selectedVehicle === vehicle.label && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#DA6330]" />
                              )}
                              <span className="text-sm font-semibold text-[#3D4252]">{vehicle.label}</span>
                              {vehicle.engineStatus === "on" ? (
                                <Cog className="h-3 w-3" style={{ color: "#0F766E" }} />
                              ) : (
                                <Cog className="h-3 w-3" style={{ color: "#ef4444" }} />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="font-medium text-[#3D4252]">{vehicle.timeInside}</div>
                              <div
                                style={{
                                  width: "1px",
                                  height: "14px",
                                  backgroundColor: "rgba(202, 203, 213, 0.5)",
                                }}
                              />
                              <div className="font-medium text-[#DA6330]">{vehicle.routesCompleted}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {idx < plants.length - 1 && (
                    <div style={{ height: "1px", background: "rgba(202, 203, 213, 0.4)", margin: "8px 0" }} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
