import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MolecularData = () => {
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
              <CardHeader>
                <CardTitle className="text-white">Phylogenetic Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[2/1] bg-gradient-to-b from-gray-700/20 to-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                  <img 
                    src="https://www.researchgate.net/profile/Christopher_Austin2/publication/316018545/figure/fig1/AS:486385900625923@1492974843495/Phylogenetic-relationships-among-fish-species-The-phylogenetic-tree-was-inferred-from-a.png"
                    alt="Phylogenetic relationships among fish species - evolutionary tree showing genetic relationships"
                    className="w-full h-full object-contain bg-white rounded-lg"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex items-center justify-center h-full">
                            <div class="text-center">
                              <svg class="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                              </svg>
                              <p class="text-gray-300">Interactive Phylogenetic Tree</p>
                              <p class="text-sm text-gray-400 mt-1">Evolutionary relationships visualization</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Phylogenetic tree showing evolutionary relationships among fish species based on molecular data
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