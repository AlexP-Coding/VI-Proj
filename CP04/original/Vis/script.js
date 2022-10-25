const margin = { top: 0.028 * window.innerHeight, right: 0.019 * window.innerWidth, bottom: 0.056 * window.innerHeight, left: 0.033 * window.innerWidth };
const width_left = 0.326 * window.innerWidth - margin.left - margin.right;
const height_left_top = 0.563 * window.innerHeight - margin.top - margin.bottom;
const height_left_bottom = 0.281 * window.innerHeight - margin.top - margin.bottom;

const width_right = 0.610 * window.innerWidth - margin.left - margin.right;
const height_right = 0.478 * window.innerHeight - margin.top - margin.bottom;


function init() {
  createHeatmap("#vi1");
  //createBarChart("#vi4");
  //createBarChart("#vi5");
  createParallelCoordinates("#vi2");
  createScatterPoltMoves("#vi3");
}

function createHeatmap(id) {
  const svg = d3
    .select(id)
    .attr("width", width_left + margin.left + margin.right)
    .attr("height", height_left_top + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gHeatmap")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  d3.json("json/types_usage.json").then(function (data) {

    const types = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass",
    "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy" ];

    const x = d3.scaleBand()
      .range([   0, width_left ])
      .domain(types)
    
    const y = d3.scaleBand()
      .range([height_left_top , 0 ])
      .domain(types)

    var myColor = d3.scaleSequential()
      .interpolator(d3.interpolateOranges)
      .domain(d3.extent(data, d => d.Monthly_Usage))

    // create a tooltip
    var mouseover = function(d) {
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mouseleave = function(d) {
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    svg
      .append("g")
      .attr("class", "gXAxis")
      .attr("transform", "translate(0," + height_left_top+ ")")
      .call(d3.axisBottom(x).tickSize(0)) 
      .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", 0.028*height_left_top + "px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .select(".domain").remove()
      
    svg
      .append("g")
      .attr("id", "gYAxis")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", 0.028*height_left_top + "px")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .select(".domain").remove()
      

    svg.selectAll()
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Type1) })
      .attr("y", function(d) { return y(d.Type2) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d){return myColor(d.Monthly_Usage)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
      .append("title")
        .text((d) => "Monthly Usage of "+ d.Type1 + "-" + d.Type2 + " Pokemon: " + d.Monthly_Usage + "k")


  });
}

function createParallelCoordinates(id) {
  const svg = d3
    .select(id)
    .attr("width", width_right + margin.left + margin.right)
    .attr("height", height_right + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gParallelCoordinates")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.json("json/df_pokemon.json").then(function (data) {


    const stats = ["Total", "HP", "Attack", "Defense", "Special_Atk", "Special_Def", "Speed"];

    function value(key, d){
      if(key == "Total" )
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


    const color = d3.scaleOrdinal(["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass",
      "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"],
      ["#6D6D53", "#9A2620", "#270F70", "#803380", "#644F14", "#93802D", "#86931A", "#5A467A", "#313149", "#AC4F0C",
        "#0E3289", "#5F902D", "#826904", "#950631", "#256363", "#3506A9", "#5A463A", "#691125"])


    const x = d3.scalePoint(stats, [0, (19/20)* width_right]);


    const y = new Map(Array.from(stats, key => [key, d3.scaleLinear(d3.extent(data, d => value(key, d)), [10, height_right])]))

    new_data = data.filter(function (d) { return d.Monthly_Usage > 0; });

    line = d3.line()
      .defined(([value,]) => value != null)
      .x(([, key]) => x(key))
      .y(([value, key]) => y.get(key)(value))


    svg
      .selectAll("path")
      .data(new_data)
      .enter()
      .append("path")
      .attr("class", "pathValue")
      .attr("fill", "none")
      .attr("stroke-width", 0.5)
      .attr("stroke", d => color(d.Type1))
      .attr("d", d => line(d3.cross([d], stats, (element, key) => [value(key, element), key])))
      .append("title")
        .text((d) => d.Pokemon);


    svg.append("g")
      .selectAll("g")
      .data(stats)
      .join("g")
      .each(function (d) { d3.select(this).call(d3.axisLeft(y.get(d))); })
      .attr("transform", d => `translate(${x(d)},0)`)
      .call(g => g.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .style("font-size", "1.5em")
        .text(d => d))
      .call(g => g.selectAll("text")
        .clone(true)
        .lower()
        .attr("fill", "none")
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .attr("stroke", "white"));
  })
}

