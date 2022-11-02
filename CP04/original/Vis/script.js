const margin = { top: 0.028 * window.innerHeight, right: 0.019 * window.innerWidth, bottom: 0.056 * window.innerHeight, left: 0.033 * window.innerWidth };
const width_left = 0.326 * window.innerWidth - margin.left - margin.right;
const height = 0.478 * window.innerHeight - margin.top - margin.bottom;
const height_left_bottom = 0.281 * window.innerHeight - margin.top - margin.bottom;

const width_right = 0.6455 * window.innerWidth - margin.left - margin.right;
const width_bottom = window.innerWidth - margin.left - margin.right;


function init() {
  createHeatmap("#vi1");
  //createBarChart("#vi4");
  //createBarChart("#vi5");
  createParallelCoordinates("#vi2");
  createScatterPlotMoves("#vi3");
  //createSearchBar("#sb1");
}

function blendColors(colorA, colorB, amount) {
  const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
  const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
  const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}

function value(key, d) {
  if (key == "Total")
    return d.Total;
  if (key == "HP")
    return d.HP;
  if (key == "Attack")
    return d.Attack;
  if (key == "Defense")
    return d.Defense;
  if (key == "Special_Atk")
    return d.Special_Atk;
  if (key == "Special_Def")
    return d.Special_Def;
  if (key == "Speed")
    return d.Speed;
}

const stats = ["Total", "HP", "Attack", "Defense", "Special_Atk", "Special_Def", "Speed"];

const types = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass",
  "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"];

const colors = ["#6D6D53", "#9A2620", "#270F70", "#803380", "#644F14", "#93802D", "#86931A", "#5A467A", "#313149", "#AC4F0C",
  "#0E3289", "#5F902D", "#826904", "#950631", "#256363", "#3506A9", "#5A463A", "#691125"];

//Global variables
var clicked = 0;
var highlight = 0;

var opacityTriangle = 0;
var opacityCircle = 0;

function createHeatmap(id) {
  const svg = d3
    .select(id)
    .attr("width", width_left + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gHeatmap")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.json("json/types_usage.json").then(function (data) {

    const types = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass",
      "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"];

    const color = d3.scaleOrdinal(["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass",
      "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"],
      ["#6D6D53", "#9A2620", "#270F70", "#803380", "#644F14", "#93802D", "#86931A", "#5A467A", "#313149", "#AC4F0C",
        "#0E3289", "#5F902D", "#826904", "#950631", "#256363", "#3506A9", "#5A463A", "#691125"])

    const x = d3.scaleBand()
      .range([0, width_left])
      .domain(types)

    const y = d3.scaleBand()
      .range([height, 0])
      .domain(types)

    var myColor = d3.scaleSequential()
      .interpolator(d3.interpolateBlues)
      .domain(d3.extent(data, d => d.Monthly_Usage))


    svg
      .append("g")
      .attr("class", "gXAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", 0.028 * height + "px")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)")
      .select(".domain").remove();

    d3.selectAll(".gXAxis .tick").each(function (d) {
      d3.select(this).select("text").style("fill", color(d))
    });


    svg
      .append("g")
      .attr("class", "gYAxis")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", 0.028 * height + "px")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .select(".domain").remove();

    d3.selectAll(".gYAxis .tick").each(function (d) {
      d3.select(this).select("text").style("fill", color(d))
    });

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < types.length; j++) {
        svg
          .append("rect")
          .attr("x", function () { return x(types[i]) })
          .attr("y", function (d) { return y(types[j]) })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .style("fill", function () { return "#DCDCDC" })
          .style("stroke-width", 4)
          .style("stroke", "none")
          .style("opacity", 0.4)
      }
    }


    svg.selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d.Type1) })
      .attr("y", function (d) { return y(d.Type2) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) { return myColor(d.Monthly_Usage) })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.9)
      .on("mouseover", function (event, d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("Monthly Usage of" + "<br/>" + d.Type1 + "-" + d.Type2 + "<br/>" + "Pokémon: " + d.Monthly_Usage + "k")
          .style("left", (d3.pointer(event, this)[0] + (0.045 * window.innerWidth)) + "px")
          .style("top", (d3.pointer(event, this)[1] - (0.045 * window.innerHeight)) + "px");

        d3.select(this)
          .style("stroke", this.style.stroke == "grey" ? "grey" : "black")
          .style("opacity", 1.0);

      })
      .on("mousemove", function (event, d) {
        div.style("left", (d3.pointer(event, this)[0] + (0.045 * window.innerHeight)) + "px")
          .style("top", (d3.pointer(event, this)[1] - (0.016 * window.innerHeight)) + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .style("stroke", this.style.stroke == "grey" ? "grey" : "none")
          .style("opacity", 0.8);

        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function (event, d) {
        if (this.style.stroke == "grey") {
          clicked = 0;
          d3.select(this)
            .style("stroke", this.style.stroke == "grey" ? "black" : "grey")
            .style("opacity", 1)
            .style("stroke-width", "3px");
          resetParallelCoordinates();
          resetScatterPlot();
          d3.select("rect.highlight").remove();
        }
        else {
          if (clicked == 0) {
            clicked = 1;
            d3.select(this)
              .style("stroke", this.style.stroke == "grey" ? "black" : "grey")
              .style("opacity", 1)
              .style("stroke-width", "3px");
            updateParallelCoordinatesTwoTypes(d.Type1, d.Type2);
            d3.select("rect.highlight").remove();
          }
          else if (highlight == 1) {
            d3.select(this)
              .style("stroke", "black")
              .style("opacity", 1)
              .style("stroke-width", "3px");
            resetParallelCoordinates();
            resetScatterPlot();
            d3.select("rect.highlight").remove();
            clicked = 0;
            highlight = 0;
          }
        }
      });
  });
}

