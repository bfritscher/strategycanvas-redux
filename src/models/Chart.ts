import * as d3 from 'd3';
export interface Serie {
  business: string;
  color: string;
  symbol: string;
  dash: string;
  offerings: { [s: string]: number };
}

function getUniqueName(name:string, list:string[]){
  var count = 1;
  while(list.length > 0 && list.indexOf(name + ' ' + count) > -1){
    count++;
  }
  return name + ' ' + count;
}

export const colors = d3.scaleOrdinal(d3.schemeCategory10).range();

export const symbols = [
  'circle',
  'diamond',
  'square',
  'star',
  'triangle',
  'wye'
];

export const SymbolsLookup: { [s: string]: d3.SymbolType } = {
  circle: d3.symbolCircle,
  cross: d3.symbolCross,
  diamond: d3.symbolDiamond,
  square: d3.symbolSquare,
  star: d3.symbolStar,
  triangle: d3.symbolTriangle,
  wye: d3.symbolWye
};

export const symbolsPaths:{[s: string]:string} = symbols.reduce((all:{[s: string]:string}, name:string) => {
  all[name] = d3.symbol().type(SymbolsLookup[name])() || '';
  return all;
}, {});

export class Chart {
  title:string;
  factors:string[];
  editCode:boolean;
  series:Serie[];

  constructor({ factors, editCode, series, title}:{factors?:string[], editCode:boolean, series?:Serie[], title?:string}) {
    this.factors = factors || [];
    this.editCode = editCode || false;
    this.series = series || [];
    this.title = title || 'New Chart'
  }

  addOffering(factorName:string, value:number) {
    // add to first existing series which does not have an offering for this factor
    for (var i = this.series.length - 1; i >= 0; i--) {
      if (!this.series[i].offerings.hasOwnProperty(factorName)) {
        // self.notifyOfferingChange(self.series[i], factorName, value);
        // log.event('offering', 'add', self.editCode);
        this.series[i].offerings[factorName] = value
        return;
      }
    }
    const series = this.addSeries();
    series[0].offerings[factorName] = value
    // or create a new Serie
    //var series = self.notifySerieAdd();
    // log.event('serie', 'autoadd', self.editCode);
  }

  removeOffering(serie:Serie, factorName:string) {
    delete serie.offerings[factorName];
  }

  /**
   * Add one or more series to chart.
   * If name already exists it is skipped.
   *
   * @param names list of names one per line
   * @returns list of series added
   */
  addSeries(names?:string){
    if(!names){
      names = this.getUniqueBusinessName();
    }
    const lines = names.split(/\r\n|\r|\n/);

    const addedSeries:Serie[] = [];
    lines.forEach((business) => {
      if(business !== '' && this.businessNotInUse(business)){
        const serie = this.getUnusedSerie(business);
        this.series.push(serie);
        addedSeries.push(serie);
        // log.event('serie', 'add', self.editCode);
      }
    });
    return addedSeries;
  }

  businessNotInUse(value:string) {
    return this.series.every((serie) => serie.business !== value);
  }

  factorNotInUse(value:string) {
    return !this.factors.includes(value);
  }

  getUnusedColor(symbol?:string) {
    let series = this.series;
    if(symbol){
      series = series.filter((serie) => serie.symbol === symbol);
    }
    const usedColors = series.map((serie) => serie.color);
    for(const color of colors){
      if(!usedColors.includes(color)){
        return color;
      }
    }
    return;
  }

  getUnusedMarker() {
    // first get color across any symbol
    let color = this.getUnusedColor();
    if (color){
      return {color: color, symbol: symbols[0], dash: '0'};
    }
    // for symbol get free color
    for(const symbol of symbols){
      color = this.getUnusedColor(symbol);
      if(color !== undefined){
        return {color: color, symbol: symbol, dash: '0'};
      }
    }
    //default
    return {color: colors[0], symbol: symbols[0], dash: '0'};
  }

  getUniqueBusinessName() {
    if (this.series.length === 0){
      return 'Business';
    }
    return getUniqueName('Competitor', this.series.map((serie) => serie.business));
  }

  getUnusedSerie(business?:string) {
    return Object.assign({
      offerings: {},
      business: business || this.getUniqueBusinessName()
    },
    this.getUnusedMarker());
  }

}