function createScatterPoltMoves(id) {
  const svg = d3
    .select(id)
    .attr("width", width_right + margin.left + margin.right + 100)
    .attr("height", height_right + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gLineChart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const bar = svg.append("g");

  bar.append("rect")
    .attr("x", 0.88*width_right)
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
    .text(22)
    .attr("x", 0.9*width_right)
    .attr("y", 20);

  bar
    .append("text")
    .attr("fill", "currentColor")
    .text(1)
    .attr("x", 0.9*width_right)
    .attr("y", 70);

  bar
    .append("text")
    .attr("fill", "currentColor")
    .text("Estimate of number of moves")
    .attr("x", 0.88*width_right)
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
      .attr("transform", `translate(0, ${height_right})`)
      .call(d3.axisBottom(x));
    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("y", height_right - 10)
      .attr("x", width_right)
      .text("Power");

    const y = d3
      .scaleLinear()
      .domain([0, 40])
      .range([height_right, 0]);
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
      .text("PP");

    svg
      .selectAll("dots")
      .data(data)
      .enter()
      .append("path")
      .attr("class", function (d) { return d.Damage_Class == "Special" ? "circleValue" : "triangleValue" })
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

    svg.append("circle").attr("cx",0.88*width_right).attr("cy",  0.465 * height_right).attr("r", 6).style("fill", "steelblue").style("opacity", 0.15);
    svg.append("path").attr("d", trianglesym).attr("fill", "steelblue").attr("transform", "translate(" +0.88*width_right +", 158)").style("opacity", 0.15);

    svg.append("text").attr("x", 0.9*width_right).attr("y", 0.48 * height_right).text("Special").style("font-size", "15px").attr("alignment-baseline", "middle")
      .on("click", function (d) {
        currentOpacity = d3.selectAll(".circleValue").style("opacity")
        d3.selectAll(".circleValue").transition().style("opacity", currentOpacity == 0.15 ? 0 : 0.15)
      });
    svg.append("text").attr("x", 0.9*width_right).attr("y", 160).text("Physical").style("font-size", "15px").attr("alignment-baseline", "middle")
      .on("click", function (d) {
        currentOpacity = d3.selectAll(".triangleValue").style("opacity")
        d3.selectAll(".triangleValue").transition().style("opacity", currentOpacity == 0.15 ? 0 : 0.15)
      });;
  });
}

function updateBarChart(start, finish) {
  d3.json("data.json").then(function (data) {
    data = data.filter(function (elem) {
      return start <= elem.oscar_year && elem.oscar_year <= finish;
    });

    const svg = d3.select("#gBarChart");

    const x = d3.scaleLinear().domain([0, 10]).range([0, width]);
    svg.select("#gXAxis").call(d3.axisBottom(x));

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.oscar_year))
      .range([0, height])
      .padding(0.2);

    const barFillConvertion = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.budget)])
      .range([0, 1]);

    svg.select("#gYAxis").call(d3.axisLeft(y));

    svg
      .selectAll("rect.rectValue")
      .data(data, (d) => d.title)
      .join(
        (enter) => {
          rects = enter
            .append("rect")
            .attr("class", "rectValue itemValue")
            .attr("x", x(0))
            .attr("y", (d) => y(d.oscar_year))
            .attr("width", (d) => x(0))
            .attr("height", y.bandwidth())
            .attr("fill", function (d, i) {
              return d3.interpolateBlues(barFillConvertion(d.budget));
            })
            .style("stroke", "black")
            .on("mouseover", (event, d) => handleMouseOver(d))
            .on("mouseleave", (event, d) => handleMouseLeave());
          rects
            .transition()
            .duration(1000)
            .attr("width", (d) => x(d.rating));
          rects.append("title").text((d) => d.title);
        },
        (update) => {
          update
            .transition()
            .duration(1000)
            .attr("x", x(0))
            .attr("y", (d) => y(d.oscar_year))
            .attr("width", (d) => x(d.rating))
            .attr("height", y.bandwidth())
            .attr("fill", function (d, i) {
              return d3.interpolateBlues(barFillConvertion(d.budget));
            });
        },
        (exit) => {
          exit.remove();
        }
      );
  });
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
    .style("stroke", "red");
}

function handleMouseLeave() {
  d3.selectAll("rect.itemValue")
    .style("stroke-width", 1)
    .style("stroke", "black");

  d3.selectAll("circle.itemValue")
    .style("stroke-width", 1)
    .style("stroke", "black");
}
