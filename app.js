// Data
var data = [
  { date: 1988, num: 51 },
  { date: 1989, num: 60 },
  { date: 1990, num: 62 },
  { date: 1991, num: -64 },
  { date: 1992, num: 69 },
  { date: 1993, num: 69 },
  { date: 1994, num: 75 },
  { date: 1995, num: 80 },
  { date: 1996, num: 91 },
  { date: 1997, num: 93 },
  { date: 1998, num: 97 },
  { date: 1999, num: 100 },
  { date: 2000, num: -103 },
  { date: 2001, num: 104 },
  { date: 2002, num: 105 },
  { date: 2003, num: 110 },
  { date: 2004, num: 111 },
  { date: 2005, num: 112 },
  { date: 2006, num: 112 },
  { date: 2007, num: 113 },
  { date: 2008, num: 119 },
  { date: 2009, num: 128 },
  { date: 2010, num: 139 },
  { date: 2011, num: -139 },
  { date: 2012, num: 139 },
  { date: 2013, num: 140 },
  { date: 2014, num: 143 },
  { date: 2015, num: 146 },
  { date: 2016, num: 147 },
  { date: 2017, num: 149 }
];
//format of date is year
var time_parse = d3.timeParse('%Y');
var time_format = d3.timeFormat('%Y');
//dimensions
var chart_width = 1000;
var chart_height = 800;
var padding = 50;

// Format Date and transform into Date object
data.forEach(function(e, i) {
  data[i].date = time_parse(e.date);
});

// Scales
var x_scale = d3
  .scaleTime() //timescale
  .domain([
    d3.min(data, function(d) {
      return d.date;
    }),
    d3.max(data, function(d) {
      return d.date;
    })
  ])
  .range([padding, chart_width - padding]);
//normal linear scale for the y scale
var y_scale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function(d) {
      return d.num;
    })
  ])
  .range([chart_height - padding, padding]);

// Create SVG element
var svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', chart_width)
  .attr('height', chart_height);

// Create Axes
var x_axis = d3
  .axisBottom(x_scale)
  .ticks(10)
  .tickFormat(time_format);
var y_axis = d3.axisLeft(y_scale).ticks(12);
svg
  .append('g')
  .attr('transform', 'translate(0,' + (chart_height - padding) + ')')
  .call(x_axis);
svg
  .append('g')
  .attr('transform', 'translate(' + padding + ',0)')
  .call(y_axis);

//create linear
var line = d3
  .line()
  .defined(function(d) {
    return d.num > 0 && d.num <= 100; //ignore negative numbers
  })
  .x(function(d) {
    return x_scale(d.date);
  })
  .y(function(d) {
    return y_scale(d.num);
  });
//line for showing data > 100
var red_line = d3
  .line()
  .defined(function(d) {
    return d.num > 100; //ignore negative numbers
  })
  .x(function(d) {
    return x_scale(d.date);
  })
  .y(function(d) {
    return y_scale(d.num);
  });
//create area object
var area = d3
  .area()
  .defined(function(d) {
    return d.num > 0; //ignore negative numbers
  })
  .x(function(d) {
    return x_scale(d.date);
  })
  .y0(function(d) {
    return y_scale.range()[0];
  })
  .y1(function(d) {
    return y_scale(d.num);
  });

//create area object
var red_area = d3
  .area()
  .defined(function(d) {
    return d.num > 100; //ignore negative numbers
  })
  .x(function(d) {
    return x_scale(d.date);
  })
  .y0(function(d) {
    return y_scale(100);
  })
  .y1(function(d) {
    return y_scale(d.num);
  });

//datum function binds one element from the data, so no looping required nor waiting room with enter
//draw area
svg
  .append('path')
  .datum(data)
  //these 3 attributes to avoid path from closing
  .attr('fill', '#73ff36')
  .attr('d', area);
//draw red area
svg
  .append('path')
  .datum(data)
  //these 3 attributes to avoid path from closing
  .attr('fill', '#ea20c0')
  .attr('d', red_area);

svg
  .append('path')
  .datum(data)
  //these 3 attributes to avoid path from closing
  .attr('fill', 'none')
  .attr('stroke', '#73ff36')
  .attr('stroke-width', '5')
  .attr('d', line);

svg
  .append('path')
  .datum(data)
  //these 3 attributes to avoid path from closing
  .attr('fill', 'none')
  .attr('stroke', '#ea20c0')
  .attr('stroke-width', '5')
  .attr('d', red_line);
