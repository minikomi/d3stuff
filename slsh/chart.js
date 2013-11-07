var clear = false;

var numbers = [
  ["╲＼＼＼＼", "╲╱╱╱＼", "╲╱╱╱＼", "╲╱╱╱＼", "╲＼＼＼＼"],
  ["╱╱╲╱╱", "╱╱╲╱╱", "╱╱╲╱╱", "╱╱╲╱╱", "╱╱╲╱╱"],
  ["╲＼＼＼＼", "╱╱╱╱╲", "╲＼＼＼＼", "╲╱╱╱╱", "╲＼＼＼＼"],
  ["╲＼＼＼＼", "╱╱╱╱╲", "╲＼＼＼＼", "╱╱╱╱╲", "╲＼＼＼＼"],
  ["╲╱╱╱＼", "╲╱╱╱＼", "╲＼＼＼＼", "╱╱╱╱╲", "╱╱╱╱╲"],
  ["╲＼＼＼＼", "╲╱╱╱╱", "╲＼＼＼＼", "╱╱╱╱╲", "╲＼＼＼＼"],
  ["╲＼＼＼＼", "╲╱╱╱╱", "╲＼＼＼＼", "╲╱╱╱＼", "╲＼＼＼＼"],
  ["╲＼＼＼＼", "╱╱╱╱╲", "╱╱╱╱╲", "╱╱╱╱╲", "╱╱╱╱╲"],
  ["╲＼＼＼＼", "╲╱╱╱＼", "╲＼＼＼＼", "╲╱╱╱＼", "╲＼＼＼＼"],
  ["╲＼＼＼＼", "╲╱╱╱＼", "╲＼＼＼＼", "╱╱╱╱╲", "╱╱╱╱╲"]
];

var frmt = d3.time.format("%H %M %S");
var blankline = "╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱\n";
var txt = d3.select("body").append("pre").append("code");

var plot = function(){
  var t = blankline +
  frmt(new Date()).split(" ")
  .map(function(n){
    var asciiDigits =  n.split("").map(function(d){return numbers[+d]});
    var rows = "";
    for (i = 0; i < 5; i++) {
      rows += "╱╱╱╱╱╱" + (asciiDigits[0][i] + "╱" +  asciiDigits[1][i]) + "╱╱╱╱╱╱\n";
    }
    return rows;
  }).join(blankline) + blankline;

  if (clear) { t = t.replace(/╱/g, "　") }

  txt.text(t);
}

setInterval(plot, 1000);

d3.select("body").on("click", function(e){
  clear = !clear;
});
