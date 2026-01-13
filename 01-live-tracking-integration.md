# Live Tracking Integration Guide

## 0. Overview & Goal

**What:** Replace static vehicle data with real-time Socket.IO updates to show live vehicle positions, speeds, and statuses on the map.

**Why:** Enables real-time fleet monitoring with automatic updates every 5 seconds without page refresh.

**What You'll Build:**
- Socket.IO connection to backend
- Real-time vehicle marker updates
- onMouseover tooltip showing vehicle details
- Click handler for vehicle details popup

---

## 1. Files to Modify

| File Path | Purpose |
|-----------|---------|
| `components/fleet-map.tsx` | Main map component - replace static vehicle data with Socket.IO updates |
| `components/vehicle-details.tsx` | Vehicle details popup - connect to real-time vehicle data |
| `package.json` | Add `socket.io-client` dependency |

---

## 2. Static Data Locations

### File: `components/fleet-map.tsx`

**Line 8-165:** Static vehicle markers array
```typescript
const vehicleMarkers = [
  // 12 hardcoded vehicles from line 8 to line 165
]
```

**What needs to change:**
- Convert `vehicleMarkers` from a constant to React state
- Remove hardcoded array
- Populate from Socket.IO `vehicles:update` event

---

### File: `components/vehicle-details.tsx`

**Line 207-300+:** Static vehicle data object
```typescript
const vehicleData: Record<string, any> = {
  "W71-19": { ... },
  "W48-23": { ... },
  // More hardcoded vehicles
}
```

**What needs to change:**
- Remove hardcoded `vehicleData` object
- Receive vehicle data as prop from `fleet-map.tsx`
- Display real-time data from Socket.IO

---

## 3. Example of Static Data

### Current Vehicle Marker Structure (fleet-map.tsx, Line 8-21)
```typescript
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
}
```

### Current Vehicle Details Structure (vehicle-details.tsx, Line 208-223)
```typescript
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
}
```

---

## 4. Socket Integration

### A. Install Socket.IO Client

```bash
npm install socket.io-client
```

### B. Socket.IO Connection Details

**Backend URL:** `https://caritest.ddns.net`
**Socket Path:** `/backend/socket.io`
**Authentication:** Required via API key

**Connection Code:**
```typescript
import { io } from 'socket.io-client'

const socket = io('https://caritest.ddns.net', {
  path: '/backend/socket.io',
  transports: ['websocket'],
  auth: {
    apiKey: 'aedk45ddd7kkgsff4',
    token: 'user-session-token' // Get from login
  }
})
```

### C. Socket Events to Listen For

**Event:** `vehicles:update`
**Frequency:** Every 5 seconds
**Payload Structure:**
```typescript
[
  {
    object_id: 260,
    label: '508',
    position: [12.1586, -68.87964],
    time: '05:45 PM',
    date: 'Jan 08, 2026',
    speed: 0,
    heading: 58,
    street: 'Kaya W. Pieters',
    neighborhood: 'Schelpwijk',
    engine: 'OFF',
    kMdriven: 142,
    stopmade: 0,
    last_stop_datetime: '03:12 PM',
    last_stop_street: 'Scharlooweg',
    last_stop_neighborhood: 'Scharloo',
    last_stop_time_spent: 'NA',
    group_id: 3
  }
  // ... more vehicles
]
```

### D. Data Field Mapping

| Socket.IO Field | Current App Field | Component Usage |
|----------------|-------------------|-----------------|
| `label` | `id` | Vehicle identifier (e.g., "W71-19") |
| `position` | `position` | `[lat, lng]` coordinates |
| `speed` | `speed` | Current speed (km/h) |
| `engine` | `status` | Map "ON" → "MOVING", "OFF" → "PARKED" |
| `heading` | `heading` | Vehicle direction (0-360 degrees) |
| `street` | `address` | Street address |
| `neighborhood` | `neighbourhood` | Neighborhood name |
| `kMdriven` | `kmDriven` | Total KM driven |
| `stopmade` | `stopsMade` | Number of stops |
| `last_stop_street` | - | Last stop address |
| `last_stop_datetime` | - | Last stop time |

**Missing Fields (need to calculate or hardcode):**
- `driver` - Not provided by API (hardcode "Kevin Maduro" or leave blank)
- `model` - Not provided by API (hardcode "Toyota Hiace" or leave blank)
- `hoursActive` - Calculate from `time` field or API metadata
- `avgSpeed` - Calculate from speed history or hardcode

---

## 5. Key Explanations

### How Live Tracking Works
1. User logs in → Token stored in localStorage
2. App connects to Socket.IO server with auth token
3. Backend pushes vehicle updates every 5 seconds via `vehicles:update` event
4. Frontend receives updates and updates React state
5. Map markers automatically re-render with new positions

### onMouseover Tooltip Flow
1. User hovers over vehicle marker
2. Trigger `onMouseOver` event on marker
3. Display small tooltip with: Vehicle ID, Speed, Status
4. Tooltip follows cursor or anchors to marker

### Vehicle Details Popup Flow
1. User clicks vehicle marker
2. Trigger `onClick` event on marker
3. Open `VehicleDetails` component with full information
4. Pass vehicle data from Socket.IO state to popup

---

## 6. Implementation Steps (High-Level)

### Step 1: Install Dependencies (2 min)
```bash
npm install socket.io-client
```

### Step 2: Create Socket Connection (10 min)
- Add Socket.IO import to `fleet-map.tsx`
- Connect to backend with auth
- Handle connection errors

### Step 3: Replace Static Data with State (5 min)
- Change Line 8 from `const vehicleMarkers = [...]` to `const [vehicleMarkers, setVehicleMarkers] = useState([])`
- Delete hardcoded array (Lines 8-165)

### Step 4: Listen for Socket Updates (10 min)
- Add `useEffect` hook to listen for `vehicles:update`
- Transform Socket.IO data to match current structure
- Update state with `setVehicleMarkers(transformedData)`

### Step 5: Add Cleanup (3 min)
- Disconnect socket on component unmount
- Remove event listeners

### Step 6: Test Connection (5 min)
- Check browser DevTools Network tab for WebSocket connection
- Verify `vehicles:update` events arriving every 5 seconds
- Confirm markers updating on map

---

## 7. Testing Checklist

- [ ] Socket.IO client installed successfully
- [ ] WebSocket connection shows "connected" in DevTools
- [ ] `vehicles:update` events received every 5 seconds
- [ ] Vehicle markers appear on map
- [ ] Markers update position in real-time
- [ ] No console errors
- [ ] Markers disappear when vehicles go offline
- [ ] onMouseover tooltip displays (implement after socket works)
- [ ] Vehicle details popup opens on click (implement after socket works)

---

## 8. Common Issues & Solutions

**Issue:** Socket won't connect
- **Solution:** Check if auth token exists in localStorage, verify API key is correct

**Issue:** No vehicles showing on map
- **Solution:** Check data transformation - Socket.IO fields must match app structure

**Issue:** Markers not updating
- **Solution:** Verify `setVehicleMarkers()` is called inside socket event listener

**Issue:** Performance issues with many vehicles
- **Solution:** Implement marker clustering (already exists in code)

---

## 9. Next Steps After Socket.IO Works

1. **Add onMouseover Tooltip** - Show quick vehicle info on hover
2. **Connect Vehicle Details Popup** - Pass real-time data to popup
3. **Add Loading States** - Show spinner while connecting
4. **Handle Disconnections** - Show "reconnecting..." message
5. **Optimize Performance** - Throttle updates, use useMemo for expensive calculations

---

**Estimated Time:** 45-60 minutes for complete Socket.IO integration
