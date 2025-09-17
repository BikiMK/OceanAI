import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import FishStocksChart from "@/components/charts/fish-stocks-chart";
import SpeciesDiversityChart from "@/components/charts/species-diversity-chart";

const FisheriesData = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [fisheriesData, setFisheriesData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dataSource, setDataSource] = useState<'default' | 'uploaded'>('default');

  // Default static data, will be replaced when .pkl file is uploaded
  const [fishStocksData, setFishStocksData] = useState([
    { region: 'Atlantic', stocks: 0 },
    { region: 'Pacific', stocks: 0 },
    { region: 'Indian', stocks: 0 },
    { region: 'Arctic', stocks: 0 },
  ]);

  const [speciesDiversityData, setSpeciesDiversityData] = useState<Array<{name: string, value: number, color: string, count: string}>>([]);

  const [catchData, setCatchData] = useState<Array<{
    species: string;
    region: string;
    catch: string;
    trend: string;
    trendType: 'up' | 'down';
    sustainability: string;
    sustainabilityColor: string;
  }>>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pkl')) {
      setUploadStatus('error');
      setUploadMessage('Please select a .pkl file');
      return;
    }

    setUploadStatus('uploading');
    setUploadMessage('Processing fisheries data...');

    const formData = new FormData();
    formData.append('pklFile', file);

    try {
      const response = await fetch('/api/fisheries-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Update charts with data from .pkl file
      if (result.fishStocks) {
        setFishStocksData(result.fishStocks);
      }
      if (result.speciesDiversity) {
        setSpeciesDiversityData(result.speciesDiversity);
      }
      if (result.catchStatistics) {
        setCatchData(result.catchStatistics);
      }
      setDataSource('uploaded');
      
      setUploadStatus('success');
      setUploadMessage(`Successfully processed ${result.fileName}! Charts updated with new fisheries data.`);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Fisheries Data</h1>
              <p className="text-lg text-muted-foreground">Fish stock monitoring and sustainability analysis</p>
            </div>
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
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload .pkl File
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Upload Status */}
          {uploadMessage && (
            <Alert className={`mb-6 ${
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
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fish Stocks Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Fish Stocks by Region
                <span className={`text-xs px-2 py-1 rounded ${
                  dataSource === 'uploaded' 
                    ? 'text-green-400 bg-green-500/10' 
                    : 'text-gray-400 bg-gray-500/10'
                }`}>
                  {dataSource === 'uploaded' ? 'From .pkl file' : 'Default data'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FishStocksChart data={fishStocksData} />
            </CardContent>
          </Card>
          
          {/* Species Diversity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Species Diversity
                <span className={`text-xs px-2 py-1 rounded ${
                  dataSource === 'uploaded' 
                    ? 'text-green-400 bg-green-500/10' 
                    : 'text-gray-400 bg-gray-500/10'
                }`}>
                  {dataSource === 'uploaded' ? 'From .pkl file' : 'Default data'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpeciesDiversityChart data={speciesDiversityData} />
            </CardContent>
          </Card>
          
          {/* Catch Statistics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Catch Statistics
                  <span className={`text-xs px-2 py-1 rounded ${
                    dataSource === 'uploaded' 
                      ? 'text-green-400 bg-green-500/10' 
                      : 'text-gray-400 bg-gray-500/10'
                  }`}>
                    {dataSource === 'uploaded' ? 'From .pkl file' : 'Default data'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-2 font-semibold text-foreground">Species</th>
                        <th className="text-left py-3 px-2 font-semibold text-foreground">Region</th>
                        <th className="text-left py-3 px-2 font-semibold text-foreground">Catch (MT)</th>
                        <th className="text-left py-3 px-2 font-semibold text-foreground">Trend</th>
                        <th className="text-left py-3 px-2 font-semibold text-foreground">Sustainability</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {catchData.map((row, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-3 px-2" data-testid={`species-${index}`}>{row.species}</td>
                          <td className="py-3 px-2" data-testid={`region-${index}`}>{row.region}</td>
                          <td className="py-3 px-2" data-testid={`catch-${index}`}>{row.catch}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center ${row.trendType === "up" ? "text-green-400" : "text-red-400"}`}>
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                {row.trendType === "up" ? (
                                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                ) : (
                                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                )}
                              </svg>
                              <span data-testid={`trend-${index}`}>{row.trend}</span>
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="secondary" className={row.sustainabilityColor} data-testid={`sustainability-${index}`}>
                              {row.sustainability}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FisheriesData;
