var margin = {top: 20, right: 10, bottom: 20, left: 10};

var minichartHeight = 300, minichartWidth = 300, minichartGutter = 30;

var axisHeight = 40, titleHeight = 18;

var width = (4 * (minichartWidth + minichartGutter)) - margin.left - margin.right,
    height = (12 * (minichartHeight + minichartGutter+ axisHeight + titleHeight)) - margin.top - margin.bottom;

var ages = ["0-4","5-9","10-14","15-19","20-24", "25-29","30-34","35-39","40-44","45-49", "50-54","55-59","60-64","65-69","70-74", "75-79","80-84","85-89","90+"];

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/in.csv", function(inDataRaw){
  d3.csv("data/out.csv", function(outDataRaw){

  data = [];

  inDataRaw.forEach(function(d){
    var pref = {"Prefecture": d["Prefecture"]};
    ages.forEach(function(x){
      pref[x] = {in:{}, out:{}}
      pref[x]["in"]["m"] = +d["m" + x];
      pref[x]["in"]["f"] = +d["f" + x];
      pref[x]["in"]["sum"] = pref[x]["in"]["m"] + pref[x]["in"]["f"]

    });
    data.push(pref);
  });
  outDataRaw.forEach(function(d,i){
    ages.forEach(function(x){
      data[i][x]["out"]["m"] = +d["m" + x];
      data[i][x]["out"]["f"] = +d["f" + x];
      data[i][x]["out"]["sum"] =  data[i][x]["out"]["m"] + data[i][x]["out"]["f"]
    });
  });

  data.forEach(function(d){
    d.inmax = d3.max(d3.values(d).splice(1).map(function(x){return  x.in.sum}))
    d.outmax = d3.max(d3.values(d).splice(1).map(function(x){if (x.out) return x.out.sum}))
  });

  var x = d3.scale.ordinal()
            .domain(ages)
            .rangeRoundBands([0,minichartWidth], 1,1);

  var minicharts = svg.selectAll(".chart")
    .data(data).enter()
      .append("g")
        .attr("transform", function(_,i){
          return "translate(" +
          ((i%4)*(minichartWidth + minichartGutter)) + "," +
          (Math.floor(i/4) * (minichartHeight + minichartGutter + titleHeight + axisHeight)) +
          ")"
        })
        .attr("class", "chart")
        .attr("id", function(d){return d.Prefecture});


  var axis = d3.svg.axis()
                .scale(x)

    minicharts.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (minichartHeight/2) + ")")
        .call(axis)
          .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    minicharts.append("text")
      .attr("x", minichartWidth/2)
      .text(function(d){return d["Prefecture"]})
      .attr("text-anchor", "middle")
      .attr("class","title")

    minicharts.each(function(pref){

      var mc = d3.select(this);

      var inY = d3.scale.linear()
                .range([0,(minichartHeight/2)])
                .domain([0,pref.inmax])

      mc.selectAll(".m .in")
        .data( function(d){ return ages.map(function(x){return d[x]})}).enter()
        .append("rect")
          .attr("class", "m in")
          .attr("x", function(_, i){return x(i)-x(0)/2 + 1.5})
          .attr("y", function(d){return (minichartHeight/2) - inY(d["in"]["m"])})
          .attr("height", function(d){return inY(d["in"]["m"])})
          .attr("width", x(1) - x(0) - 2)

      mc.selectAll(".f .in")
        .data( function(d){ return ages.map(function(x){return d[x]})}).enter()
        .append("rect")
          .attr("class", "f in")
          .attr("x", function(_, i){return x(i)-x(0)/2 + 1.5})
          .attr("y", function(d){  return (minichartHeight/2) - inY(d["in"]["f"]) - inY(d["in"]["m"])})
          .attr("height", function(d){return inY(d["in"]["f"])})
          .attr("width", x(1) - x(0) - 2)

      var outY = d3.scale.linear()
                .range([0,(minichartHeight/2)])
                .domain([0,pref.outmax])

      mc.selectAll(".m .out")
        .data( function(d){return ages.map(function(x){return d[x]})}).enter()
        .append("rect")
          .attr("class", "m out")
          .attr("x", function(_, i){return x(i)-x(0)/2 + 1.5})
          .attr("y", function(d){return (minichartHeight/2 + axisHeight)})
          .attr("height", function(d){return outY(d["out"]["m"])})
          .attr("width", x(1) - x(0) - 2)

      mc.selectAll(".f .out")
        .data( function(d){  return ages.map(function(x){return d[x]})}).enter()
        .append("rect")
          .attr("class", "f out")
          .attr("x", function(_, i){return x(i)-x(0)/2 + 1.5})
          .attr("y", function(d){return (minichartHeight/2) +axisHeight + outY(d["out"]["m"])})
          .attr("height", function(d){return outY(d["out"]["f"])})
          .attr("width", x(1) - x(0) - 2)

    });


  })

})
