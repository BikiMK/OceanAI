// Marine Knowledge Database - Comprehensive fish and ocean information
export interface MarineKnowledgeEntry {
  commonName: string;
  scientificName: string;
  family: string;
  habitat: string;
  significance: string[];
  physicalDescription?: string;
  distribution?: string;
  culturalImportance?: string;
  nutritionalValue?: string;
  conservationStatus?: string;
  relatedTopics: string[];
}

export const marineKnowledgeBase: { [key: string]: MarineKnowledgeEntry } = {
  "hilsa": {
    commonName: "Hilsa (also called Ilish, Pulasa, or Palva depending on region)",
    scientificName: "Tenualosa ilisha",
    family: "Clupeidae (same family as herrings and sardines)",
    habitat: "Anadromous – it lives in the sea but migrates to rivers (like the Ganges, Padma, Meghna, Godavari) for spawning",
    significance: [
      "One of the most famous and highly valued fish in South Asia, especially in India (West Bengal), Bangladesh (where it's the national fish), and parts of Myanmar",
      "Culinary delicacy, especially during monsoon season",
      "Cultural importance in Bengal and Bangladesh – dishes like Ilish bhapa, Ilish paturi, and Ilish macher jhol are iconic",
      "Rich in Omega-3 fatty acids, though very bony, which makes eating it a skilled art"
    ],
    distribution: "Found in the Indo-Pacific region, primarily in the Bay of Bengal and Arabian Sea",
    conservationStatus: "Near threatened due to overfishing and habitat degradation",
    relatedTopics: ["Bengali cuisine", "Anadromous fish", "Bay of Bengal", "Monsoon fishing", "South Asian culture"]
  },
  
  "tuna": {
    commonName: "Tuna",
    scientificName: "Thunnus species",
    family: "Scombridae (mackerels and tunas)",
    habitat: "Pelagic waters of all major oceans, highly migratory",
    significance: [
      "One of the most commercially important fish globally",
      "Key species for sushi and sashimi cuisine",
      "Critical to marine food webs as both predator and prey",
      "Source of high-quality protein and omega-3 fatty acids"
    ],
    physicalDescription: "Large, torpedo-shaped body built for speed and endurance, with retractable fins",
    distribution: "Found in warm waters of Atlantic, Pacific, and Indian Oceans",
    conservationStatus: "Varies by species - some like Bluefin tuna are critically endangered",
    relatedTopics: ["Commercial fishing", "Sushi", "Ocean conservation", "Pelagic ecosystem", "Migratory fish"]
  },

  "salmon": {
    commonName: "Salmon",
    scientificName: "Salmo and Oncorhynchus species",
    family: "Salmonidae",
    habitat: "Anadromous - born in fresh water, mature in ocean, return to spawn",
    significance: [
      "Iconic species of Pacific Northwest and North Atlantic",
      "Cultural cornerstone for Indigenous communities",
      "Major commercial and recreational fishery",
      "Keystone species in both marine and freshwater ecosystems"
    ],
    physicalDescription: "Streamlined body that changes color during spawning runs",
    distribution: "North Pacific and North Atlantic oceans and their tributary rivers",
    culturalImportance: "Sacred to many Indigenous peoples; featured in art, stories, and ceremonies",
    relatedTopics: ["Pacific Northwest", "Indigenous culture", "Spawning migration", "Ecosystem restoration"]
  },

  "cod": {
    commonName: "Atlantic Cod",
    scientificName: "Gadus morhua",
    family: "Gadidae",
    habitat: "Cold waters of North Atlantic, from shallow coastal areas to continental shelf",
    significance: [
      "Historically one of the most important commercial fish",
      "Drove European exploration and settlement of North America",
      "Traditional staple food preserved as salt cod",
      "Collapse of cod fisheries became symbol of overfishing"
    ],
    distribution: "North Atlantic from Greenland to North Carolina and Europe",
    conservationStatus: "Some populations severely depleted, slowly recovering",
    culturalImportance: "Central to maritime cultures of Atlantic Canada, New England, and Northern Europe",
    relatedTopics: ["Overfishing", "Maritime history", "Fisheries collapse", "Ocean conservation"]
  },

  "shark": {
    commonName: "Sharks",
    scientificName: "Various species in class Chondrichthyes",
    family: "Multiple families including Carcharhinidae, Lamnidae",
    habitat: "All oceans from surface to deep sea, some in fresh water",
    significance: [
      "Apex predators maintaining ocean ecosystem balance",
      "Evolved over 400 million years with unique adaptations",
      "Critical for marine food web stability",
      "Many species threatened by finning and bycatch"
    ],
    physicalDescription: "Cartilaginous skeleton, multiple gill slits, specialized teeth that continuously replace",
    conservationStatus: "Many species endangered due to overfishing and habitat loss",
    culturalImportance: "Featured in mythology and modern media, often misunderstood",
    relatedTopics: ["Apex predators", "Cartilaginous fish", "Shark finning", "Marine conservation", "Ocean ecosystem"]
  },

  "whale": {
    commonName: "Whales",
    scientificName: "Various cetacean species",
    family: "Multiple families including Balaenidae, Physeteridae",
    habitat: "All oceans, from polar to tropical waters",
    significance: [
      "Largest animals ever to exist on Earth",
      "Critical for ocean nutrient cycling through whale pump",
      "Complex social behaviors and communication",
      "Indicator species for ocean health"
    ],
    physicalDescription: "Marine mammals with streamlined bodies, blowholes, and specialized feeding adaptations",
    conservationStatus: "Recovery varies by species; some still endangered",
    culturalImportance: "Featured in literature, art, and Indigenous traditions worldwide",
    relatedTopics: ["Marine mammals", "Whale watching", "Ocean conservation", "Cetacean intelligence", "Whaling history"]
  },

  "coral": {
    commonName: "Coral",
    scientificName: "Various anthozoan species",
    family: "Multiple families in class Anthozoa",
    habitat: "Tropical and subtropical shallow marine waters",
    significance: [
      "Build coral reefs - most biodiverse marine ecosystems",
      "Provide coastal protection from storms and erosion",
      "Support 25% of marine species despite covering <1% of ocean",
      "Generate billions in tourism and fishing revenue"
    ],
    physicalDescription: "Colonial marine animals with calcium carbonate skeletons",
    conservationStatus: "Critically threatened by climate change, bleaching, and acidification",
    culturalImportance: "Sacred to many Pacific Island cultures; basis of many coastal economies",
    relatedTopics: ["Coral reefs", "Climate change", "Ocean acidification", "Marine biodiversity", "Coral bleaching"]
  },

  "plankton": {
    commonName: "Plankton",
    scientificName: "Various microscopic organisms",
    family: "Diverse groups including phytoplankton and zooplankton",
    habitat: "Throughout ocean water column, from surface to deep waters",
    significance: [
      "Base of marine food webs supporting all ocean life",
      "Phytoplankton produce over 50% of Earth's oxygen",
      "Critical for global carbon cycle and climate regulation",
      "Indicators of ocean health and climate change"
    ],
    physicalDescription: "Microscopic organisms including plants, animals, and bacteria",
    distribution: "Found in all ocean waters, with seasonal and regional variations",
    relatedTopics: ["Marine food web", "Ocean productivity", "Climate change", "Carbon cycle", "Marine ecology"]
  }
};

