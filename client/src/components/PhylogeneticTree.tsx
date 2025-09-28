import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface PhylogeneticTreeProps {
  newick?: string;
  species?: string[];
  metadata?: any;
}

const PhylogeneticTree: React.FC<PhylogeneticTreeProps> = ({ newick, species = [], metadata }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewMode, setViewMode] = useState<'radial' | 'hierarchical'>('radial');

  // Sample data for demonstration
  const defaultSpecies = [
    'Katsuwonus_pelamis', 'Harpadon_nehereus', 'Gadus_morhua', 'Labeo_rohita',
    'Etroplus_suratensis', 'Lates_calcarifer', 'Coryphaena_hippurus',
    'Oreochromis_mossambicus', 'Catla_catla', 'Anabas_testudineus',
    'Rastrelliger', 'Salmo', 'Sardinella', 'Scomberomorus', 'Tenuialosa',
    'Thunnus', 'Salmo_salar', 'Scomberomorus_guttatus', 'Thunnus_obesus'
  ];

  const speciesData = species.length > 0 ? species : defaultSpecies;

  const renderRadialTree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 80;
    
    svg.attr("width", width).attr("height", height);
    
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create simulated tree structure
    const angleStep = (2 * Math.PI) / speciesData.length;
    const colors = d3.schemeCategory10;
    
    // Draw center point
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 4)
      .attr("fill", "#22d3ee");

    // Create groups and branches
    const groups = [
      { name: "Group 1", species: speciesData.slice(0, Math.ceil(speciesData.length / 3)), color: colors[0] },
      { name: "Group 2", species: speciesData.slice(Math.ceil(speciesData.length / 3), Math.ceil(2 * speciesData.length / 3)), color: colors[1] },
      { name: "Group 3", species: speciesData.slice(Math.ceil(2 * speciesData.length / 3)), color: colors[2] }
    ];

    groups.forEach((group, groupIndex) => {
      const groupAngleStart = (groupIndex * 2 * Math.PI) / 3;
      const groupAngleRange = (2 * Math.PI) / 3;
      
      group.species.forEach((species, speciesIndex) => {
        const angle = groupAngleStart + (speciesIndex * groupAngleRange) / group.species.length;
        const branchLength = radius * (0.6 + Math.random() * 0.4);
        
        const x = Math.cos(angle - Math.PI / 2) * branchLength;
        const y = Math.sin(angle - Math.PI / 2) * branchLength;
        
        // Draw branch
        g.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", x)
          .attr("y2", y)
          .attr("stroke", group.color)
          .attr("stroke-width", 2)
          .attr("opacity", 0.8);
        
        // Draw species point
        g.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 3)
          .attr("fill", group.color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);
        
        // Add species label
        const labelX = Math.cos(angle - Math.PI / 2) * (branchLength + 20);
        const labelY = Math.sin(angle - Math.PI / 2) * (branchLength + 20);
        
        g.append("text")
          .attr("x", labelX)
          .attr("y", labelY)
          .attr("text-anchor", labelX > 0 ? "start" : "end")
          .attr("alignment-baseline", "middle")
          .attr("font-size", "10px")
          .attr("fill", "#374151")
          .text(species.replace(/_/g, ' '));
      });
    });

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text("Simulated Taxonomy-based Phylogenetic Tree (Radial Layout)");
  };

  const renderHierarchicalTree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    
    svg.attr("width", width).attr("height", height);
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create hierarchical structure
    const treeWidth = width - margin.left - margin.right;
    const treeHeight = height - margin.top - margin.bottom;
    
    // Root node
    const rootNode = {
      x: treeWidth / 2,
      y: 50,
      label: "Root Node",
      subtitle: "Common Ancestor of Species",
      color: "#6366f1"
    };
    
    // Group nodes
    const groupNodes = [
      { x: treeWidth * 0.2, y: 150, label: "Group 1", subtitle: "Ruhu, Catla, Hilsa", color: "#3b82f6" },
      { x: treeWidth * 0.5, y: 150, label: "Group 2", subtitle: "Mackerel, Seer Fish, Tuna", color: "#f59e0b" },
      { x: treeWidth * 0.8, y: 150, label: "Group 3", subtitle: "Cod, Barramundi, Tilapia", color: "#10b981" }
    ];
    
    // Sub-group nodes
    const subGroups = [
      { x: treeWidth * 0.1, y: 280, label: "Sub-group 1A", subtitle: "Ruhu Variants: Bagwe Tuna, Pacific", color: "#6366f1", parent: 0 },
      { x: treeWidth * 0.3, y: 280, label: "Sub-group 1B", subtitle: "Hilsa Variants: Atlantic Salmon, Bluefin", color: "#6366f1", parent: 0 },
      { x: treeWidth * 0.5, y: 280, label: "Sub-group 2A", subtitle: "Key Anglerfish: Kingfish, Skipjack Tuna", color: "#f59e0b", parent: 1 },
      { x: treeWidth * 0.9, y: 280, label: "Sub-group 3A", subtitle: "Adaptable Species: Catla, Climbing", color: "#10b981", parent: 2 }
    ];

    // Draw connections
    // Root to groups
    groupNodes.forEach(group => {
      g.append("line")
        .attr("x1", rootNode.x)
        .attr("y1", rootNode.y + 20)
        .attr("x2", rootNode.x)
        .attr("y2", 120)
        .attr("stroke", "#4b5563")
        .attr("stroke-width", 2);
      
      g.append("line")
        .attr("x1", rootNode.x)
        .attr("y1", 120)
        .attr("x2", group.x)
        .attr("y2", 120)
        .attr("stroke", "#4b5563")
        .attr("stroke-width", 2);
      
      g.append("line")
        .attr("x1", group.x)
        .attr("y1", 120)
        .attr("x2", group.x)
        .attr("y2", group.y - 20)
        .attr("stroke", "#4b5563")
        .attr("stroke-width", 2);
    });
    
    // Groups to sub-groups
    subGroups.forEach(subGroup => {
      const parentGroup = groupNodes[subGroup.parent];
      
      g.append("line")
        .attr("x1", parentGroup.x)
        .attr("y1", parentGroup.y + 20)
        .attr("x2", parentGroup.x)
        .attr("y2", 220)
        .attr("stroke", "#4b5563")
        .attr("stroke-width", 1.5);
      
      g.append("line")
        .attr("x1", parentGroup.x)
        .attr("y1", 220)
        .attr("x2", subGroup.x)
        .attr("y2", 220)
        .attr("stroke", "#4b5563")
        .attr("stroke-width", 1.5);
      
      g.append("line")
        .attr("x1", subGroup.x)
        .attr("y1", 220)
        .attr("x2", subGroup.x)
        .attr("y2", subGroup.y - 20)
        .attr("stroke", "#4b5563")
        .attr("stroke-width", 1.5);
    });

    // Draw nodes
    const drawNode = (node: any, size: number = 80) => {
      const nodeGroup = g.append("g");
      
      nodeGroup.append("rect")
        .attr("x", node.x - size)
        .attr("y", node.y - 20)
        .attr("width", size * 2)
        .attr("height", 40)
        .attr("fill", node.color)
        .attr("fill-opacity", 0.1)
        .attr("stroke", node.color)
        .attr("stroke-width", 2)
        .attr("rx", 5);
      
      nodeGroup.append("text")
        .attr("x", node.x)
        .attr("y", node.y - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", node.color)
        .text(node.label);
      
      nodeGroup.append("text")
        .attr("x", node.x)
        .attr("y", node.y + 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("fill", "#6b7280")
        .text(node.subtitle);
    };

    // Draw all nodes
    drawNode(rootNode, 100);
    groupNodes.forEach(node => drawNode(node, 90));
    subGroups.forEach(node => drawNode(node, 85));

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", "#e5e7eb")
      .text("Evolutionary Relationships");
  };

  useEffect(() => {
    if (!svgRef.current) return;
    
    if (viewMode === 'radial') {
      renderRadialTree();
    } else {
      renderHierarchicalTree();
    }
  }, [viewMode, speciesData]);

  return (
    <div className="w-full h-full relative bg-gray-900">
      {/* View mode toggle */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-600">
          <button
            onClick={() => setViewMode('radial')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'radial'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Radial
          </button>
          <button
            onClick={() => setViewMode('hierarchical')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'hierarchical'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Tree
          </button>
        </div>
      </div>

      {/* Tree visualization */}
      <div className="flex items-center justify-center h-full">
        <svg
          ref={svgRef}
          className="max-w-full max-h-full"
          style={{ background: viewMode === 'radial' ? '#f9fafb' : 'transparent' }}
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-3 border border-gray-600">
        <div className="text-xs text-gray-300 mb-2 font-medium">Species Groups</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-300">Marine Species</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs text-gray-300">Pelagic Fish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-300">Freshwater Species</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhylogeneticTree;