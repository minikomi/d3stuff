var translate = function(x,y){               
  return "translate(" + x + "," + y + ")";
}

var draw = function(data){
  var bits = data.bitblocks;

  var fileDiv = d3.select("#main").append("div").attr("class", "file")

  fileDiv.append("div").html(tmpl("file_description_tmpl", data))

  var colors = d3.scale.category20b();

//  var colors = d3.scale.ordinal()
//    .range(["#8DD3C7", "#FFFFB3", "#BEBADA", "#FB8072", "#80B1D3", "#FDB462", "#B3DE69"]);

  var offset = 0;
  bits.forEach(function(d, i){
    d.offset = offset;
    d.number = i;
    d.row = Math.floor(d.offset / 32);
    offset = offset + d.bits;
  });

  var rows = d3.nest()
    .key(function(d){ return d.row})
    .entries(bits)

 var  rowHeight = 40,
      bitWidth = 20,
      gridWidth = 32 * bitWidth,
      height = rows.length * rowHeight + 40;

  var margin = {top: 0, right: 20, bottom: 40, left: 10};

  var x = d3.scale.linear()
    .rangeRound([0, gridWidth])
    .domain([0,32]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .tickValues([0,4,8,12,16,20,24,28,32])
    .tickSubdivide(4)
    .tickSize(8,4,2)

  var svg = fileDiv.append("svg")
    .attr("width", gridWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", translate(margin.left, margin.top))

  var axisg = svg.append("g")
    .attr("class", "axis")
    .attr("transform", translate(0,40))
    .call(xAxis)


  axisg.append("text").text("bits").attr("x", 5).attr("y", -11).attr("fill","#e22")

  var grid = svg.append("g")
    .attr("transform", translate(0,50))
  
  var rows = grid.selectAll(".row")
    .data(rows)
    .enter().append("g")
    .attr("class", "row")
    .attr("transform", function(d){ return translate(0, (rowHeight * d.key))})

  // Event Handlers

  var mouseOverHandler = function(d) {

    var className = d3.select(this).attr("class")

    bitblocks.attr("opacity", 0.5);
    keys.style("opacity", 0.5);

    grid.select("."+className)
      .attr("opacity", 1)

    fileKeyDiv.select("."+className)
      .style("opacity", 1)

    fileDiv.select(".blockDescription")
      .html("<h3>"+d.name+" <span>("+d.bits+" bit"+(d.bits > 1? "s":"")+")</span></h3>"+"<div>"+d.description+"</div>")
  }

  var mouseOutHandler = function(d) {
    d3.select("#tooltip")
    .style("display", "none")
    bitblocks.attr("opacity", 1)
    keys.style("opacity", 1);
  }

  var count = 0;
  bitblocks = rows.selectAll(".bitblock")
    .data(function(d){return d.values})
    .enter().append("rect")
      .attr("class", function(d){return "key_" + d.name.replace(/\W*/g,"")})
      .attr("x", function(d){ return x(d.offset - (d.row * 32)) + 1})
      .attr("width", function(d){return d.bits * bitWidth - 2})
      .attr("height", rowHeight - 2)
      .attr("fill", function(d,i){count++; return d3.rgb(colors(d.number))})
      .attr("stroke", function(d,i){return d3.rgb(colors(d.number)).darker()})
      .on("mouseover", mouseOverHandler)
      .on("mouseout", mouseOutHandler);

  fileKeyDiv = fileDiv.append("div")
    .attr("class", "fileKey")

  fileKeyDiv.append("h2")
    .text("Parts")

  var ul = fileKeyDiv.append("ul")

  var keys = ul.selectAll("li")
      .data(bits).enter()
      .append("li")
        .text(function(d){return d.name})
        .attr("class", function(d){return "key_" + d.name.replace(/\W*/g,"")})
        .style("color", function(d,i){return d3.rgb(colors(i)).darker()})
        .on("mouseover", mouseOverHandler)
        .on("mouseout", mouseOutHandler);

  fileKeyDiv.append("div")
      .attr("class", "blockDescription")

}

d3.json("./ip.json", draw)
