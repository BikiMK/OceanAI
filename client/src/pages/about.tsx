import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const teamMembers = [
    {
      name: "Biki Mukherjee",
      role: "Frontend Developer & Project Lead",
      initials: "BM",
      gradient: "from-primary to-accent",
      image: "src/images/biki.png", // Add your image path here
    },
    {
      name: "Rupsa Pramanik",
      role: "Backend & API Integration",
      initials: "RP",
      gradient: "from-accent to-green-400",
      image: "/images/rupsa-pramanik.jpg", // Add your image path here
    },
    {
      name: "Sayan Samadder",
      role: "Frontend Developer",
      initials: "SS",
      gradient: "from-accent to-green-400",
      image: "/images/sayan-samadder.jpg", // Add your image path here
    },
    {
      name: "Dipannita Biswas",
      role: "Documenctation Presentator",
      initials: "DB",
      gradient: "from-accent to-green-400",
      image: "/images/dipannita-biswas.jpg", // Add your image path here
    },
    {
      name: "Debjit Chakraborty",
      role: "AI/ML & Model Integration",
      initials: "DC",
      gradient: "from-green-400 to-blue-400",
      image: "/images/debjit-chakraborty.jpg", // Add your image path here
    },
  ];

  const dataSources = [
    "NOAA Ocean Database",
    "FAO Global Fisheries Statistics",
    "Copernicus Marine Environment",
    "OBIS Biodiversity Records",
    "GenBank Genetic Sequences",
    "Satellite Oceanography Data",
    "Regional Fisheries Organizations",
    "Marine Protected Area Networks",
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">About OceanAI Platform</h1>
          <p className="text-lg text-muted-foreground">Revolutionizing ocean research through artificial intelligence</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To accelerate ocean conservation and sustainable fisheries management through cutting-edge AI and comprehensive data integration, 
                providing researchers and policymakers with actionable insights for protecting marine ecosystems.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our platform leverages machine learning algorithms, satellite data, genomic analysis, and real-time sensor networks 
                to provide unprecedented insights into ocean health and fish population dynamics.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Research Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className={`w-24 h-24 bg-gradient-to-br ${member.gradient} rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden relative`}>
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={`${member.name} profile`}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span 
                      className={`text-2xl font-bold text-primary-foreground absolute inset-0 flex items-center justify-center ${member.image ? 'hidden' : 'flex'}`}
                      data-testid={`team-member-initials-${index}`}
                    >
                      {member.initials}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground" data-testid={`team-member-name-${index}`}>
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`team-member-role-${index}`}>
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <ul className="space-y-2">
                  {dataSources.slice(0, 4).map((source, index) => (
                    <li key={index} data-testid={`data-source-${index}`}>• {source}</li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  {dataSources.slice(4).map((source, index) => (
                    <li key={index + 4} data-testid={`data-source-${index + 4}`}>• {source}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default About;