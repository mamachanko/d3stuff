const width = window.innerWidth;
const height = window.innerHeight;

const deck = {
  name: "some deck",
  manaCurve: [
    {cost: 0, count: 0},
    {cost: 1, count: 2},
    {cost: 2, count: 8},
    {cost: 3, count: 7},
    {cost: 4, count: 3},
    {cost: 5, count: 1},
    {cost: 6, count: 1},
    {cost: 7, count: 8}
  ].filter(
    function (manaLevel) {
      return manaLevel.count > 0;
    }
  )
};

const color = d3.scaleOrdinal()
  .domain([0, 1, 2, 3, 4, 5, 6, 7])
  .range(
    // eight shades of lavender
    ["#eaeafb", "#e6e6fa", "#d4d4f7", "#bfbff2",
     "#aaaaee", "#9595ea", "#7f7fe6", "#6a6ae2"]
   )

const radius = d3.min([width, height]) / 2;

const pieChart = d3.pie()
  .sort(null)
  .value(function (d) {return d.count});

const pieSlicePath = d3.arc()
  .outerRadius(radius)
  .innerRadius(0);

const pieSliceLabel = d3.arc()
  .outerRadius(radius / 2)
  .innerRadius(radius / 2);

const svg = d3.select("body")
  .select("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("text")
    .text("hello")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const arc = svg.selectAll(".arc")
    .data(pieChart(deck.manaCurve))
    .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

arc.append("path")
  .attr("d", pieSlicePath)
  .attr("fill", function(d) { return color(d.data.cost); });

arc.append("text")
  .text(function(d){ return d.data.cost; })
  .attr("fill", "#2E294E")
  .attr("transform", function(d){ return "translate(" + pieSliceLabel.centroid(d) + ")"; });

// ----------------

const pack = d3.pack().size([radius, radius])

const root = d3.hierarchy(getData())
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

var g = svg.append("g");

var node = g.selectAll(".node")
  .data(pack(root).descendants())
  .enter().append("g")
    .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

node.append("title")
  .text(function(d) { return d.data.name + "\n" + d.value; });

node.append("circle")
  .attr("r", function(d) { return d.r; });

node.filter(function(d) { return !d.children; }).append("text")
  .attr("dy", "0.3em")
  .text(function(d) { return d.data.name.substring(0, d.r / 3); });

function getData() {
  return {
    "name": "Root",
    "children": [
        {
            "name": "Leaf",
            "size": 2098629
        },
        {
            "name": "Leaf",
            "size": 104720
        }
      ]};
    }
