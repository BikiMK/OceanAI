import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PhylogeneticTreeProps {
  newick: string;
  species: string[];
  metadata: {
    nodeCount: number;
    depth: number;
    confidence: number;
    method: string;
  };
}

const PhylogeneticTree: React.FC<PhylogeneticTreeProps> = ({ newick, species, metadata }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !newick) return;

    // Clear any existing content
    d3.select(containerRef.current).selectAll("*").remove();

    try {
      // Create SVG element
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      const svg = d3.select(containerRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "transparent");

      // Parse the Newick string and create a tree
      const parseNewick = (s: string) => {
        const ancestors: any[] = [];
        let tree: any = {};
        const tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
        
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          switch (token) {
            case '(': // New clade
              const subtree = {};
              tree.children = [subtree];
              ancestors.push(tree);
              tree = subtree;
              break;
            case ',': // Another branch
              const sibling = {};
              ancestors[ancestors.length - 1].children.push(sibling);
              tree = sibling;
              break;
            case ')': // End of clade
              tree = ancestors.pop();
              break;
            case ':': // Branch length delimiter (skip)
              break;
            case ';': // End of tree
              break;
            default:
              const x = tokens[i - 1];
              if (x === ')' || x === '(' || x === ',') {
                tree.name = token;
              } else if (x === ':') {
                tree.length = parseFloat(token);
              }
          }
        }
        return tree;
      };

      // Parse the Newick string
      const treeData = parseNewick(newick);
      
      // Create hierarchy
      const root = d3.hierarchy(treeData);
      
      // Create tree layout
      const treeLayout = d3.tree<any>()
        .size([height - 80, width - 120]);
      
      treeLayout(root);

      // Create group for tree elements
      const g = svg.append("g")
        .attr("transform", "translate(60, 40)");

      // Draw links
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal<any, any>()
          .x((d: any) => d.y)
          .y((d: any) => d.x))
        .style('fill', 'none')
        .style('stroke', '#60a5fa')
        .style('stroke-width', 2);

      // Draw nodes
      const nodes = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${d.y}, ${d.x})`);

      // Add circles for nodes
      nodes.append('circle')
        .attr('r', 4)
        .style('fill', (d: any) => d.children ? '#3b82f6' : '#10b981')
        .style('stroke', '#ffffff')
        .style('stroke-width', 1);

      // Add labels for leaf nodes
      nodes.filter((d: any) => !d.children)
        .append('text')
        .attr('dx', 8)
        .attr('dy', 4)
        .style('font-size', '12px')
        .style('fill', '#e5e7eb')
        .style('font-family', 'monospace')
        .text((d: any) => d.data.name || 'Unknown');

      // Add metadata display
      const metadataG = svg.append("g")
        .attr("transform", `translate(10, ${height - 60})`);

      metadataG.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "11px")
        .style("fill", "#9ca3af")
        .style("font-family", "sans-serif")
        .text(`Species: ${species.length} | Confidence: ${(metadata.confidence * 100).toFixed(1)}% | Method: ${metadata.method}`);

    } catch (error) {
      console.error('Error rendering phylogenetic tree:', error);
      
      // Fallback visualization
      const svg = d3.select(containerRef.current)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

      svg.append("text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .style("fill", "#ef4444")
        .style("font-size", "14px")
        .text("Error rendering tree. Check Newick format.");
    }
  }, [newick, species, metadata]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[300px]"
      style={{ minHeight: '300px' }}
    />
  );
};

export default PhylogeneticTree;