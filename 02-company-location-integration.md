# Company Location Integration Guide

## 0. Overview & Goal

**What:** Replace static company location data with real-time Socket.IO updates to show live vehicle counts at each company location.

**Why:** Enables real-time monitoring of which vehicles are at which company locations (plants) with automatic updates.

**What You'll Build:**
- Socket.IO listener for company location updates
- Real-time vehicle count updates per location
- Dynamic location list with expand/collapse

---

## 1. Files to Modify

| File Path | Purpose |
|-----------|---------|
| `components/office-vehicles-monitor.tsx` | Company locations component - replace static data with Socket.IO updates |
| `package.json` | Add `socket.io-client` dependency (if not already done in Live Tracking) |

---

## 2. Static Data Locations

### File: `components/office-vehicles-monitor.tsx`

**Line 33-37:** Static plants/locations array
```typescript
const plants: PlantLocation[] = [
  { id: "brievengat", name: "Brievengat", totalVehicles: 5, engineOn: 3, engineOff: 2 },
  { id: "mall-pais", name: "Mall Pais", totalVehicles: 23, engineOn: 12, engineOff: 11 },
  { id: "mijnmaatschappij", name: "Mijnmaatschappij", totalVehicles: 4, engineOn: 2, engineOff: 2 },
]
```

**Line 39-140+:** Static vehicles at plants array
```typescript
const vehiclesAtPlants: VehicleAtPlant[] = [
  {
    id: "4",
    label: "3434 - Trekker",
    plantName: "Brievengat",
    timeInside: "2h 15min",
    routesCompleted: 7,
    engineStatus: "on",
  },
  // More hardcoded vehicles...
]
```

**What needs to change:**
- Convert `plants` from constant to React state
- Convert `vehiclesAtPlants` from constant to React state
- Populate from Socket.IO geofence events

---

## 3. Example of Static Data

### Current Plants Structure (Line 33-37)
```typescript
{
  id: "brievengat",
  name: "Brievengat",
  totalVehicles: 5,
  engineOn: 3,
  engineOff: 2
}
```

### Current Vehicles at Plants Structure (Line 41-48)
```typescript
{
  id: "4",
  label: "3434 - Trekker",
  plantName: "Brievengat",
  timeInside: "2h 15min",
  routesCompleted: 7,
  engineStatus: "on"
}
```

---

## 4. Socket Integration

### A. Socket Events to Listen For

**Event:** `geofence:vehicles:update` or similar
**Frequency:** Every 5 seconds (when vehicles enter/exit geofences)
**Expected Payload Structure:**
```typescript
[
  {
    geofence_id: "brievengat",
    geofence_name: "Brievengat",
    vehicles: [
      {
        vehicle_id: "3434",
        label: "3434 - Trekker",
        time_inside: "2h 15min",
        engine_status: "on",
        routes_completed: 7
      }
    ],
    total_vehicles: 5,
    engine_on_count: 3,
    engine_off_count: 2
  }
]
```

**Note:** The exact event name and payload structure may differ. Check with backend documentation or test the Socket.IO connection to see what events are available.

### B. Socket Connection

If Socket.IO is already connected in `fleet-map.tsx`, you can:
1. **Option A:** Pass socket instance as prop from parent
2. **Option B:** Create separate socket connection in this component
3. **Option C:** Use a shared Socket context/provider (recommended)

### C. Data Field Mapping

| Socket.IO Field | Current App Field | Purpose |
|----------------|-------------------|---------|
| `geofence_id` | `id` | Unique location identifier |
| `geofence_name` | `name` | Display name of location |
| `total_vehicles` | `totalVehicles` | Total vehicles at location |
| `engine_on_count` | `engineOn` | Vehicles with engine on |
| `engine_off_count` | `engineOff` | Vehicles with engine off |
| `vehicles[]` | `vehiclesAtPlants[]` | Individual vehicle details |

---

## 5. Key Explanations

### How Company Location Tracking Works
1. Backend tracks vehicles using geofences (virtual boundaries around company locations)
2. When a vehicle enters/exits a geofence, backend sends update via Socket.IO
3. Frontend receives updates and recalculates vehicle counts per location
4. UI automatically updates to show current counts

### Geofence Logic
- Each company location has a geofence (polygon boundary)
- Backend checks if vehicle position is inside geofence
- Updates sent only when vehicles enter/exit (or periodically)

---

## 6. Implementation Steps (High-Level)

### Step 1: Convert Static Data to State (5 min)
- Change Line 33 from `const plants =` to `const [plants, setPlants] = useState<PlantLocation[]>([])`
- Change Line 39 from `const vehiclesAtPlants =` to `const [vehiclesAtPlants, setVehiclesAtPlants] = useState<VehicleAtPlant[]>([])`
- Delete hardcoded arrays

### Step 2: Connect to Socket.IO (10 min)
- Import Socket.IO (if not using shared context)
- Listen for geofence update events
- Transform data to match current structure

### Step 3: Update State on Socket Events (10 min)
- Parse incoming geofence data
- Map to `PlantLocation[]` format
- Call `setPlants()` and `setVehiclesAtPlants()`

### Step 4: Handle Edge Cases (5 min)
- Empty locations (no vehicles)
- Vehicles with no geofence (not at any location)
- Connection loss handling

### Step 5: Test (5 min)
- Verify counts update in real-time
- Check expand/collapse still works
- Confirm vehicle list updates

---

## 7. Testing Checklist

- [ ] Plants list populated from Socket.IO
- [ ] Vehicle counts update in real-time
- [ ] Engine on/off counts accurate
- [ ] Vehicles appear in correct plant sections
- [ ] Expand/collapse functionality works
- [ ] No console errors
- [ ] Empty plants show 0 vehicles
- [ ] UI updates smoothly without flicker

---

## 8. Common Issues & Solutions

**Issue:** Plants not showing
- **Solution:** Check if Socket.IO event name is correct, verify data transformation

**Issue:** Vehicle counts incorrect
- **Solution:** Verify backend is sending accurate counts, check if filtering logic is correct

**Issue:** Vehicles appear in wrong plant
- **Solution:** Check `plantName` or `geofence_id` mapping is correct

**Issue:** Old data not clearing
- **Solution:** Clear state before updating with new data from socket

---

## 9. Important Notes

**Data Availability:** Confirm with backend team:
- Is geofence data available via Socket.IO?
- What is the event name?
- What is the exact payload structure?

**Fallback:** If Socket.IO doesn't provide geofence data:
- Calculate geofences on frontend using vehicle positions
- Use existing static data until backend integration is ready
- Request backend team to add geofence:update event

---

**Estimated Time:** 30-45 minutes (after confirming Socket.IO event availability)
