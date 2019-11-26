const width = 1500
const height = 400

const colors = ["#cae1f7", "#add8ff", "#80b9ee", "#559ce4", "#0078d4", "#235a9f", "#174276", "#092642"]

const svg =  d3.select("#chart")
               .append("svg")
               .attr("width", width)
               .attr("height", height)
               //.call(responsivefy)

const tooltip = d3.select("#chart")
                  .append("div")
                  .attr("id", "tooltip")

//Legend
const legend = svg.append("g")
                  .attr("id", "legend")

for(var i = 0; i < colors.length; i++){
     legend.append("g")
           .append("rect")
           .attr("class", "legend-item")
           .attr("x", width - (40 * (i+1)))
           .attr("y", height + 60)
           .attr("width", 40)
           .attr("height", 20)
           .attr("fill", colors[colors.length - 1 - i])
           .attr("transform", "translate(-455, -460)")
}

const treemap = d3.treemap()
                  .size([width, height])
                  .paddingInner(1)

//Receive data and build tree.
d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json", function(error,data){
  if (error) throw error
  console.log(data)
  
  var root = d3.hierarchy(data)
               .eachBefore(d => {
                  d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name
                 })
               .sum(d => d.value)
               .sort((a, b) => b.height - a.height || b.value - a.value)
  
  treemap(root)
  
  const cell = svg.selectAll('g')
                  .data(root.leaves())
                  .enter()
                  .append('g')
                  .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")")

  cell.append('rect')
          .attr('id', d => d.data.id)
          .attr('class', 'tile')
          .attr('data-name', d => d.data.name)
          .attr('data-value', d => d.data.value)
          .attr('data-category', d => d.data.category)
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
})