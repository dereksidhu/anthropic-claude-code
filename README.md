# Global Port Status Tracker

A real-time web application for monitoring global port closures and congestion levels worldwide.

## Features

- **Interactive World Map**: Visualize all ports on an interactive Leaflet map with color-coded markers indicating status
- **Real-time Updates**: Simulated live data updates every 5 seconds showing changing port conditions
- **Port Status Tracking**: Monitor port statuses (Open, Congested, Closed, Partial)
- **Congestion Levels**: Track congestion from None to Severe
- **Alert System**: View active alerts for weather, strikes, maintenance, security, and capacity issues
- **Filtering & Search**: Filter ports by status, congestion level, region, or search by name/country
- **Detailed Port Info**: Click any port to view detailed statistics including wait times, vessel counts, and capacity

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Leaflet** & **React-Leaflet** for interactive maps
- **Tailwind CSS** for styling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard/      # Port details panel
│   ├── Header/         # App header with statistics
│   ├── Map/            # Leaflet map component
│   ├── PortCard/       # Individual port cards
│   ├── Sidebar/        # Port list and filters
│   └── StatusBadge/    # Status indicator badges
├── data/
│   └── ports.ts        # Initial port data (20 major ports)
├── hooks/
│   └── usePorts.ts     # Port data hook with filtering
├── services/
│   └── portService.ts  # Port data service with real-time simulation
├── types/
│   └── port.ts         # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Ports Covered

The application tracks 20 major ports across all continents:

- **Asia**: Shanghai, Singapore, Hong Kong, Busan, Tokyo, Colombo, Mumbai
- **Europe**: Rotterdam, Hamburg, Antwerp, Felixstowe, Piraeus
- **North America**: Los Angeles, Long Beach, Vancouver
- **South America**: Santos
- **Middle East**: Jebel Ali (Dubai)
- **Africa**: Durban, Alexandria
- **Oceania**: Sydney

## Extending with Real Data

To connect to a real data source, modify `src/services/portService.ts` to fetch from your API instead of using the simulated updates.
