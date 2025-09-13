const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 ocean-gradient rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">OceanAI Platform</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Advanced AI-driven platform for ocean research and sustainable fisheries management.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Research Team</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>👨‍💻 Biki Mukherjee – Frontend Developer & Project Lead</p>
              <p>👨‍💻 Rupsa Pramanik – Backend & API Integration</p>
              <p>👨‍💻 Sayan Samadder – Data Analyst & Visualization</p>
              <p>👩‍💻 Debjit Chakraborty – AI/ML & Model Training</p>
              <p>👩‍💻 Dipannita Biswas – Research & Documentation</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Data Sources</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>NOAA Ocean Database</p>
              <p>FAO Fisheries Statistics</p>
              <p>GenBank Sequences</p>
              <p>Copernicus Marine Data</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 OceanAI Platform. Advancing marine science through artificial intelligence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;