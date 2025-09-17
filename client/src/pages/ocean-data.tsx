import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// Mock Card components since we don't have access to shadcn/ui
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 pb-0">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
);

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

// Simple Ocean Temperature Chart Component
const OceanTempChart = () => {
  const data = [
    { month: 'Jan', temp: 15.2 },
    { month: 'Feb', temp: 15.8 },
    { month: 'Mar', temp: 16.1 },
    { month: 'Apr', temp: 16.7 },
    { month: 'May', temp: 17.3 },
    { month: 'Jun', temp: 18.1 }
  ];

  return (
    <div className="space-y-3 text-gray-500">
      {data.map((item, index) => (
        <div key={item.month} className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{item.month}</span>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full  overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full  transition-all duration-1000" 
                style={{ width: `${(item.temp / 20) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{item.temp}°C</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Leaflet Map Component
const LeafletMap = ({ fishData = null }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        // Initialize the map
        const map = window.L.map(mapRef.current, {
          center: [20, 0], // Center on equator
          zoom: 2,
          zoomControl: true
        });

        // Add tile layer (OpenStreetMap)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Use fish species data if available, otherwise default ocean stations
        const mapData = fishData ? fishData.fishLocations : [
          {
            lat: 35.6762,
            lng: 139.6503,
            name: "Tokyo Bay Station",
            temp: "18.5°C",
            ph: "8.1",
            depth: "50m"
          },
          {
            lat: 40.7128,
            lng: -74.0060,
            name: "New York Harbor",
            temp: "16.2°C",
            ph: "7.9",
            depth: "30m"
          },
          {
            lat: -33.8688,
            lng: 151.2093,
            name: "Sydney Harbor",
            temp: "22.1°C",
            ph: "8.2",
            depth: "40m"
          },
          {
            lat: 51.5074,
            lng: -0.1278,
            name: "Thames Estuary",
            temp: "14.8°C",
            ph: "7.8",
            depth: "25m"
          },
          {
            lat: 25.7617,
            lng: -80.1918,
            name: "Miami Coast",
            temp: "26.3°C",
            ph: "8.0",
            depth: "60m"
          },
          {
            lat: -23.5505,
            lng: -46.6333,
            name: "Santos Port",
            temp: "23.7°C",
            ph: "7.9",
            depth: "35m"
          }
        ];

        // Add markers for map data (either fish species or ocean stations)
        mapData.forEach(location => {
          let markerColor, popupContent;
          
          if (fishData) {
            // Fish species data
            markerColor = location.markerColor || '#FF6B6B';
            popupContent = `
              <div class="p-2">
                <h3 class="font-semibold text-sm mb-2">${location.name}</h3>
                <div class="space-y-1 text-xs">
                  <div><strong>Species Count:</strong> ${location.speciesCount}</div>
                  <div><strong>Abundance:</strong> ${location.abundance}</div>
                  <div><strong>Temperature:</strong> ${location.temperature}</div>
                  <div><strong>Depth:</strong> ${location.depth}</div>
                  <div><strong>Salinity:</strong> ${location.salinity}</div>
                  <div class="mt-2">
                    <strong>Species Found:</strong>
                    <div class="mt-1">
                      ${location.species.map(species => `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded mr-1 mb-1">${species.replace('_', ' ')}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `;
          } else {
            // Ocean station data
            markerColor = getColorByTemp(parseFloat(location.temp));
            popupContent = `
              <div class="p-2">
                <h3 class="font-semibold text-sm mb-2">${location.name}</h3>
                <div class="space-y-1 text-xs">
                  <div><strong>Temperature:</strong> ${location.temp}</div>
                  <div><strong>pH Level:</strong> ${location.ph}</div>
                  <div><strong>Depth:</strong> ${location.depth}</div>
                </div>
              </div>
            `;
          }

          const marker = window.L.circleMarker([location.lat, location.lng], {
            radius: 8,
            fillColor: markerColor,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);

          // Add popup with location data
          marker.bindPopup(popupContent);

          // Add hover effect
          marker.on('mouseover', function() {
            this.setStyle({
              radius: 12,
              weight: 3
            });
          });

          marker.on('mouseout', function() {
            this.setStyle({
              radius: 8,
              weight: 2
            });
          });
        });

        // Add a legend
        const legend = window.L.control({ position: 'bottomright' });
        legend.onAdd = function(map) {
          const div = window.L.DomUtil.create('div', 'legend');
          
          if (fishData) {
            div.innerHTML = `
              <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 8px 0; color: black; font-size: 12px; font-weight: bold;">Fish Species Distribution</h4>
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 10px; color: black;">
                  <div style="width: 12px; height: 12px; background: #96CEB4; border-radius: 50%; margin-right: 6px;"></div>
                  Low Abundance
                </div>
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 10px; color: black;">
                  <div style="width: 12px; height: 12px; background: #4ECDC4; border-radius: 50%; margin-right: 6px;"></div>
                  Medium Abundance
                </div>
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 10px; color: black;">
                  <div style="width: 12px; height: 12px; background: #FF6B6B; border-radius: 50%; margin-right: 6px;"></div>
                  High Abundance
                </div>
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 10px; color: black;">
                  <div style="width: 12px; height: 12px; background: #45B7D1; border-radius: 50%; margin-right: 6px;"></div>
                  Very High Abundance
                </div>
              </div>
            `;
          } else {
            div.innerHTML = `
              <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 8px 0; color: black; font-size: 12px; font-weight: bold;">Ocean Temperature</h4>
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 10px; color: black;">
                  <div style="width: 12px; height: 12px; background: #0066cc; border-radius: 50%; margin-right: 6px;"></div>
                  Cold (&lt;15°C)
                </div>
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 10px; color: black;">
                  <div style="width: 12px; height: 12px; background: #00cc66; border-radius: 50%; margin-right: 6px;"></div>
                  Moderate (15-20°C)
                </div>
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 10px; color: black;">
                  <div style="width: 12px; height: 12px; background: #ff6600; border-radius: 50%; margin-right: 6px;"></div>
                  Warm (20-25°C)
                </div>
                <div style="display: flex; align-items: center; margin: 4px 0; font-size: 10px; color: black;">
                  <div style="width: 12px; height: 12px; background: #cc0000; border-radius: 50%; margin-right: 6px;"></div>
                  Hot (&gt;25°C)
                </div>
              </div>
            `;
          }
          
          return div;
        };
        legend.addTo(map);

        mapInstanceRef.current = map;
      }
    };

    // Helper function to get color based on temperature
    const getColorByTemp = (temp) => {
      if (temp < 15) return '#0066cc';      // Cold - Blue
      if (temp < 20) return '#00cc66';      // Moderate - Green
      if (temp < 25) return '#ff6600';      // Warm - Orange
      return '#cc0000';                     // Hot - Red
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [fishData]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border-2 border-gray-200 relative"
        style={{ 
          minHeight: '400px',
          zIndex: 1,
          position: 'relative'
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-control-container {
          z-index: 2 !important;
        }
        .leaflet-popup {
          z-index: 3 !important;
        }
        .leaflet-tooltip {
          z-index: 3 !important;
        }
        `
      }} />
    </div>
  );
};

const OceanData = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [fishSpeciesData, setFishSpeciesData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pkl')) {
      setUploadStatus('error');
      setUploadMessage('Please select a .pkl file');
      return;
    }

    setUploadStatus('uploading');
    setUploadMessage('Analyzing fish species data...');

    const formData = new FormData();
    formData.append('pklFile', file);

    try {
      const response = await fetch('/api/fish-species-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setFishSpeciesData(result);
      setUploadStatus('success');
      setUploadMessage(`Successfully analyzed ${result.fileName}! Found ${result.totalSpecies} species across ${result.fishLocations.length} locations.`);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white-900 mb-4">Ocean Data Dashboard</h1>
          <p className="text-lg text-white-600">Comprehensive ocean monitoring and analysis platform</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Leaflet Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{fishSpeciesData ? 'Fish Species Distribution Map' : 'Global Ocean Monitoring Stations'}</CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pkl"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={triggerFileUpload}
                    disabled={uploadStatus === 'uploading'}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    {uploadStatus === 'uploading' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Fish Data (.pkl)
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Upload Status */}
                {uploadMessage && (
                  <Alert className={`mb-4 ${
                    uploadStatus === 'success' ? 'border-green-500 bg-green-500/10' :
                    uploadStatus === 'error' ? 'border-red-500 bg-red-500/10' :
                    'border-blue-500 bg-blue-500/10'
                  }`}>
                    {uploadStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {uploadStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                    {uploadStatus === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                    <AlertDescription className={
                      uploadStatus === 'success' ? 'text-green-300' :
                      uploadStatus === 'error' ? 'text-red-300' :
                      'text-blue-300'
                    }>
                      {uploadMessage}
                    </AlertDescription>
                  </Alert>
                )}
                
                <LeafletMap fishData={fishSpeciesData} />
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    {fishSpeciesData 
                      ? 'Click on markers to view fish species information. Colors represent abundance levels.'
                      : 'Click on markers to view detailed station information. Colors represent temperature ranges. Upload a .pkl file to analyze fish species distribution.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Side Panel Charts */}
          <div className="space-y-6">
            {/* Ocean Temperature Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Temperature Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <OceanTempChart />
              </CardContent>
            </Card>
            
            {/* pH Levels */}
            <Card>
              <CardHeader>
                <CardTitle>pH Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Atlantic</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-500" data-testid="ph-atlantic">8.1</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pacific</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-3/5 h-full bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-500" data-testid="ph-pacific">7.9</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Indian</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-emerald-400 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-500" data-testid="ph-indian">8.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Live Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">6</div>
                    <div className="text-sm text-blue-800">Active Stations</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">19.2°C</div>
                    <div className="text-sm text-green-800">Avg Temperature</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">8.0</div>
                    <div className="text-sm text-purple-800">Avg pH Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OceanData;