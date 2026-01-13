# Vehicle Group Filter Integration Guide

## 0. Overview & Goal

**What:** Connect the Vehicle Group Filter component to real-time vehicle data to show accurate live counts for each status (Moving, Parked, Overspeed, Alarm, Generator).

**Why:** Users need to see real-time counts of vehicles in each status category and filter the map accordingly.

**What You'll Build:**
- Dynamic count updates based on Socket.IO vehicle data
- Filter logic to show/hide vehicles based on selected groups
- Real-time count synchronization

---

## 1. Files to Modify

| File Path | Purpose |
|-----------|---------|
| `components/vehicle-group-filter.tsx` | Filter UI component - receives real-time counts |
| `components/fleet-map.tsx` | Map component - passes vehicle counts and applies filters |

---

## 2. Static Data Locations

### File: `components/vehicle-group-filter.tsx`

**No static data to replace** - This component already receives `vehicleCounts` as a prop.

**What it receives:**
```typescript
interface VehicleGroupFilterProps {
  filters: VehicleGroupFilters
  onFiltersChange: (filters: VehicleGroupFilters) => void
  vehicleCounts: Record<string, number> // This is where counts come from
}
```

**Current implementation (Lines 1-149):**
- Component is already built to receive dynamic counts
- Filters are managed by parent component (`fleet-map.tsx`)
- No hardcoded data inside this component

---

### File: `components/fleet-map.tsx`

**No static filter counts** - Counts need to be calculated from real-time vehicle data.

**What needs to be added:**
- Calculate counts from Socket.IO vehicle data
- Pass counts to `VehicleGroupFilter` component
- Apply filters to hide/show markers

---

## 3. Example of Current Structure

### Vehicle Status Mapping (vehicle-group-filter.tsx, Lines 28-43)
```typescript
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
```

---

## 4. Integration Logic (No Socket.IO Needed)

**This component works with existing Socket.IO data from Live Tracking integration.**

### A. Calculate Counts from Vehicle Data

After Socket.IO provides vehicle data in `fleet-map.tsx`, calculate counts:

```typescript
const vehicleCounts = useMemo(() => {
  const counts = {
    MOVING: 0,
    PARKED: 0,
    OVERSPEED: 0,
    ALARM: 0,
    GENERATOR: 0,
  }
  
  vehicleMarkers.forEach(vehicle => {
    if (vehicle.status === 'MOVING') counts.MOVING++
    if (vehicle.status === 'PARKED') counts.PARKED++
    if (vehicle.status === 'OVERSPEED') counts.OVERSPEED++
    // Add logic for ALARM and GENERATOR based on vehicle data
  })
  
  return counts
}, [vehicleMarkers])
```

### B. Pass Counts to Filter Component

In `fleet-map.tsx` where `VehicleGroupFilter` is rendered:
```typescript
<VehicleGroupFilter
  filters={groupFilters}
  onFiltersChange={setGroupFilters}
  vehicleCounts={vehicleCounts}
/>
```

### C. Apply Filters to Markers

Filter vehicles before rendering markers:
```typescript
const filteredVehicles = useMemo(() => {
  return vehicleMarkers.filter(vehicle => {
    // If filter is active for this status, show the vehicle
    return groupFilters[vehicle.status as keyof VehicleGroupFilters]
  })
}, [vehicleMarkers, groupFilters])
```

---

## 5. Key Explanations

### How Filtering Works
1. Socket.IO updates vehicle data in `fleet-map.tsx`
2. Counts are calculated from vehicle data (MOVING, PARKED, etc.)
3. Counts passed to `VehicleGroupFilter` component
4. User toggles filters (checkboxes)
5. Filter state updates in parent component
6. Map re-renders showing only filtered vehicles

### Status Determination
Based on Socket.IO vehicle data:
- **MOVING:** `engine === "ON"` and `speed > 0`
- **PARKED:** `engine === "OFF"` or `speed === 0`
- **OVERSPEED:** `speed > speed_limit` (need speed limit data)
- **ALARM:** Backend should provide alarm status
- **GENERATOR:** Backend should provide generator status

---

## 6. Implementation Steps (High-Level)

### Step 1: Add Count Calculation (10 min)
- In `fleet-map.tsx`, create `useMemo` hook to calculate counts
- Count vehicles by status from Socket.IO data
- Return counts object

### Step 2: Pass Counts to Filter (2 min)
- Find where `VehicleGroupFilter` is rendered
- Add `vehicleCounts={vehicleCounts}` prop

### Step 3: Apply Filters to Markers (10 min)
- Create filtered vehicle list based on active filters
- Use filtered list for marker rendering
- Ensure clusters recalculate with filtered data

### Step 4: Handle Edge Cases (5 min)
- All filters unchecked → show nothing or show all?
- No vehicles in a category → show count as 0
- Filter state persists on page reload (optional)

### Step 5: Test Filtering (5 min)
- Toggle each filter and verify markers show/hide
- Check counts update in real-time
- Verify clusters update correctly

---

## 7. Testing Checklist

- [ ] Counts display correctly for each status
- [ ] Counts update in real-time as vehicles change status
- [ ] Toggling filter shows/hides correct vehicles
- [ ] All filters unchecked behavior is correct
- [ ] Markers disappear smoothly (no flicker)
- [ ] Clusters recalculate after filtering
- [ ] Badge shows active filter count
- [ ] Expand/collapse animation works

---

## 8. Common Issues & Solutions

**Issue:** Counts not updating
- **Solution:** Verify `useMemo` dependencies include `vehicleMarkers`

**Issue:** Filtering not working
- **Solution:** Check if filtered vehicle list is being used for marker rendering

**Issue:** All vehicles disappear
- **Solution:** Check filter logic - ensure status values match exactly (case-sensitive)

**Issue:** Counts incorrect
- **Solution:** Verify status determination logic matches backend data structure

---

## 9. Status Mapping Reference

### Socket.IO to App Status Mapping

| Socket.IO Condition | App Status | Filter Group |
|--------------------|------------|--------------|
| `engine: "ON"` + `speed > 0` | `MOVING` | Moving |
| `engine: "OFF"` or `speed === 0` | `PARKED` | Parked |
| `speed > 80` (configurable) | `OVERSPEED` | Overspeed |
| Backend alarm flag | `ALARM` | Alarm |
| Backend generator flag | `GENERATOR` | Generator |

**Note:** Overspeed threshold, alarm, and generator status must be confirmed with backend team.

---

## 10. Important Notes

**No Direct Socket.IO:** This component doesn't connect to Socket.IO directly. It works with data already received by `fleet-map.tsx` from Live Tracking integration.

**Dependencies:** Complete Live Tracking integration (Document 01) before implementing this filter logic.

**Performance:** Use `useMemo` for count calculation to avoid unnecessary recalculations on every render.

---

**Estimated Time:** 20-30 minutes (assuming Live Tracking is already complete)
