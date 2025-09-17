import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import PhylogeneticTree from "@/components/PhylogeneticTree";

const MolecularData = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [phylogeneticData, setPhylogeneticData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const geneticMetrics = [
    { name: "Heterozygosity", value: "0.74", percentage: 74 },
    { name: "Allelic Richness", value: "5.2", percentage: 87 },
    { name: "FST Index", value: "0.12", percentage: 12 },
  ];

  const sampleStatus = [
    { status: "Processed", count: "1,247", color: "text-green-400" },
    { status: "In Queue", count: "89", color: "text-yellow-400" },
    { status: "Failed", count: "12", color: "text-red-400" },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pkl')) {
      setUploadStatus('error');
      setUploadMessage('Please select a .pkl file');
      return;
    }

    setUploadStatus('uploading');
    setUploadMessage('Processing phylogenetic data...');

    const formData = new FormData();
    formData.append('pklFile', file);

    try {
      const response = await fetch('/api/phylogenetic-tree', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setPhylogeneticData(result);
      setUploadStatus('success');
      setUploadMessage(`Successfully processed ${result.fileName}! Tree updated with ${result.species.length} species.`);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <div className="container mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Molecular Data</h1>
          <p className="text-lg text-gray-300">Genetic diversity and molecular analysis</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Genetic Diversity Metrics */}
          <div className="space-y-6">
            <Card className="bg-gray-800/70 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Genetic Diversity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geneticMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{metric.name}</span>
                        <span className="font-medium text-white" data-testid={`metric-value-${index}`}>{metric.value}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"
                          style={{ width: `${metric.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/70 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Sample Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleStatus.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.status}</span>
                      <span className={`${item.color} font-medium`} data-testid={`sample-${item.status.toLowerCase().replace(' ', '-')}`}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Phylogenetic Tree */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/70 border-gray-600">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Phylogenetic Relationships</CardTitle>
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
                        Upload .pkl File
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

                {/* Phylogenetic Tree Visualization Area */}
                <div className="aspect-[2/1] bg-gradient-to-b from-gray-700/20 to-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                  {phylogeneticData ? (
                    <PhylogeneticTree
                      newick={phylogeneticData.treeData}
                      species={phylogeneticData.species}
                      metadata={phylogeneticData.metadata}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-300">Upload a .pkl file to generate</p>
                        <p className="text-gray-300">an interactive phylogenetic tree</p>
                        <p className="text-sm text-gray-400 mt-2">AI-powered phylogenetic analysis</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    {phylogeneticData 
                      ? `Interactive phylogenetic tree generated from ${phylogeneticData.fileName} using AI analysis`
                      : "Upload a .pkl file to generate an AI-powered phylogenetic tree showing evolutionary relationships"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MolecularData;