export function searchMarineKnowledge(query: string): MarineKnowledgeEntry | null {
  const searchTerm = query.toLowerCase().trim();
  
  // Direct name matches
  for (const [key, entry] of Object.entries(marineKnowledgeBase)) {
    if (searchTerm.includes(key) || 
        searchTerm.includes(entry.commonName.toLowerCase()) ||
        searchTerm.includes(entry.scientificName.toLowerCase())) {
      return entry;
    }
  }
  
  // Partial matches in significance or topics
  for (const [key, entry] of Object.entries(marineKnowledgeBase)) {
    const allText = [
      entry.commonName,
      entry.significance.join(" "),
      entry.relatedTopics.join(" "),
      entry.habitat,
      entry.culturalImportance || "",
      entry.distribution || ""
    ].join(" ").toLowerCase();
    
    if (allText.includes(searchTerm)) {
      return entry;
    }
  }
  
  return null;
}

export function formatMarineKnowledgeResponse(entry: MarineKnowledgeEntry): string {
  let response = `${entry.commonName} is ${entry.significance[0]}\n\n`;
  response += `Here's a detailed breakdown:\n\n`;
  response += `**Common name:** ${entry.commonName}\n\n`;
  response += `**Scientific name:** ${entry.scientificName}\n\n`;
  response += `**Family:** ${entry.family}\n\n`;
  response += `**Habitat:** ${entry.habitat}\n\n`;
  
  if (entry.physicalDescription) {
    response += `**Physical Description:** ${entry.physicalDescription}\n\n`;
  }
  
  if (entry.distribution) {
    response += `**Distribution:** ${entry.distribution}\n\n`;
  }
  
  response += `**Significance:**\n`;
  entry.significance.forEach(point => {
    response += `• ${point}\n`;
  });
  
  if (entry.culturalImportance) {
    response += `\n**Cultural Importance:** ${entry.culturalImportance}\n`;
  }
  
  if (entry.nutritionalValue) {
    response += `\n**Nutritional Value:** ${entry.nutritionalValue}\n`;
  }
  
  if (entry.conservationStatus) {
    response += `\n**Conservation Status:** ${entry.conservationStatus}\n`;
  }
  
  return response;
}

// Ocean and environmental topics
export function getOceanTopicInfo(query: string): string | null {
  const searchTerm = query.toLowerCase();
  
  const oceanTopics: { [key: string]: string } = {
    "ocean temperature": "Ocean temperatures vary globally and with depth. Surface temperatures range from -2°C in polar regions to over 30°C in tropical areas. Ocean warming due to climate change is causing sea level rise, coral bleaching, and shifts in marine ecosystems. The ocean has absorbed over 90% of excess heat from global warming.",
    
    "sea level rise": "Global sea levels are rising at approximately 3.3 mm per year due to thermal expansion of seawater and melting ice. This threatens coastal communities, infrastructure, and ecosystems. Small island nations face particular risks of displacement.",
    
    "ocean acidification": "The ocean has absorbed about 30% of human-produced CO2, making it more acidic. This 'other CO2 problem' threatens shell-forming organisms like corals, oysters, and some plankton, potentially disrupting entire food webs.",
    
    "marine biodiversity": "Oceans contain 80% of Earth's biodiversity. From microscopic plankton to blue whales, marine ecosystems support complex food webs. However, overfishing, pollution, and climate change threaten this diversity.",
    
    "ocean currents": "Ocean currents are driven by wind, temperature, and salinity differences. They transport heat, nutrients, and marine life globally. Major currents like the Gulf Stream significantly influence regional climates.",
    
    "deep sea": "The deep sea (below 200m) represents 95% of living space on Earth but remains largely unexplored. It hosts unique ecosystems around hydrothermal vents, cold seeps, and abyssal plains, with many species yet undiscovered."
  };
  
  for (const [topic, info] of Object.entries(oceanTopics)) {
    if (searchTerm.includes(topic) || topic.includes(searchTerm)) {
      return info;
    }
  }
  
  return null;
}