function createParallelCoordinates(id) {
  const svg = d3
    .select(id)
    .attr("width", width_bottom + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gParallelCoordinates")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);

  d3.json("json/average_values_types_one.json").then(function (data) {

    const color = d3.scaleOrdinal(types, colors);

    const x = d3.scalePoint(stats, [0, (7 / 8) * width_bottom]);

    const x_types = d3.scalePoint(types, [0, (19 / 20) * width_bottom]);

    const y = new Map(Array.from(stats, key => [key, d3.scaleLinear([d3.min(data, d => value(key, d)) - 10, d3.max(data, d => value(key, d)) + 10], [10, height])]));


    line = d3.line()
      .defined(([value,]) => value != null)
      .x(([, key]) => x(key))
      .y(([value, key]) => y.get(key)(value))



    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", d => d.Type1)
      .attr("fill", "none")
      .attr("stroke-width", 1.0)
      .attr("stroke", d => color(d.Type1))
      .attr("d", d => line(d3.cross([d], stats, (element, key) => [value(key, element), key])))
      .style("opacity", .6)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 3.0)
          .style("opacity", 1.0);
        div.transition()
          .duration(100)
          .style("opacity", .9);
        div.html("Type 1: " + d.Type1)
          .style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px")
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke-width", 1.0)
          .style("opacity", .6);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("mousemove", function (event, d) {
        div.style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px");
      })
      .on("click", function (event, d) {
        updateParallelCoordinatesOneType(d.Type1);
        updateHeatMapSelectionOneType(this.textContent);
        updateScatterPlotFilterOneType(d.Type1);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .append("title")
      .text((d) => d.Type1);

    for (i = 0; i < 7; i++) {
      svg
        .append("g")
        .attr("id", stats[i] + "Axis")
        .attr("transform", `translate(${x(stats[i])},0)`)
        .call(d3.axisLeft(y.get(stats[i])))
        .call(g => g.append("text")
          .attr("x", 0)
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .attr("fill", "currentColor")
          .style("font-size", 0.018 * width_right + "px")
          .text(function () {
            if (stats[i] == "Special_Atk")
              return "Special Attack";
            else if (stats[i] == "Special_Def")
              return "Special Defense";
            else
              return stats[i];
          }))
        .call(g => g.selectAll("text")
          .clone(true)
          .lower()
          .attr("fill", "none")
          .attr("stroke-width", 5)
          .attr("stroke-linejoin", "round")
          .attr("stroke", "white"));
    }

    for (i = 0; i < 18; i++) {
      svg
        .append("text")
        .attr("class", "types_colors")
        .attr("text-anchor", "left")
        .attr("y", height + 25)
        .attr("x", x_types(types[i]))
        .style("font-size", 0.014 * width_right + "px")
        .text(types[i])
        .on("mouseover", function () {
          d3.selectAll("." + this.textContent)
            .attr("stroke-width", 3.0)
            .style("opacity", 1.0);
        })
        .on("mouseout", function () {
          d3.selectAll("." + this.textContent)
            .attr("stroke-width", 1.0)
            .style("opacity", .6);
        })
        .on("click", function (event, d) {
          updateParallelCoordinatesOneType(this.textContent);
          updateHeatMapSelectionOneType(this.textContent);
          updateScatterPlotFilterOneType(this.textContent);
        });
      svg.append("rect")
        .attr("y", height + 15)
        .attr("x", function () {
          return x_types(types[i]) - 15; //- (types[i].length * 5.8);
        })
        .style("fill", color(types[i]))
        .attr("height", 10)
        .attr("width", 10)
        .style("opacity", 1.0);
    }
  })
}

function createScatterPlotMoves(id) {
  const svg = d3
    .select(id)
    .attr("width", width_right + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gScatterPlot")
    .attr("transform", "translate(" + (margin.left) + ", " + margin.top + ")");

  const bar = svg.append("g");

  bar.append("rect")
    .attr("x", 0.78 * width_right)
    .attr("y", 10)
    .attr("height", 60)
    .attr("width", 10)
    .attr("stroke", "black");


  const gradient = bar.append("defs")
    .append("linearGradient")
    .attr("id", "mygrad")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "100%");

  gradient
    .append("stop")
    .attr("offset", "0%")
    .style("stop-color", "#4b83b4");

  gradient
    .append("stop")
    .attr("offset", "100%")
    .style("stop-color", d3.interpolateBlues(0.1));

  bar.attr("fill", "url(#mygrad)");

  bar
    .append("text")
    .attr("fill", "currentColor")
    .style("font-size", 0.015 * width_right + "px")
    .text(24)
    .attr("x", 0.8 * width_right)
    .attr("y", 20);

  bar
    .append("text")
    .attr("fill", "currentColor")
    .style("font-size", 0.015 * width_right + "px")
    .text(1)
    .attr("x", 0.8 * width_right)
    .attr("y", 70);

  bar
    .append("text")
    .attr("fill", "currentColor")
    .style("font-size", 0.015 * width_right + "px")
    .text("Estimate of number of moves")
    .attr("x", 0.78 * width_right)
    .attr("y", 90);

  d3.json("json/df_moves.json").then(function (data) {
    data = data.filter(function (d) {
      return d.Power != -1; //&& !(d.Accuracy == -1);
    });

    const keys = ["Special", "Status", "Physical"];

    const shape = d3.scaleOrdinal()
      .domain(keys)
      .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle]);

    const x = d3
      .scaleLinear()
      .domain([0, 250])
      .range([0, width_right]);
    svg
      .append("g")
      .attr("id", "gXAxis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("y", height - 10)
      .attr("x", width_right)
      .style("font-size", 0.018 * width_right + "px")
      .text("Power");

    const y = d3
      .scaleLinear()
      .domain([0, 40])
      .range([height, 0]);

    svg
      .append("g")
      .attr("id", "gYAxis")
      .call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -25)
      .attr("x", 0)
      .attr("transform", `rotate(-90)`)
      .style("font-size", 0.018 * width_right + "px")
      .text("PP");

    svg
      .selectAll("dots")
      .data(data)
      .enter()
      .append("path")
      .attr("id", d => d.Move)
      .attr("class", function (d) { return d.Damage_Class == "Special" ? `dotValue circleValue ${d.Type}Dot` : `dotValue triangleValue ${d.Type}Dot` })
      .attr("d", d3.symbol()
        .size(120)
        .type(function (d) { return shape(d.Damage_Class) })
      )
      .attr("transform", function (d) { return "translate(" + x(d.Power) + "," + y(d.PP) + ")"; })
      .style("fill", "steelblue")
      .style("opacity", 0.15)
      /*
      .on("mouseover", (event, d) => handleMouseOver(d.country))
      .on("mouseleave", (event, d) => handleMouseLeave())
      */
      .append("title")
      .text((d) => d.Move);

    const trianglesym = d3.symbol().type(d3.symbolTriangle).size(120);

    svg.append("circle")
      .attr("cx", 0.78 * width_right)
      .attr("cy", 0.465 * height)
      .attr("r", 6)
      .style("fill", "steelblue")
      .style("opacity", 0.35);

    svg.append("path")
      .attr("d", trianglesym)
      .attr("fill", "steelblue")
      .attr("transform", "translate(" + 0.78 * width_right + ", 158)")
      .style("opacity", 0.35);

    const label_special = svg.append("text");
    const label_physical = svg.append("text");

    label_special
      .attr("id", "special_label")
      .attr("x", 0.8 * width_right)
      .attr("y", 0.48 * height)
      .text("Special")
      .style("font-weight","bold")
      .style("font-size", 0.015 * width_right + "px")
      .attr("alignment-baseline", "middle")
      .on("click", function(event, d) {
        opacityCircle = d3.selectAll(".circleValue").style("opacity");
        d3.selectAll(".circleValue").transition().style("opacity", opacityCircle == 0.15 ? 0 : 0.15);
        d3.select(this).style("font-weight", opacityCircle == 0.15 ? "normal" : "bold")
      });

    label_physical
      .attr("id", "physical_label")
      .attr("x", 0.8 * width_right)
      .attr("y", 160)
      .text("Physical")
      .style("font-weight", "bold")
      .style("font-size", 0.015 * width_right + "px")
      .attr("alignment-baseline", "middle")
      .on("click", function(event, d) {
        opacityTriangle = d3.selectAll(".triangleValue").style("opacity");
        d3.selectAll(".triangleValue").transition().style("opacity", opacityTriangle == 0.15 ? 0 : 0.15);
        d3.select(this).style("font-weight", opacityTriangle == 0.15 ? "normal" : "bold")
      });
  });
}

