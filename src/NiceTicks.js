/**
 * Created by Rick on 2022-05-18.
 */
'use strict';
export default class NiceTicks {
  constructor(min, max, maxTicks) {
    this.min = min;
    this.max = max;
    this.maxTicks = maxTicks;
  }

  niceNumber(range, round){
    const exp = Math.floor(Math.log10(range));
    const frac = range / Math.pow(10, exp);
    let niceFrac;
    if(round){
      if(frac < 1.5) niceFrac = 1
      else if(frac <= 3) niceFrac = 2
      else if(frac <= 7) niceFrac = 5
      else niceFrac = 10;
    }else {
      if(frac < 1) niceFrac = 1
      else if(frac <= 2) niceFrac = 2
      else if(frac <= 5) niceFrac = 5
      else niceFrac = 10;
    }
    return (niceFrac * Math.pow(10, exp))
  }

  calculate(){
    const range = this.niceNumber(this.max - this.min, false);
    const tickSpacing = this.niceNumber(range / (this.maxTicks - 1), true);
    const niceMin = Math.floor(this.min / tickSpacing) * tickSpacing;
    const niceMax = Math.ceil(this.max / tickSpacing) * tickSpacing;

    return({
      tickSpacing: tickSpacing,
      niceMin: niceMin,
      miceMax: niceMax
    })
  }
}