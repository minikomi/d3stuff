var margin = {top: 20, right: 10, bottom: 20, left: 10};

var minichartHeight = 300, minichartWidth = 300, minichartGutter = 30;

var axisHeight = 40, titleHeight = 18;

var width = (4 * (minichartWidth + minichartGutter)) - margin.left - margin.right,
    height = (12 * (minichartHeight + minichartGutter+ axisHeight + titleHeight + 30)) - margin.top - margin.bottom;

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

  var xconv = d3.scale.linear()
              .domain([x(ages[0]), x(ages[ages.length - 1])])
              .rangeRound([0, ages.length-1]);

  var minicharts = svg.selectAll(".chart")
    .data(data).enter()
      .append("g")
        .attr("transform", function(_,i){
          return "translate(" +
          ((i%4)*(minichartWidth + minichartGutter)) + "," +
          (margin.top + Math.floor(i/4) * (minichartHeight + minichartGutter + titleHeight + axisHeight + 20)) +
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
      .attr("x", minichartWidth)
      .attr("y", minichartHeight /2 + axisHeight + 26)
      .text(function(d){return d["Prefecture"]})
      .attr("text-anchor", "end")
      .attr("class","title")
      .attr("dy", "-.35em")



    minicharts.each(function(pref){
      var mc = d3.select(this);
      var max = d3.max([pref.inmax, pref.outmax])

      var y = d3.scale.linear()
                .range([0,(minichartHeight/2)])
                .domain([0,max])


      var inlabelY = y(pref.inmax);
      var outlabelY = y(pref.outmax);

      mc.append("text").attr("class","label")
        .attr("x",0)
        .attr("y", minichartHeight/2 - inlabelY - 22 )
        .text("入 MAX: "  + pref.inmax + "人")

      mc.append("line")
        .attr("class", "limit")
        .attr("x1",0)
        .attr("x2",minichartWidth)
        .attr("y1", minichartHeight/2 - inlabelY - 17)
        .attr("y2", minichartHeight/2 - inlabelY - 17)

      mc.append("text").attr("class","label")
        .attr("x",0)
        .attr("y", minichartHeight/2 + axisHeight + outlabelY + 20)
        .text("出 MAX: "+ pref.outmax + "人")

      mc.append("line")
        .attr("class", "limit")
        .attr("x1",0)
        .attr("x2",minichartWidth)
        .attr("y1", minichartHeight/2 + axisHeight + outlabelY + 10)
        .attr("y2", minichartHeight/2 + axisHeight + outlabelY + 10)

      mc.selectAll(".m .in")
        .data( function(d){ return ages.map(function(x){var ret = d[x]; ret.age = x; return ret })}).enter()
        .append("rect")
          .attr("class", function(d){return "m in age" + d.age})
          .attr("x", function(_, i){return x(i)-x(0)/2 + 1.5})
          .attr("y", function(d){return (minichartHeight/2) - y(d["in"]["m"])})
          .attr("height", function(d){return y(d["in"]["m"])})
          .attr("width", x(1) - x(0) - 2)

      mc.selectAll(".f .in")
        .data( function(d){ return ages.map(function(x){return d[x]})}).enter()
        .append("rect")
          .attr("class", function(d){return "f in age" + d.age})
          .attr("x", function(_, i){return x(i)-x(0)/2 + 1.5})
          .attr("y", function(d){  return (minichartHeight/2) - y(d["in"]["f"]) - y(d["in"]["m"])})
          .attr("height", function(d){return y(d["in"]["f"])})
          .attr("width", x(1) - x(0) - 2)

      mc.selectAll(".m .out")
        .data( function(d){return ages.map(function(x){return d[x]})}).enter()
        .append("rect")
          .attr("class", function(d){return "m out age" + d.age})
          .attr("x", function(_, i){return x(i)-x(0)/2 + 1.5})
          .attr("y", function(d){return (minichartHeight/2 + axisHeight)})
          .attr("height", function(d){return y(d["out"]["m"])})
          .attr("width", x(1) - x(0) - 2)

      mc.selectAll(".f .out")
        .data( function(d){  return ages.map(function(x){return d[x]})}).enter()
        .append("rect")
          .attr("class", function(d){return "f out age" + d.age})
          .attr("x", function(_, i){return x(i)-x(0)/2 + 1.5})
          .attr("y", function(d){return (minichartHeight/2) +axisHeight + y(d["out"]["m"])})
          .attr("height", function(d){return y(d["out"]["f"])})
          .attr("width", x(1) - x(0) - 2)

      mc.selectAll(".in .label .one")
        .data( function(d){ return ages.map(function(x){return d[x]})}).enter()
        .append("text")
          .attr("class", function(d,i){return "label in one age" + i})
          .attr("x", function(_, i){return x(i) + 1.5})
          .attr("y", function(d){  return (minichartHeight/2) - y(d["in"]["sum"])})
          .attr("text-anchor", "middle")
          .text(function(d){return d["in"]["sum"]})
          .style("display", "none")

      mc.selectAll(".out .label .one")
        .data( function(d){ return ages.map(function(x){return d[x]})}).enter()
        .append("text")
          .attr("class", function(d,i){return "label out one age" + i})
          .attr("x", function(_, i){return x(i) + 1.5})
          .attr("y", function(d){  return (minichartHeight/2) + axisHeight + 10 + y(d["out"]["sum"])})
          .attr("text-anchor", "middle")
          .text(function(d){return d["out"]["sum"]})
          .style("display", "none")

    });
      minicharts.append("rect")
      .attr("width", minichartWidth)
      .attr("height", minichartHeight + axisHeight + 26)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on("mousemove", function(){
        d3.selectAll(".one").style("display", "none")
        var age = xconv(d3.mouse(this)[0])
        console.log(age)
        if(age  >=0 && age < ages.length) {
          d3.selectAll(".one.age"+age).style("display", "block")
        }
      });

  })

})
