import { ParsedQuery, QueryType } from "../shared/schema.js";
import { findMarineRegion } from "../shared/marineGazetteer.js";
import { findSpecies } from "../shared/speciesDictionary.js";

export function parseMarineQuery(query: string): ParsedQuery {
  const originalQuery = query;
  const normalized = query.toLowerCase().trim();
  
  // Look for species in the query
  const speciesMatch = findSpecies(normalized);
  
  // Look for regions in the query
  const regionMatch = findMarineRegion(normalized);
  
  // Detect query type based on what we found
  let queryType: QueryType;
  
  if (speciesMatch && regionMatch) {
    // Both species and region found - composite query
    queryType = 'composite';
  } else if (speciesMatch) {
    // Only species found
    queryType = 'species';
  } else if (regionMatch) {
    // Only region/ocean found
    queryType = 'ocean';
  } else {
    // Default to species search for marine-related terms
    queryType = 'species';
  }
  
  // Extract region text for further processing
  let regionRaw: string | undefined;
  if (regionMatch) {
    regionRaw = regionMatch.canonicalName;
  } else {
    // Try to extract region keywords even if not in gazetteer
    const regionKeywords = ['bay', 'gulf', 'sea', 'ocean', 'strait', 'channel'];
    for (const keyword of regionKeywords) {
      if (normalized.includes(keyword)) {
        const words = normalized.split(' ');
        const keywordIndex = words.findIndex(word => word.includes(keyword));
        if (keywordIndex >= 0) {
          // Take a few words around the keyword
          const start = Math.max(0, keywordIndex - 1);
          const end = Math.min(words.length, keywordIndex + 2);
          regionRaw = words.slice(start, end).join(' ');
          break;
        }
      }
    }
  }
  
  const result: ParsedQuery = {
    queryType,
    originalQuery,
  };
  
  if (speciesMatch) {
    result.species = speciesMatch.commonName;
    result.scientificName = speciesMatch.scientificName;
  }
  
  if (regionRaw) {
    result.regionRaw = regionRaw;
  }
  
  return result;
}

export function resolveRegionCoordinates(regionRaw?: string) {
  if (!regionRaw) {
    // Default fallback to global ocean view
    return {
      lat: 0,
      lng: 0,
      zoom: 2,
      bbox: [-60, -180, 60, 180] as [number, number, number, number]
    };
  }
  
  const region = findMarineRegion(regionRaw);
  if (region) {
    return region.coordinates;
  }
  
  // Fallback heuristics for unknown regions
  if (regionRaw.includes('pacific')) {
    return { lat: 0, lng: -140, zoom: 3, bbox: [-60, -180, 60, -70] as [number, number, number, number] };
  } else if (regionRaw.includes('atlantic')) {
    return { lat: 14, lng: -30, zoom: 3, bbox: [-70, -80, 70, 20] as [number, number, number, number] };
  } else if (regionRaw.includes('indian')) {
    return { lat: -20, lng: 80, zoom: 3, bbox: [-50, 20, 30, 150] as [number, number, number, number] };
  } else if (regionRaw.includes('mediterranean')) {
    return { lat: 35, lng: 18, zoom: 5, bbox: [30, -6, 46, 42] as [number, number, number, number] };
  } else if (regionRaw.includes('bengal')) {
    return { lat: 15, lng: 88, zoom: 5, bbox: [5, 80, 25, 100] as [number, number, number, number] };
  }
  
  // Final fallback
  return {
    lat: 0,
    lng: 0,
    zoom: 2,
    bbox: [-60, -180, 60, 180] as [number, number, number, number]
  };
}