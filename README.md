## histogram-comp-d3

**histogram-comp-d3** is a Vue.js(versioin >= 3.2) component that provides a histogram of data with reactivity for the number of bins and the minimum/maximum range for those bins. 

**histogram-comp-d3** can be installed via with the included `package.json` file for a local installation via the [npm install](https://docs.npmjs.com/cli/install.html "npm install") command.  **histogram-comp-d3** depends on the [vue.js](https://vuejs.org/ "Vue.js") framework.  A demo folder is provided that used [Parcel](https://parceljs.org/) together with its associated `package.json` file to bundle together  **histogram-comp-d3's** [github location](git+https://github.com/deandevl/HistogramCompD3.git) with its [vue.js](https://vuejs.org/ "Vue.js")  and [d3](https://github.com/d3/d3/blob/main/API.md) dependencies.  Further details are provided below for running the demo.

## Props ##

A prop in Vue.js is a custom attribute for passing information from a parent component hosting **histogram-comp-d3** instance(s) to a **histogram-comp-d3** as a child component. 

**histogram-comp-d3**  has the following props for a parent to bind and send information to:

`chartData` -- An array of javascript objects where the objects contain a specific variable name and its associated numeric value (Array, default: null, required).

`title` -- A string that sets the main title for the chart (String, default: null, optional).

`subtitle` -- A string that sets the sub title for the chart (String, default: null, optional).

`titlesColor`-- A string that sets the titles` color (String, default: '#000000', optional).

`xLabel` -- A string that sets the x-axis title (String, default: ' ', optional).

`yLabel` -- A string that sets the y-axis title (String, default: ' ', optional).

`ticColor` -- A string that sets the color for tic labels (String, default: '#000000', optional).

`barFill` -- A string that sets the fill color of the bars (String, default: '#69b3a2', optional).

`width` -- A numeric that sets the overall svg width of the chart (Number, default: 800. optional).

`height` -- A numeric that sets the overall svg height of the chart (Number, default: 650, optional).

`marginLeft` -- A numeric that sets the left margin (Number, default: 60, optional).

`marginTop` -- A numeric that sets the top margin (Number, default: 30, optional).

`marginBottom` -- A numeric that sets the bottom margin (Number, default: 50, optional).

`xVar` -- A string that sets the variable name defined in `chartData`'s  array of objects (String, default: null, required).

`xMin` -- A numeric that sets starting range for the chart's bins.  **histogram-comp-d3** immediately responds to a change in this value (Number, default: null, optional).

`xMax` -- A numeric that sets ending range for the chart's bins.  **histogram-comp-d3** immediately responds to a change in this value (Number, default: null, optional).

`nBins` -- A numeric that sets the number of bins to be displayed. **histogram-comp-d3** immediately responds to a change in this value (Number, default: null, optional).

`yTics` -- An array that sets the tics along the y axis. If `null` then d3 will compute the y axis tics (Array, default: null, optional).

## Events ##

**histogram-comp-d3** emits three events that notifies the parent component of the current input value.

**histogram-comp-d3** emits the following single named events to its parent:

```
'histogramCompBins' -- returns the current value of nBins when computed by d3
'histogramCompXmin' -- returns the current value of xMin when computed by d3
'histogramCompXmax' -- returns the current value of xMax when computed by d3
```

## Demonstration ##

A demonstration of **histogram-comp-d3** is provided in the [HistogramCompD3](git+https://github.com/deandevl/HistogramCompD3.git) repository by hosting the `index.html`file under the `dist-prod` folder.  The demo (templated in the `App.vue` file) hosts a histogram of commercial aircraft arrival delays that includes chart reactivity in the number of bins and the minimum/maximum range for the bins.

As a suggestion, install [http-server](https://www.npmjs.com/package/http-server "http-server") locally/globally via [npm](https://www.npmjs.com/ "npm") then enter the command `http-server`in the **histogram-comp-d3** `prod` directory.  From a browser enter the url: `localhost:8080/` to view the demo.