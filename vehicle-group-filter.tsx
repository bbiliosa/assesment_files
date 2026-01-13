"use client"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

export interface VehicleGroupFilters {
  MOVING: boolean
  PARKED: boolean
  OVERSPEED: boolean
  ALARM: boolean
  GENERATOR: boolean
}

interface VehicleGroupFilterProps {
  filters: VehicleGroupFilters
  onFiltersChange: (filters: VehicleGroupFilters) => void
  vehicleCounts: Record<string, number>
}

const statusConfig = {
  MOVING: {
    label: "Moving",
    color: "text-[#047857]",
  },
  PARKED: {
    label: "Parked",
    color: "text-[#666f88]",
  },
  OVERSPEED: {
    label: "Overspeed",
    color: "text-[#D55E2D]",
  },
  ALARM: {
    label: "Alarm",
    color: "text-[#ef4444]",
  },
  GENERATOR: {
    label: "Generator",
    color: "text-[#e19507]",
  },
}

export default function VehicleGroupFilter({ filters, onFiltersChange, vehicleCounts }: VehicleGroupFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleToggle = (status: keyof VehicleGroupFilters) => {
    onFiltersChange({
      ...filters,
      [status]: !filters[status],
    })
  }

  const activeCount = Object.values(filters).filter((v) => v).length

  return (
    <div
      className="w-64 rounded-[10px] bg-white/[0.875] backdrop-blur-md border border-white/60"
      style={{
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="p-4 border-b border-white/60 cursor-pointer hover:bg-white/50 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center"
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: activeCount > 0 ? "#D55E2D" : "transparent",
              border: activeCount > 0 ? "2px solid #D55E2D" : "2px solid #CACBD5",
              borderRadius: "3px",
              transition: "all 0.2s",
            }}
          >
            {activeCount > 0 && <span style={{ color: "white", fontSize: "10px", fontWeight: "bold" }}>✓</span>}
          </div>
          <span className="text-sm font-medium text-[#3D4252]">Group Filters</span>
          <span
            style={{
              backgroundColor: "rgba(213, 94, 45, 0.08)",
              color: "#D55E2D",
              marginLeft: "auto",
              height: "22px",
              minWidth: "24px",
              padding: "0 8px",
              fontSize: "11px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
            }}
          >
            {activeCount}
          </span>
          <ChevronDown
            className="h-4 w-4 text-[#3D4252] transition-transform"
            style={{
              transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
            }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {(Object.keys(statusConfig) as Array<keyof VehicleGroupFilters>).map((status, idx) => {
            const config = statusConfig[status]
            const count = vehicleCounts[status] || 0

            return (
              <div key={status}>
                <div
                  className="flex items-center gap-2 hover:bg-white/80 focus:outline-none transition-all"
                  style={{ padding: "6px 0" }}
                >
                  <Checkbox
                    id={status}
                    checked={filters[status]}
                    onCheckedChange={() => handleToggle(status)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={status} className="flex flex-1 cursor-pointer items-center justify-between">
                    <span className="text-sm text-[#3D4252]">{config.label}</span>
                    <span className={`text-xs font-semibold ${config.color}`}>{count}</span>
                  </Label>
                </div>
                {idx < Object.keys(statusConfig).length - 1 && (
                  <div style={{ height: "1px", background: "rgba(202, 203, 213, 0.4)", margin: "4px 0" }} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
