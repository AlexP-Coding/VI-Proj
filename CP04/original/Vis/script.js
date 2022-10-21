const margin = { top: 0.028 * window.innerHeight, right: 0.019 * window.innerWidth, bottom: 0.056* window.innerHeight, left: 0.033 * window.innerWidth };
const width_left = 0.326 * window.innerWidth - margin.left - margin.right;
const height_left_top = 0.563 * window.innerHeight - margin.top - margin.bottom;
const height_left_bottom = 0.281 * window.innerHeight - margin.top - margin.bottom;

const width_right = 0.651 * window.innerWidth - margin.left - margin.right;
const height_right = 0.478 * window.innerHeight - margin.top - margin.bottom;

function init() {
  createBarChart("#vi1");
  //createBarChart("#vi4");
  //createBarChart("#vi5");
  createParallelCoordinates("#vi2");
  createScatterPoltMoves("#vi3");
}

function createBarChart(id) {
  const svg = d3
    .select(id)
    .attr("width", width_left + margin.left + margin.right)
    .attr("height", height_left_top + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gBarChart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  d3.json("data.json").then(function (data) {
    const x = d3.scaleLinear().domain([0, 10]).range([0, width_left]);
    svg
      .append("g")
      .attr("id", "gXAxis")
      .attr("transform", `translate(0, ${height_left_top})`)
      .call(d3.axisBottom(x));

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.oscar_year))
      .range([0, height_left_top])
      .padding(0.2);

    const barFillConvertion = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.budget)])
      .range([0, 1]);

    svg.append("g").attr("id", "gYAxis").call(d3.axisLeft(y));
  });
}

