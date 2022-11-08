const margin = { top: 0.028 * window.innerHeight, right: 0.019 * window.innerWidth, bottom: 0.056 * window.innerHeight, left: 0.033 * window.innerWidth };
const width_left = 0.326 * window.innerWidth - margin.left - margin.right;
const height = 0.478 * window.innerHeight - margin.top - margin.bottom;
const height_left_bottom = 0.281 * window.innerHeight - margin.top - margin.bottom;

const width_right = 0.6455 * window.innerWidth - margin.left - margin.right;
const width_bottom = window.innerWidth - margin.left - margin.right;


function init() {
  readAllPokemon();
  createHeatmap("#vi1");
  createParallelCoordinates("#vi2");
  createScatterPlotMoves("#vi3");
  createSearchBar("#sb1");
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

var allPokemon = new Array();	
var allMoves = {};
var opacityTriangle = 0;
var opacityCircle = 0;
var opacitySquare = 0;
var parallel_data, initial_parallel_data;

function readAllPokemon() {
  d3.json("json/df_pokemon.json").then(function (data) {
    for (let i = 0; i < data.length; i++) {
      allPokemon.push(data[i].Pokemon);
    }
  });
}

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
        div.html("Monthly Usage of" + "<br/>" + d.Type1 + "-" + d.Type2 + "<br/>" + "Pokémon: " + d.Monthly_Usage + "k" + "<br/>" +
        "<img src= types/" + d.Type1 +".png width=22 height=22 opacity=1/>"+ 
        "<img src= types/" + d.Type2 +".png width=22 height=22 opacity=1/>")
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
            updateScatterPlotFilterTwoTypes(d.Type1, d.Type2);
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

    data.forEach(function (d) {
      d["Dtype"] = "AvgOneType";
    });

    parallel_data = initial_parallel_data = data;

    console.log(data);

    const color = d3.scaleOrdinal(types, colors);

    const x = d3.scalePoint(stats, [0, (7 / 8) * width_bottom]);

    const x_types = d3.scalePoint(types, [0, (19 / 20) * width_bottom]);

    const y = new Map(Array.from(stats, key => [key, d3.scaleLinear([d3.min(data, d => value(key, d)) - 10, d3.max(data, d => value(key, d)) + 10], [10, height])]));

    const dragging = {};


    line = d3.line()
      .defined(([value,]) => value != null)
      .x(([, key]) => x(key))
      .y(([value, key]) => y.get(key)(value))


    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", d => `avgOneType ${d.Type1}`)
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
        div.html("Type 1: " + d.Type1 + "<br/>" +
        "<img src= types/" + d.Type1 +".png width=22 height=22 opacity=1/>")
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
          .attr("stroke", "white"))
    }

    svg.selectAll("g[id$='Axis']")
      .call(d3.drag()
      //.subject(function (d) { return { x: x(d) }; })
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));



    //Define the drag functions
    function dragstarted(event, d) {
      dragging[d] = x(d);
      console.log(dragging[d]);
    }
    
    function dragged(event, d) {
      //Only drag the axis horizontally
      dragging[d] = Math.min((7 / 8) * width_bottom, Math.max(0, event.x));
      //Update the position of the selected axis
      console.log(dragging[d]);
      d3.select(this).attr("transform", function (d) { return "translate(" + dragging[d] + ")"; });
      //Update the paths of the parallel coordinates
      //svg.selectAll("path").attr("d", line(d3.cross([d], stats, (element, key) => [value(key, element), key]) ));
    }

    function dragended(event, d) {
      delete dragging[d];
    }

    function position(d) {
      const v = dragging[d];
      return v == null ? x(d) : v;
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

function readPokemonMovesData(svg, pokemon) {
  var div = d3.select("body").append("div")
    .attr("id", "tooltipMovesPokemon")
    .attr("class", "tooltip6")
    .style("opacity", 0);

  d3.json("json/df_used_with_move1.json").then(function (data) {
    data = data.filter(function (d) {
      return d.Pokemon == pokemon;
    });

    const keys = ["Special", "Status", "Physical"];

    const shape = d3.scaleOrdinal()
      .domain(keys)
      .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle]);

    const x = d3
      .scaleLinear()
      .domain([-5, 270])
      .range([0, width_right]);

    const y = d3
      .scaleLinear()
      .domain([0, 40])
      .range([height, 0]);

    const fillScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, 1]);

    svg
      .selectAll("dots")
      .data(data)
      .enter()
      .append("path")
      .attr("id", d => d.Move)
      .attr("class", function (d) {
        if (d.Damage_Class == "Special") return `dotValue circleValue ${d.Type}Dot`;
        else if (d.Damage_Class == "Physical") return `dotValue triangleValue ${d.Type}Dot`
        else return `dotValue squareValue ${d.Type}Dot`;
      })
      .attr("d", d3.symbol()
        .size(120)
        .type(function (d) { return shape(d.Damage_Class) })
      )
      .attr("transform", function (d) { return "translate(" + x(allMoves[d.Move].Power) + "," + y(allMoves[d.Move].PP) + ")"; })
      .style("fill", function(d) {
        if (allMoves[d.Move].Accuracy == -1) return "#DCDCDC";
        else return d3.interpolateBlues(fillScale(allMoves[d.Move].Accuracy));
      })
      .style("opacity", function() {
        if (d3.select(this).classed("circleValue")) return opacityCircle == 1 ? 0 : 1;
        else if (d3.select(this).classed("squareValue")) return opacitySquare == 1 ? 0 : 1;
        else return opacityTriangle == 1 ? 0 : 1;
      })
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity") == 1 ?
          div.transition()
            .duration(100)
            .style("opacity", .9) :
          div.style("opacity", 0);
        div.html(
          (d.Accuracy == -1 ?
            `<b>Move:</b> ${d.Move}<br><b>Type:</b> ${allMoves[d.Move].Type}<br><b>Power:</b> N/A<br><b>Damage Class:</b> ${d.Damage_Class}
             <b>Monthly Move Use:</b> ${d.Monthly_Move_Use}<br><b>Use Percentage:</b> ${d.Use_Percentage}`
             :
            `<b>Move:</b> ${d.Move}<br><b>Type:</b> ${allMoves[d.Move].Type}<br><b>Power:</b> ${allMoves[d.Move].Accuracy}<br><b>Damage Class:</b> ${d.Damage_Class}
             <b>Monthly Move Use:</b> ${d.Monthly_Move_Use}<br><b>Use Percentage:</b> ${d.Use_Percentage}`)
        )
        .style("left", (d3.pointer(event, this)[0] + (1.155 * window.innerHeight)) + "px")
        .style("top", (d3.pointer(event, this)[1] + (0.055 * window.innerHeight)) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(100)
          .style("opacity", 0);
      })
  });
}

