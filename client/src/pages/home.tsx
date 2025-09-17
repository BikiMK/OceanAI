import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Waves, Fish, Dna, Globe, Zap, ChevronRight, Sparkles, Brain } from "lucide-react";

interface SearchResult {
  answer: string;
  source: string;
  confidence: number;
  related_topics: string[];
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const metrics = [
    { label: "Ocean Data Points", value: "2.4B+", color: "from-cyan-400 to-blue-600" },
    { label: "AI Models Active", value: "847", color: "from-purple-400 to-pink-600" },
    { label: "Species Analyzed", value: "125K+", color: "from-green-400 to-teal-600" },
    { label: "Real-time Sensors", value: "18.7K", color: "from-orange-400 to-red-600" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Search failed:", response.statusText);
        setSearchResults({
          answer: "Sorry, I couldn't process your search at the moment. Please try again.",
          source: "Error",
          confidence: 0,
          related_topics: []
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({
        answer: "Sorry, I couldn't connect to the search service. Please try again.",
        source: "Error",
        confidence: 0,
        related_topics: []
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickAction = (label: string) => {
    console.log("Quick action triggered:", label);
    // Implement quick action logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Gradient Orbs */}
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl mx-auto">
            {/* Logo/Brand */}
            <div className="mb-8 flex items-center justify-center space-x-3">
              <div className="relative">
                <Waves className="w-12 h-12 text-cyan-400 animate-bounce" />
                <div className="absolute inset-0 w-12 h-12 bg-cyan-400 rounded-full blur-xl opacity-30 animate-ping" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                OCEANIA.AI
              </h1>
            </div>

            {/* Main Title */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                SEARCH THE
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                DIGITAL OCEAN
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Dive into the world's most advanced AI-powered ocean intelligence platform. 
              Discover patterns, predict changes, and explore the depths of marine data like never before.
            </p>

            {/* Search Interface */}
            <div className="mb-16 max-w-4xl mx-auto">
              <div className={`relative group transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                <div className="relative flex items-center bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2">
                  <Search className="w-6 h-6 text-slate-400 ml-4" />
                  <input
                    type="text"
                    placeholder="Ask about ocean temperatures, marine species, climate patterns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-transparent text-white placeholder-slate-400 px-4 py-4 text-lg focus:outline-none"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="mr-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <>
                        <Brain className="w-5 h-5 mr-2 animate-pulse" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {[
                  { icon: Globe, label: "Climate Analysis", color: "from-green-400 to-teal-500" },
                  { icon: Fish, label: "Marine Biology", color: "from-blue-400 to-cyan-500" },
                  { icon: Dna, label: "Genomics Data", color: "from-purple-400 to-pink-500" },
                  { icon: Waves, label: "Ocean Currents", color: "from-cyan-400 to-blue-500" }
                ].map(({ icon: Icon, label, color }, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(label)}
                    className="group flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-xl hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`p-1 rounded-lg bg-gradient-to-r ${color} opacity-80 group-hover:opacity-100`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-300 text-sm">{label}</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            {searchResults && (
              <div className="mb-16 max-w-4xl mx-auto">
                <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-cyan-400 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Ocean Intelligence Response
                      </CardTitle>
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                        Confidence: {Math.round(searchResults.confidence * 100)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-slate-200 leading-relaxed text-lg">
                      {searchResults.answer}
                    </div>
                    
                    {searchResults.related_topics && searchResults.related_topics.length > 0 && (
                      <div className="pt-4 border-t border-slate-700/50">
                        <h4 className="text-sm text-slate-400 mb-3">Related Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {searchResults.related_topics.map((topic, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="bg-slate-700/30 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 transition-colors cursor-pointer"
                              onClick={() => setSearchQuery(topic)}
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-slate-500 pt-2">
                      Source: {searchResults.source} | Powered by OceanAI
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Floating Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className={`relative group transition-all duration-700 ${
                    currentMetric === index ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-600/20 to-slate-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4 md:p-6 hover:border-slate-600/50 transition-all duration-300">
                    <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-1`}>
                      {metric.value}
                    </div>
                    <div className="text-slate-400 text-xs md:text-sm font-medium">
                      {metric.label}
                    </div>
                    <div className={`mt-2 h-1 bg-gradient-to-r ${metric.color} rounded-full transition-all duration-500 ${
                      currentMetric === index ? 'opacity-100' : 'opacity-30'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
                Powered by Advanced AI
              </h3>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Our neural networks process petabytes of ocean data in real-time, 
                delivering insights that were previously impossible to obtain.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Predictive Analytics",
                  description: "Forecast ocean conditions up to 30 days in advance using deep learning models",
                  icon: "🔮"
                },
                {
                  title: "Species Recognition",
                  description: "Identify and track marine life with 99.7% accuracy using computer vision",
                  icon: "🐠"
                },
                {
                  title: "Climate Modeling",
                  description: "Simulate complex ocean-atmosphere interactions with quantum-enhanced algorithms",
                  icon: "🌊"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300 h-full">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Styled-JSX for Grid Pattern */}
      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default Home;