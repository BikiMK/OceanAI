// Species Dictionary - Common and scientific names with primary regions
export interface MarineSpecies {
  commonName: string;
  scientificName: string;
  synonyms: string[];
  primaryRegions: string[];
  habitat: string;
}

export const speciesDictionary: Record<string, MarineSpecies> = {
  // Popular commercial fish
  'hilsa': {
    commonName: 'Hilsa',
    scientificName: 'Tenualosa ilisha',
    synonyms: ['hilsa fish', 'ilish', 'hilsha', 'tenualosa ilisha'],
    primaryRegions: ['bayofbengal', 'arabiansea', 'indian'],
    habitat: 'Coastal and estuarine waters'
  },
  'tuna': {
    commonName: 'Tuna',
    scientificName: 'Thunnus spp.',
    synonyms: ['bluefin tuna', 'yellowfin tuna', 'skipjack tuna', 'thunnus'],
    primaryRegions: ['pacific', 'atlantic', 'indian', 'mediterranean'],
    habitat: 'Open ocean pelagic'
  },
  'bluefintuna': {
    commonName: 'Bluefin Tuna',
    scientificName: 'Thunnus thynnus',
    synonyms: ['bluefin', 'northern bluefin tuna', 'thunnus thynnus'],
    primaryRegions: ['atlantic', 'mediterranean', 'pacific'],
    habitat: 'Open ocean pelagic'
  },
  'salmon': {
    commonName: 'Salmon',
    scientificName: 'Salmo salar',
    synonyms: ['atlantic salmon', 'pacific salmon', 'salmo salar', 'oncorhynchus'],
    primaryRegions: ['pacific', 'atlantic', 'northsea'],
    habitat: 'Anadromous - rivers and ocean'
  },
  'cod': {
    commonName: 'Cod',
    scientificName: 'Gadus morhua',
    synonyms: ['atlantic cod', 'gadus morhua', 'codfish'],
    primaryRegions: ['atlantic', 'northsea', 'pacific'],
    habitat: 'Cold water demersal'
  },
  'herring': {
    commonName: 'Herring',
    scientificName: 'Clupea harengus',
    synonyms: ['atlantic herring', 'clupea harengus', 'herring fish'],
    primaryRegions: ['atlantic', 'northsea', 'pacific'],
    habitat: 'Pelagic schooling fish'
  },
  'sardine': {
    commonName: 'Sardine',
    scientificName: 'Sardina pilchardus',
    synonyms: ['european sardine', 'sardina pilchardus', 'pilchard'],
    primaryRegions: ['atlantic', 'mediterranean', 'pacific'],
    habitat: 'Coastal pelagic'
  },
  'mackerel': {
    commonName: 'Mackerel',
    scientificName: 'Scomber scombrus',
    synonyms: ['atlantic mackerel', 'scomber scombrus', 'indian mackerel'],
    primaryRegions: ['atlantic', 'indian', 'bayofbengal', 'arabiansea'],
    habitat: 'Pelagic migratory'
  },
  'pomfret': {
    commonName: 'Pomfret',
    scientificName: 'Pampus argenteus',
    synonyms: ['silver pomfret', 'pampus argenteus', 'white pomfret'],
    primaryRegions: ['indian', 'bayofbengal', 'arabiansea'],
    habitat: 'Coastal waters'
  },
  'kingfish': {
    commonName: 'Kingfish',
    scientificName: 'Scomberomorus commerson',
    synonyms: ['king mackerel', 'scomberomorus commerson', 'spanish mackerel'],
    primaryRegions: ['indian', 'arabiansea', 'gulfofmexico'],
    habitat: 'Coastal pelagic'
  },
  'rohu': {
    commonName: 'Rohu',
    scientificName: 'Labeo rohita',
    synonyms: ['labeo rohita', 'rui fish', 'rohita'],
    primaryRegions: ['bayofbengal', 'indian'],
    habitat: 'Freshwater and brackish'
  },
  'catla': {
    commonName: 'Catla',
    scientificName: 'Catla catla',
    synonyms: ['catla catla', 'katla fish', 'catla fish'],
    primaryRegions: ['bayofbengal', 'indian'],
    habitat: 'Freshwater rivers and lakes'
  }
};

// Reverse lookup for scientific names
export const scientificNameLookup: Record<string, string> = {};
Object.entries(speciesDictionary).forEach(([key, species]) => {
  const scientificKey = species.scientificName.toLowerCase().replace(/[^a-z]/g, '');
  scientificNameLookup[scientificKey] = key;
});

export function findSpecies(speciesText: string): MarineSpecies | null {
  const normalized = speciesText.toLowerCase().replace(/[^a-z]/g, '');
  
  // Direct match first
  if (speciesDictionary[normalized]) {
    return speciesDictionary[normalized];
  }
  
  // Check scientific name
  if (scientificNameLookup[normalized]) {
    return speciesDictionary[scientificNameLookup[normalized]];
  }
  
  // Search through synonyms
  for (const [key, species] of Object.entries(speciesDictionary)) {
    if (species.synonyms.some(synonym => 
      normalized.includes(synonym.replace(/[^a-z]/g, '')) ||
      synonym.replace(/[^a-z]/g, '').includes(normalized)
    )) {
      return species;
    }
  }
  
  return null;
}