function createSearchBar(id) {
  const svg = d3
    .select(id)
    .attr("width", width_bottom + margin.right)
    .attr("height", 30)
    .append("g")
    .attr("id", "gSearchBar")
    .attr("transform", `translate(0, 0)`);

  svg
    .append("rect")
    .attr("x", 742.656 - 250)
    .attr("y", 0)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("height", 30)
    .attr("width", 500)
    .attr("stroke", "black")
    .attr("fill", "#cccccc");

}

function resetParallelCoordinates() {
  var div = d3.select("body").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);

  d3.json("json/average_values_types_one.json").then(function (data) {

    const color = d3.scaleOrdinal(types, colors);

    const x = d3.scalePoint(stats, [0, (7 / 8) * width_bottom]);

    const x_types = d3.scalePoint(types, [0, (19 / 20) * width_bottom]);

    const y = new Map(Array.from(stats, key => [key, d3.scaleLinear([d3.min(data, d => value(key, d)) - 10, d3.max(data, d => value(key, d)) + 10], [10, height])]));

    const svg = d3.select("#gParallelCoordinates");



    line = d3.line()
      .defined(([value,]) => value != null)
      .x(([, key]) => x(key))
      .y(([value, key]) => y.get(key)(value));

    svg
      .selectAll("path")
      .remove();

    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", d => d.Type1)
      .attr("fill", "none")
      .attr("stroke-width", 1.0)
      .attr("stroke", d => color(d.Type1))
      .attr("d", d => line(d3.cross([d], stats, (element, key) => [value(key, element), key])))
      .style("opacity", .6)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 3.0)
          .style("opacity", 1.0);
        div.transition()
          .duration(100)
          .style("opacity", .9);
        div.html("Type 1: " + d.Type1)
          .style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px")
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke-width", 1.0)
          .style("opacity", .6);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("mousemove", function (event, d) {
        div.style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px");
      })
      .on("click", function (event, d) {
        updateParallelCoordinatesOneType(d.Type1);
        updateHeatMapSelectionOneType(d.Type1);
        updateScatterPlotFilterOneType(d.Type1);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .append("title")
      .text((d) => d.Type1);

    for (i = 0; i < 7; i++) {
      svg
        .select("#" + stats[i] + "Axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y.get(stats[i])));
    }

    svg.selectAll("text.types_colors").remove();
    svg.selectAll("rect").remove();

    for (i = 0; i < 18; i++) {
      svg
        .append("text")
        .attr("class", "types_colors")
        .attr("text-anchor", "left")
        .attr("y", height + 25)
        .attr("x", x_types(types[i]))
        .style("font-size", 0.014 * width_right + "px")
        .text(types[i])
        .style("font-weight", "none")
        .style("opacity", 1.0)
        .on("mouseover", function () {
          d3.selectAll("." + this.textContent)
            .attr("stroke-width", 3.0)
            .style("opacity", 1.0);
        })
        .on("mouseout", function () {
          d3.selectAll("." + this.textContent)
            .attr("stroke-width", 1.0)
            .style("opacity", .6);
        })
        .on("click", function (event, d) {
          updateParallelCoordinatesOneType(this.textContent);
          updateHeatMapSelectionOneType(this.textContent);
          updateScatterPlotFilterOneType(this.textContent);
        });
      svg.append("rect")
        .attr("y", height + 15)
        .attr("x", function () {
          return x_types(types[i]) - 15; //- (types[i].length * 5.8);
        })
        .style("fill", color(types[i]))
        .attr("height", 10)
        .attr("width", 10)
        .style("opacity", 1.0);
    }
  });
}

function updateParallelCoordinatesOneType(type1) {
  var div = d3.select("body").append("div")
    .attr("class", "tooltip3")
    .style("opacity", 0);

  d3.json("json/two_types_averages.json").then(function (data) {
    data = data.filter(function (elem) {
      return type1 == elem.Type1;
    });

    const color = d3.scaleOrdinal(types, colors);

    const x = d3.scalePoint(stats, [0, (7 / 8) * width_bottom]);

    const x_types = d3.scalePoint(types, [0, (19 / 20) * width_bottom]);

    const y = new Map(Array.from(stats, key => [key, d3.scaleLinear([d3.min(data, d => value(key, d)) - 10, d3.max(data, d => value(key, d)) + 10], [10, height])]));

    const svg = d3.select("#gParallelCoordinates");

    line = d3.line()
      .defined(([value,]) => value != null)
      .x(([, key]) => x(key))
      .y(([value, key]) => y.get(key)(value));

    svg
      .selectAll("path")
      .remove();

    var available_types = []

    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", function (d) {
        available_types.push(d.Type2);
        console.log(available_types);
        return d.Type2;
      })
      .attr("fill", "none")
      .attr("stroke-width", 1.0)
      .attr("stroke", d => color(d.Type2))
      .attr("d", d => line(d3.cross([d], stats, (element, key) => [value(key, element), key])))
      .style("opacity", .6)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 3.0)
          .style("opacity", 1.0);
        div.transition()
          .duration(100)
          .style("opacity", .9);
        div.html("Type 1: " + d.Type1 + "<br/>" + "Type 2: " + d.Type2)
          .style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px")
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke-width", 1.0)
          .style("opacity", .6);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("mousemove", function (event, d) {
        div.style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px");
      })
      .on("click", function (event, d) {
        updateParallelCoordinatesTwoTypes(d.Type1, d.Type2);
        updateHeatMapSelectionTwoTypes(d.Type1, d.Type2);
        clicked = 1;
        highlight = 1;
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .append("title")
      .text((d) => d.Type2);

    for (i = 0; i < 7; i++) {
      svg
        .select("#" + stats[i] + "Axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y.get(stats[i])));
    }

    svg.selectAll("text.types_colors").remove();
    svg.selectAll("rect").remove();

    for (i = 0; i < 18; i++) {
      svg
        .append("text")
        .attr("class", "types_colors")
        .attr("text-anchor", "left")
        .attr("y", height + 25)
        .attr("x", x_types(types[i]))
        .style("font-size", 0.014 * width_right + "px")
        .text(types[i])
        .style("font-weight", function () {
          if (type1 == this.textContent)
            return "bold";
          else
            return "none";
        })
        .style("opacity", function () {
          if (!available_types.includes(this.textContent)) {
            return 0.5;
          }
          else
            return 1.0;
        })
        .on("mouseover", function () {
          d3.selectAll("." + this.textContent)
            .attr("stroke-width", 3.0)
            .style("opacity", 1.0);
        })
        .on("mouseout", function () {
          d3.selectAll("." + this.textContent)
            .attr("stroke-width", 1.0)
            .style("opacity", .6);
        })
        .on("click", function (event, d) {
          if (available_types.includes(this.textContent)) {
            updateParallelCoordinatesTwoTypes(type1, this.textContent);
            updateHeatMapSelectionTwoTypes(type1, this.textContent);
            clicked = 1;
            highlight = 1;
          }
        })
      svg.append("rect")
        .attr("y", height + 15)
        .attr("x", function () {
          return x_types(types[i]) - 15;
        })
        .style("fill", color(types[i]))
        .attr("height", 10)
        .attr("width", 10)
        .style("opacity", 1.0);
    }
  });
}

function updateParallelCoordinatesTwoTypes(type1, type2) {
  var div = d3.select("body").append("div")
    .attr("class", "tooltip3")
    .style("opacity", 0);

  d3.json("json/df_pokemon.json").then(function (data) {
    data = data.filter(function (elem) {
      return type1 == elem.Type1 && elem.Type2 == type2;
    });

    const color = d3.scaleOrdinal(types, colors);

    const x = d3.scalePoint(stats, [0, (7 / 8) * width_bottom]);

    const x_types = d3.scalePoint(types, [0, (19 / 20) * width_bottom]);

    const y = new Map(Array.from(stats, key => [key, d3.scaleLinear([d3.min(data, d => value(key, d)) - 10, d3.max(data, d => value(key, d)) + 10], [10, height])]));
    const svg = d3.select("#gParallelCoordinates");

    line = d3.line()
      .defined(([value,]) => value != null)
      .x(([, key]) => x(key))
      .y(([value, key]) => y.get(key)(value));

    svg
      .selectAll("path")
      .remove();

    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "pathValue")
      .attr("fill", "none")
      .attr("stroke-width", 1.0)
      .attr("stroke", d => blendColors(color(d.Type2), color(d.Type1), 0.5))
      .attr("d", d => line(d3.cross([d], stats, (element, key) => [value(key, element), key])))
      .style("opacity", .6)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 3.0)
          .style("opacity", 1.0);
        div.transition()
          .duration(100)
          .style("opacity", .9);
        div.html("Pokémon: " + d.Pokemon + "<br/>" + "Type 1: " + d.Type1 + "<br/>" + "Type 2: " + d.Type2)
          .style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px")
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke-width", 1.0)
          .style("opacity", .6);
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("mousemove", function (event, d) {
        div.style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px");
      })
      .append("title")
      .text((d) => d.Pokemon);

    for (i = 0; i < 7; i++) {
      svg
        .select("#" + stats[i] + "Axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y.get(stats[i])));
    }

    svg.selectAll("text.types_colors").remove();
    svg.selectAll("rect").remove();

    for (i = 0; i < 18; i++) {
      svg
        .append("text")
        .attr("class", "types_colors")
        .attr("text-anchor", "left")
        .attr("y", height + 25)
        .attr("x", x_types(types[i]))
        .style("font-size", 0.014 * width_right + "px")
        .text(types[i])
        .style("font-weight", function () {
          if (type1 == this.textContent || type2 == this.textContent)
            return "bold";
          else
            return "none";
        })
        .style("opacity", function () {
          if (type1 == this.textContent || type2 == this.textContent) {
            return 1.0;
          }
          else
            return 0.5;
        })
        .on("mouseover", function () {
          d3.selectAll("." + this.textContent)
            .attr("stroke-width", 3.0)
            .style("opacity", 1.0);
        })
        .on("mouseout", function () {
          d3.selectAll("." + this.textContent)
            .attr("stroke-width", 1.0)
            .style("opacity", .6);
        })
      svg.append("rect")
        .attr("y", height + 15)
        .attr("x", function () {
          return x_types(types[i]) - 15; //- (types[i].length * 5.8);
        })
        .style("fill", color(types[i]))
        .attr("height", 10)
        .attr("width", 10)
        .style("opacity", 1.0);
    }
  });
}

