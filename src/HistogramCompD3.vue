<template>
  <div ref="chartDiv" />
</template>

<script>
import NiceTicks from './NiceTicks';
import {select} from 'd3-selection';
import {extent, histogram, max} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';

export default {
  name: 'HistogramCompD3',
  props: {
    chartData: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    subTitle: {
      type: String,
      default: null
    },
    titlesColor: {
      type: String,
      default: '#000000'
    },
    xLabel: {
      type: String,
      default: ''
    },
    yLabel: {
      type: String,
      default: ''
    },
    ticColor: {
      type: String,
      default: '#000000'
    },
    barFill: {
      type: String,
      default: '#69b3a2'
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 650
    },
    marginLeft: {
      type: Number,
      default:60
    },
    marginTop: {
      type: Number,
      default: 30
    },
    marginBottom: {
      type: Number,
      default: 50
    },
    xVar: {
      type: String,
      default: null
    },
    xMin: {
      type: Number,
      default: null
    },
    xMax: {
      type: Number,
      default: null
    },
    nBins: {
      type: Number,
      default: null
    },
    yTics: {
      type: Array,
      default: null
    }
  },
  emits: {
    'histogramCompBins': null,
    'histogramCompXmin': null,
    'histogramCompXmax': null
  },
  data() {
    return {
      svg: null,
      xAccessor: null,
      ctrGroup: null,
      ctrWidth: null,
      ctrHeight: null,
      xmin: null,
      xmax: null,
      nbins: null,
      bins: null,
      thresholdArr: null
    };
  },
  watch: {
    /*chartData(chartData){
      console.log(`chartData changed: ${chartData.length}`);
    },*/
    nBins(nBins){
      this.nbins = nBins;

      //console.log(`Bins changed: ${this.nbins}`);

      this.calculateThresholdArr(this.xmin,this.xmax,nBins);
      this.drawXaxis();
      this.drawYaxis();
      this.drawBars();
    },
    xMin(xMin){
      this.xmin = xMin;

      //console.log(`xMin changed: ${this.xmin}`);

      this.calculateThresholdArr(xMin, this.xmax, this.nbins);
      this.drawXaxis();
      this.drawYaxis();
      this.drawBars();
    },
    xMax(xMax){
      this.xmax = xMax;

      //console.log(`xMax changed: ${this.xmax}`);

      this.calculateThresholdArr(this.xmin, xMax, this.nbins);
      this.drawXaxis();
      this.drawYaxis();
      this.drawBars();
    }
  },
  mounted() {
    if(this.chartData === null){
      throw(new ReferenceError('Property chartData must be defined.'));
    }
    if(this.xVar === null){
      throw(new ReferenceError('Property xVar must be defined.'))
    }else {
      this.xAccessor = (d) => +d[this.xVar];
    }

    let binwidth;
    if(this.xMin === null || this.xMax === null) {
      const xExtent = extent(this.chartData, this.xAccessor);
      //console.log(`extent min: ${xExtent[0]} extent max: ${xExtent[1]}`);
      const niceTicks = new NiceTicks(xExtent[0], xExtent[1], 10);
      const ticksObj = niceTicks.calculate();

      this.xmin = ticksObj.niceMin;
      this.xmax = ticksObj.miceMax;
      binwidth = ticksObj.tickSpacing;
      this.nbins = (this.xmax - this.xmin) / binwidth;
      this.$emit('histogramCompBins', this.nbins);
      this.$emit('histogramCompXmin', this.xmin);
      this.$emit('histogramCompXmax', this.xmax);
    }else{
      this.xmin = this.xMin;
      this.xmax = this.xMax;
      this.nbins = this.nBins;
      binwidth = (this.xmax - this.xmin)/this.nbins;
    }

    //console.log(`xmin: ${this.xmin} xmax: ${this.xmax} nbins: ${this.nbins} binwidth: ${binwidth}`)

    this.calculateThresholdArr(this.xmin, this.xmax, this.nbins);

    this.drawTitles();
    this.drawXaxis();
    this.drawYaxis();
    this.drawBars();
  },
  methods: {
    // Create svg and add draw titles
    drawTitles: function(){
      const dimensions = {
        width: this.width,
        height: this.height,
        margin: {
          top: this.marginTop,
          bottom: this.marginBottom,
          left: this.marginLeft,
          right: 10
        }
      };

      this.svg = select(this.$refs.chartDiv)
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

      let currrentY = 0;
      if(this.title !== null){
        currrentY = currrentY + 40;
        this.svg.append('text')
          .attr('x', dimensions.width / 2)
          .attr('y', currrentY)
          .attr('fill', this.titlesColor)
          .text(this.title)
          .style('text-anchor', 'middle')
          .style('font-size', '28px')
          .style('font-weight', 'bold')
      }
      if(this.subTitle !== null){
        currrentY = currrentY + 25;
        this.svg.append('text')
          .attr('x', dimensions.width / 2)
          .attr('y', currrentY)
          .attr('fill', this.titlesColor)
          .text(this.subTitle)
          .style('text-anchor', 'middle')
          .style('font-size', '20px')
          .style('font-weight', 'bold')
      }
      // Define dimensions of graph area and create/locate associated group
      this.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
      this.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom - currrentY;

      this.ctrGroup = this.svg.append('g')
        .attr('id', 'ctrGroup')
        .attr(
          'transform',
          `translate(${dimensions.margin.left}, ${currrentY + dimensions.margin.top})`);
    },

    // Axes and Scales
    // X axis: scale and draw
    drawXaxis: function(){
      select("#xAxisGroup").remove();

      this.xScale = scaleLinear()
        .domain([this.xmin, this.xmax])
        .rangeRound([0, this.ctrWidth]);

      //console.log(`thresholdArr: ${this.thresholdArr}`);

      const xAxis = axisBottom(this.xScale)
        .tickValues(this.thresholdArr);

      const xAxisGroup = this.ctrGroup.append('g')
        .attr("id", "xAxisGroup")
        .style('transform', `translateY(${this.ctrHeight}px)`)
        .style('font-size', '12px')
        .call(xAxis);

      xAxisGroup.append('text')
        .attr('x', this.ctrWidth / 2)
        .attr('y', this.marginBottom - 10)
        .attr('fill', this.ticColor)
        .text(this.xLabel)
        .style('font-size', '16px')
        .style('font-weight', 'bold');

      const a_histogram = histogram()
        .value(this.xAccessor)
        .domain(this.xScale.domain())
        .thresholds(this.thresholdArr.slice(0, this.thresholdArr.length - 1));

      this.bins = a_histogram(this.chartData);
    },

    // Axes and Scales
    // Y axis: scale and draw
    drawYaxis: function(){
      select("#yAxisGroup").remove();

      let yAxisGroup;
      if(this.yTics === null){
        const ymax = max(this.bins, d => d.length);
        //console.log(`ymax: ${ymax}`)
        this.yScale = scaleLinear()
          .domain([0, ymax])
          .range([this.ctrHeight, 0]);
        yAxisGroup = this.ctrGroup.append('g')
          .attr("id", "yAxisGroup")
          .style('font-size', '12px')
          .call(axisLeft(this.yScale));
      }else {
        const lastIdx = this.yTics.length - 1;
        this.yScale = scaleLinear()
          .domain([this.yTics[0], this.yTics[lastIdx]])
          .range([this.ctrHeight, 0]);
        const yAxis = axisLeft(this.yScale)
          .tickValues(this.yTics);
        yAxisGroup = this.ctrGroup.append('g')
          .attr("id", "yAxisGroup")
          .style('font-size', '12px')
          .call(yAxis);
      }

      yAxisGroup.append('text')
        .attr('x', -this.ctrHeight / 2)
        .attr('y', -this.marginLeft + 15)
        .attr('fill', this.ticColor)
        .html(this.yLabel)
        .style('transform', 'rotate(270deg)')
        .style('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')

      yAxisGroup.style('color', this.ticColor)
    },

    drawBars: function(){
      select('#barsGroup').remove();

      const barsGroup = this.ctrGroup.append('g')
        .attr("id", "barsGroup")
      // Append bar rectangles
      const ctrHeight = this.ctrHeight;
      const xScale = this.xScale;
      const yScale = this.yScale;
      barsGroup.selectAll('rect')
        .data(this.bins)
        .join(
          enter => {
            return enter.append('rect')
          },
          exit => exit.remove()
        )
        .attr('x', 1)
        .attr('transform', function(d) {
          return `translate(${xScale(d.x0)}, ${yScale(d.length)})`
        })
        .attr('width', function(d) {
          return xScale(d.x1) - xScale(d.x0) - 1
        })
        .attr('height', function(d) {
          return ctrHeight - yScale(d.length)
        })
        .style('fill', this.barFill);
    },
    calculateThresholdArr: function(xmin, xmax, nbins){
      this.thresholdArr = new Array(nbins + 1);
      const binwidth = (xmax - xmin)/nbins;
      for (let i = 0; i < nbins + 1; i++) {
        this.thresholdArr[i] = xmin + binwidth * i
      }
    }
  }
};
</script>
