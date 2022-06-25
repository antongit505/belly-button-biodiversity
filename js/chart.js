function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample = sampleArray.filter( sampleObj => sampleObj.id == sample);
    //console.log("La variable desiredSample es", desiredSample)
    //  5. Create a variable that holds the first sample in the array.
    var result_id = desiredSample[0]
    //console.log("La variable result es", result_id)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = result_id.otu_ids;
    var otuLabels = result_id.otu_labels;
    var sampleValues = result_id.sample_values;

    //######## BAR CHART########//
    // 7. Create the yticks for the bar chart.
    var yticks = otuID.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [
      {y : yticks,
       x : sampleValues.slice(0,10).reverse(),
       text: otuLabels.slice(0,10).reverse(),
       type: "bar",
       orientation : "h",
       marker: {
        color: 'rgba(58, 153, 115, 0.662)'
       }
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "Top 10 Bacteria Cultures Found",
              font:{
                family: 'Kdam Thmor Pro, sans-serif',
                size: 24
                    }
              },
      margin: { t: 50, l: 150 }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    //##############BUBBLE CHART##################//
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuID,
        size: sampleValues
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title :{ text:'Bacteria Cultures per Sample',
                font:{
                  family: 'Kdam Thmor Pro, sans-serif',
                  size: 24
                      }
              },
      margin: { t: 50, l:100 },
      xaxis: { title:{
                text: "OTU ID",
                font:{
                family: 'Arial, serif',
                size: 18,
                color: 'black' },
                }
              },
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    //#####GAUGE CHART######//

    var metadata = data.metadata;
    var resultMetadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var resultMeta = resultMetadataArray[0];
    var wfreq = resultMeta.wfreq
   
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x:[0,1], y:[0,1]},
      value: wfreq,
      title:{text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
              font:{
                family: 'Kdam Thmor Pro, sans-serif',
                size: 22
                    }       
    },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        steps: [
        { range: [0, 2], color: 'rgba(237, 127, 127, 0.785)' },
        { range: [2,4], color: "rgba(253, 186, 99, 0.785)"},
        { range: [4,6], color: " rgba(235, 235, 95, 0.836)"},
        { range: [6,8], color: "rgba(58, 153, 115, 0.662)"},
        { range: [8, 10], color: "rgba(153, 240, 109, 0.854)" } ],
        axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
        bar:{color: 'rgba(69, 126, 248, 0.854)'}
      },  
    } ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400,
      height: 600,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: {color: "black",family:'Kdam Thmor Pro, sans-serif'}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);

  });

  };

  