function updateHeatMapSelectionOneType(type1) {
  const svg = d3.select("#gHeatmap");

  const x = d3.scaleBand()
    .range([0, width_left])
    .domain(types)

  const y = d3.scaleBand()
    .range([height, 0])
    .domain(types)

  svg
    .append("rect")
    .attr("class", "highlight")
    .attr("x", x(type1))
    .attr("y", 0)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("height", height)
    .attr("width", x.bandwidth())
    .attr("stroke", "grey")
    .attr("fill", "none")
    .style("stroke-width", "3px");
}

function updateHeatMapSelectionTwoTypes(type1, type2) {
  const svg = d3.select("#gHeatmap");

  svg.selectAll("rect.highlight").remove();

  const x = d3.scaleBand()
    .range([0, width_left])
    .domain(types)

  const y = d3.scaleBand()
    .range([height, 0])
    .domain(types)

  svg
    .append("rect")
    .attr("class", "highlight")
    .attr("x", x(type1))
    .attr("y", y(type2))
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("height", y.bandwidth())
    .attr("width", x.bandwidth())
    .attr("stroke", "grey")
    .attr("fill", "none")
    .style("stroke-width", "3px");
}

function resetScatterPlot() {
  const svg = d3.select("#gScatterPlot");

  const x = d3
      .scaleLinear()
      .domain([0, 250])
      .range([0, width_right]);

  const y = d3
      .scaleLinear()
      .domain([0, 40])
      .range([height, 0]);
  
  svg.selectAll("path")
    .filter(".dotValue")
    .remove();

  d3.json("json/df_moves.json").then(function (data) {
    data = data.filter(function (d) {
      return d.Power != -1; //&& !(d.Accuracy == -1);
    });

    const keys = ["Special", "Status", "Physical"];

    const shape = d3.scaleOrdinal()
      .domain(keys)
      .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle]);

    svg
      .selectAll("dots")
      .data(data)
      .enter()
      .append("path")
      .attr("id", d => d.Move)
      .attr("class", function (d) { return d.Damage_Class == "Special" ? `dotValue circleValue ${d.Type}Dot` : `dotValue triangleValue ${d.Type}Dot` })
      .attr("d", d3.symbol()
        .size(120)
        .type(function (d) { return shape(d.Damage_Class) })
      )
      .attr("transform", function (d) { return "translate(" + x(d.Power) + "," + y(d.PP) + ")"; })
      .style("fill", "steelblue")
      .append("title")
      .text((d) => d.Move);

      console.log(opacityCircle, opacityTriangle);

      d3.selectAll(".circleValue")
        .attr("opacity", opacityCircle == 0.15 ? 0 : 0.15);

      d3.selectAll(".triangleValue")
        .attr("opacity", opacityTriangle == 0.15 ? 0 : 0.15);
    })  
}

