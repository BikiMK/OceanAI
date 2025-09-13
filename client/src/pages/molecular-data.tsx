import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

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

  // Table data
  const tableData = [
    {
      sample: "Frozen, processed fish",
      rows: [
        {
          sample: "Fish sticks (species unspecified)",
          blast285: "Gadus morhua (Atlantic cod), 98%",
          cytB: "Homo sapiens, 99%",
          note: "d"
        },
        {
          sample: "Fish sticks (species unspecified)",
          blast285: "Bad sequence",
          cytB: "",
          note: "c"
        },
        {
          sample: "Fish sticks (species unspecified)",
          blast285: "Gadus morhua (Atlantic cod), 100%",
          cytB: "Merluccius productus (North Pacific hake), 99%",
          note: ""
        },
        {
          sample: "Fish sticks (species unspecified)",
          blast285: "Bad sequence",
          cytB: "",
          note: ""
        },
        {
          sample: "Pollock sticks (Pollachius species)",
          blast285: "Bad sequence",
          cytB: "",
          note: ""
        },
        {
          sample: "Pollock sticks (Pollachius species)",
          blast285: "Bad sequence",
          cytB: "",
          note: ""
        },
        {
          sample: "Pollock patty (Pollachius species)",
          blast285: "Gadus morhua (Atlantic cod), 90%",
          cytB: "",
          note: ""
        },
        {
          sample: "Pollock patty (Pollachius species)",
          blast285: "Bad sequence",
          cytB: "",
          note: ""
        },
        {
          sample: "White fish patty",
          blast285: "Gadus morhua (Atlantic cod), 94%",
          cytB: "Merluccius productus (North Pacific hake), 99%",
          note: ""
        }
      ]
    },
    {
      sample: "Fillets",
      rows: [
        {
          sample: "Cod (Gadus species)",
          blast285: "Gadus morhua (Atlantic cod), 99%",
          cytB: "",
          note: ""
        },
        {
          sample: "Cod (Gadus species)",
          blast285: "Melanogrammus aeglefinus (Haddock), 97%",
          cytB: "Sus scrofa (Pig), 91%",
          note: "f,g"
        },
        {
          sample: "Fresh cod (Gadus species)",
          blast285: "Gadus morhua (Atlantic cod), 99%",
          cytB: "Coryphaena hippurus (Mahi mahi), 100%",
          note: ""
        },
        {
          sample: "Mahi mahi (Coryphaena hippurus)",
          blast285: "Trigia lucerna (Tub gunnard), 98%",
          cytB: "Coryphaena hippurus (Mahi mahi), 99%",
          note: "e"
        },
        {
          sample: "Mahi mahi (Coryphaena hippurus)",
          blast285: "Antennarius striatus (Striated frogfish), 99%",
          cytB: "",
          note: "e"
        },
        {
          sample: "Pollock (Pollachius species)",
          blast285: "No PCR product",
          cytB: "Oncorhynchus gorbuscha (Pink salmon), 100%",
          note: ""
        },
        {
          sample: "Salmon (Oncorhynchus and Salmo species)",
          blast285: "Oncorhynchus mykiss (Rainbow trout), 98%",
          cytB: "",
          note: ""
        },
        {
          sample: "Salmon (Oncorhynchus and Salmo species)",
          blast285: "Oncorhynchus mykiss (Rainbow trout), 98%",
          cytB: "",
          note: ""
        },
        {
          sample: "Tilapia (3 genera, including Oreochromis)",
          blast285: "Oreochromis aureus (Blue tilapia), 99%",
          cytB: "",
          note: ""
        },
        {
          sample: "Tilapia (3 genera, including Oreochromis)",
          blast285: "Oreochromis aureus (Blue tilapia), 99%",
          cytB: "",
          note: ""
        }
      ]
    },
    {
      sample: "Canned fish",
      rows: [
        {
          sample: "Canned tuna (Thunnus species)",
          blast285: "Bad sequence",
          cytB: "Homo sapiens, 99%",
          note: "d"
        },
        {
          sample: "Canned tuna (Thunnus species)",
          blast285: "Bad sequence",
          cytB: "",
          note: ""
        },
        {
          sample: "Canned tuna (Thunnus species)",
          blast285: "Bad sequence",
          cytB: "",
          note: ""
        },
        {
          sample: "Canned tuna (Thunnus species)",
          blast285: "Bad sequence",
          cytB: "",
          note: ""
        },
        {
          sample: "Canned tuna (Thunnus species)",
          blast285: "Aspergillus flavus (mold), 98%",
          cytB: "Merluccius productus (North Pacific hake), 94%",
          note: "h,j"
        }
      ]
    }
  ];

  // State for typing animation
  const [displayedTable, setDisplayedTable] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  // Convert table data to string for typing animation
  const tableString = `Table 1—Student samples and top BLAST hits to sequencing results.

| Sample, as identified by student    | 28S sequence top BLAST result${String.fromCharCode(0x00B9)} | Cytochrome b sequence top BLAST result${String.fromCharCode(0x00B2)} |
|---|---|---|
${tableData.flatMap(category => [
  category.sample,
  ...category.rows.map(row => {
    const sampleCol = row.sample.padEnd(40);
    const blastCol = row.blast285.padEnd(45);
    const cytBCol = row.cytB.padEnd(45);
    const note = row.note ? `${String.fromCharCode(0x1d47 + parseInt(row.note))}` : "";
    return `| ${sampleCol} | ${blastCol} | ${cytBCol} |${note}`;
  })
]).join('\n')}

${String.fromCharCode(0x00B9)} 28S ribosomal RNA gene, partial sequence
${String.fromCharCode(0x00B2)} Cytochrome b gene, partial sequence
${String.fromCharCode(0x1d47)} Human DNA contamination suspected
${String.fromCharCode(0x1d48)} Sequence quality issues
${String.fromCharCode(0x1d49)} Possible misidentification
${String.fromCharCode(0x1d4a)} Unexpected match
${String.fromCharCode(0x1d4b)} Mold contamination suspected
${String.fromCharCode(0x1d4c)} Low sequence similarity`;

  // Typing animation effect
  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => {
      if (currentIndex < tableString.length) {
        setDisplayedTable(tableString.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsAnimating(false);
      }
    }, 5); // Adjust typing speed here

    return () => clearTimeout(timer);
  }, [currentIndex, isAnimating, tableString]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <div className="container mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Molecular Data</h1>
          <p className="text-lg text-gray-300">Genetic diversity and molecular analysis</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DNA Sequence Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/70 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">DNA Sequence Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-lg border border-gray-600 p-4 font-mono text-sm">
                  <div className="text-green-400 mb-2">&gt; Species: Thunnus thynnus (Atlantic Bluefin Tuna)</div>
                  <div className="text-gray-300 mb-4">Sequence Length: 16,527 bp | GC Content: 46.8%</div>
                  <div className="space-y-1 text-xs overflow-hidden">
                    <div data-testid="dna-sequence-1">
                      <span className="text-red-400">ATGC</span>
                      <span className="text-blue-400">GCAT</span>
                      <span className="text-green-400">TACG</span>
                      <span className="text-yellow-400">CGTA</span>
                      <span className="text-purple-400">AATG</span>
                      <span className="text-pink-400">GCTT</span> ...
                    </div>
                    <div data-testid="dna-sequence-2">
                      <span className="text-blue-400">CGAT</span>
                      <span className="text-green-400">TACG</span>
                      <span className="text-yellow-400">CGTA</span>
                      <span className="text-red-400">ATGC</span>
                      <span className="text-purple-400">GGCC</span>
                      <span className="text-pink-400">TAAT</span> ...
                    </div>
                    <div data-testid="dna-sequence-3">
                      <span className="text-green-400">TACG</span>
                      <span className="text-yellow-400">CGTA</span>
                      <span className="text-red-400">ATGC</span>
                      <span className="text-blue-400">CGAT</span>
                      <span className="text-pink-400">CCGG</span>
                      <span className="text-purple-400">ATAT</span> ...
                    </div>
                  </div>
                  <div className="mt-4 text-blue-400" data-testid="analysis-result">Analysis complete: 847 genes identified</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
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
          
          {/* BLAST Results Table with Typing Animation */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/70 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">BLAST Sequencing Results - Real time updation </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-2 right-2 flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${isAnimating ? 'bg-green-400 animate-pulse' : 'bg-green-600'}`}></div>
                    <span className="text-xs text-gray-400">
                      {isAnimating ? 'Updating...' : 'Updated      .      .'}
                    </span>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 font-mono text-xs overflow-auto max-h-96">
                    <pre className="text-gray-300 whitespace-pre-wrap">
                      {displayedTable}
                      {isAnimating && <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></span>}
                    </pre>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button 
                      onClick={() => {
                        setCurrentIndex(0);
                        setDisplayedTable("");
                        setIsAnimating(true);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Restart Animation
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Real-time BLAST analysis results showing species identification through DNA sequencing</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Phylogenetic Tree */}
          <div className="lg:col-span-3">
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
