var data; // json object we'll read in from data.json
/**
 * This function runs when the HTML is loaded.
 */
async function handleOnLoad() {
  // upon loading page fetch data
  await getJSONdata((print = false));

  // load components
  loadScatterPlot();
  loadPieBar((info = true));
  // toolTip();

  // set event handler for when the window is resized
  document.defaultView.addEventListener("resize", handleResize);
}

/**
 * Remove old elements from the DOM and redraw to new scale.
 */
function handleResize() {
  // remove scatter elements
  const scatter = document.getElementById("scatterDiv");
  while (scatter.firstChild) {
    scatter.removeChild(scatter.firstChild);
  }

  // remove pie elements
  const pie = document.getElementById("pieDiv");
  while (pie.firstChild) {
    pie.removeChild(pie.firstChild);
  }

  // remove histogram elements
  const hist = document.getElementById("histDiv");
  while (hist.firstChild) {
    hist.removeChild(hist.firstChild);
  }

  // redraw components
  loadScatterPlot();
  loadPieBar((info = false)); // don't bother redrawing info component
}

/**
 * Display popups when hovering over d3 elements
 */
function toolTip() {
  // Select the HTML element to add the hover effect to
  const myElement = d3.select("#scatterDiv");

  // Add a mouseover event listener to the selected element
  myElement.on("mouseover", () => {
    // Get the position of the mouse cursor
    const [x, y] = d3.pointer(event);

    // Create a new element for the pop-up message
    const popup = d3
      .select("#scatterDiv")
      .append("div")
      .attr("class", "popup")
      .text("This is the pop-up message!");

    // Set the position of the pop-up message element
    popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
  });

  // Add a mouseout event listener to the selected element
  myElement.on("mouseout", () => {
    // Remove the pop-up message element
    d3.select(".popup").remove();
  });
}

/**
 * Turn data.json into a JSON object that we'll store in variable data.
 */
async function getJSONdata(print) {
  await fetch("./data.json")
    .then((res) => res.json()) // convert to JSON
    .then((res) => {
      data = res; // store in variable data
      if (print) {
        console.log(data); // print JSON to console
      }
    })
    .catch((error) => {
      console.error("error fetching data:", error);
    });

  // format dates
  const parseTime = d3.timeParse("%Y-%m-%d");
  data.forEach(function (d) {
    d.Week = parseTime(d.Week);
  });
}

// --------------------------------------------------------
// ------------------ UPPER BAR FUNCTIONS -----------------
// --------------------------------------------------------

/**
 * Load the initial scatter plot
 */
