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
  function Point(initAngle, minAngle, maxAngle) {
    var angle = initAngle;
    var radius = 100;
    this.setNewAngle = function(){
      angle = minAngle + (Math.random() * (maxAngle - minAngle));
    }
    this.getX = function(){ return Math.floor(radius * Math.cos((angle-90) * Math.PI / 180))}
    this.getY = function(){ return Math.floor(radius * Math.sin((angle-90) * Math.PI / 180))}
    this.setRadius = function(r){ radius = r;};
  }
  return Point;
})();

var Character = (function(){
  return function(_x,_y,_radius, _lines){
    var radius = _radius;
    this.r = function(){return radius};
    this.x = function(){return _x};
    this.y = function(){return _y};
    this.lines = function(){
      _lines.forEach( function(l){
        l.forEach(function(p){
          p.setRadius(radius);
        });
      });
      return _lines;
    }
    this.move = function(){
      radius = 20 + Math.floor(Math.random() * _radius);
      _lines.forEach( function(l){
        l.forEach(function(p){
          p.setNewAngle();
        });
      });
    }
  };
})();


var Mi = new Character( 80, 80, 30,
  [
    [
      new Point(330, 310, 350),
      new Point(30, 10, 50)
    ],
    [
      new Point(270, 250, 290),
      new Point(90, 70, 110)
    ],
    [
      new Point(190, 185, 220),
      new Point(170, 150, 175)
    ]
  ]
)

var Ra = new Character( 180, 80, 30,
  [
    [
      new Point(330, 310, 350),
      new Point(30, 10, 50)
    ],
    [
      new Point(270, 250, 290),
      new Point(90, 70, 110),
      new Point(190, 185, 220)
    ]
  ]
)

var I = new Character( 280, 80, 30,
  [
    [
      new Point(330, 290, 350),
      new Point(30, 10, 60),
      new Point(190, 185, 220)
    ]
  ]
)
var Ma = new Character( 380, 80, 30,
  [
    [
      new Point(330, 290, 350),
      new Point(30, 10, 60),
      new Point(190, 185, 220),
      new Point(170, 150, 175)
    ]
  ]
)

var data = [Mi,Ra,I,Ma];

var tick = function (data) {
  var characters = svg.selectAll(".character")
                  .data(data)
  characters.enter()
    .append("g")
    .attr("transform", function(d) { return "translate(" +(d.x() - d.r()) + "," +
                                                          (d.y() - d.r()) + ")"})
    .attr("class","character")

  var mainCircles = characters.selectAll(".maincircle").data(function(d){return [d]})

  mainCircles.enter()
      .append("circle")
      .attr("r", function(d){d.r()})
      .attr("stroke-width", "1")
      .attr("stroke", "#555555")
      .attr("fill", "none")
      .attr("opacity", "0")
      .attr("class", "maincircle")

  mainCircles.transition()
    .transition()
      .delay(0)
      .duration(0)
      .attr("opacity", 1)
      .delay(200)
      .duration(200)
      .attr("r", function(d){return d.r()})
  mainCircles.transition()
      .delay(700)
      .duration(0)
      .attr("opacity", 0)


  var lineƒ = d3.svg.line()
              .x(function(p) { return p.getX(); })
              .y(function(p) { return p.getY(); })
              .interpolate("linear")

  var line = characters.selectAll("path")
                      .data(function(d){
                        return d.lines()
                      })

  line.enter().append("path")
    .attr("d", lineƒ)
    .attr("stroke", "#222222")
    .attr("stroke-width", "3")
    .attr("fill", "none")
    .attr("stroke-miterlimit", 1)

  line.transition()
    .delay(200)
    .duration(200)
    .ease("linear")
    .attr("d", lineƒ)

  var points = characters.selectAll(".point")
                  .data(function(d){
                    return d3.merge(d.lines())
                  });

  points.enter()
    .append("circle")
      .attr("cx", function(p) {return p.getX() })
      .attr("cy", function(p) {return p.getY() })
      .attr("r", 3)
      .attr("class", "point")

  points.transition()
    .delay(200)
    .duration(200)
    .ease("linear")
    .attr("cx", function(p) {return p.getX() })
    .attr("cy", function(p) {return p.getY() })

}


tick(data);

var makeinterval = function() {

  return setInterval(function() {
    data.forEach(function(char){
      char.move();
    });
    tick(data);
  }, 1200)

}

var intv = makeinterval();


d3.select("body").on("click", function() {
  clearInterval(intv)
  data.forEach(function(char){
    char.move();
  });
  tick(data);
 intv = makeinterval();
})

