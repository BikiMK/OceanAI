// client/src/pages/ai-predictions.tsx
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Thermometer, Brain, Activity, Globe } from "lucide-react";
import Plot from "react-plotly.js";

// Mock auth context for demonstration
const useAuth = () => ({
  user: { name: "Demo User" }
});

// Mock Link component (keep as-is)
const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href}>{children}</a>
);

// Futuristic background (kept the same)
const FuturisticBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-black" />
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "gridMove 20s linear infinite"
          }}
        />
      </div>
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

// PredictionChart (unchanged)
const PredictionChart = ({ searchResults }: { searchResults: any[] }) => {
  if (!searchResults.length) return null;

  const regions = searchResults.map((result) => result.region);
  const populations = searchResults.map((result) => {
    const val = (result.fishPopulation || "").toString().replace("%", "").replace("+", "");
    return parseFloat(val) || 0;
  });
  const colors = populations.map((p) => (p > 0 ? "#10b981" : "#ef4444"));

  const data = [
    {
      x: regions,
      y: populations,
      type: "bar",
      marker: { color: colors, line: { color: "white", width: 1 } },
      hovertemplate: "<b>%{x}</b><br>Population Change: %{y}%<extra></extra>"
    }
  ];

  const layout = {
    title: { text: "Fish Population Predictions by Region", font: { size: 18, color: "#ffffff" } },
    xaxis: { title: { text: "Regions", color: "#e2e8f0" }, tickfont: { color: "#e2e8f0" }, gridcolor: "rgba(255,255,255,0.1)" },
    yaxis: { title: { text: "Population Change (%)", color: "#e2e8f0" }, tickfont: { color: "#e2e8f0" }, gridcolor: "rgba(255,255,255,0.1)" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(17,24,39,0.8)",
    font: { color: "#e2e8f0" },
    margin: { l: 50, r: 20, b: 50, t: 50 },
    showlegend: false
  };

  return <Plot data={data} layout={layout} config={{ responsive: true, displayModeBar: true }} style={{ width: "100%", height: "400px" }} className="rounded-lg border border-white/20" />;
};

// Species -> coordinates mapping you provided
const SPECIES_COORDS: Record<string, [number, number]> = {
  "Hilsa": [22.0, 90.0],                // Padma/Meghna Delta, Bangladesh
  "Indian Mackerel": [15.5, 73.8],      // Goa, India (Arabian Sea)
  "Pomfret": [19.0, 72.8],              // Mumbai, India (Arabian Sea)
  "Rohu": [16.5, 87.5],                 // Godavari River, India
  "Catla": [23.2, 88.4],                // West Bengal rivers, India
  "Tuna": [0.0, -160.0],                // Central Pacific Ocean
  "Salmon": [60.0, -150.0],             // Alaska, USA
  "Sardine": [36.5, -6.3],              // Cádiz, Spain
  "Mackerel": [55.0, -5.0],             // Scottish waters, UK
  "Anchovy": [37.9, 23.7],              // Aegean Sea, Greece
  "Atlantic Salmon": [63.0, -8.0],      // West coast of Ireland
  "Barramundi": [-12.5, 130.8],         // Darwin, Northern Australia
  "Bigeye Tuna": [0.5, -150.0],         // Equatorial Pacific
  "Bluefin Tuna": [41.0, 5.0],          // Western Mediterranean Sea
  "Seer Fish (King Mackerel)": [12.9, 74.8], // Mangalore coast, India
  "Skipjack Tuna": [-5.0, 160.0],       // Solomon Islands, Pacific
  "Tilapia": [15.5, 73.8],               // Lake Victoria, Uganda
  "Yellowfin Tuna": [5.0, -80.0],       // Offshore Ecuador, Pacific
  "Rohu (river)": [24.0, 85.0],         // Bihar rivers, India

  // Extra popular fishes
  "Cod": [67.0, 14.5],                  // Lofoten, Norway
  "Haddock": [57.0, -4.0],              // North Sea, Scotland
  "Halibut": [59.0, -151.5],            // Homer, Alaska
  "Snapper": [-36.8, 175.0],            // Hauraki Gulf, New Zealand
  "Grouper": [25.5, -80.2],             // Florida Keys, USA
  "Swordfish": [34.0, -24.0],           // Mid-Atlantic Ocean
  "Mahseer": [31.0, 77.0],              // Himalayan rivers, India
  "Clownfish": [-8.5, 115.5],           // Bali, Indonesia
  "Shark (Great White)": [-34.0, 18.5], // Gansbaai, South Africa
  "Eel": [52.5, 5.0],                   // Netherlands (IJsselmeer)
};


// Helper to find coordinate for a species name (case-insensitive)
const findSpeciesCoords = (speciesName: string | undefined): [number, number] | null => {
  if (!speciesName) return null;
  for (const key of Object.keys(SPECIES_COORDS)) {
    if (key.toLowerCase() === speciesName.toLowerCase()) return SPECIES_COORDS[key];
  }
  for (const key of Object.keys(SPECIES_COORDS)) {
    if (speciesName.toLowerCase().includes(key.toLowerCase())) return SPECIES_COORDS[key];
  }
  return null;
};

// LeafletMap: updated so it zooms on species markers when user searches fish names
const LeafletMap = ({ regionData }: { regionData?: any }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      const map = L.map(mapRef.current, { zoomControl: true, attributionControl: true }).setView([20, 0], 2);
      mapInstanceRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© AI Ocean Engine | OceanAI", maxZoom: 18 }).addTo(map);
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !regionData) return;
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!L) return;

    // Remove existing markers
    markersRef.current.forEach((m) => {
      try { map.removeLayer(m); } catch {}
    });
    markersRef.current = [];

    // Determine coordinates we can use to center/fit the map:
    // Priority:
    // 1) bbox if provided
    // 2) coordinates (region center) if provided
    // 3) species-specific coordinates from topFishes or single species
    const bbox = regionData?.coordinates?.bbox;
    const regionCenter: [number, number] | null = regionData?.coordinates ? [regionData.coordinates.lat, regionData.coordinates.lng] : null;

    // Collect species coords (from topFishes array or species field)
    const topFishes: string[] = Array.isArray(regionData?.topFishes) ? regionData.topFishes : [];
    const speciesToPlace = topFishes.length ? topFishes : (regionData?.species ? [regionData.species] : []);
    const speciesCoords: [number, number][] = [];

    speciesToPlace.forEach((s: string) => {
      const coords = findSpeciesCoords(s) || null;
      if (coords) speciesCoords.push(coords);
    });

    // If bbox present, prefer fitting bounds to bbox
    if (bbox && Array.isArray(bbox) && bbox.length === 4) {
      const bounds = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]];
      try {
        map.fitBounds(bounds, { animate: true, duration: 1.0, padding: [30, 30] });
      } catch {
        // fallback to region center if fitBounds fails
        if (regionCenter) map.setView(regionCenter, regionData.coordinates?.zoom || 6);
      }
    } else if (speciesCoords.length > 1) {
      // Fit to species coords bounds
      const bounds = speciesCoords.map((c) => [c[0], c[1]]);
      try {
        map.fitBounds(bounds as any, { animate: true, duration: 1.0, padding: [60, 60] });
      } catch {
        // fallback: center on first species
        const first = speciesCoords[0];
        if (first) map.flyTo(first, 6, { animate: true, duration: 1.0 });
      }
    } else if (speciesCoords.length === 1) {
      // Single species: zoom closer so user sees it clearly
      const single = speciesCoords[0];
      try {
        map.flyTo(single, 7, { animate: true, duration: 1.0 });
      } catch {
        if (regionCenter) map.flyTo(regionCenter, 6, { animate: true, duration: 1.0 });
      }
    } else if (regionCenter) {
      // No species coords: use region center but zoom more than default to show detail
      const requestedZoom = regionData.coordinates?.zoom ? Math.max(regionData.coordinates.zoom, 6) : 6;
      try {
        map.flyTo(regionCenter, requestedZoom, { animate: true, duration: 1.0 });
      } catch {
        map.setView(regionCenter, requestedZoom);
      }
    }

    // Add main region center marker (if exists)
    if (regionCenter) {
      const mainIcon = L.divIcon({
        html: `<div style="background: radial-gradient(circle, #2b2b2b 0%, #111827 100%); border: 2px solid #0b0b0b; border-radius:50%; width:20px; height:20px; box-shadow:0 0 10px rgba(0,0,0,0.6);"></div>`,
        className: "main-prediction-icon",
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      const mainMarker = L.marker(regionCenter, { icon: mainIcon }).addTo(map);
      mainMarker.bindPopup(`<b>${regionData.regionCanonical || regionData.region || "Region"}</b>`).openPopup();
      markersRef.current.push(mainMarker);
    }

    // Add species markers (use speciesCoords OR fallback to regionCenter clustered offsets if no species coords)
    const darkPalette = ["#064e3b", "#5b2c06", "#3f3f46", "#3b1f1f", "#553c1f", "#2b2340"];

    if (speciesToPlace.length > 0) {
      speciesToPlace.forEach((s: string, idx: number) => {
        const normalized = s?.toString()?.trim();
        const coords = findSpeciesCoords(normalized) || regionCenter || [0, 0];
        const color = darkPalette[idx % darkPalette.length];

        const icon = L.divIcon({
          html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #000;box-shadow:0 0 8px rgba(0,0,0,0.6);"></div>`,
          className: "species-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker(coords, { icon }).addTo(map);
        const popupHtml = `
          <div style="font-family:Inter, sans-serif; min-width:180px; color:#07203c;">
            <div style="font-weight:700; margin-bottom:6px;">${s}</div>
            <div style="font-size:12px; color:#334155;">Region: ${regionData.regionCanonical || regionData.region || "N/A"}</div>
            <div style="font-size:12px; color:#334155;">Population: ${regionData.fishPopulation || "N/A"}</div>
          </div>
        `;
        marker.bindPopup(popupHtml);
        markersRef.current.push(marker);
      });
    }

  }, [regionData]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg relative overflow-hidden border border-gray-200"
      style={{ minHeight: "400px", zIndex: 1, position: "relative", background: "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)" }}
    />
  );
};

// MAIN COMPONENT
const AIPredictions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [rawModelOutput, setRawModelOutput] = useState<any>(null);
  const { user } = useAuth();

  // direct backend endpoint
  const BACKEND_PREDICT_URL = "http://127.0.0.1:8000/predict";

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    if (!user) return;

    setIsGenerating(true);
    try {
      const response = await fetch(BACKEND_PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });

      const data = await response.json();

      if (!response.ok) {
        setRawModelOutput(null);
        setSearchResults([]);
        throw new Error(data.error || "Prediction failed");
      }

      setRawModelOutput(data);

      const baseResults = [
        {
          id: "1",
          species: data.species || searchQuery,
          region: data.regionCanonical || data.region || "North Atlantic",
          timeframe: "12 months",
          scenario: "Current Conditions",
          fishPopulation: data.fishPopulation || "+12.7%",
          climateChange: data.climateChange || "-5.2%",
          geneticDiversity: data.geneticDiversity || "High",
          confidence: data.confidence || "91%",
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          species: data.species || searchQuery,
          region: "Pacific Ocean",
          timeframe: "12 months",
          scenario: "RCP 4.5",
          fishPopulation: data.fishPopulation || "+8.9%",
          climateChange: data.climateChange || "-9.4%",
          geneticDiversity: data.geneticDiversity || "Medium",
          confidence: data.confidence || "84%",
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          species: data.species || searchQuery,
          region: data.region || "Mediterranean",
          timeframe: "12 months",
          scenario: "RCP 8.5",
          fishPopulation: data.fishPopulation || "-3.2%",
          climateChange: data.climateChange || "-15.7%",
          geneticDiversity: data.geneticDiversity || "Low",
          confidence: data.confidence || "88%",
          createdAt: new Date().toISOString()
        }
      ];

      setSearchResults(baseResults);
    } catch (error) {
      console.error("Prediction failed:", error);
      const mockResults = [
        { id: "1", species: searchQuery, region: "North Atlantic", timeframe: "12 months", scenario: "Current Conditions", fishPopulation: "+12.7%", climateChange: "-5.2%", geneticDiversity: "High", confidence: "91%", createdAt: new Date().toISOString() },
        { id: "2", species: searchQuery, region: "Pacific Ocean", timeframe: "12 months", scenario: "RCP 4.5", fishPopulation: "+8.9%", climateChange: "-9.4%", geneticDiversity: "Medium", confidence: "84%", createdAt: new Date().toISOString() },
        { id: "3", species: searchQuery, region: "Mediterranean", timeframe: "12 months", scenario: "RCP 8.5", fishPopulation: "-3.2%", climateChange: "-15.7%", geneticDiversity: "Low", confidence: "88%", createdAt: new Date().toISOString() }
      ];
      setSearchResults(mockResults);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <FuturisticBackground />
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="mb-8 backdrop-blur-md bg-black/40 border-cyan-500/30 shadow-2xl rounded-3xl p-12 border-2">
              <div className="relative mb-6">
                <Brain className="w-20 h-20 text-cyan-400 mx-auto animate-pulse" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 font-mono">NEURAL ENGINE</h1>
              <div className="text-lg text-cyan-300 mb-8 font-mono">[ AUTHENTICATION REQUIRED ]<br />ACCESS_LEVEL: RESTRICTED</div>
              <Link href="/auth"><Button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black px-10 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25 font-mono font-bold border border-cyan-400/50">INITIALIZE_SESSION</Button></Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <FuturisticBackground />

      {/* Header + Search */}
      <section className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl mr-6 border border-cyan-400/30"><Brain className="w-12 h-12 text-cyan-400 animate-pulse" /></div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">OCEAN_AI</h1>
                <div className="text-cyan-300 font-mono text-sm mt-2">v1.0.0 | QUANTUM_READY</div>
              </div>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-mono">[ OCEAN_INTELLIGENCE_SYSTEM ] Deep learning predictions for marine ecosystems</p>
          </div>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <Input placeholder="Search species or region (e.g., 'Hilsa in Bay of Bengal')" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200" />
                </div>
                <Button onClick={handleSearch} disabled={isGenerating || !searchQuery.trim()} className="h-12 px-8 bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                  {isGenerating ? (<><Activity className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>) : (<><Brain className="w-4 h-4 mr-2" />Predict</>)}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Output */}
          {rawModelOutput && (
            <div className="mt-6">
              <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Brain className="w-5 h-5 mr-2 text-green-400" />AI Model Output - OceanAI Model
                    {rawModelOutput.model_used && <Badge className="ml-2 bg-green-900/50 text-green-300 border-green-700">✅ Model Active</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Quick Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/10 rounded-lg border border-white/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{rawModelOutput.stock_status || (rawModelOutput.prediction ? rawModelOutput.prediction.replace("Stock Status: ", "") : "Unknown")}</div>
                        <div className="text-sm text-blue-200">Stock Status</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-400">{rawModelOutput.confidence || "N/A"}</div>
                        <div className="text-sm text-blue-200">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">Class {rawModelOutput.prediction_class ?? "—"}</div>
                        <div className="text-sm text-blue-200">Prediction Class</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-300">{rawModelOutput.regionCanonical || rawModelOutput.region || "—"}</div>
                        <div className="text-sm text-blue-200">Canonical Region</div>
                      </div>
                    </div>

                    {/* Raw JSON (Scientific name kept here only) */}
                    <div className="bg-black/30 rounded-lg p-4 border border-white/20">
                      <h4 className="text-sm font-semibold text-blue-200 mb-2">Raw Model Response:</h4>
                      <pre className="text-xs text-green-300 overflow-x-auto whitespace-pre-wrap max-h-60 overflow-y-auto">
                        {JSON.stringify(rawModelOutput, null, 2)}
                      </pre>
                    </div>

                    {/* Class Probabilities */}
                    {rawModelOutput.class_probabilities && (
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <h4 className="text-sm font-semibold text-blue-200 mb-3">Class Probabilities:</h4>
                        <div className="space-y-2">
                          {rawModelOutput.class_probabilities.map((prob: number, index: number) => {
                            const labels = ["Declining", "Stable", "Increasing"];
                            const colors = ["bg-red-500", "bg-yellow-500", "bg-green-500"];
                            return (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="w-20 text-sm text-blue-200">{labels[index]}:</div>
                                <div className="flex-1 bg-white/20 rounded-full h-2 relative overflow-hidden">
                                  <div className={`${colors[index]} h-2 rounded-full`} style={{ width: `${prob * 100}%` }} />
                                </div>
                                <div className="w-16 text-sm text-blue-200 text-right">{(prob * 100).toFixed(1)}%</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Top fishes */}
                    {rawModelOutput.topFishes && Array.isArray(rawModelOutput.topFishes) && rawModelOutput.topFishes.length > 0 && (
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <h4 className="text-sm font-semibold text-blue-200 mb-3">Top fishes in this region</h4>
                        <div className="flex flex-wrap gap-2">
                          {rawModelOutput.topFishes.map((f: string, i: number) => (
                            <Badge key={i} className="bg-blue-900/50 text-blue-300 border-blue-700/50">{f}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8">
            {/* Map */}
            <div className="w-full">
              <Card className="h-full backdrop-blur-md bg-white/10 border-white/20 shadow-2xl relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center text-white"><Globe className="w-5 h-5 mr-2 text-blue-400" />Interactive Ocean Map</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="aspect-video rounded-lg overflow-hidden border border-white/20">
                    <LeafletMap regionData={rawModelOutput} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ocean Metrics */}
            {rawModelOutput?.oceanMetrics && (
              <div className="w-full">
                <Card className="h-full backdrop-blur-md bg-white/10 border-white/20 shadow-2xl relative overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white"><Thermometer className="w-5 h-5 mr-2 text-blue-400" />Ocean Environmental Data</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/20">
                        <div className="text-2xl font-bold text-cyan-400">{rawModelOutput.oceanMetrics.Sea_Surface_Temperature_C}°C</div>
                        <div className="text-xs text-white/70">Sea Surface</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/20">
                        <div className="text-2xl font-bold text-green-400">{rawModelOutput.oceanMetrics.Salinity_PSU}</div>
                        <div className="text-xs text-white/70">Salinity (PSU)</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/20">
                        <div className="text-2xl font-bold text-purple-400">{rawModelOutput.oceanMetrics.pH_Level}</div>
                        <div className="text-xs text-white/70">pH Level</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/20">
                        <div className="text-lg font-bold text-yellow-400">{rawModelOutput.oceanMetrics.Wind_Speed_ms}</div>
                        <div className="text-xs text-white/70">Wind Speed (m/s)</div>
                      </div>
                    </div>

                    {/* popularFishes within oceanMetrics (if present) */}
                    {rawModelOutput.oceanMetrics.popularFishes && rawModelOutput.oceanMetrics.popularFishes.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3">Popular Fish Species in this Region</h4>
                        <div className="flex flex-wrap gap-2">
                          {rawModelOutput.oceanMetrics.popularFishes.map((fish: string, index: number) => (
                            <Badge key={index} className="bg-blue-900/50 text-blue-300 border-blue-700/50">{fish}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Chart */}
            {searchResults.length > 0 && rawModelOutput?.fishPopulation && (
              <div className="w-full">
                <Card className="h-full backdrop-blur-md bg-white/10 border-white/20 shadow-2xl relative overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white"><TrendingUp className="w-5 h-5 mr-2 text-green-400" />Interactive Prediction Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PredictionChart searchResults={searchResults} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Results cards */}
          {searchResults.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Prediction Results</h2>
                <p className="text-blue-100">AI-generated predictions for "{searchQuery}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result) => (
                  <Card key={result.id} className="backdrop-blur-md bg-white/10 border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">{result.region}</CardTitle>
                        <Badge className="bg-blue-900/50 text-blue-300 border-blue-700/50">{result.confidence} confidence</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg border border-blue-700/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-blue-200">📈 Fish Population</span>
                          <span className={`font-bold ${(result.fishPopulation || "").startsWith("+") ? "text-green-400" : "text-red-400"}`}>{result.fishPopulation}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-700/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-blue-200">🌡️ Climate Impact</span>
                          <span className="font-bold text-red-400">{result.climateChange}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 rounded-lg border border-yellow-700/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-blue-200">🧬 Genetic Risk</span>
                          <Badge className="bg-yellow-900/50 text-yellow-300 border-yellow-700/50">{result.geneticDiversity}</Badge>
                        </div>
                      </div>

                      <div className="text-xs text-blue-200 pt-2 border-t border-white/20">Scenario: {result.scenario} • Timeframe: {result.timeframe}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!searchResults.length && !isGenerating && (
            <div className="mt-12 text-center">
              <div className="max-w-md mx-auto backdrop-blur-md bg-white/10 border-white/20 shadow-2xl rounded-2xl p-8">
                <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">Ready for AI Analysis</h3>
                <p className="text-blue-200">Enter a species or region above to generate AI-powered predictions and insights</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AIPredictions;
