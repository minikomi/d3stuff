var margin = {top: 20, right: 10, bottom: 20, left: 10};

var axisHeight = 40, titleHeight = 18;

var width = 800,
    height = 600;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var Point = (function(){
  var p = Point.prototype;
  function Point() {
    var x = Math.floor(Math.random() * width),
        y = Math.floor(Math.random() * height);
    this.getxy = function() {
      return {x:x,y:y}
    }
    this.randomxy = function() {
      x = x + 100 - Math.floor(Math.random() * 200);
      y = y + 100  - Math.floor(Math.random() * 200);

      if (x < margin.left) x = margin.left
      if (y < margin.top) y = margin.top
      if (x > width - margin.right) x = width - margin.right
      if (y > height - margin.bottom) y = height - margin.bottom
    }
  }
  return Point;
})();

var pointsData = [
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point(),
  new Point()
];



var tick = function (data) {

  var lineƒ = d3.svg.line()
              .x(function(p) { return p.getxy().x; })
              .y(function(p) { return p.getxy().y; })
                .interpolate("cardinal-closed")

  var line = svg.selectAll("path").data([data])

  line.enter().append("path")
    .attr("d", function(d){return lineƒ(d)})
    .attr("stroke", "pink")
    .attr("stroke-width", "1")
    .attr("fill", "none")

  line.transition()
    .delay(200)
    .duration(600)
    .ease("linear")
    .attr("d", function(d){return lineƒ(d)})
    .attr("stroke", "#22eeff")
    .attr("stroke-width", "3")
    .attr("fill", "#ffeeee")

  var points = svg.selectAll("circle").data(data)

  points.enter()
    .append("circle")
      .attr("cx", function(p) {return p.getxy().x })
      .attr("cy", function(p) {return p.getxy().y })
      .attr("r", 3);


  points.transition()
    .delay(200)
    .duration(600)
    .ease("linear")
    .attr("cx", function(p) {return p.getxy().x })
    .attr("cy", function(p) {return p.getxy().y })



}

setInterval(function() {
  pointsData.forEach(function(p){
    p.randomxy();
  });
  tick(pointsData);
}, 800)