function readMovesData(svg, types) {

  var div = d3.select("body").append("div")
    .attr("id", "tooltipMoves")
    .attr("class", "tooltip4")
    .style("opacity", 0);

  d3.json("json/df_moves.json").then(function (data) {
    if (types == "first"){
      for (let i = 0; i < data.length; i++) {
        allMoves[data[i].Move] = data[i];
      }
    }
    else if (types != null) {
      data = data.filter(function (d) {
        return types.includes(d.Type);
      });
    }
    console.log(allMoves);
    const keys = ["Special", "Status", "Physical"];

    const shape = d3.scaleOrdinal()
      .domain(keys)
      .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle]);

    const x = d3
      .scaleLinear()
      .domain([-5, 270])
      .range([0, width_right]);

    const y = d3
      .scaleLinear()
      .domain([0, 40])
      .range([height, 0]);

    const fillScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, 1]);

    svg
      .selectAll("dots")
      .data(data)
      .enter()
      .append("path")
      .attr("id", d => d.Move)
      .attr("class", function (d) {
        if (d.Damage_Class == "Special") return `dotValue circleValue ${d.Type}Dot`;
        else if (d.Damage_Class == "Physical") return `dotValue triangleValue ${d.Type}Dot`
        else return `dotValue squareValue ${d.Type}Dot`;
      })
      .attr("d", d3.symbol()
        .size(120)
        .type(function (d) { return shape(d.Damage_Class) })
      )
      .attr("transform", function (d) { return "translate(" + x(d.Power) + "," + y(d.PP) + ")"; })
      .style("fill", function(d) {
        if (d.Accuracy == -1) return "#DCDCDC";
        else return d3.interpolateBlues(fillScale(d.Accuracy));
      })
      .style("opacity", function() {
        if (d3.select(this).classed("circleValue")) return opacityCircle == 1 ? 0 : 1;
        else if (d3.select(this).classed("squareValue")) return opacitySquare == 1 ? 0 : 1;
        else return opacityTriangle == 1 ? 0 : 1;
      })
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity") == 1 ?
          div.transition()
            .duration(100)
            .style("opacity", .9) :
          div.style("opacity", 0);
        div.html(
          (d.Accuracy == -1 ?
            `<b>Move:</b> ${d.Move}<br><b>Type:</b> ${d.Type}<br><b>Power:</b> N/A<br><b>Damage Class:</b> ${d.Damage_Class}`
            :
            `<b>Move:</b> ${d.Move}<br><b>Type:</b> ${d.Type}<br><b>Power:</b> ${d.Accuracy}<br><b>Damage Class:</b> ${d.Damage_Class}`)
        )
        .style("left", (d3.pointer(event, this)[0] + (1.155 * window.innerHeight)) + "px")
        .style("top", (d3.pointer(event, this)[1] + (0.055 * window.innerHeight)) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(100)
          .style("opacity", 0);
      })
  });
}

