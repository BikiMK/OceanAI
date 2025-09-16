// Marine Gazetteer - Accurate coordinates and ocean data for major water bodies
export interface MarineRegion {
  name: string;
  canonicalName: string;
  synonyms: string[];
  coordinates: {
    lat: number;
    lng: number;
    zoom: number;
    bbox: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
  };
  oceanMetrics: {
    salinityPSU: number;
    pH: number;
    temperatureC: number;
    popularFishes: string[];
  };
}

export const marineGazetteer: Record<string, MarineRegion> = {
  // Major Oceans
  'pacific': {
    name: 'Pacific Ocean',
    canonicalName: 'pacific',
    synonyms: ['pacific ocean', 'pacific', 'north pacific', 'south pacific'],
    coordinates: {
      lat: 0,
      lng: -140,
      zoom: 3,
      bbox: [-60, -180, 60, -70]
    },
    oceanMetrics: {
      salinityPSU: 34.6,
      pH: 8.1,
      temperatureC: 19.4,
      popularFishes: ['Pacific Salmon', 'Tuna', 'Mahi Mahi', 'Pacific Cod', 'Yellowfin Tuna']
    }
  },
  'atlantic': {
    name: 'Atlantic Ocean',
    canonicalName: 'atlantic',
    synonyms: ['atlantic ocean', 'atlantic', 'north atlantic', 'south atlantic'],
    coordinates: {
      lat: 14,
      lng: -30,
      zoom: 3,
      bbox: [-70, -80, 70, 20]
    },
    oceanMetrics: {
      salinityPSU: 35.4,
      pH: 8.1,
      temperatureC: 16.9,
      popularFishes: ['Atlantic Cod', 'Bluefin Tuna', 'Herring', 'Mackerel', 'Haddock']
    }
  },
  'indian': {
    name: 'Indian Ocean',
    canonicalName: 'indian',
    synonyms: ['indian ocean', 'indian'],
    coordinates: {
      lat: -20,
      lng: 80,
      zoom: 3,
      bbox: [-50, 20, 30, 150]
    },
    oceanMetrics: {
      salinityPSU: 34.8,
      pH: 8.0,
      temperatureC: 22.0,
      popularFishes: ['Yellowfin Tuna', 'Skipjack Tuna', 'Barramundi', 'Kingfish', 'Coral Trout']
    }
  },
  'mediterranean': {
    name: 'Mediterranean Sea',
    canonicalName: 'mediterranean',
    synonyms: ['mediterranean sea', 'mediterranean', 'med sea'],
    coordinates: {
      lat: 35,
      lng: 18,
      zoom: 5,
      bbox: [30, -6, 46, 42]
    },
    oceanMetrics: {
      salinityPSU: 38.5,
      pH: 8.2,
      temperatureC: 21.0,
      popularFishes: ['Bluefin Tuna', 'Sea Bass', 'Sardine', 'Anchovy', 'Red Mullet']
    }
  },
  'bayofbengal': {
    name: 'Bay of Bengal',
    canonicalName: 'bayofbengal',
    synonyms: ['bay of bengal', 'bengal bay', 'bengal', 'bay bengal'],
    coordinates: {
      lat: 15,
      lng: 88,
      zoom: 5,
      bbox: [5, 80, 25, 100]
    },
    oceanMetrics: {
      salinityPSU: 32.5,
      pH: 7.9,
      temperatureC: 28.0,
      popularFishes: ['Hilsa', 'Indian Mackerel', 'Pomfret', 'Rohu', 'Catla']
    }
  },
  'arabiansea': {
    name: 'Arabian Sea',
    canonicalName: 'arabiansea',
    synonyms: ['arabian sea', 'arabian', 'sea of arabia'],
    coordinates: {
      lat: 16,
      lng: 65,
      zoom: 5,
      bbox: [0, 50, 30, 80]
    },
    oceanMetrics: {
      salinityPSU: 36.5,
      pH: 8.0,
      temperatureC: 27.0,
      popularFishes: ['Kingfish', 'Pomfret', 'Sardine', 'Tuna', 'Mackerel']
    }
  },
  'northsea': {
    name: 'North Sea',
    canonicalName: 'northsea',
    synonyms: ['north sea', 'northern sea'],
    coordinates: {
      lat: 56,
      lng: 3,
      zoom: 6,
      bbox: [51, -4, 62, 12]
    },
    oceanMetrics: {
      salinityPSU: 34.0,
      pH: 8.2,
      temperatureC: 9.0,
      popularFishes: ['Cod', 'Haddock', 'Herring', 'Plaice', 'Sole']
    }
  },
  'gulfofindia': {
    name: 'Gulf of India',
    canonicalName: 'gulfofindia',
    synonyms: ['gulf of india', 'indian gulf'],
    coordinates: {
      lat: 10,
      lng: 76,
      zoom: 6,
      bbox: [8, 74, 12, 78]
    },
    oceanMetrics: {
      salinityPSU: 35.0,
      pH: 8.0,
      temperatureC: 28.0,
      popularFishes: ['Kingfish', 'Mackerel', 'Sardine', 'Tuna', 'Snapper']
    }
  },
  'gulfofmexico': {
    name: 'Gulf of Mexico',
    canonicalName: 'gulfofmexico',
    synonyms: ['gulf of mexico', 'mexican gulf', 'gulf mexico'],
    coordinates: {
      lat: 25,
      lng: -90,
      zoom: 6,
      bbox: [18, -98, 31, -80]
    },
    oceanMetrics: {
      salinityPSU: 36.0,
      pH: 8.1,
      temperatureC: 24.0,
      popularFishes: ['Red Snapper', 'Mahi Mahi', 'Grouper', 'Amberjack', 'King Mackerel']
    }
  }
};

export function findMarineRegion(regionText: string): MarineRegion | null {
  const normalized = regionText.toLowerCase().replace(/[^a-z]/g, '');
  
  // Direct match first
  if (marineGazetteer[normalized]) {
    return marineGazetteer[normalized];
  }
  
  // Search through synonyms
  for (const [key, region] of Object.entries(marineGazetteer)) {
    if (region.synonyms.some(synonym => 
      normalized.includes(synonym.replace(/[^a-z]/g, '')) ||
      synonym.replace(/[^a-z]/g, '').includes(normalized)
    )) {
      return region;
    }
  }
  
  return null;
}