function createParallelCoordinates(id) {
  const svg = d3
    .select(id)
    .attr("width",  width_right + margin.left + margin.right)
    .attr("height", height_right + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gParallelCoordinates")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


    /*const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.budget)])
      .range([0, width_right]);
    svg
      .append("g")
      .attr("id", "gXAxis")
      .attr("transform", `translate(0, ${height_right})`)
      .call(d3.axisBottom(x).tickFormat((x) => x / 1000000 + "M"));*/
  




  d3.json("json/df_pokemon.json").then(function(data) {

          
    const stats = ["Total", "HP", "Attack", "Defense", "Special_Atk", "Special_Def", "Speed"];

    const x = d3
      .scalePoint()
      .domain(stats)
      .range([0, (6/7)* width_right]);

    const total = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Total), d3.max(data, (d) => d.Total)])
      .range([10, height_right]);
    svg
      .append("g")
      .attr("id", "gYAxis")
      .attr("transform", `translate(${x("Total")}, 0)`)
      .call(d3.axisLeft(total));
    
    const hp = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.HP), d3.max(data, (d) => d.HP)])
      .range([10, height_right]);
    svg
      .append("g")
      .attr("id", "gYAxis")
      .attr("transform", `translate(${x("HP")}, 0)`)
      .call(d3.axisLeft(hp));
    
    const attack = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Attack), d3.max(data, (d) => d.Attack)])
      .range([10, height_right]);
    svg
      .append("g")
      .attr("id", "gYAxis")
      .attr("transform", `translate(${x("Attack")}, 0)`)
      .call(d3.axisLeft(attack));
    
    const defense = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Defense), d3.max(data, (d) => d.Defense)])
      .range([10, height_right]);
    svg
      .append("g")
      .attr("id", "gYAxis")
      .attr("transform", `translate(${x("Defense")}, 0)`)
      .call(d3.axisLeft(defense));  

    const special_attack = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Special_Atk), d3.max(data, (d) => d.Special_Atk)])
      .range([10, height_right]);
    svg
      .append("g")
      .attr("id", "gYAxis")
      .attr("transform", `translate(${x("Special_Atk")}, 0)`)
      .call(d3.axisLeft(special_attack));
    
    const special_defense = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Special_Def), d3.max(data, (d) => d.Special_Def)])
      .range([10, height_right]);
    svg
      .append("g")
      .attr("id", "gYAxis")
      .attr("transform", `translate(${x("Special_Def")}, 0)`)
      .call(d3.axisLeft(special_defense));
    
    const speed = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Speed), d3.max(data, (d) => d.Speed)])
      .range([10, height_right]);
    svg
      .append("g")
      .attr("id", "gYAxis")
      .attr("transform", `translate(${x("Speed")}, 0)`)
      .call(d3.axisLeft(special_attack));
    
    for(i=0; i<7;i++){
      svg
        .append("text")
        .data(stats)
        .attr("x", x(stats[i]))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .text(stats[i]);
    }

    function y(key, value){
      if(key == "Total" )
        return total(value);
      if(key == "HP")
        return hp(value);
      if(key == "Attack")
        return attack(value);
      if(key == "Defense")
        return defense(value);
      if(key == "Special_Atk")
        return special_attack(value);
      if(key == "Special_Def")
        return special_defense(value);
      if(key == "Speed")
        return speed(value);
    }

    function value(key, d){
      if(key == "Total" )
        return d.Total;
      if(key == "HP")
        return d.HP;
      if(key == "Attack")
        return d.Attack;
      if(key == "Defense")
        return d.Defense;
      if(key == "Special_Atk")
        return d.Special_Atk;
      if(key == "Special_Def")
        return d.Special_Def;
      if(key == "Speed")
        return d.Speed;
    }

    line = d3.line()
    //.defined(([key, value]) => value != null)
    .x(([key]) => x(key))
    .y(([key, val]) => y(key, val))

    svg
      .append("path")
      .datum(data)
      .attr("class", "pathValue")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d => line(d3.cross(stats, d, (key, d) => [key, value(key, d)])));
    
    
  
    /*function path(d) {
        return d3.line()(stats.map(function(p) { 
          if (p == "Total")
            return [0, total(d[p])]; 
          if (p == "HP")
            return [143, total(d[p])]; 
          }));
    }

  svg
    .selectAll("myPath")
    .data(data)
    .append("path")
    .attr("d",  path)
    .style("fill", "none")
    .style("stroke", "#69b3a2")
    .style("opacity", 0.5);*/
    
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

  d3.json("json/df_moves.json").then(function (data) {
    data = data.filter(function (d) {
      return d.Power != -1; //&& !(d.Accuracy == -1);
    });

    const shape = d3.scaleOrdinal()
      .domain(["Special", "Status", "Physical" ])
      .range([ d3.symbolCircle, d3.symbolTriangle, d3.symbolSquare]);
    
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
      .attr("y", height_right -10)
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
      .selectAll("dot")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "itemValue")
      .attr("d", d3.symbol()
        .size(120)
        .type(function(d) { return shape(d.Damage_Class)})
      )
      .attr("transform", function(d) { return "translate(" + x(d.Power) + "," + y(d.PP) + ")"; })
      .style("fill", "steelblue")
      .style("opacity", 0.25)
      /*
      .on("mouseover", (event, d) => handleMouseOver(d.country))
      .on("mouseleave", (event, d) => handleMouseLeave())
      */
      .append("title")
      .text((d) => d.Move);

    /*svg
      .selectAll("circle.circleValues")
      .data(data, (d) => d.title)
      .join("circle")
      .attr("class", "circleValues itemValue")
      .attr("cx", (d) => x(d.oscar_year))
      .attr("cy", (d) => y(d.budget))
      .attr("r", 4)
      .style("fill", function (d, i) {
        if (d.budget == yMax) return "lightgreen";
        else if (d.budget == yMin) return "yellow";
        else return "steelblue";
      })
      .style("stroke", "black")
      .on("mouseover", (event, d) => handleMouseOver(d))
      .on("mouseleave", (event, d) => handleMouseLeave())
      .append("title")
      .text((d) => d.title);*/
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
            .style("fill", "steelblue")
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
              else return "steelblue";
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
              else return "steelblue";
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