function loadScatterPlot() {
  // add the title component
  const scat = document.getElementById("scatterDiv");
  const title = document.createElement("h3");
  title.innerHTML = "Scatter Plot";
  scat.appendChild(title);

  // get height and width information from the parent container
  let parent = d3.select("#scatterDiv").node().getBoundingClientRect();

  // calculate new child dimensions
  const margin = {
    top: 0.025 * parent.height,
    right: 0.1 * parent.width,
    bottom: 0.075 * parent.height,
    left: 0.1 * parent.width,
  };
  const width = 0.9 * parent.width;
  const height = 0.7 * parent.height;

  // create new SVG element
  const svg = d3
    .select("#scatterDiv")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // set the ranges
  const x = d3.scaleTime().range([0, width]); // based on time variable
  const y = d3.scaleLinear().range([height, 0]); // based on search variables

  // Scale the range of the data
  x.domain(
    d3.extent(data, function (d) {
      return d.Week;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return Math.max(d.javascript, d.python, d.java);
    }),
  ]);

  // define the 3 lines
  const redLine = d3
    .line()
    .x(function (d) {
      return x(d.Week);
    })
    .y(function (d) {
      return y(d.javascript);
    });

  const blueLine = d3
    .line()
    .x(function (d) {
      return x(d.Week);
    })
    .y(function (d) {
      return y(d.python);
    });

  const greenLine = d3
    .line()
    .x(function (d) {
      return x(d.Week);
    })
    .y(function (d) {
      return y(d.java);
    });

  // Add the 3 valueline paths
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "red")
    .attr("fill", "bisque")
    .attr("d", redLine)
    .on("mouseover", function (d) {
      // Get the position of the mouse cursor
      const [x, y] = d3.pointer(event, window);

      // Create a new element for the popup message
      const popup = d3
        .select("#scatterDiv")
        .append("div")
        .attr("class", "popup")
        .text(`JavaScript`);

      // offset from mouse
      popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
    })
    .on("mouseout", function () {
      // remove tooltip on mouseout
      d3.select(".popup").remove();
    });

  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "green")
    .attr("fill", "bisque")
    .attr("d", greenLine)
    .on("mouseover", function (d) {
      // Get the position of the mouse cursor
      const [x, y] = d3.pointer(event, window);

      // Create a new element for the popup message
      const popup = d3
        .select("#scatterDiv")
        .append("div")
        .attr("class", "popup")
        .text(`Java`);

      // offset from mouse
      popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
    })
    .on("mouseout", function () {
      // remove tooltip on mouseout
      d3.select(".popup").remove();
    });

  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "blue")
    .attr("fill", "bisque")
    .attr("d", blueLine)
    .on("mouseover", function (d) {
      // Get the position of the mouse cursor
      const [x, y] = d3.pointer(event, window);

      // Create a new element for the popup message
      const popup = d3
        .select("#scatterDiv")
        .append("div")
        .attr("class", "popup")
        .text(`Python`);

      // offset from mouse
      popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
    })
    .on("mouseout", function () {
      // remove tooltip on mouseout
      d3.select(".popup").remove();
    });

  // add the 3 scatter plots
  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 1.5)
    .attr("stroke", "red")
    .attr("fill", "red")
    .attr("cx", function (d) {
      return x(d.Week);
    })
    .attr("cy", function (d) {
      return y(d.javascript);
    })
    .on("mouseover", function (d) {
      // Get the position of the mouse cursor
      const [x, y] = d3.pointer(event, window);
      const oldDate = d.target.__data__.Week;

      // nicer format
      const date = new Date(oldDate).toISOString().substring(0, 10);

      // Create a new element for the popup message
      const popup = d3
        .select("#scatterDiv")
        .append("div")
        .attr("class", "popup");

      document.getElementsByClassName(
        "popup"
      )[0].innerHTML = `JavaScript<br>${d.target.__data__.javascript}<br>${date}`;

      // offset from mouse
      popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
    })
    .on("mouseout", function () {
      // remove tooltip on mouseout
      d3.select(".popup").remove();
    });

  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 1.5)
    .attr("stroke", "green")
    .attr("fill", "green")
    .attr("cx", function (d) {
      return x(d.Week);
    })
    .attr("cy", function (d) {
      return y(d.java);
    })
    .on("mouseover", function (d) {
      // Get the position of the mouse cursor
      const [x, y] = d3.pointer(event, window);
      const oldDate = d.target.__data__.Week;

      // nicer format
      const date = new Date(oldDate).toISOString().substring(0, 10);

      // Create a new element for the popup message
      const popup = d3
        .select("#scatterDiv")
        .append("div")
        .attr("class", "popup");

      document.getElementsByClassName(
        "popup"
      )[0].innerHTML = `Java<br>${d.target.__data__.java}<br>${date}`;
      // offset from mouse
      popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
    })
    .on("mouseout", function () {
      // remove tooltip on mouseout
      d3.select(".popup").remove();
    });

  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 1.5)
    .attr("stroke", "blue")
    .attr("fill", "blue")
    .attr("cx", function (d) {
      return x(d.Week);
    })
    .attr("cy", function (d) {
      return y(d.python);
    })
    .on("mouseover", function (d) {
      // Get the position of the mouse cursor
      const [x, y] = d3.pointer(event, window);
      const oldDate = d.target.__data__.Week;

      // nicer format
      const date = new Date(oldDate).toISOString().substring(0, 10);

      // Create a new element for the popup message
      const popup = d3
        .select("#scatterDiv")
        .append("div")
        .attr("class", "popup");

      document.getElementsByClassName(
        "popup"
      )[0].innerHTML = `Python<br>${d.target.__data__.python}<br>${date}`;

      // offset from mouse
      popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
    })
    .on("mouseout", function () {
      // remove tooltip on mouseout
      d3.select(".popup").remove();
    });

  // add the X Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the Y axis gridlines
  const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat("").ticks(10);
  svg.append("g").attr("class", "y axis-grid").call(yAxisGrid);

  // add the Y Axis
  svg.append("g").call(d3.axisLeft(y));
}

// --------------------------------------------------------
// ------------------ LOWER BAR FUNCTIONS -----------------
// --------------------------------------------------------

/**
 * Load the initial lower bar.
 */
function loadPieBar(info) {
  const pieBar = document.getElementById("pieBar");

  // Pie Chart
  plotPieChart();

  // Info section
  if (info) {
    makeInfo();
  }

  // Histogram
  plotHistogram();
}

/**
 * Average the total number of search hits on each language across all weeks
 * in data.json. Return the averages in a dictionary.
 */
function avgHistValues() {
  if (data === undefined) {
    return null;
  }

  let javascript = (python = java = 0);

  for (const obj in data) {
    javascript += data[obj].javascript;
    python += data[obj].python;
    java += data[obj].java;
  }

  // number of weeks to divide by
  const length = Object.keys(data).length;

  return {
    javascript: Math.round(javascript / length),
    python: Math.round(python / length),
    java: Math.round(java / length),
  };
}

/**
 * Return a formated popup string based on the avg data number.
 */
function popupMessage(avg) {
  if (avg === 20) {
    return "JavaScript: 20";
  }
  if (avg === 68) {
    return "Python: 68";
  }
  return "Java: 43";
}

/**
 * Plot the pie chart and append it to tje lower bar.
 */
