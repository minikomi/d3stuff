var draw = function(data){

  data = data.data.map(function(d){
  });

  var translate = function(x,y){               
    return "translate(" + x + "," + y + ")";
  }

  var width, height;

  var margin = {top: 40, right: 20, bottom: 40, left: 60};

  var x = d3.time.scale()
    .rangeRound([0,width])

  var svg = d3.select("#main").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", translate(margin.left, margin.top))

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%_I %p"))
    .tickSubdivide(2)
    .ticks(d3.time.hours, 3)
    .tickSize(8,4,2)

  svg.append("g").attr("class", "axis")
     .attr("transform", translate(0, topChartHeight + 5))
     .call(xAxis)
}

d3.json("./metro.json", draw)
