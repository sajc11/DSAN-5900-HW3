define(["d3"], function(d3) {
    document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ resolution_map.js loaded");
  
    const container = d3.select("#map-container");
    let svg, tooltip, width, height, projection, path, color, photoFilter = 1;
    let selectedCircle = null;
  
    init();
  
    function init() {
      container.selectAll("*").remove();
  
      width = container.node().getBoundingClientRect().width;
      height = window.innerWidth < 700 ? width * 0.75 : width * 0.65; // adjusted height for better proportions
  
      svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
  
      tooltip = container
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
  
      projection = d3.geoMercator()
        .center([-122.433701, 37.767683])
        .scale(width * 220)
        .translate([width / 2, height / 2]);
  
      path = d3.geoPath().projection(projection);
  
      color = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([0.5, 1.0]);
  
      // Load data
      Promise.all([
        d3.csv("data/311_map_data.csv"),
        d3.json("data/SF_Find_Neighborhoods_2025.geojson")
      ])
        .then(([data, geo]) => {
          data.forEach(d => {
            d.latitude = +d.latitude;
            d.longitude = +d.longitude;
            d.resolution_rate = +d.resolution_rate;
            d.resolution_time = +d.resolution_time;
            d["photo.dumm"] = +d["photo.dumm"];
          });
  
          addToggleControls();
          drawMap(data, geo);
  
          // Handle window resizing
          window.addEventListener("resize", () => {
            width = container.node().getBoundingClientRect().width;
            height = window.innerWidth < 700 ? width * 0.75 : width * 0.65;
            
            svg.attr("width", width)
              .attr("height", height)
              .attr("viewBox", `0 0 ${width} ${height}`);
            
            projection.scale(width * 220)
              .translate([width / 2, height / 2]);
            
            drawMap(data, geo);
          });
        })
        .catch(error => {
          console.error("🚨 Failed to load map:", error);
          container.append("p")
            .attr("class", "error-message")
            .text("⚠️ Map failed to load. Check console for details.");
        });
    }
  
    function addToggleControls() {
      const toggle = container
        .append("div")
        .attr("class", "toggle");
  
      toggle.append("button")
        .attr("class", photoFilter === 1 ? "photo-toggle-btn active" : "photo-toggle-btn")
        .text("With Photo")
        .on("click", function () {
          if (photoFilter !== 1) {
            photoFilter = 1;
            d3.selectAll(".photo-toggle-btn").classed("active", false);
            d3.select(this).classed("active", true);
            
            // Redraw with new filter
            Promise.all([
              d3.csv("data/311_map_data.csv"),
              d3.json("data/SF_Find_Neighborhoods_2025.geojson")
            ]).then(([data, geo]) => {
              data.forEach(d => {
                d.latitude = +d.latitude;
                d.longitude = +d.longitude;
                d.resolution_rate = +d.resolution_rate;
                d.resolution_time = +d.resolution_time;
                d["photo.dumm"] = +d["photo.dumm"];
              });
              
              drawMap(data, geo);
            });
          }
        });
  
      toggle.append("button")
        .attr("class", photoFilter === 0 ? "photo-toggle-btn active" : "photo-toggle-btn")
        .text("Without Photo")
        .on("click", function () {
          if (photoFilter !== 0) {
            photoFilter = 0;
            d3.selectAll(".photo-toggle-btn").classed("active", false);
            d3.select(this).classed("active", true);
            
            // Redraw with new filter
            Promise.all([
              d3.csv("data/311_map_data.csv"),
              d3.json("data/SF_Find_Neighborhoods_2025.geojson")
            ]).then(([data, geo]) => {
              data.forEach(d => {
                d.latitude = +d.latitude;
                d.longitude = +d.longitude;
                d.resolution_rate = +d.resolution_rate;
                d.resolution_time = +d.resolution_time;
                d["photo.dumm"] = +d["photo.dumm"];
              });
              
              drawMap(data, geo);
            });
          }
        });
    }
  
    function drawMap(data, geo) {
      const filtered = data.filter(d => d["photo.dumm"] === photoFilter);
      svg.selectAll("*").remove();
  
      // Draw map background
      svg.append("g")
        .selectAll("path")
        .data(geo.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#f2f2f2")
        .attr("stroke", "#aaa")
        .attr("stroke-width", 0.5);
  
      // Draw data points
      svg.append("g")
        .selectAll("circle")
        .data(filtered)
        .join("circle")
        .attr("cx", d => projection([d.longitude, d.latitude])[0])
        .attr("cy", d => projection([d.longitude, d.latitude])[1])
        .attr("r", 0)
        .attr("fill", d => color(d.resolution_rate))
        .attr("stroke", "#222")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.8)
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 7)
            .attr("opacity", 1);
          
          tooltip
            .style("opacity", 0.95)
            .html(`
              <strong>${d.neighborhood || "Unknown"}</strong><br/>
              Resolution Rate: ${(d.resolution_rate * 100).toFixed(1)}%<br/>
              Avg Time: ${Math.round(d.resolution_time)} hrs<br/>
              ${d.top_case_1 ? `Top Cases:<br/>• ${d.top_case_1}<br/>• ${d.top_case_2}<br/>• ${d.top_case_3}` : ""}
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          if (this !== selectedCircle) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 5)
              .attr("opacity", 0.8);
          }
          
          tooltip.transition().duration(300).style("opacity", 0);
        })
        .on("click", function (event, d) {
          if (selectedCircle === this) {
            // Deselect if already selected
            selectedCircle = null;
            d3.select(this)
              .attr("stroke", "#222")
              .attr("stroke-width", 0.5)
              .attr("r", 5)
              .attr("opacity", 0.8);
            return;
          }
          
          // Deselect previously selected circle
          if (selectedCircle) {
            d3.select(selectedCircle)
              .attr("stroke", "#222")
              .attr("stroke-width", 0.5)
              .attr("r", 5)
              .attr("opacity", 0.8);
          }
          
          // Select new circle
          selectedCircle = this;
          
          d3.select(this)
            .raise()
            .attr("stroke", "#ff6600")
            .attr("stroke-width", 2)
            .attr("r", 7)
            .attr("opacity", 1);
            
          tooltip
            .style("opacity", 0.95)
            .html(`
              <strong>${d.neighborhood || "Unknown"}</strong><br/>
              Resolution Rate: ${(d.resolution_rate * 100).toFixed(1)}%<br/>
              Avg Time: ${Math.round(d.resolution_time)} hrs<br/>
              ${d.top_case_1 ? `Top Cases:<br/>• ${d.top_case_1}<br/>• ${d.top_case_2}<br/>• ${d.top_case_3}` : ""}
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .transition()
        .duration(600)
        .attr("r", 5);
        
      // Add title to the map
      svg.append("text")
        .attr("class", "map-title")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text(`311 Resolution Rates ${photoFilter === 1 ? "With" : "Without"} Photo Evidence`);
        
      // Add legend
      const legendWidth = 200;
      const legendHeight = 10;
      const legendX = width - legendWidth - 20;
      const legendY = height - 50;
      
      const legendScale = d3.scaleLinear()
        .domain([0.5, 1.0])
        .range([0, legendWidth]);
        
      const legendAxis = d3.axisBottom(legendScale)
        .tickValues([0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
        .tickFormat(d => `${(d*100).toFixed(0)}%`);
        
      // Create legend gradient
      const defs = svg.append("defs");
      
      const gradient = defs.append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
        
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color(0.5));
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color(1.0));
      
      // Draw legend
      svg.append("g")
        .attr("transform", `translate(${legendX}, ${legendY})`)
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)");
        
      svg.append("g")
        .attr("class", "legend-axis")
        .attr("transform", `translate(${legendX}, ${legendY + legendHeight})`)
        .call(legendAxis)
        .select(".domain").remove();
        
      svg.append("text")
        .attr("class", "legend-title")
        .attr("x", legendX)
        .attr("y", legendY - 8)
        .attr("text-anchor", "start")
        .text("Resolution Rate");
    }
  });
});