function createScatterPlotMoves(id) {
  const svg = d3
    .select(id)
    .attr("width", width_right + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gScatterPlot")
    .attr("transform", "translate(" + (margin.left) + ", " + margin.top + ")");

  const x = d3
    .scaleLinear()
    .domain([-5, 270])
    .range([0, width_right]);

  const y = d3
    .scaleLinear()
    .domain([0, 40])
    .range([height, 0]);

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
    .style("stop-color", d3.interpolateBlues(1));

  gradient
    .append("stop")
    .attr("offset", "100%")
    .style("stop-color", d3.interpolateBlues(0));

  bar.attr("fill", "url(#mygrad)");

  bar
    .append("text")
    .attr("fill", "currentColor")
    .style("font-size", 0.015 * width_right + "px")
    .text("100%")
    .attr("x", 0.8 * width_right)
    .attr("y", 20);

  bar
    .append("text")
    .attr("fill", "currentColor")
    .style("font-size", 0.015 * width_right + "px")
    .text("0%")
    .attr("x", 0.8 * width_right)
    .attr("y", 70);

  bar
    .append("text")
    .attr("fill", "currentColor")
    .style("font-size", 0.015 * width_right + "px")
    .text("Accuracy")
    .attr("x", 0.78 * width_right)
    .attr("y", 90);

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

  readMovesData(svg, "first");

  const trianglesym = d3.symbol().type(d3.symbolTriangle).size(120);
  const squaresym = d3.symbol().type(d3.symbolSquare).size(120);

  svg.append("circle")
    .attr("cx", 0.78 * width_right)
    .attr("cy", 0.465 * height)
    .attr("r", 6)
    .style("fill", "steelblue")
    .style("opacity", 0.35);

  svg.append("path")
    .attr("d", trianglesym)
    .attr("fill", "steelblue")
    .attr("transform", "translate(" + 0.78 * width_right + "," + 0.405 * height + ")")
    .style("opacity", 0.35);

  svg.append("path")
    .attr("d", squaresym)
    .attr("fill", "steelblue")
    .attr("transform", "translate(" + 0.78 * width_right + "," + 0.53 * height + ")")
    .style("opacity", 0.35);

  const label_special = svg.append("text");
  const label_physical = svg.append("text");
  const label_status = svg.append("text");

  label_special
    .attr("id", "special_label")
    .attr("x", 0.8 * width_right)
    .attr("y", 0.471 * height)
    .text("Special")
    .style("font-weight", "bold")
    .style("font-size", 0.015 * width_right + "px")
    .attr("alignment-baseline", "middle")
    .on("click", function () {
      opacityCircle = d3.selectAll(".circleValue").style("opacity");
      d3.selectAll(".circleValue").transition().style("opacity", opacityCircle == 1 ? 0 : 1);
      d3.select(this).style("font-weight", opacityCircle == 1 ? "normal" : "bold")
    });

  label_physical
    .attr("id", "physical_label")
    .attr("x", 0.8 * width_right)
    .attr("y", 0.405 * height)
    .text("Physical")
    .style("font-weight", "bold")
    .style("font-size", 0.015 * width_right + "px")
    .attr("alignment-baseline", "middle")
    .on("click", function () {
      opacityTriangle = d3.selectAll(".triangleValue").style("opacity");
      d3.selectAll(".triangleValue").transition().style("opacity", opacityTriangle == 1 ? 0 : 1);
      d3.select(this).style("font-weight", opacityTriangle == 1 ? "normal" : "bold")
    });

  label_status
    .attr("id", "status_label")
    .attr("x", 0.8 * width_right)
    .attr("y", 0.537 * height)
    .text("Status")
    .style("font-weight", "bold")
    .style("font-size", 0.015 * width_right + "px")
    .attr("alignment-baseline", "middle")
    .on("click", function () {
      opacitySquare = d3.selectAll(".squareValue").style("opacity");
      d3.selectAll(".squareValue").transition().style("opacity", opacitySquare == 1 ? 0 : 1);
      d3.select(this).style("font-weight", opacitySquare == 1 ? "normal" : "bold")
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

  const resetButton = d3.select(id).append("g").attr("id", "gButtonReset");

  resetButton
    .append("rect")
    .attr("x", width_left - 502.5)
    .attr("y", 0)
    .attr("width", 35)
    .attr("height", 34)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 1)

  resetButton
    .append("svg:image")
    .attr("x", width_left - 500)
    .attr("xlink:href", "symbol/reset1.png")
    .attr("y", 0)
    .attr("width", 30)
    .attr("height", 30)
    .attr("rx", 5)
    .attr("ry", 5)
    .style("stroke", "black")
    .on("click", function () {
      resetParallelCoordinates();
      resetScatterPlot();
      d3.select("rect.highlight").remove();
      clicked = 0;
      highlight = 0;
      d3.select("#gHeatmap")
        .selectAll("rect")
        .style("stroke", "none");
      parallel_data = initial_parallel_data;
    });
  

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

  // Add the search icon
  svg
    .append("svg:image")
    .attr("xlink:href", "symbol/search--v1.png")
    .attr("x", 742.656 - 250 + 10)
    .attr("y", 5)
    .attr("width", 20)
    .attr("height", 20);

  // Add the search input
  svg
    .append("foreignObject") 
    .attr("x", 742.656 - 250 + 40)
    .attr("y", 0)
    .attr("width", 500 - 40)
    .attr("height", 30)
    .append("xhtml:input")
    .attr("id", "searchInput")
    .attr("type", "text")
    .attr("placeholder", "Search for a pokemon")
    .attr("style", "width: 100%; height: 100%; border: none; outline: none; font-size: 16px; padding-left: 5px;");

  //When the user presses enter, search for the type
  d3.select("#searchInput").on("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      const search = document.getElementById("searchInput").value;
      searchPokemon(search);
    }
  });

  //When the user clicks on the button, search for the type
  svg
    .on("click", function () {
      const search = document.getElementById("searchInput").value;
      if (search != "") {
        searchPokemon(search);
        d3.select("#gScatterPlot")
        .selectAll("path")
        .filter(".dotValue")
        .remove();
        readPokemonMovesData(d3.select("#gScatterPlot"), search);
      }
    });

  const autocomplete = document.getElementById("searchInput");
  const resultsHTML = svg.append("ul").attr("id", "results");

  autocomplete.oninput = function () {
    let results = [];
    const userInput = this.value;
    resultsHTML.innerHTML = "";
    if (userInput.length > 0) {
      results = getResults(userInput);
      resultsHTML.style.display = "block";
      for (i = 0; i < results.length; i++) {
        resultsHTML.innerHTML += "<li>" + results[i] + "</li>";
      }
    }
  };

  function getResults(input) {
    const results = [];
    for (i = 0; i < allPokemon.length; i++) {
      if (input === allPokemon[i].slice(0, input.length)) {
        results.push(allPokemon[i]);
      }
    }
    return results;
  }
}

