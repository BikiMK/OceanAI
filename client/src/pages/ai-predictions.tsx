import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, TrendingUp, Thermometer, Dna, Brain, Activity, Globe, Zap, Cpu, Database, Network } from "lucide-react";
import Plot from 'react-plotly.js';

// Mock auth context for demonstration
const useAuth = () => ({
  user: { name: "Demo User" }
});

// Mock Link component
const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href}>{children}</a>
);

// Enhanced Futuristic Background Component
const FuturisticBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-black" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>
      
      {/* Neural Network Connections */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          {Array.from({ length: 15 }, (_, i) => {
            const x1 = Math.random() * 1000;
            const y1 = Math.random() * 1000;
            const x2 = Math.random() * 1000;
            const y2 = Math.random() * 1000;
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#neuralGradient)"
                  strokeWidth="1"
                  opacity="0.6"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                <circle
                  cx={x1}
                  cy={y1}
                  r="3"
                  fill="#00ffff"
                  opacity="0.8"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              </g>
            );
          })}
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="50%" stopColor="#0066ff" />
              <stop offset="100%" stopColor="#ff00ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Floating Data Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              boxShadow: '0 0 10px currentColor'
            }}
          />
        ))}
      </div>
      
      {/* Holographic Overlays */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '-2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '-4s' }} />
      </div>
      
      {/* Scan Lines Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 3px)',
          animation: 'scanlines 2s linear infinite'
        }}
      />
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
};

// Prediction Chart Component using Plotly.js
const PredictionChart = ({ searchResults }: { searchResults: any[] }) => {
  if (!searchResults.length) return null;

  // Parse fishPopulation to numbers for plotting
  const regions = searchResults.map((result) => result.region);
  const populations = searchResults.map((result) => {
    const val = result.fishPopulation.replace('%', '').replace('+', '').replace('-', '-');
    return parseFloat(val) || 0;
  });
  const colors = populations.map((p) => (p > 0 ? '#10b981' : '#ef4444')); // Green for positive, red for negative

  const data = [
    {
      x: regions,
      y: populations,
      type: 'bar',
      marker: {
        color: colors,
        line: {
          color: 'white',
          width: 1
        }
      },
      hovertemplate: '<b>%{x}</b><br>Population Change: %{y}%<extra></extra>'
    }
  ];

  const layout = {
    title: {
      text: 'Fish Population Predictions by Region',
      font: {
        size: 18,
        color: '#ffffff'
      }
    },
    xaxis: {
      title: {
        text: 'Regions',
        color: '#e2e8f0'
      },
      tickfont: {
        color: '#e2e8f0'
      },
      gridcolor: 'rgba(255,255,255,0.1)'
    },
    yaxis: {
      title: {
        text: 'Population Change (%)',
        color: '#e2e8f0'
      },
      tickfont: {
        color: '#e2e8f0'
      },
      gridcolor: 'rgba(255,255,255,0.1)'
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(17,24,39,0.8)',
    font: {
      color: '#e2e8f0'
    },
    margin: {
      l: 50,
      r: 20,
      b: 50,
      t: 50
    },
    showlegend: false
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={{
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
      }}
      style={{
        width: '100%',
        height: '400px'
      }}
      className="rounded-lg border border-white/20"
    />
  );
};

// Leaflet Map Component with white mode styling
const LeafletMap = ({ regionData }: { regionData?: any }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const predictionMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    // Add custom CSS for white mode styling
    const customStyles = document.createElement('style');
    customStyles.textContent = `
      .leaflet-container {
        z-index: 1 !important;
        position: relative !important;
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.1) !important;
      }
      .leaflet-tile {
        filter: brightness(1) contrast(1) !important;
      }
      .leaflet-control-zoom a {
        background: rgba(255, 255, 255, 0.9) !important;
        border: 1px solid #cbd5e1 !important;
        color: #475569 !important;
      }
      .leaflet-control-zoom a:hover {
        background: rgba(255, 255, 255, 1) !important;
        color: #1e293b !important;
      }
      .leaflet-control-attribution {
        background: rgba(255, 255, 255, 0.9) !important;
        color: #64748b !important;
        font-family: 'Inter', sans-serif !important;
      }
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; box-shadow: 0 0 10px currentColor; }
        50% { transform: scale(1.2); opacity: 0.8; box-shadow: 0 0 20px currentColor; }
        100% { transform: scale(1); opacity: 1; box-shadow: 0 0 10px currentColor; }
      }
      .custom-popup .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 8px !important;
        color: #1e293b !important;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15) !important;
      }
      .custom-popup .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid #cbd5e1 !important;
      }
    `;
    document.head.appendChild(customStyles);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.onload = () => {
      const L = (window as any).L;
      
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([20, 0], 2);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© AI Ocean Engine | OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      const createCustomIcon = (color: string) => {
        return L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="
            width: 20px; 
            height: 20px; 
            background: radial-gradient(circle, ${color} 0%, transparent 70%); 
            border: 2px solid ${color}; 
            border-radius: 50%; 
            animation: pulse 2s infinite;
            box-shadow: 0 0 15px ${color};
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
      };

      const marineStations = [
        {
          lat: 45.5,
          lng: -30.2,
          name: "NORTH_ATLANTIC_ALPHA",
          species: "Atlantic Cod",
          prediction: "+12.7%",
          color: "#00ff88"
        },
        {
          lat: 35.2,
          lng: -120.4,
          name: "PACIFIC_BETA", 
          species: "Pacific Salmon",
          prediction: "+8.9%",
          color: "#0088ff"
        },
        {
          lat: 42.3,
          lng: 15.1,
          name: "MEDITERRANEAN_GAMMA",
          species: "Bluefin Tuna",
          prediction: "-3.2%",
          color: "#ff4444"
        },
        {
          lat: -25.5,
          lng: 153.2,
          name: "BARRIER_REEF_DELTA",
          species: "Coral Trout",
          prediction: "+5.4%",
          color: "#ffaa00"
        },
        {
          lat: 60.1,
          lng: 5.3,
          name: "NORWEGIAN_EPSILON",
          species: "Herring",
          prediction: "+15.3%",
          color: "#00ff88"
        },
        {
          lat: -40.2,
          lng: -55.8,
          name: "SOUTH_ATLANTIC_ZETA",
          species: "Patagonian Toothfish",
          prediction: "-8.1%",
          color: "#ff4444"
        }
      ];

      marineStations.forEach(station => {
        const marker = L.marker([station.lat, station.lng], {
          icon: createCustomIcon(station.color)
        }).addTo(map);

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; min-width: 200px; background: rgba(255, 255, 255, 0.95); color: #1e293b;">
            <div style="border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 8px;">
              <div style="font-size: 10px; color: #64748b;">STATION_ID:</div>
              <div style="font-size: 12px; font-weight: bold; color: #1e293b;">${station.name}</div>
            </div>
            <div style="margin-bottom: 6px;">
              <span style="font-size: 10px; color: #64748b;">TARGET_SPECIES:</span>
              <div style="font-size: 11px; color: #334155;">${station.species}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="font-size: 10px; color: #64748b;">PREDICTION_DELTA:</span>
              <span style="
                font-size: 12px; 
                font-weight: bold; 
                color: ${station.prediction.startsWith('+') ? '#059669' : '#dc2626'};
              ">
                ${station.prediction}
              </span>
            </div>
            <div style="
              background: linear-gradient(90deg, #f1f5f9, #e2e8f0); 
              border: 1px solid #cbd5e1; 
              border-radius: 4px; 
              padding: 4px 6px; 
              font-size: 9px; 
              color: #64748b;
              text-align: center;
            ">
              AI_CONFIDENCE: 87-91% | STATUS: ACTIVE
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 250,
          className: 'custom-popup'
        });

        marker.on('mouseover', function() {
          this.openPopup();
        });
      });

      const addOceanCurrents = () => {
        const currentPaths = [
          [[60, -30], [45, -20], [30, -10], [15, 0]],
          [[-10, 20], [0, 30], [10, 40], [20, 50]],
          [[40, 140], [35, 150], [30, 160], [25, 170]]
        ];

        currentPaths.forEach((path, index) => {
          setTimeout(() => {
            const polyline = L.polyline(path, {
              color: '#3b82f6',
              weight: 2,
              opacity: 0.6,
              dashArray: '5, 10'
            }).addTo(map);

            polyline.bindTooltip(`DATA_STREAM_${index + 1}`, {
              permanent: false,
              direction: 'center',
              className: 'futuristic-tooltip'
            });
          }, index * 1000);
        });
      };

      setTimeout(addOceanCurrents, 2000);
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !regionData) return;
    
    console.log('Map update triggered with regionData:', regionData);
    console.log('Coordinates:', regionData.coordinates);

    const map = mapInstanceRef.current;
    const L = (window as any).L;

    if (!L) return; // Ensure Leaflet is loaded

    // Remove existing prediction marker if it exists
    if (predictionMarkerRef.current) {
      map.removeLayer(predictionMarkerRef.current);
      predictionMarkerRef.current = null;
    }

    // Use coordinates from backend API response or fallback
    const coordinates: [number, number] = regionData.coordinates ? 
      [regionData.coordinates.lat, regionData.coordinates.lng] : [0, 0];
    const zoom = regionData.coordinates?.zoom || 5;
    const bbox = regionData.coordinates?.bbox;

    // Update map view to new coordinates with animation
    if (bbox && bbox.length === 4) {
      // Use bounding box for better fit
      const bounds = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]];
      map.fitBounds(bounds, { animate: true, duration: 1.5 });
    } else {
      // Fallback to center coordinates
      map.flyTo(coordinates, zoom, {
        animate: true,
        duration: 1.5
      });
    }

    // Create custom prediction marker icon
    const predictionIcon = L.divIcon({
      html: `
        <div style="
          background: radial-gradient(circle, #8b5cf6 0%, #3b82f6 100%);
          border: 3px solid #1e293b;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3);
          animation: pulse 2s infinite;
        ">
          <div style="
            background: #fff;
            border-radius: 50%;
            width: 8px;
            height: 8px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          "></div>
        </div>
      `,
      className: 'prediction-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add new prediction marker
    const marker = L.marker(coordinates, {
      icon: predictionIcon
    }).addTo(map);

    // Create popup content
    const popupContent = `
      <div style="font-family: 'Inter', sans-serif; min-width: 220px; background: rgba(255, 255, 255, 0.98); color: #1e293b;">
        <div style="border-bottom: 1px solid #8b5cf6; padding-bottom: 8px; margin-bottom: 8px;">
          <div style="font-size: 10px; color: #64748b;">AI_PREDICTION_ENGINE:</div>
          <div style="font-size: 12px; font-weight: bold; color: #8b5cf6;">NEURAL_FORECAST_ALPHA</div>
        </div>
        <div style="margin-bottom: 6px;">
          <span style="font-size: 10px; color: #64748b;">SPECIES_TARGET:</span>
          <div style="font-size: 11px; color: #334155;">${regionData.species || 'Unknown'}</div>
        </div>
        <div style="margin-bottom: 6px;">
          <span style="font-size: 10px; color: #64748b;">REGION_SCOPE:</span>
          <div style="font-size: 11px; color: #334155;">${regionData.regionCanonical || regionData.region || 'Unknown'}</div>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="font-size: 10px; color: #64748b;">STOCK_STATUS:</span>
          <span style="
            font-size: 12px; 
            font-weight: bold; 
            color: ${regionData.stock_status === 'Increasing' ? '#059669' : regionData.stock_status === 'Declining' ? '#dc2626' : '#d97706'};
          ">
            ${regionData.stock_status || 'Unknown'} (${regionData.fishPopulation || 'N/A'})
          </span>
        </div>
        <div style="
          background: linear-gradient(90deg, #f8fafc, #e2e8f0); 
          border: 1px solid #cbd5e1; 
          border-radius: 4px; 
          padding: 4px 6px; 
          font-size: 9px; 
          color: #64748b;
          text-align: center;
        ">
          CONFIDENCE: ${regionData.confidence || 'N/A'} | MODEL: ${regionData.model_used ? 'NEURAL_ACTIVE' : 'FALLBACK'}
        </div>
      </div>
    `;

    // Bind and open popup
    marker.bindPopup(popupContent, {
      maxWidth: 280,
      className: 'prediction-popup'
    }).openPopup();

    // Store marker reference
    predictionMarkerRef.current = marker;
  }, [regionData]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg relative overflow-hidden border border-gray-200" 
      style={{ 
        minHeight: '400px',
        zIndex: 1,
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)'
      }} 
    />
  );
};

const AIPredictions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [rawModelOutput, setRawModelOutput] = useState<any>(null);
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    if (!user) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ml-predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setRawModelOutput(null);
          setSearchResults([]);
          throw new Error(data.error || "Invalid species. Please search for marine species like tuna, salmon, cod, etc.");
        } else if (response.status === 503) {
          setRawModelOutput(null);
          setSearchResults([]);
          throw new Error("AI prediction service is currently starting up. Please wait a moment and try again.");
        } else {
          throw new Error(data.error || "Prediction failed");
        }
      }

      setRawModelOutput(data);

      const baseResults = [
        {
          id: "1",
          species: data.species || searchQuery,
          region: "North Atlantic",
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
      
      // Show error message instead of mock data since we want to use .pkl file exclusively
      setRawModelOutput(null);
      setSearchResults([]);
      
      // Display user-friendly error
      alert(`Prediction Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`)
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
                <Cpu className="w-20 h-20 text-cyan-400 mx-auto animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 font-mono">
                NEURAL ENGINE
              </h1>
              <div className="text-lg text-cyan-300 mb-8 font-mono">
                [ AUTHENTICATION REQUIRED ]<br/>
                ACCESS_LEVEL: RESTRICTED
              </div>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black px-10 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25 font-mono font-bold border border-cyan-400/50">
                  INITIALIZE_SESSION
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <FuturisticBackground />
      
      {/* Header */}
      <section className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl mr-6 border border-cyan-400/30">
                <Brain className="w-12 h-12 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/10 rounded-xl blur-lg animate-pulse" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">
                  NEURAL_ENGINE
                </h1>
                <div className="text-cyan-300 font-mono text-sm mt-2">v2.1.4 | QUANTUM_READY</div>
              </div>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-mono">
              [ OCEAN_INTELLIGENCE_SYSTEM ] Deep learning predictions for marine ecosystems
            </p>
          </div>

          {/* Search Interface */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <Input
                    placeholder="Search species or region (e.g., 'Bluefin Tuna North Atlantic')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 focus:ring-blue-400/25 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isGenerating || !searchQuery.trim()}
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  {isGenerating ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Predict
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Output Box */}
          {rawModelOutput && (
            <div className="mt-6">
              <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Brain className="w-5 h-5 mr-2 text-green-400" />
                    AI Model Output - fish_stock_model.pkl
                    {rawModelOutput.model_used && (
                      <Badge className="ml-2 bg-green-900/50 text-green-300 border-green-700">
                        ✅ Model Active
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Quick Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {rawModelOutput.stock_status || "Unknown"}
                        </div>
                        <div className="text-sm text-blue-200">Stock Status</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-400">
                          {rawModelOutput.confidence || "N/A"}
                        </div>
                        <div className="text-sm text-blue-200">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          Class {rawModelOutput.prediction_class}
                        </div>
                        <div className="text-sm text-blue-200">Prediction Class</div>
                      </div>
                    </div>

                    {/* Raw JSON Output */}
                    <div className="bg-black/30 rounded-lg p-4 border border-white/20 backdrop-blur-sm">
                      <h4 className="text-sm font-semibold text-blue-200 mb-2">Raw Model Response:</h4>
                      <pre className="text-xs text-green-300 overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {JSON.stringify(rawModelOutput, null, 2)}
                      </pre>
                    </div>

                    {/* Class Probabilities */}
                    {rawModelOutput.class_probabilities && (
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20 backdrop-blur-sm">
                        <h4 className="text-sm font-semibold text-blue-200 mb-3">Class Probabilities:</h4>
                        <div className="space-y-2">
                          {rawModelOutput.class_probabilities.map((prob: number, index: number) => {
                            const labels = ['Declining', 'Stable', 'Increasing'];
                            const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'];
                            return (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="w-20 text-sm text-blue-200">{labels[index]}:</div>
                                <div className="flex-1 bg-white/20 rounded-full h-2 relative overflow-hidden">
                                  <div 
                                    className={`${colors[index]} h-2 rounded-full transition-all duration-500`}
                                    style={{ width: `${prob * 100}%` }}
                                  ></div>
                                </div>
                                <div className="w-16 text-sm text-blue-200 text-right">
                                  {(prob * 100).toFixed(1)}%
                                </div>
                              </div>
                            );
                          })}
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
            
            {/* Interactive Ocean Map - Full Width */}
            <div className="w-full">
              <Card className="h-full backdrop-blur-md bg-white/10 border-white/20 shadow-2xl relative overflow-hidden" style={{ zIndex: 1 }}>
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Globe className="w-5 h-5 mr-2 text-blue-400" />
                    Interactive Ocean Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="aspect-video rounded-lg overflow-hidden border border-white/20 relative backdrop-blur-sm" style={{ zIndex: 1 }}>
                    <LeafletMap regionData={rawModelOutput} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 relative" style={{ zIndex: 2 }}>
                    <Badge className="bg-green-900/50 text-green-300 border-green-700/50 backdrop-blur-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Increasing Population
                    </Badge>
                    <Badge className="bg-red-900/50 text-red-300 border-red-700/50 backdrop-blur-sm">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                      Declining Population
                    </Badge>
                    <Badge className="bg-blue-900/50 text-blue-300 border-blue-700/50 backdrop-blur-sm">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                      Monitoring Station
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ocean Metrics Display for Ocean/Composite Queries */}
            {rawModelOutput?.oceanMetrics && (
              <div className="w-full">
                <Card className="h-full backdrop-blur-md bg-white/10 border-white/20 shadow-2xl relative overflow-hidden" style={{ zIndex: 1 }}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Thermometer className="w-5 h-5 mr-2 text-blue-400" />
                      Ocean Environmental Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/20">
                        <div className="text-2xl font-bold text-cyan-400">{rawModelOutput.oceanMetrics.temperatureC}°C</div>
                        <div className="text-xs text-white/70">Temperature</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/20">
                        <div className="text-2xl font-bold text-green-400">{rawModelOutput.oceanMetrics.salinityPSU}</div>
                        <div className="text-xs text-white/70">Salinity (PSU)</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/20">
                        <div className="text-2xl font-bold text-purple-400">{rawModelOutput.oceanMetrics.pH}</div>
                        <div className="text-xs text-white/70">pH Level</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-white/5 border border-white/20">
                        <div className="text-lg font-bold text-yellow-400">{rawModelOutput.oceanMetrics.popularFishes?.length || 0}</div>
                        <div className="text-xs text-white/70">Popular Species</div>
                      </div>
                    </div>
                    {rawModelOutput.oceanMetrics.popularFishes && rawModelOutput.oceanMetrics.popularFishes.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3">Popular Fish Species in this Region</h4>
                        <div className="flex flex-wrap gap-2">
                          {rawModelOutput.oceanMetrics.popularFishes.map((fish: string, index: number) => (
                            <Badge key={index} className="bg-blue-900/50 text-blue-300 border-blue-700/50 backdrop-blur-sm">
                              {fish}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Trend Analysis for Composite Queries */}
            {rawModelOutput?.trendSummary && (
              <div className="w-full">
                <Card className="h-full backdrop-blur-md bg-white/10 border-white/20 shadow-2xl relative overflow-hidden" style={{ zIndex: 1 }}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Activity className="w-5 h-5 mr-2 text-orange-400" />
                      Population Trend Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-white/90 leading-relaxed">{rawModelOutput.trendSummary}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Interactive Prediction Chart - Full Width */}
            {searchResults.length > 0 && rawModelOutput?.fishPopulation && (
              <div className="w-full">
                <Card className="h-full backdrop-blur-md bg-white/10 border-white/20 shadow-2xl relative overflow-hidden" style={{ zIndex: 1 }}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Interactive Prediction Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="w-full rounded-lg overflow-hidden border border-white/20 relative backdrop-blur-sm" style={{ zIndex: 1 }}>
                      <PredictionChart searchResults={searchResults} />
                    </div>
                    <div className="mt-4 text-xs text-blue-300 text-center">
                      Hover over bars for detailed predictions | Data updates with each search
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-12 relative" style={{ zIndex: 1 }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Prediction Results</h2>
                <p className="text-blue-100 drop-shadow-md">AI-generated predictions for "{searchQuery}"</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result) => (
                  <Card key={result.id} className="backdrop-blur-md bg-white/10 border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">{result.region}</CardTitle>
                        <Badge className="bg-blue-900/50 text-blue-300 border-blue-700/50 backdrop-blur-sm">
                          {result.confidence} confidence
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Fish Population */}
                      <div className="p-3 bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg border border-blue-700/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium flex items-center text-blue-200">
                            📈 Fish Population
                          </span>
                          <span className={`font-bold ${result.fishPopulation.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {result.fishPopulation}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${result.fishPopulation.startsWith('+') ? 'bg-green-400' : 'bg-red-400'}`} style={{width: '70%'}}></div>
                        </div>
                      </div>

                      {/* Climate Change Effect */}
                      <div className="p-3 bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-700/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium flex items-center text-blue-200">
                            🌡️ Climate Impact
                          </span>
                          <span className="font-bold text-red-400">
                            {result.climateChange}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{width: '45%'}}></div>
                        </div>
                      </div>

                      {/* Genetic Diversity */}
                      <div className="p-3 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 rounded-lg border border-yellow-700/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium flex items-center text-blue-200">
                            🧬 Genetic Risk
                          </span>
                          <Badge 
                            className={`${
                              result.geneticDiversity === 'High' ? 'bg-green-900/50 text-green-300 border-green-700/50' :
                              result.geneticDiversity === 'Medium' ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50' :
                              'bg-red-900/50 text-red-300 border-red-700/50'
                            } backdrop-blur-sm`}
                          >
                            {result.geneticDiversity}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-xs text-blue-200 pt-2 border-t border-white/20">
                        Scenario: {result.scenario} • Timeframe: {result.timeframe}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Results State */}
          {!searchResults.length && !isGenerating && (
            <div className="mt-12 text-center relative" style={{ zIndex: 1 }}>
              <div className="max-w-md mx-auto backdrop-blur-md bg-white/10 border-white/20 shadow-2xl rounded-2xl p-8">
                <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2 drop-shadow-lg">Ready for AI Analysis</h3>
                <p className="text-blue-200 drop-shadow-md">
                  Enter a species or region above to generate AI-powered predictions and insights
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AIPredictions;