function updateScatterPlotFilterOneType(type) {
  const svg = d3.select("#gScatterPlot");

  svg.selectAll("path")
    .filter(".dotValue")
    .filter(`*:not(.${type}Dot)`)
    .remove();
}

function updateScatterPlot(start, finish) {
  d3.json("data.json").then(function (data) {
    data = data.filter(function (elem) {
      return start <= elem.oscar_year && elem.oscar_year <= finish;
    });

    const svg = d3.select("#gScatterPlot");

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.budget)])
      .range([0, width]);
    svg
      .select("#gXAxis")
      .call(d3.axisBottom(x).tickFormat((x) => x / 1000000 + "M"));

    const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);

    const radiusScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.title.length)])
      .range([4, 20]);

    svg.select("gYAxis").call(d3.axisLeft(y));

    svg
      .selectAll("circle.circleValues")
      .data(data, (d) => d.title)
      .join(
        (enter) => {
          circles = enter
            .append("circle")
            .attr("class", "circleValues itemValue")
            .attr("cx", (d) => x(d.budget))
            .attr("cy", (d) => y(0))
            .attr("r", (d) => radiusScale(d.title.length))
            .style("fill", "blue")
            .style("stroke", "black")
            .on("mouseover", (event, d) => handleMouseOver(d))
            .on("mouseleave", (event, d) => handleMouseLeave());
          circles
            .transition()
            .duration(1000)
            .attr("cy", (d) => y(d.rating));
          circles.append("title").text((d) => d.title);
        },
        (update) => {
          update
            .transition()
            .duration(1000)
            .attr("cx", (d) => x(d.budget))
            .attr("cy", (d) => y(d.rating))
            .attr("r", (d) => radiusScale(d.title.length));
        },
        (exit) => {
          exit.remove();
        }
      );
  });
}

