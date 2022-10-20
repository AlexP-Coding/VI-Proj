const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width_left = 500 - margin.left - margin.right;
const height_left_top = 400 - margin.top - margin.bottom;
const height_left_bottom = 200 - margin.top - margin.bottom;

const width_right = 1000 - margin.left - margin.right;
const height_right = 340 - margin.top - margin.bottom;

function init() {
  createBarChart("#vi1");
  //createBarChart("#vi4");
  //createBarChart("#vi5");
  createScatterPlot("#vi2");
  createLineChart("#vi3");
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

function createScatterPlot(id) {
  const svg = d3
    .select(id)
    .attr("width",  width_right + margin.left + margin.right)
    .attr("height", height_right + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gScatterPlot")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.json("data.json").then(function (data) {
    /*const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.budget)])
      .range([0, width_right]);
    svg
      .append("g")
      .attr("id", "gXAxis")
      .attr("transform", `translate(0, ${height_right})`)
      .call(d3.axisBottom(x).tickFormat((x) => x / 1000000 + "M"));*/

    const total = d3.scaleLinear().domain([150, 700]).range([10, height_right,]);
    svg.append("g")
    .attr("id", "gYAxis")
    .attr("transform", `translate(0, 0)`)
    .call(d3.axisLeft(total));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 0)
    .attr("x", 0)
    .text("Total");

    const hp = d3.scaleLinear().domain([0, 255]).range([10, height_right,]);
    svg.append("g")
    .attr("id", "gYAxis")
    .attr("transform", `translate(143, 0)`)
    .call(d3.axisLeft(hp));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 0)
    .attr("x", 143)
    .text("HP");

    const attack = d3.scaleLinear().domain([0, 200]).range([10, height_right,]);
    svg.append("g")
    .attr("id", "gYAxis")
    .attr("transform", `translate(286, 0)`)
    .call(d3.axisLeft(attack));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 0)
    .attr("x", 286)
    .text("Attack");

    const defense = d3.scaleLinear().domain([0, 250]).range([10, height_right,]);
    svg.append("g")
    .attr("id", "gYAxis")
    .attr("transform", `translate(429, 0)`)
    .call(d3.axisLeft(defense));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 0)
    .attr("x", 429)
    .text("Defense");

    const sp_attack = d3.scaleLinear().domain([0, 200]).range([10, height_right,]);
    svg.append("g")
    .attr("id", "gYAxis")
    .attr("transform", `translate(572, 0)`)
    .call(d3.axisLeft(sp_attack));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 0)
    .attr("x", 572)
    .text("Special Attack");

    const sp_defense = d3.scaleLinear().domain([0, 250]).range([10, height_right,]);
    svg.append("g")
    .attr("id", "gYAxis")
    .attr("transform", `translate(715, 0)`)
    .call(d3.axisLeft(sp_defense));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 0)
    .attr("x", 715)
    .text("Special Defense");

    const speed = d3.scaleLinear().domain([0, 200]).range([10, height_right,]);
    svg.append("g")
    .attr("id", "gYAxis")
    .attr("transform", `translate(858, 0)`)
    .call(d3.axisLeft(speed));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 0)
    .attr("x", 858)
    .text("Speed");

    /*const radiusScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.title.length)])
    .range([4, 20]);

    svg
      .selectAll("circle.circleValues")
      .data(data, (d) => d.title)
      .join("circle")
      .attr("class", "circleValues itemValue")
      .attr("cx", (d) => x(d.budget))
      .attr("cy", (d) => y(d.rating))
      .attr("r", (d) => radiusScale(d.title.length))
      .style("fill", "steelblue")
      .style("stroke", "black")
      .on("mouseover", (event, d) => handleMouseOver(d))
      .on("mouseleave", (event, d) => handleMouseLeave())
      .append("title")
      .text((d) => d.title);*/
  });
}

function createLineChart(id) {
  const svg = d3
    .select(id)
    .attr("width", width_right + margin.left + margin.right)
    .attr("height", height_right + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gLineChart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.json("data.json").then(function (data) {
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
      .domain([0, 100])
      .range([height_right, 0]);
    svg
      .append("g")
      .attr("id", "gYAxis")
      .call(d3.axisLeft(y));
    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 15)
      .attr("x", 0)
      .attr("transform", `rotate(-90)`)
      .text("Accuracy");

    svg
      .append("path")
      .datum(data)
      .attr("class", "pathValue")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
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
      .text((d) => d.title);
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