function autoCompleteSearch() {
  const searchInput = document.getElementById("searchInput");
  const autoComplete = new autoComplete({
    data: {
      src: allPokemon,
      key: ["name"],
      cache: false,
    },
    selector: "#searchInput",
    threshold: 0,
    debounce: 0,
    searchEngine: "loose",
    highlight: true,
    maxResults: 5,
    resultsList: {
      render: true,
      container: (source) => {
        source.setAttribute("id", "autoComplete_list");
      },
      destination: searchInput,
      position: "afterend",
      element: "ul",
    },
    resultItem: {
      content: (data, source) => {
        source.innerHTML = data.match;
      },
      element: "li",
    },
    noResults: () => {
      const result = document.createElement("li");
      result.setAttribute("class", "no_result");
      result.setAttribute("tabindex", "1");
      result.innerHTML = "No Results";
      document.querySelector("#autoComplete_list").appendChild(result);
    },
    onSelection: (feedback) => {
      searchInput.value = feedback.selection.value.name;
      searchPokemon(feedback.selection.value.name);
    },
  });
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

    data.forEach(function (d) {
      d["Dtype"] = "AvgOneType";
    });
    
    console.log(data);

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
      .attr("class", d => `avgOneType ${d.Type1}`)
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
        div.html("Type 1: " + d.Type1 + "<br/>" +
        "<img src= types/" + d.Type1 +".png width=22 height=22 opacity=1/>")
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

    data.forEach(function (d) {
      d["Dtype"] = "AvgTwoTypes";
    });

    parallel_data = data;

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
        return `avgTwoTypes ${d.Type2}`;
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
        div.html("Type 1: " + d.Type1 + "<br/>" + "Type 2: " + d.Type2 +"<br/>" +
        "<img src= types/" + d.Type1 +".png width=22 height=22 opacity=1/>"+ 
        "<img src= types/" + d.Type2 +".png width=22 height=22 opacity=1/>")
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
        updateScatterPlotFilterTwoTypes(d.Type1, d.Type2);
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
            updateScatterPlotFilterTwoTypes(type1, this.textContent);
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
    .attr("class", "tooltip5")
    .style("opacity", 0);

  d3.json("json/df_pokemon.json").then(function (data) {
    data = data.filter(function (elem) {
      return type1 == elem.Type1 && elem.Type2 == type2;
    });

    data.forEach(function (d) {
      d["Dtype"] = "Pokemon";
    });

    parallel_data = data;
    console.log(parallel_data);
    console.log(data);

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
      .attr("id", d => d.Pokemon)
      .attr("class", "pathValuePokemon")
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
        div.html("Pokémon: "+ d.Pokemon + "<br/>" + "Type 1: " + d.Type1 + "<br/>" + "Type 2: " + d.Type2 +"<br/>" +
        "<img src= types/" + d.Type1 +".png width=22 height=22 opacity=1/>"+ 
        "<img src= types/" + d.Type2 +".png width=22 height=22 opacity=1/>" + 
        "<img src= images/" + d.ID +".png width=22 height=22 opacity=1/>" )
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
        d3.select("#gScatterPlot")
        .selectAll("path")
        .filter(".dotValue")
        .remove();
        readPokemonMovesData(d3.select("#gScatterPlot"), d.Pokemon);
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

    for (i = 0; i < 7; i++) {
      svg
        .select("#" + stats[i] + "Axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y.get(stats[i])));
    }
  });
}

function searchPokemon(pokemon){

  var divPokemon = d3.select("body").append("div")
    .attr("class", "tooltip5")
    .style("opacity", 0);

  var divAvgOneType = d3.select("body").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);

  var divAvgTwoTypes = d3.select("body").append("div")
    .attr("class", "tooltip3")
    .style("opacity", 0);

  d3.json("json/df_pokemon.json").then(function (data) {
    data = data.filter(function (elem) {
      return pokemon == elem.Pokemon;
    });
    if (data.length == 0){
      alert("Pokemon not found!");
    }

    data.forEach(function (d) {
      d["Dtype"] = "Pokemon";
    });    

    data = parallel_data = data.concat(parallel_data);

    console.log(data);

    selectionDiv = {"AvgOneType": [divAvgOneType, divAvgOneTypeFunc],
     "AvgTwoTypes": [divAvgTwoTypes, divAvgTwoTypesFunc],
      "Pokemon": [divPokemon, divPokemonFunc]
    };

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
      .attr("id", d => d.Pokemon)
      .attr("class", "pathValuePokemon")
      .attr("fill", "none")
      .attr("stroke-width", 1.0)
      .attr("stroke", d => blendColors(color(d.Type2), color(d.Type1), 0.5))
      .attr("d", d => line(d3.cross([d], stats, (element, key) => [value(key, element), key])))
      .style("opacity", .6)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 3.0)
          .style("opacity", 1.0);
        selectionDiv[d["Dtype"]][0].transition()
          .duration(100)
          .style("opacity", .9);
        selectionDiv[d["Dtype"]][0].html(selectionDiv[d["Dtype"]][1](d))
          .style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px")
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 1.0)
          .style("opacity", .6);
          selectionDiv[d["Dtype"]][0].transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("mousemove", function (event, d) {
        selectionDiv[d["Dtype"]][0].style("left", (d3.pointer(event, this)[0]) + "px")
          .style("top", (d3.pointer(event, this)[1] + (0.476 * window.innerHeight)) + "px");
      })
      /*.append("title")
      .text((d) => d.Pokemon);*/

    for (i = 0; i < 7; i++) {
      svg
        .select("#" + stats[i] + "Axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y.get(stats[i])));
    }

    function divPokemonFunc(d){
      return "Pokémon: "+ d.Pokemon + "<br/>" + "Type 1: " + d.Type1 + "<br/>" + "Type 2: " + d.Type2 +"<br/>" +
        "<img src= types/" + d.Type1 +".png width=22 height=22 opacity=1/>"+ 
        "<img src= types/" + d.Type2 +".png width=22 height=22 opacity=1/>" + 
        "<img src= images/" + d.ID +".png width=22 height=22 opacity=1/>" 
    }

    function divAvgOneTypeFunc(d){
      return "Type 1: " + d.Type1 + "<br/>" +
        "<img src= types/" + d.Type1 +".png width=22 height=22 opacity=1/>"
    }

    function divAvgTwoTypesFunc(d){
      return "Type 1: " + d.Type1 + "<br/>" + "Type 2: " + d.Type2 +"<br/>" +
        "<img src= types/" + d.Type1 +".png width=22 height=22 opacity=1/>"+ 
        "<img src= types/" + d.Type2 +".png width=22 height=22 opacity=1/>"
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

  svg.selectAll("path")
    .filter(".dotValue")
    .remove();

  readMovesData(svg, null);

  svg.selectAll(".circleValue")
    .style("opacity", opacityCircle == 1 ? 0 : 1);

  svg.selectAll(".triangleValue")
    .style("opacity", opacityTriangle == 1 ? 0 : 1);

  svg.selectAll(".squareValue")
    .style("opacity", opacitySquare == 1 ? 0 : 1);

}

function updateScatterPlotFilterOneType(type) {
  const svg = d3.select("#gScatterPlot");

  svg.selectAll("path")
    .filter(".dotValue")
    .transition()
    .duration(1500)
    .style("opacity", 0)
    .remove();

  readMovesData(svg, [type]);
}

function updateScatterPlotFilterTwoTypes(type1, type2) {
  const svg = d3.select("#gScatterPlot");

  svg.selectAll("path")
    .filter(".dotValue")
    .transition()
    .duration(1500)
    .style("opacity", 0)
    .remove();

  readMovesData(svg, [type1, type2]);
}