function plotPieChart() {
  // get the required values
  const histValues = Object.values(avgHistValues());

  // get the parent container
  const pie = document.getElementById("pieDiv");

  // add the title text element
  const placeholder = document.createElement("h4");
  placeholder.classList.add("titleElement");
  placeholder.innerHTML = "Pie Chart";
  pie.appendChild(placeholder);

  // get height and width information from the parent container
  let parent = d3.select("#pieDiv").node().getBoundingClientRect();

  // set the dimensions of the SVG element
  const width = parent.width;
  const height = parent.height;
  const margin = {
    top: 0.05 * parent.height,
    right: 0.025 * parent.width,
    bottom: 0.1 * parent.height,
    left: 0.025 * parent.width,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2 - 1.5; // account for the stroke width on either side

  // create new SVG element and append to pieBar
  const svg = d3
    .select("#pieDiv")
    .append("svg")
    .attr("width", innerWidth)
    .attr("height", innerHeight);

  // add pie chart as child of SVG element
  const g = svg
    .append("g")
    .attr("transform", `translate(${innerWidth / 2}, ${innerHeight / 2})`);

  // function that will create pie chart from data
  const pieChart = d3
    .pie()
    .value((d) => d)
    .sort(null)
    .padAngle(0.1); // space between slices

  // arc generator for individual slices
  const arc = d3
    .arc()
    .innerRadius(radius / 3)
    .outerRadius(radius);

  // generate slices from data and append to pie chart
  const arcs = g
    .selectAll("arc")
    .data(pieChart(histValues))
    .enter()
    .append("g")
    .attr("class", "arc");

  // draw arc paths (actually draw arcs with colors)
  const colors = ["red", "blue", "green"];
  arcs
    .append("path")
    .attr("fill", (d, i) => colors[i])
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("d", arc)
    .on("mouseover", function (d) {
      // Get the position of the mouse cursor
      const [x, y] = d3.pointer(event, window);
      const dataNum = d.target.__data__.data;

      // Create a new element for the popup message
      const popup = d3
        .select("#pieDiv")
        .append("div")
        .attr("class", "popup")
        .text(`${popupMessage(dataNum)}`);

      // offset from mouse
      popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
    })
    .on("mouseout", function () {
      // remove tooltip on mouseout
      d3.select(".popup").remove();
    });
}

/**
 * Add the info section to the lower bar.
 */
function makeInfo() {
  const histValues = Object.values(avgHistValues());

  // remove info text and replace
  const info = document.getElementById("infoDiv");
  const header = document.createElement("h1");
  header.innerHTML = "Info";

  const description = document.createElement("p");
  description.innerHTML =
    "Average value of interest over duration of three years for three languages:";

  const list = document.createElement("ul");
  const js = document.createElement("li");
  js.innerHTML = `JavaScript: ${histValues[0]}`;
  const py = document.createElement("li");
  py.innerHTML = `Python: ${histValues[1]}`;
  const ja = document.createElement("li");
  ja.innerHTML = `Java: ${histValues[2]}`;

  // append all new elements
  info.appendChild(header);
  info.appendChild(description);
  info.appendChild(list);
  list.appendChild(js);
  list.appendChild(py);
  list.appendChild(ja);
}

/**
 * Plot the histogram and add it to the lower bar.
 */
function plotHistogram() {
  // get the required values
  const histValues = Object.values(avgHistValues());

  // get the parent container
  const hist = document.getElementById("histDiv");

  // get height and width information from the parent container
  let parent = d3.select("#histDiv").node().getBoundingClientRect();

  // add the title text element
  const title = document.createElement("h4");
  title.innerHTML = "Histogram";
  title.classList.add("titleElement");
  hist.appendChild(title);

  // set the dimensions of the SVG element
  const width = 0.9 * parent.width;
  const height = 0.9 * parent.height;
  const margin = {
    top: 0.025 * parent.height,
    right: 0.025 * parent.width,
    bottom: 0.025 * parent.height,
    left: 0.025 * parent.width,
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // create new SVG element and append to pieBar
  const svg = d3
    .select("#histDiv")
    .append("svg")
    .attr("width", innerWidth)
    .attr("height", height);

  // create the x-axis
  const xScale = d3
    .scaleBand()
    .domain(["Red", "Blue", "Green"])
    .range([0, innerWidth])
    .padding(0.1);

  // create the y-axis
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(histValues)])
    .range([innerHeight, 0]);

  // draw the rectangles
  svg
    .selectAll("rect")
    .data(histValues)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(["Red", "Blue", "Green"][i]))
    .attr("y", (d) => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => innerHeight - yScale(d))
    .attr("fill", (d, i) => ["red", "blue", "green"][i])
    .style("stroke", "black")
    .style("stroke-width", 3)
    .on("mouseover", function (d) {
      // Get the position of the mouse cursor
      const [x, y] = d3.pointer(event, window);
      const dataNum = d.target.__data__;

      // Create a new element for the popup message
      const popup = d3
        .select("#histDiv")
        .append("div")
        .attr("class", "popup")
        .text(`${popupMessage(dataNum)}`);

      // offset from mouse
      popup.style("left", x + 10 + "px").style("top", y - 10 + "px");
    })
    .on("mouseout", function () {
      // remove tooltip on mouseout
      d3.select(".popup").remove();
    });
}
