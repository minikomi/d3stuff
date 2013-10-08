var draw = function(data) {

    data = data.data.map(function(d) {
        d.Date = new Date(d.Date);
        return d;
    });

    var tokyoMetroLines = ["hibiya", "ginza", "chiyoda", "touzai", "fukutoshin", "yurakucho", "hanzoumon", "nanboku", "marunouchi"];

    var lineColors = d3.scale.ordinal().domain(tokyoMetroLines)
        .range([
        d3.rgb("#8ba2ae"),
        d3.rgb("#f7931d"),
        d3.rgb("#00a650"),
        d3.rgb("#00b2dd"),
        d3.rgb("#ba6831"),
        d3.rgb("#ffdf00"),
        d3.rgb("#937cb9"),
        d3.rgb("#00b5ad"),
        d3.rgb("#ed1c24")
    ]);


    var format = d3.time.format("%H:%M:%S")

    var translate = function(x, y) {
        return "translate(" + x + "," + y + ")";
    }

    var d3_time_suffixes = ["th", "st", "nd", "rd"];

    var d3_time_suffix = function(number) {
        return d3_time_suffixes[number > 10 && number < 14 || number % 10 > 3 ? 0 : number % 10];
    }

    // Grid view

    var daily = d3.nest()
        .key(function(d) {
        return d3.time.day.floor(d.Date)
    })
        .key(function(d) {
        return d.LineName
    }).sortKeys(d3.ascending)
        .entries(data)

    var extent = d3.extent(data, function(d) {
        return d.Date
    });

    var dayCount = d3.time.days.apply(this, extent).length;

    var blocksize = 3;
    dayHeight = tokyoMetroLines.length * blocksize,
    width = 24 * 38,
    topChartHeight = 300,
    spacing = 55,
    gridHeight = (dayCount * dayHeight),
    height = topChartHeight + spacing + gridHeight,
    margin = {
        top: 40,
        right: 20,
        bottom: 40,
        left: 60
    };

    var x = d3.time.scale()
        .rangeRound([0, width])
        .domain([
        format.parse("0:0:0"), +format.parse("0:0:0") + (24 * 60 * 60 * 1000)
    ]);


    var gridY = d3.time.scale()
        .rangeRound([gridHeight, 0])
        .domain(d3.extent(data, function(d) {
        return d.Date
    }))
        .nice(d3.time.day)

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
        .tickSize(8, 4, 2)

    svg.append("g").attr("class", "axis")
        .attr("transform", translate(0, topChartHeight + 5))
        .call(xAxis)

    var ticks = d3.selectAll(".tick text");

    d3.select(ticks[0][ticks[0].length - 1]).remove()

    ticks.attr("dx", 38 / 2)

    var grid = svg.append("g")
        .attr("class", "grid")
        .attr("transform", translate(0, topChartHeight + spacing))

    var days = grid.selectAll(".day")
        .data(gridY.ticks(d3.time.days)).enter()
        .append("g")
        .attr("class", "day")
        .attr("transform", function(d) {
        return translate(0, gridY(d))
    })

    days.append("rect")
        .filter(function(d) {
        return (d.getDay() != 0 && d.getDay() != 6)
    })
        .attr("class", "rushhour")
        .attr("x", x(format.parse("7:0:0")))
        .attr("width", x(format.parse("10:0:0")) - x(format.parse("7:0:0")))
        .attr("height", dayHeight)

    days.append("rect")
        .filter(function(d) {
        return (d.getDay() != 0 && d.getDay() != 6)
    })
        .attr("class", "rushhour")
        .attr("x", x(format.parse("17:0:0")))
        .attr("width", x(format.parse("20:0:0")) - x(format.parse("17:0:0")))
        .attr("height", dayHeight)

    days.append("text")
        .attr("dx", -4)
        .attr("dy", 2 + dayHeight / 2)
        .attr("class", "datename")
        .text(function(d) {
        return d.getDate() + d3_time_suffix(d.getDate())
    })

    days.append("text")
        .filter(function(d, i) {
        return new Date(+d + (24 * 60 * 60 * 1000)).getDate() == 1 || i == dayCount + 1
    })
        .attr("dx", -48)
        .attr("dy", 2 + dayHeight / 2)
        .attr("class", "monthname")
        .text(function(d) {
        return d3.time.format("%b")(d)
    })


    grid.selectAll(".hour")
        .data(x.ticks(24 * 2)).enter()
        .append("line")
        .attr("class", "hour")
        .classed("main", function(d) {
        return (d.getHours() % 3) == 0 && d.getMinutes() == 0
    })
        .classed("min", function(d) {
        return (d.getMinutes() != 0)
    })
        .attr("y1", -10)
        .attr("y2", gridHeight + dayHeight)
        .attr("x1", function(d) {
        return x(d)
    })
        .attr("x2", function(d) {
        return x(d)
    })

    days.append("line")
        .attr("x1", function(d) {
        return d.getDate() == 1 ? -48 : 0;
    })
        .attr("x2", width)
        .attr("y1", dayHeight)
        .attr("y2", dayHeight)

    grid.append("line")
        .attr("class", "gridbase")
        .attr("x1", -48)
        .attr("x2", width)

    var happeningDays = grid.selectAll(".happening-day")
        .data(daily).enter()
        .append("g")
        .attr("class", "happening-day")
        .attr("transform", function(d) {
        return translate(0, gridY(new Date(d.key)))
    })

    var lineGroups = happeningDays.selectAll(".linegroup")
        .data(function(d) {
        return d.values
    }).enter()
        .append("g")
        .attr("class", function(d) {
        return "linegroup " + d.key
    })
        .attr("transform", function(d) {
        return translate(0, 5 * (tokyoMetroLines.indexOf(d.key)))
    })

    lineGroups.selectAll(".happening")
        .data(function(d) {
        return d.values
    }).enter()
        .append("rect")
        .attr("class", "happening")
        .attr("height", blocksize + 1)
        .attr("width", blocksize + 1)
        .attr("fill", function(d) {
        return lineColors(d.LineName)
    })
        .attr("stroke", function(d) {
        return lineColors(d.LineName).darker()
    })
        .attr("y", -3)
        .attr("x", function(d) {
        return x(format.parse(format(d.Date)))
    })
        .on("mouseover", function(d) {

        d3.select(this)
            .attr("width", blocksize + 7)
            .attr("height", blocksize + 7)
            .attr("transform", translate(-4, -4))

        d3.select("#tooltip")
            .style("display", "block")
            .html("<h3><img src='./" + d.LineName + ".png' />" +
            d3.time.format("%d %b %y - %I:%M")(d.Date) + " [" + d.Result + "]</h3>" +
            "<p>" + d.Text.replace(/[\r\n]/g, "").replace(/.*】/, "").replace(/.*現在、平/, "平") + "</p>")
            .attr("class", d.LineName)
            .style("left", (d3.event.pageX - 400 < 30 ? 30 : d3.event.pageX - 400) + "px")
            .style("top", (d3.event.pageY - (document.getElementById("tooltip").offsetHeight) - 50) + "px")
    })
        .on("mouseout", function(d) {
        d3.select("#tooltip")
            .style("display", "none")

        d3.select(this).attr("width", blocksize + 1)
            .attr("height", blocksize + 1)
            .attr("transform", translate(0, 0))
    })

    // Chart view
    var hourly = d3.nest()
        .key(function(d) {
        return d3.time.hour.floor(format.parse(format(d.Date)))
    })
        .key(function(d) {
        return d.LineName
    }).sortKeys(d3.ascending)
        .rollup(function(d) {
        return d.length
    })
        .entries(data)

    var chartMax = d3.max(hourly.map(function(d) {
        return d3.sum(d.values, function(e) {
            return e.values
        })
    }));

    var topY = d3.scale.linear()
        .range([topChartHeight, 0])
        .domain([0, chartMax])

    var topYAxis = d3.svg.axis()
        .scale(topY)
        .orient("left")

    hourly.forEach(function(d) {
        var offset = 0;
        d.values.forEach(function(e) {
            offset = offset + e.values;
            e.dy = offset;
        });
    });

    var topChart = svg.append("g")

    topChart.append("g")
        .attr("class", "axis")
        .attr("transform", translate(-5, 0))
        .call(topYAxis)

    var rushHourLine = function(start, end) {
        topChart.append("line")
            .attr("class", "rushhour")
            .attr("x1", x(format.parse(start)))
            .attr("x2", x(format.parse(end)))
            .attr("y1", -1 + topChartHeight + spacing / 2)
            .attr("y2", -1 + topChartHeight + spacing / 2)

        topChart.append("line")
            .attr("class", "rushhour")
            .attr("x1", x(format.parse(start)))
            .attr("x2", x(format.parse(start)))
            .attr("y1", 6 + topChartHeight + spacing / 2)
            .attr("y2", -10 + topChartHeight + spacing / 2)

        topChart.append("line")
            .attr("class", "rushhour")
            .attr("x1", x(format.parse(end)))
            .attr("x2", x(format.parse(end)))
            .attr("y1", 6 + topChartHeight + spacing / 2)
            .attr("y2", -10 + topChartHeight + spacing / 2)

        topChart.append("text")
            .attr("class", "rushhour")
            .attr("x", x(format.parse(start)) + (x(format.parse(end)) - x(format.parse(start))) / 2)
            .attr("y", 12 + topChartHeight + spacing / 2)
            .text("Rush Hour")
            .attr("fill", "#222")
            .attr("stroke", null)
    }

    rushHourLine("7:0:0", "10:0:0")
    rushHourLine("17:0:0", "20:0:0")

    var hourGroup = topChart.selectAll(".hourgroup")
        .data(hourly).enter()
        .append("g")
        .attr("class", "hourgroup")
        .attr("transform", function(d) {
        return translate(x(new Date(d.key)), 0)
    })

    hourGroup.selectAll("rect")
        .data(function(d) {
        return d.values
    }).enter()
        .append("rect")
        .attr("x", 1)
        .attr("y", function(d) {
        return topY(d.dy)
    })
        .attr("width", x(format.parse("01:00:00")) - 2)
        .attr("height", function(d) {
        return topChartHeight - topY(d.values)
    })
        .attr("class", function(d) {
        return d.key
    })
        .attr("fill", function(d) {
        return lineColors(d.key)
    })
        .attr("stroke", function(d) {
        return lineColors(d.key).darker()
    })

    hourGroup.append("text")
        .text(function(d) {
        return d.values.reduce(function(acc, v) {
            return acc + v.values
        }, 0)
    })
        .attr("x", 38 / 2)
        .attr("y", topChartHeight - 2)
        .attr("class", "labeltext")
}

d3.json("/metro/metro.json", draw)
