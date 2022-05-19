<template>
  <div id="controlsDiv">
    <button-comp
      :css-variables="buttonCssVariables"
      @button-comp-clicked="loadData"
    >
      Load Data
    </button-comp>
    
    <input-comp
      heading="N Bins"
      input-type="number"
      :input-value="nbins_value"
      input-size="50"
      @input-comp-value-changed="value => {nbins = value}"
    />

    <input-comp
      heading="XMIN:"
      input-type="number"
      :input-value="xmin_value"
      input-size="50"
      @input-comp-value-changed="value => {xmin = value}"
    />

    <input-comp
      heading="XMAX:"
      input-type="number"
      :input-value="xmax_value"
      input-size="50"
      @input-comp-value-changed="value => {xmax = value}"
    />
  </div>
  
  <div v-if="chartData">
    <histogram-comp-d3
      :chart-data="chartData"
      x-var="arr_delay"
      title="Distribution of Airline Flight Arrival Delays"
      sub-title="Data source: flights14_reduced.csv"
      x-label="Delay (in minutes)"
      y-label="Count"
      :height="height"
      :x-min="xmin"
      :x-max="xmax"
      :n-bins="nbins"
      :y-tics="ytics"
      @histogram-comp-bins="nbinsChanged"
      @histogram-comp-xmin="xminChanged"
      @histogram-comp-xmax="xmaxChanged"
    />
  </div>
</template>

<script>
import HistogramCompD3 from 'histogramcompd3';
import ButtonComp from 'buttoncomp'
import InputComp from 'inputcomp';
import {csv} from "d3-fetch";

export default {
  name: 'App',
  components: {
    HistogramCompD3,
    ButtonComp,
    InputComp
  },
  data() {
    return {
      chartData: null,
      height: 700,
      nbins: null,
      xmin: null,
      xmax: null,
      nbins_value: null,
      xmin_value: null,
      xmax_value: null,
      ytics: this.getYtics(),
      buttonCssVariables: {
        button_comp_font_size: '1.2rem',
        button_comp_background: 'linear-gradient(to bottom, #a3ff33 0, #3cc72a 13%, #2eba1e 33%, #4bba37 64%, #4bba37 100%)',
        button_comp_hover_background: 'linear-gradient(to bottom, #a3ff33 0, #4bba37 100%)'
      }
    };
  },
  methods: {
    async loadData() {
      this.chartData =  await csv('flights14_reduced.csv');
    },
    getYtics: function(){
      const ytics = new Array(16);
      let val = 0;
      for(let i=0; i < 16; i++){
        ytics[i] = val;
        val += 200;
      }
      return(ytics);
    },
    nbinsChanged: function(value){
      this.nbins_value = value;
    },
    xminChanged: function(value){
      this.xmin_value = value;
    },
    xmaxChanged: function(value){
      this.xmax_value = value;
    }
  }
};
</script>

<style scoped>
  #controlsDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 1100px;
    margin-top: 20px;
  }
</style>