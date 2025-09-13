import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FishStocksChart from "@/components/charts/fish-stocks-chart";
import SpeciesDiversityChart from "@/components/charts/species-diversity-chart";

const FisheriesData = () => {
  const catchData = [
    {
      species: "Atlantic Cod",
      region: "North Atlantic",
      catch: "45,230",
      trend: "-12%",
      trendType: "down" as const,
      sustainability: "Moderate",
      sustainabilityColor: "bg-yellow-400/10 text-yellow-400" as const,
    },
    {
      species: "Pacific Salmon",
      region: "North Pacific",
      catch: "78,450",
      trend: "+8%",
      trendType: "up" as const,
      sustainability: "Good",
      sustainabilityColor: "bg-green-400/10 text-green-400" as const,
    },
    {
      species: "Bluefin Tuna",
      region: "Mediterranean",
      catch: "12,890",
      trend: "-25%",
      trendType: "down" as const,
      sustainability: "Critical",
      sustainabilityColor: "bg-red-400/10 text-red-400" as const,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Fisheries Data</h1>
          <p className="text-lg text-muted-foreground">Fish stock monitoring and sustainability analysis</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fish Stocks Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Fish Stocks by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <FishStocksChart />
            </CardContent>
          </Card>
          
          {/* Species Diversity */}
          <Card>
            <CardHeader>
              <CardTitle>Species Diversity</CardTitle>
            </CardHeader>
            <CardContent>
              <SpeciesDiversityChart />
            </CardContent>
          </Card>
          
          {/* Catch Statistics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Catch Statistics</CardTitle>
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
