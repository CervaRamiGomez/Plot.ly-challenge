//giving the dropdown menu functionality
function dropDownMenu() {
    var menu = d3.select("#selDataset");

   const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
   d3.json(url).then(function(data) {
       var sampleName = data.names;
       sampleName.forEach((name) => {
           menu
           .append("option")
           .text(name)
           .property("value", name);                
       });

       //set default
       const defaultSample = sampleName[0];
       demoTable(defaultSample);
       charting(defaultSample);
   });
    };

function optionChanged(sampleName) {
   
   demoTable(sampleName)
   charting(sampleName);
}

function demoTable(sampleName) {
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

   d3.json(url).then((data) => {
       var tabInfo = data.metadata;
       console.log(tabInfo)
       var filtered = tabInfo.filter(x => x.id == sampleName)[0];
       console.log(filtered)
       var tablegraphic = d3.select("#sample-metadata");
       tablegraphic.html("")
       
       Object.entries(filtered).forEach(([key,value]) => {
           var row = tablegraphic.append('tr');
           var cell = tablegraphic.append('td');
           cell.text(key.toLowerCase() + `: ${value}`)
           var cell = row.append('td');
           
       });
   });
}

// Set up charts information
function charting(sampleName) {
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

   d3.json(url).then((data) => {
       var tabInfo = data.samples;
       var filtered = tabInfo.filter(x => x.id.toString() === sampleName)[0];
       console.log(filtered)
       var otu_ids = filtered.otu_ids;
       var otu_labels = filtered.otu_labels
       var sample_values = filtered.sample_values;
       
       //bar chart
       var trace1 = {
           type: "bar",
           orientation: "h",
           x: sample_values.slice(0,10).reverse(),
           y: otu_ids.slice(0,10).map(x => `OTU ${x}`).reverse(),
       };

       var data1 = [trace1];

       var layout1 = {
           title: "Bar Chart Top 10 OTU",
           xaxis: { title: "" },
           yaxis: { title: "" }
       };
       Plotly.newPlot("bar", data1, layout1);

       // Bubble Chart
       var desired_maximum_marker_size= 20;
       var size = sample_values
       var trace2 = {
           x: otu_ids,
           y: sample_values,
           mode: 'markers',
           text: otu_labels,
           marker: {
               size: sample_values,              
               color: otu_ids,
               colorscale: "Earth"            }
       };

       var data2 = [trace2];

       var layout2 = {
           title: 'Bubble Chart',
           margin: { t: 25, r: 25, l: 25, b: 25 },
           showlegend: false,
           hovermode: 'closest',
           xaxis: {
            title:"OTU ID " + sampleName
        },
         
        margin: {t:50}
        
}
    
    Plotly.newPlot("bubble", data2, layout2);


    // Gauge Chart
    var metatabInfo = data.metadata;
   
    var metafiltered = metatabInfo.filter(x => x.id == sampleName)[0];

    
    var degrees = 180-(metafiltered.wfreq*18);

  radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'category',
x: [0], y:[0],
 marker: {size: 28, color:'850000'},
 showlegend: false,
 name: 'speed',
 text: metafiltered.wfreq,
 hoverinfo: 'text+name'},
{ values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
rotation: 90,
text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
textinfo: "text",
textposition: "inside",
marker: {
 colors: [
   "rgba(0, 105, 11, .5)",
   "rgba(10, 120, 22, .5)",
   "rgba(14, 127, 0, .5)",
   "rgba(110, 154, 22, .5)",
   "rgba(170, 202, 42, .5)",
   "rgba(202, 209, 95, .5)",
   "rgba(210, 206, 145, .5)",
    "rgba(232, 226, 202, .5)",
    "rgba(240, 230, 215, .5)",
    "rgba(255, 255, 255, 0)"
    ]
  },
  labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],

  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing Frequency' ,
  height: 500,
  width: 600,
    xaxis: {type:'category',zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {type:'category',zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};


Plotly.newPlot('gauge', data, layout);



   });
}


//initialize Dashboard
dropDownMenu();