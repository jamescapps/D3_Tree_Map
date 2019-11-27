const width = 1200
const height = 400

const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"]
const colorScheme = []
    d3.schemeCategory10.forEach(color => {
      colorScheme.push(color);
    })
const colorScale = d3.scaleOrdinal(colorScheme)

const svg =  d3.select("#chart")
               .append("svg")
               .attr("width", width)
               .attr("height", height + 500)
               .call(responsivefy)

const treemap = d3.treemap()
                  .size([width - 80, height + 300])
                  .paddingInner(1)
                  
const tooltip = d3.select("#chart")
                  .append("div")
                  .attr("id", "tooltip")

//Receive data.
d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json", function(error,data){
  if (error) throw error
  
  //Builds tree.
  const root = d3.hierarchy(data)
                 .eachBefore(d => {
                    d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name
                  })
                 .sum(d => d.value)
                 .sort((a, b) => b.height - a.height || b.value - a.value)
              
  treemap(root)
  
  const cell = svg.selectAll("g")
                  .data(root.leaves())
                  .enter()
                  .append("g")
                  .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")")
              
  cell.append("rect")
      .attr("id", d => d.data.id)
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-value", d => d.data.value)
      .attr("data-category", d => d.data.category)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => colorScale(d.data.category))
      .on("mousemove", function(d) {    
        tooltip.style("opacity", .9)
        tooltip.html(
          "Name: " + d.data.name + 
          "<br>Genre: " + d.data.category + 
          "<br>Value: " + d3.format('$,.2s')(d.data.value)
        )
        .attr("data-value", d.data.value)
        .style("left", (d3.event.pageX) + 15 + "px") 
        .style("top", (d3.event.pageY) + "px")
      })    
      .on("mouseout", function(d) { 
        tooltip.style("opacity", 0)
      })
  
  cell.append("text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("x", 5)
      .attr("y", (d, i) => 13 + 10 * i)
      .text(d => d)
  
  //Legend
  const legend = svg.append("g")
                    .attr("id", "legend")

  legend.append("text")
        .attr("class", "legendLabel")
        .attr("x", width - (28 * (i + 1)) + 20)
        .attr("y", height + 90)
        .attr("transform", "translate(247, 315)")
        .text("Action"  + "\xa0\xa0\xa0" + "\xa0\xa0\xa0" + "\xa0\xa0\xa0"+ "Adventure" +  "\xa0\xa0\xa0\xa0\xa0\xa0" + "\xa0\xa0"+ "Comedy" + "\xa0\xa0\xa0\xa0\xa0\xa0" + "\xa0\xa0\xa0" + "\xa0" +  "Drama"  +  "\xa0\xa0\xa0\xa0\xa0" + "\xa0\xa0\xa0" + "\xa0\xa0" + "Animation" + "\xa0\xa0\xa0\xa0\xa0" + "\xa0\xa0\xa0\xa0" + "Family"  + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "\xa0\xa0"  + "Biography")
        .style("fill","white")  
  
  for(var i = 0; i < colors.length; i++){
      legend.append("g")
            .append("rect")
            .attr('class','legend-item')                 
            .attr("x", width - (100 * (i + 1)))
            .attr("y", height + 60)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", colors[colors.length - 1 - i])
            .attr("transform", "translate(-240, 300)")
  }
})

 /* The below function makes the graph responsive.  It was taken from Ben Clinkinbeard's website and was originally written by Brendan Sudol. https://benclinkinbeard.com/d3tips/make-any-chart-responsive-with-one-function/?utm_content=buffer976d6&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer */
  
    function responsivefy(svg) {
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width"), 10),
        height = parseInt(svg.style("height"), 10),
        aspect = width / height

    svg.attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMid")
        .call(resize);

    d3.select(window).on(
        "resize." + container.attr("id"), 
        resize
    )
    
    function resize() {
        const w = parseInt(container.style("width"))
        svg.attr("width", w)
        svg.attr("height", Math.round(w / aspect))
    }
  }  