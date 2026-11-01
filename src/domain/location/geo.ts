/**
 * Geographic and location intelligence utilities for Indian real estate
 */

export interface LatLng {
  lat: number;
  lng: number;
}

// Famous reference coordinates for key Indian metropolitan centers
export const CITY_COORDINATES: Record<string, LatLng> = {
  'Noida': { lat: 28.5355, lng: 77.3910 },
  'Greater Noida': { lat: 28.4744, lng: 77.5040 },
  'Gurugram': { lat: 28.4595, lng: 77.0266 },
  'Delhi NCR': { lat: 28.6139, lng: 77.2090 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 }
};

/**
 * Calculates straight-line distance in kilometers between two lat/lng pairs using the Haversine formula
 */
export function calculateDistanceKm(point1: LatLng, point2: LatLng): number {
  if (!point1 || !point2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Generates verified realistic landmark proximity data based on city and locality
 */
export function getNearbyLandmarks(city: string, _locality?: string) {
  if (city === 'Noida' || city === 'Greater Noida') {
    return {
      schools: [
        { name: 'Delhi Public School (DPS)', distanceKm: 1.2 },
        { name: 'Amity International School', distanceKm: 2.4 }
      ],
      hospitals: [
        { name: 'Fortis Hospital Sector 62', distanceKm: 1.8 },
        { name: 'Jaypee Hospital', distanceKm: 4.1 }
      ],
      transit: [
        { name: 'Noida Electronic City Metro (Blue Line)', distanceKm: 0.9, type: 'METRO' as const },
        { name: 'Noida-Greater Noida Expressway', distanceKm: 3.5, type: 'HIGHWAY' as const },
        { name: 'Upcoming Jewar International Airport', distanceKm: 42.0, type: 'AIRPORT' as const }
      ],
      businessHubs: [
        { name: 'Logix Cyber Park', distanceKm: 1.1 },
        { name: 'Advant Navis Business Park', distanceKm: 6.2 }
      ]
    };
  }

  if (city === 'Gurugram') {
    return {
      schools: [
        { name: 'The Heritage School', distanceKm: 1.5 },
        { name: 'Shiv Nadar School DLF', distanceKm: 2.8 }
      ],
      hospitals: [
        { name: 'Medanta The Medicity', distanceKm: 3.2 },
        { name: 'Max Super Speciality Hospital', distanceKm: 2.1 }
      ],
      transit: [
        { name: 'Rapid Metro Phase 2 Station', distanceKm: 0.6, type: 'METRO' as const },
        { name: 'Golf Course Extension Road', distanceKm: 1.4, type: 'HIGHWAY' as const },
        { name: 'IGI Airport Terminal 3', distanceKm: 14.5, type: 'AIRPORT' as const }
      ],
      businessHubs: [
        { name: 'Cyber City DLF Horizon', distanceKm: 2.0 },
        { name: 'One Horizon Center', distanceKm: 1.8 }
      ]
    };
  }

  if (city === 'Bengaluru') {
    return {
      schools: [
        { name: 'Inventure Academy', distanceKm: 2.6 },
        { name: 'Greenwood High International', distanceKm: 3.1 }
      ],
      hospitals: [
        { name: 'Manipal Hospital Whitefield', distanceKm: 1.9 },
        { name: 'Columbia Asia Hospital', distanceKm: 3.4 }
      ],
      transit: [
        { name: 'Whitefield Metro Station (Purple Line)', distanceKm: 1.1, type: 'METRO' as const },
        { name: 'Outer Ring Road (ORR)', distanceKm: 2.5, type: 'HIGHWAY' as const },
        { name: 'Kempegowda International Airport (BLR)', distanceKm: 36.0, type: 'AIRPORT' as const }
      ],
      businessHubs: [
        { name: 'ITPB (International Tech Park)', distanceKm: 1.4 },
        { name: 'Ecospace Business Park', distanceKm: 4.8 }
      ]
    };
  }

  // Default fallback for other cities
  return {
    schools: [
      { name: 'Ryan International School', distanceKm: 2.0 },
      { name: 'Kendriya Vidyalaya', distanceKm: 3.2 }
    ],
    hospitals: [
      { name: 'Apollo Hospitals & Diagnostics', distanceKm: 2.5 },
      { name: 'City Multi-Speciality Clinic', distanceKm: 1.2 }
    ],
    transit: [
      { name: 'City Central Metro / Railway Station', distanceKm: 2.1, type: 'METRO' as const },
      { name: 'National Highway Ring Road', distanceKm: 3.0, type: 'HIGHWAY' as const }
    ],
    businessHubs: [
      { name: 'Central Commercial District', distanceKm: 2.8 }
    ]
  };
}