function updateLineChart(start, finish) {
  d3.json("data.json").then(function (data) {
    data = data.filter(function (elem) {
      return start <= elem.oscar_year && elem.oscar_year <= finish;
    });

    const svg = d3.select("#gLineChart");

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.oscar_year))
      .range([width, 0]);
    svg.select("#gXAxis").call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.budget)])
      .range([height, 0]);
    svg
      .select("#gYAxis")
      .call(d3.axisLeft(y).tickFormat((x) => x / 1000000 + "M"));

    svg
      .select("path.pathValue")
      .datum(data)
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.oscar_year))
          .y((d) => y(d.budget))
      );

    const yMax = d3.max(data, (d) => d.budget);
    const yMin = d3.min(data, (d) => d.budget);

    svg
      .selectAll("circle.circleValues")
      .data(data, (d) => d.title)
      .join(
        (enter) => {
          circles = enter
            .append("circle")
            .attr("class", "circleValues itemValue")
            .attr("cx", (d) => x(d.oscar_year))
            .attr("cy", (d) => y(0))
            .attr("r", 4)
            .style("fill", function (d, i) {
              if (d.budget == yMax) return "lightgreen";
              else if (d.budget == yMin) return "yellow";
              else return "blue";
            })
            .style("stroke", "black")
            .on("mouseover", (event, d) => handleMouseOver(d))
            .on("mouseleave", (event, d) => handleMouseLeave());
          circles
            .transition()
            .duration(1000)
            .attr("cy", (d) => y(d.budget));
          circles.append("title").text((d) => d.title);
        },
        (update) => {
          update
            .transition()
            .duration(1000)
            .attr("cx", (d) => x(d.oscar_year))
            .attr("cy", (d) => y(d.budget))
            .attr("r", 4)
            .style("fill", function (d, i) {
              if (d.budget == yMax) return "lightgreen";
              else if (d.budget == yMin) return "yellow";
              else return "blue";
            });
        },
        (exit) => {
          exit.remove();
        }
      );
  });
}

function handleMouseOver(item) {
  d3.selectAll(".itemValue")
    .filter(function (d, i) {
      return d.title == item.title;
    })
    .style("stroke-width", 5)
    .style("stroke", "grey");
}

function handleMouseLeave() {
  d3.selectAll("rect.itemValue")
    .style("stroke-width", 1)
    .style("stroke", "black");

  d3.selectAll("circle.itemValue")
    .style("stroke-width", 1)
    .style("stroke", "black");
}
