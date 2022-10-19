var screenWidth;
var screenHeight;

function init() {

        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
     
        

        

        window.addEventListener("resize", onResize);
}


function onResize() {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;

        drawLines();
}

function drawLines() {


        var holder = d3.select("body") // select the 'body' element
        .append("svg")           // append an SVG element to the body
        .attr("width", screenWidth)      // make the SVG element 449 pixels wide
        .attr("height", screenHeight);    // make the SVG element 249 pixels high
  
        // draw a line (heatmap)
        holder.append('line')
        .style("stroke", "blue")
        .style("stroke-width", 3)
        .attr("x1", 0)
        .attr("y1", screenHeight * 1/3)
        .attr("x2", screenWidth * 1/3)
        .attr("y2", screenHeight * 1/3); 

        // draw a line (scented widget)
        holder.append('line')
        .style("stroke", "blue")
        .style("stroke-width", 3)
        .attr("x1", screenWidth * 1/3)
        .attr("y1", screenHeight * 1/3)
        .attr("x2", screenWidth * 1/3)
        .attr("y2", screenHeight); 

        // draw a line(moves)
        holder.append('line')
        .style("stroke", "blue")
        .style("stroke-width", 3)
        .attr("x1", screenWidth * 1/3)
        .attr("y1", screenHeight * 1/2)
        .attr("x2", screenWidth)
        .attr("y2", screenHeight * 1/2); 


        // draw a line (stats)
        holder.append('line')
        .style("stroke", "blue")
        .style("stroke-width", 3)
        .attr("x1", screenWidth * 1/3)
        .attr("y1", 0)
        .attr("x2", screenWidth*1/3)
        .attr("y2", screenHeight * 1/2); 
}