import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import * as d3 from 'd3';

interface TreemapProps {
  positionData: Array<{
    name: string;
    spend: number;
  }>;
  title?: string;
  formatValue?: (value: number) => string;
}

const D3Treemap = ({ 
  positionData, 
  title = "Position Distribution by Spend",
  formatValue = (value: number) => `$${value.toFixed(2)}`
}: TreemapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Define a fixed color palette
  const COLORS = [
    "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", 
    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A", 
    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
    "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC", 
    "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399"
  ];

  // Create a consistent color mapping - Memoize this to prevent recalculation
  const colorScale = useRef(d3.scaleOrdinal<string>().range(COLORS));

  // Set up color domain only when data changes
  useEffect(() => {
    if (positionData.length > 0) {
      colorScale.current.domain(positionData.map(d => d.name));
    }
  }, [positionData]);

  // Calculate total once
  const totalSpend = useRef(0);
  useEffect(() => {
    totalSpend.current = positionData.reduce((sum, item) => sum + item.spend, 0);
  }, [positionData]);

  // Function to handle window resize
  const handleResize = () => {
    if (containerRef.current) {
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      if (newWidth !== dimensions.width || newHeight !== dimensions.height) {
        setDimensions({
          width: newWidth,
          height: newHeight
        });
      }
    }
  };

  // Set up resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    // Initial measurement
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Create and destroy tooltip
  useEffect(() => {
    // Create tooltip element if it doesn't exist
    if (!tooltipRef.current) {
      tooltipRef.current = document.createElement('div');
      tooltipRef.current.className = 'treemap-tooltip';
      document.body.appendChild(tooltipRef.current);

      // Style the tooltip
      const tooltipStyle = tooltipRef.current.style;
      tooltipStyle.position = 'absolute';
      tooltipStyle.backgroundColor = 'rgba(254, 254, 254, 0.95)';
      tooltipStyle.color = 'rgba(15, 4, 4, 0.9)';
      tooltipStyle.padding = '10px 15px';
      tooltipStyle.borderRadius = '5px';
      tooltipStyle.fontSize = '14px';
      tooltipStyle.fontWeight = '500';
      tooltipStyle.zIndex = '10000';
      tooltipStyle.pointerEvents = 'none';
      tooltipStyle.opacity = '0';
      tooltipStyle.transition = 'opacity 0.1s';
      tooltipStyle.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.25)';
      tooltipStyle.fontFamily = 'sans-serif';
      tooltipStyle.maxWidth = '300px';
      tooltipStyle.border = '1px solid rgba(0,0,0,0.1)';
    }

    return () => {
      // Clean up tooltip when component unmounts
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, []);

  // Render chart when data or dimensions change
  useEffect(() => {
    if (!svgRef.current || !legendRef.current || !containerRef.current || positionData.length === 0) return;
    if (!tooltipRef.current) return;
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Make sure all items are included regardless of size
    // Adjust the minimum size for small items
    const minSizeThreshold = 0.001 * totalSpend.current;
    const adjustedData = positionData.map(item => ({
      name: item.name,
      spend: Math.max(item.spend, minSizeThreshold),
      originalSpend: item.spend,
      percentage: (item.spend / totalSpend.current) * 100
    }));

    // Create hierarchical data structure for D3 treemap
    const hierarchyData = {
      name: "root",
      children: adjustedData.map(item => ({
        name: item.name, 
        value: item.spend,
        originalValue: item.originalSpend,
        percentage: item.percentage
      }))
    };

    // Create treemap layout
    const root = d3.hierarchy(hierarchyData)
      .sum(d => (d as any).value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemap = d3.treemap()
      .size([dimensions.width, dimensions.height])
      .paddingOuter(3)
      .paddingInner(2)
      .round(true);

    treemap(root);

    // Create the SVG elements
    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

    const tooltip = tooltipRef.current;

    // Add cells
    const cells = svg.selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .attr("data-name", d => (d.data as any).name);

    cells.append("rect")
      .attr("width", d => Math.max(d.x1 - d.x0, 1)) // Ensure minimum width
      .attr("height", d => Math.max(d.y1 - d.y0, 1)) // Ensure minimum height
      .attr("fill", d => colorScale.current((d.data as any).name))
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Handle mouse events at the SVG level
    svg.on("mousemove", function(event) {
      const mouse = d3.pointer(event);
      let foundElement = false;

      // Find which element is under the mouse
      cells.each(function(d) {
        const cell = d3.select(this);
        const x = mouse[0];
        const y = mouse[1];
        
        if (x >= d.x0 && x <= d.x1 && y >= d.y0 && y <= d.y1) {
          // Mouse is over this cell
          foundElement = true;
          
          // Highlight only this cell
          cells.selectAll("rect")
            .attr("fill-opacity", 0.85)
            .attr("stroke-width", 2);
          
          cell.select("rect")
            .attr("fill-opacity", 1)
            .attr("stroke-width", 3);
          
          // Show tooltip for this cell
          const data = d.data as any;
          const originalValue = data.originalValue || data.value;
          const formattedValue = formatValue(originalValue);
          const percentage = (data.percentage).toFixed(1);
          
          tooltip.innerHTML = `
            <div style="margin-bottom: 6px; font-size: 16px; font-weight: bold;">${data.name}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Value:</span>
              <span style="font-weight: bold; margin-left: 12px;">${formattedValue}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Share:</span>
              <span style="font-weight: bold; margin-left: 12px;">${percentage}%</span>
            </div>
          `;
          
          tooltip.style.opacity = '1';
          tooltip.style.left = `${event.pageX + 15}px`;
          tooltip.style.top = `${event.pageY - 20}px`;
          
          // Keep tooltip in viewport
          const tooltipRect = tooltip.getBoundingClientRect();
          if (tooltipRect.right > window.innerWidth) {
            tooltip.style.left = `${event.pageX - tooltipRect.width - 10}px`;
          }
          if (tooltipRect.bottom > window.innerHeight) {
            tooltip.style.top = `${event.pageY - tooltipRect.height - 15}px`;
          }
        }
      });
      
      // If mouse is not over any cell, hide tooltip
      if (!foundElement && tooltip.style.opacity !== '0') {
        tooltip.style.opacity = '0';
        cells.selectAll("rect")
          .attr("fill-opacity", 0.85)
          .attr("stroke-width", 2);
      }
    });
    
    // Handle mouse leave for the entire SVG
    svg.on("mouseleave", function() {
      tooltip.style.opacity = '0';
      cells.selectAll("rect")
        .attr("fill-opacity", 0.85)
        .attr("stroke-width", 2);
    });

    // Add text labels to cells (for larger cells)
    cells.append("text")
      .attr("x", d => (d.x1 - d.x0) / 2)
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#ffffff")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("pointer-events", "none")
      .style("text-shadow", "0px 0px 3px rgba(0,0,0,0.7)")
      .text(d => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        return width > 60 && height > 30 ? (d.data as any).name : "";
      });

    // Create legend
    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove();

    // Create grid layout for legend
    const legendContainer = legend
      .append("div")
      .attr("class", "grid grid-cols-2 gap-3");

    // Add legend items - using original data to ensure all items are shown in legend
    positionData
      .sort((a, b) => b.spend - a.spend)
      .forEach((item) => {
        const percentage = ((item.spend / totalSpend.current) * 100).toFixed(1);
        
        const legendItem = legendContainer
          .append("div")
          .attr("class", "flex items-center space-x-2");

        legendItem
          .append("span")
          .attr("class", "inline-block w-3 h-3 rounded-full")
          .style("background-color", colorScale.current(item.name));

        legendItem
          .append("span")
          .attr("class", "text-sm text-gray-700")
          .text(`${item.name}:`);

        legendItem
          .append("span")
          .attr("class", "text-sm font-semibold text-gray-800")
          .text(`${formatValue(item.spend)} (${percentage}%)`);
      });

  }, [positionData, dimensions, formatValue]);

  return (
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72 p-4 flex items-center justify-center">
        {positionData && positionData.length > 0 ? (
          <div className="w-full h-full" ref={containerRef}>
            <svg ref={svgRef} width="100%" height="100%" />
          </div>
        ) : (
          <p className="text-gray-500 text-lg font-semibold">No Data Available</p>
        )}
      </CardContent>

      {/* Legend Below the Chart */}
      {positionData && positionData.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div ref={legendRef}></div>
        </div>
      )}
    </Card>
  );
};

export default D3Treemap;