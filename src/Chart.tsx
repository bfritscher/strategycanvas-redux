import * as React from 'react';
import * as d3 from 'd3';
import $ from 'jquery';
import './Chart.css';
import * as models from './models/Chart';

function useHookWithRefCallback(chart:models.Chart) {
  const [ref, setRef] = React.useState<Element | null | undefined>(null);
  const [redraw, setRedraw] = React.useState<any>({ redraw: true });

  React.useEffect(() => {
    if (!ref) return;
    console.log('useEffect Chart');
    type Point = [number, number];
    const profile = {
      markerSize: 10
    };
/* todo fix state?
    let oldFactors: string[] = [];
    let seriesOrder = '';
    let lastClickTimeStamp = 0;
*/

    const elm = $(ref);

    /*
    TODO FIX
  $(elm).mousewheel(function(event, delta) {
    elm[0].scrollLeft -= (delta * 30);
        event.preventDefault();
    });
  */

    //root svg
    let svg;
    let $svg = elm.find('svg');

    //d3js ordinal scale only works on simple array
    let factorNames: Array<string> = chart.factors.slice(0);

    // TODO: let delay = oldFactors.length > factorNames.length ? 500 : 0;
    // delay standard transitions if delete factor

    //62 = 10 20 1 svg 1 20 10
    //container_height - 42 = svg
    //margins top, right, bottom left
    var m = [2, chart.editCode ? 100 : 2, 100, 42];
    var w = Math.max(100 * factorNames.length + 1, 1000) - m[1] - m[3];
    //var h = Math.max(430, Math.min(600, $('#mychart').height()-85)) - m[0] - m[2];
    var h = Math.max(430, Math.min(600, 0)) - m[0] - m[2];
    if ($svg.length === 0) {
      h = 430 - m[0] - m[2];
    }

    var x = d3
      .scaleBand()
      .domain(factorNames)
      .range([0, w]);
    let y: {
      [s: string]: d3.ScaleLinear<number, number>;
    } = {};

    var line = d3.line();

    /* TODO
    var currentSeriesOrder = chart.series.map(serie => serie.business).join('');
    var doTransition =
      oldFactors.length > 0 &&
      seriesOrder === currentSeriesOrder &&
      (oldFactors.length !== factorNames.length ||
        oldFactors.join('') === factorNames.join(''));
    */
    /*
    TODO FIX
  if(scope.remoteUpdate){
    scope.remoteUpdate = false;
    doTransition = true;
  }
  */

    function updateBandingBackground(factorName: string) {
      var i = factorNames.indexOf(factorName);
      return ['#e5f3ff', '#fff'][i % 2];
    }
    function updateBandingBackgroundAdd(reverse?: boolean) {
      var i = factorNames.length;
      if (reverse) {
        i++;
      }
      return ['#f2f9ff', '#f9f9f9'][i % 2];
    }

    // Returns the path for a given data point.
    function path(serie: models.Serie | any) {
      var points: Point[] = [];
      factorNames.forEach(function(factoreName) {
        if (
          serie.offerings.hasOwnProperty(factoreName) &&
          serie.offerings[factoreName] !== undefined
        ) {
          //TODO handle animation of drag?
          points.push([
            (x(factoreName) || 0) + x.bandwidth() / 2,
            y[factoreName](serie.offerings[factoreName])
          ]);
        }
      });
      return line(points);
    }

    function maybeTransiton(
      selection: d3.Selection<any, any, any, any>,
      additionalCondition?: boolean
    ) {
      return selection
      /* TODO
      if (
        doTransition &&
        (additionalCondition === undefined || additionalCondition)
      ) {
        return selection
          .transition()
          .delay(delay)
          .duration(500);
      }
      return selection;
      */
    }

    // Create a scale for each trait.
    factorNames.forEach(function(factorName) {
      y[factorName] = d3
        .scaleLinear()
        .domain([-0.1, 1.1])
        .range([h, 0]);
    });
    // elm.dragscrollable();
    if ($svg.length === 0) {
      svg = d3
        .select(elm[0])
        .append('svg:svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .append('svg:g')
        .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');
    } else {
      svg = d3
        .select(elm[0])
        .select('svg')
        .select('g');
    }
    d3.select(elm[0])
      .select('svg')
      .attr('width', w + m[1] + m[3])
      .attr('height', h + m[0] + m[2]);

    if (chart.editCode) {
      var addFactorGroup = svg.select('g.addfactor');
      if (addFactorGroup.node() === null) {
        addFactorGroup = svg
          .append('svg:g')
          .attr('class', 'addfactor no-select')
          .on('click', function() {
            // TODO FIX scope.showAddDialog(d3.event, 'factor');
          });

        addFactorGroup
          .append('svg:rect')
          .attr('class', 'backgroundFactor')
          .attr('x', 0)
          .attr('y', 0);

        addFactorGroup
          .append('svg:text')
          .attr('class', 'mdi mdi-plus')
          .attr('style', 'font-size:140px; fill: #adc8e3')
          .text('\uf415');
      }

      addFactorGroup
        .select('rect')
        .attr('width', 100)
        .attr('height', h)
        .style('fill', updateBandingBackgroundAdd());

      addFactorGroup
        .select('text')
        .attr('transform', 'translate(0, 0)')
        .attr('x', -20)
        .attr('y', h / 2 + 50);

      addFactorGroup.attr('transform', 'translate(' + (w + 2) + ')');
    }

    //legend background
    var legendBackground = svg.select('rect.legendbackground');
    if (legendBackground.node() === null) {
      legendBackground = svg
        .append('svg:rect')
        .attr('class', 'legendbackground')
        .attr('x', 0)
        .attr('height', m[2]);
    }
    legendBackground.attr('width', w).attr('y', h);

    //border
    var backBorder = svg.select('rect.border');
    if (backBorder.node() === null) {
      backBorder = svg
        .append('svg:rect')
        .attr('class', 'border')
        .attr('x', -1)
        .attr('y', -1);

      if (chart.editCode) {
        svg
          .append('svg:text')
          .attr('class', 'addfactorhelp')
          .attr('x', 100)
          .attr('style', 'font-size:100px;fill:#fbfbfb')
          .text('Add a factor');

        svg
          .append('svg:text')
          .attr('class', 'mdi mdi-arrow-right-bold addfactorhelparrow')
          .attr('x', 680)
          .attr('style', 'font-size:80px;fill:#fbfbfb')
          .text('\uf140');
      }
    }

    svg
      .select('.addfactorhelp')
      .attr('y', h / 2 + 30)
      .style('fill', factorNames.length > 0 ? '#fbfbfb' : '#adc8e3');

    svg
      .select('.addfactorhelparrow')
      .attr('y', h / 2 + 30)
      .style('fill', factorNames.length > 0 ? '#fbfbfb' : '#adc8e3');

    //animate only on delete delete
    maybeTransiton(backBorder) //TODO: , oldFactors.length > factorNames.length)
      .attr('width', w + 2)
      .attr('height', h + 2);

    var mainAxis = svg.select('g.mainaxis');
    if (mainAxis.node() === null) {
      mainAxis = svg
        .append('svg:g')
        .attr('class', 'mainaxis no-select')
        .attr('transform', 'translate(-40)');

      mainAxis
        .append('svg:text')
        .attr('x', 0)
        .attr('y', 14)
        .text('High');

      mainAxis
        .append('svg:text')
        .attr('class', 'l-offering')
        .text('Offerings');

      mainAxis
        .append('svg:text')
        .attr('class', 'l-factor')
        .text('Factors of Competition');

      mainAxis
        .append('svg:text')
        .attr('class', 'l-low')
        .attr('x', 0)
        .text('Low');
    }
    mainAxis
      .select('.l-offering')
      .attr('transform', 'rotate(-90, 14, ' + (h / 2 + 29) + ')')
      .attr('x', 14)
      .attr('y', h / 2 + 29);

    mainAxis
      .select('.l-factor')
      .attr('x', w / 2 - 30)
      .attr('y', h + m[2]);

    mainAxis.select('.l-low').attr('y', h - 2);

    //background
    var backgroundGroup = svg.select('.background');
    if (backgroundGroup.node() === null) {
      backgroundGroup = svg.append('svg:g').attr('class', 'background');
    }

    //add background by name
    var backgroundFactor = backgroundGroup
      .selectAll('.backgroundFactor')
      .data(factorNames);

    backgroundFactor = backgroundFactor
      .enter()
      .append('svg:rect')
      .attr('class', 'backgroundFactor')
      .attr('x', w)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', h)
      .merge(backgroundFactor) //update
      .style('fill', updateBandingBackground);

    maybeTransiton(backgroundFactor)
      .attr('x', factorName => x(factorName) || 0)
      .attr('width', x.bandwidth())
      .attr('height', h);

    // Add foreground lines.
    var foreground: any = svg.select('g.foreground');
    if (foreground.empty()) {
      foreground = svg.append('svg:g').attr('class', 'foreground');
    }
    var svgPath = foreground.selectAll('.line').data(chart.series);

    svgPath = svgPath
      .enter()
      .append('svg:path')
      .attr('class', 'line')
      .attr('stroke-dasharray', (serie: models.Serie) => serie.dash)
      .style('stroke', (serie: models.Serie) => serie.color)
      .merge(svgPath);
    //update
    maybeTransiton(svgPath)
      .attr('d', path)
      .attr('stroke-dasharray', serie => serie.dash)
      .style('stroke', serie => serie.color);

    svgPath
      .exit()
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();

    //factors groupHolder
    var factorGroup = svg.select('.factorGroup');
    //other more d3js ways possible?
    if (factorGroup.node() === null) {
      factorGroup = svg.append('svg:g').attr('class', 'factorGroup');
    }

    // Add a group element for each trait.
    var factorContainer = factorGroup.selectAll('.factor').data(factorNames);
    var factorContainerEnter = factorContainer
      .enter()
      .append('svg:g')
      .attr('class', 'factor no-select')
      //appear from the right
      .attr('transform', function() {
        return 'translate(' + w + ')';
      });

    //invisible rect to force size of group and be draggable?
    factorContainerEnter
      .append('svg:rect')
      .attr('class', 'factorSize')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', h);

    const factorDomain = factorContainerEnter
      .append('svg:g')
      .attr('class', 'axis')
      .append('svg:rect')
      .attr('class', 'domain')
      .attr('y', function(factorName) {
        return y[factorName](1) - 25;
      })
      .attr('width', 50)
      .attr('height', function(factorName) {
        return 50 + y[factorName](0) - y[factorName](1);
      })
      .on('mousedown', function() {
        d3.event.stopPropagation();
      });

    //Add an axis and title.
    if (chart.editCode) {
      const addOfferingHandler = function(this: any, factorName: string) {
        if (d3.event.type === 'touchstart') {
          d3.event.stopPropagation();
        }
        /*TODO
        if (d3.event.timeStamp - lastClickTimeStamp < 300) {
          return false;
        }
        lastClickTimeStamp = d3.event.timeStamp;
        */

        /*
        TODO: FIX?
          if ($(this).data('already')) {
                $(this).data('already', false);
                return false;
            } else if (d3.event.type === 'touchstart') {
                $(this).data('already', true);
            }
            */
        const pos = d3.event.changedTouches
          ? d3.touches(this, d3.event.changedTouches)[0]
          : d3.mouse(this);
        const v = Math.max(0, Math.min(1, y[factorName].invert(pos[1])));
        chart.addOffering(factorName, v);
        setRedraw({ redraw: true });
        console.log(factorName);
      };

      factorDomain
        .on('touchstart', addOfferingHandler)
        .on('click', addOfferingHandler);
    }

    factorContainerEnter
      .select('.axis')
      .append('svg:foreignObject')
      .attr('class', 'xlegend-wrapper')
      .attr('y', h + 20)
      .attr('width', 0)
      .attr('height', 50) //TODO: custom height?
      .append('xhtml:body')
      .attr('xmlns', 'http://www.w3.org/1999/xhtml')
      .append('xhtml:div')
      .attr('class', 'xlegend')
      .text(String)
      .on('mousedown', function() {
        d3.event.stopPropagation();
      })
      .on('touchstart', function() {
        d3.event.stopPropagation();
      })
      .on('mouseup', function(factorName: string) {
        if (chart.editCode) {
          //TODO fix scope.showRemoveDialog(d3.event, 'factor',factorName);
        }
      });

    factorContainer = factorContainerEnter.merge(factorContainer);

    factorContainer
      .select('.xlegend-wrapper')
      .attr('width', function() {
        return x.bandwidth();
      })
      .attr('y', h + 20);

    factorContainer
      .select('.factorSize')
      .attr('width', x.bandwidth())
      .attr('height', h);

    var domainWidth = Math.max(50, x.bandwidth() / 3);

    factorContainer
      .select('.domain')
      .attr('y', function(factorName) {
        return y[factorName](1) - 25;
      })
      .attr('x', (x.bandwidth() - domainWidth) / 2)
      .attr('width', domainWidth)
      .attr('height', function(factorName) {
        return 50 + y[factorName](0) - y[factorName](1);
      });

    factorContainer
      .exit()
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();
    backgroundFactor
      .exit()
      .transition()
      .duration(500)
      .attr('width', 0)
      .attr('x', function(this: any) {
        return parseFloat(d3.select(this).attr('x')) + x.bandwidth() / 2;
      })
      .remove();

    //handle factor dragging right-left
    if (chart.editCode) {
      var isDraging = false;
      factorContainerEnter.call(
        d3
          .drag<any, any>()
          .subject(factorName => {
            return {
              x: x(factorName as string),
              y: null
            };
          })
          .on('start', function(this: any, factorName: string) {
            isDraging = false;

            var i = factorNames.indexOf(factorName);
            //move to top visible
            var node = d3.select(this).node();
            if (node && node.parentNode) {
              node.parentNode.appendChild(node);
            }
            const node2 = backgroundGroup.node() as Element;
            if (node2) {
              const factorRect: any = backgroundFactor.nodes()[i];
              if (factorRect) {
                node2.appendChild(factorRect);
              }
            }
          })
          .on('drag', function(factorName: string) {
            if (
              !isDraging &&
              Math.abs((x(factorName) || 0) - d3.event.x) < 30
            ) {
              return;
            }
            isDraging = true;
            const currentX: {[s:string]:number} = factorNames.reduce((currentX: {[s:string]:number}, factorName) => {
              currentX[factorName] = x(factorName) || 0;
              return currentX;
            }, {});
            currentX[factorName] = d3.event.x;
            factorNames.sort((a, b) => currentX[a] - currentX[b]);
            x.domain(factorNames).range([0, w]);
            const dragX = d3.event.x;

            foreground.selectAll('.foreground .line').attr('d', path);

            factorContainer
              .filter(':last-child')
              .attr('transform', 'translate(' + dragX + ')');
            factorContainer
              .filter(':not(:last-child)')
              .transition()
              .duration(200)
              .ease(d3.easeLinear)
              .attr('transform', function(d) {
                return 'translate(' + x(d) + ')';
              });

            backgroundFactor.style('fill', updateBandingBackground);
            backgroundFactor.filter(':last-child').attr('x', dragX).style('fill', '#90caf9');
            backgroundFactor
              .filter(':not(:last-child)')
              .transition()
              .duration(200)
              .ease(d3.easeLinear)
              .attr('x', (d: any) => x(d) || 0);
          })
          .on('end', function() {
            isDraging = false;
            x.domain(factorNames).range([0, w]);
            backgroundFactor.style('fill', updateBandingBackground);
            var t = d3.transition().duration(500);
            t.selectAll('.factor').attr('transform', function(d: any) {
              return 'translate(' + (x(d) || 0) + ')';
            });

            backgroundGroup
              .selectAll('.backgroundFactor')
              .attr('x', function(factorName: any) {
                return x(factorName) || 0;
              });
            t.selectAll('.foreground .line').attr('d', path);
            t.transition().on('end', () => {
              console.log('end');
              if (factorNames.join('') !== chart.factors.join('')) {
                // TODO FIX chart.notifyFactorsChange(factorNames);
                // log.event('factor', 'dragged', chart.editCode);
                chart.factors = factorNames.slice(0);
                setRedraw({redraw: true});
              }
            });
          })
      );
    } //end edit

    maybeTransiton(factorContainer).attr('transform', function(factorName) {
      return 'translate(' + x(factorName) + ')';
    });

    //add offering onto domain axis

    var marker = factorContainer.selectAll('.dot').data(function(factorName) {
      var points: any[] = [];
      chart.series.forEach(function(serie) {
        if (
          serie.offerings.hasOwnProperty(factorName) &&
          serie.offerings[factorName] !== undefined
        ) {
          points.push({ factorName: factorName, serie: serie });
        }
      });
      return points;
    });
    var markerEnter = marker
      .enter()
      .append('svg:g')
      .attr('class', 'dot')
      .attr('transform', function(d) {
        return (
          'matrix(0, 0, 0, 0, ' +
          x.bandwidth() / 2 +
          ', ' +
          y[d.factorName](d.serie.offerings[d.factorName]) +
          ')'
        );
      });
    markerEnter
      .transition()
      .duration(500)
      .ease(d3.easeElastic)
      .attr('transform', function(d) {
        return (
          'matrix(1, 0, 0, 1, ' +
          x.bandwidth() / 2 +
          ', ' +
          y[d.factorName](d.serie.offerings[d.factorName]) +
          ')'
        );
      });

    markerEnter.append('svg:path');

    markerEnter
      .append('svg:rect')
      .attr('x', -25)
      .attr('width', 50)
      .attr('y', -25)
      .attr('height', 50);

    marker.exit().remove();

    marker = markerEnter.merge(marker);

    maybeTransiton(marker.select('path'))
      .attr('d', function(d) {
        return d3
          .symbol()
          .type(() => models.SymbolsLookup[d.serie.symbol])
          .size(() => profile.markerSize * 10)();
      })
      .style('fill', function(d) {
        return d.serie.color;
      });

    if (chart.editCode) {
      markerEnter
        .select('rect')
        .attr('x', -domainWidth / 2)
        .attr('width', domainWidth);
      marker.call(
        d3
          .drag<any, any>()
          .subject(function(point: any) {
            return {
              y: y[point.factorName](point.serie.offerings[point.factorName])
            };
          })
          .on('start', function(point: any) {
            //make dragged serie top one
            var index =
              foreground
                .selectAll('.line')
                .data()
                .indexOf(point.serie) + 1;
            foreground
              .node()
              .appendChild(
                foreground.select('.line:nth-child(' + index + ')').node()
              );
            d3.selectAll('.dot').each(function(this: any, p: any) {
              if (p.serie === point.serie) {
                this.parentNode.appendChild(this);
              }
            });

            d3.event.sourceEvent.stopPropagation(); //we do not want to start drag on factor
          })
          .on('drag', function(this: any, point: any) {
            var v = y[point.factorName].invert(d3.event.y);
            if (v < -0.05 && v >= -0.1) {
              point.serie.offerings[point.factorName] = v;
              d3.select(this)
                .attr('transform', function(d: any) {
                  return (
                    'matrix(1, 0, 0, 1,' +
                    x.bandwidth() / 2 +
                    ',' +
                    y[d.factorName](d.serie.offerings[d.factorName]) +
                    ')'
                  );
                })
                .select('path')
                .attr('d', function(d: any) {
                  return d3
                    .symbol()
                    .type(models.SymbolsLookup[d.serie.symbol])
                    .size(function() {
                      return (profile.markerSize * 10 * (0.15 + v)) / 0.1;
                    })();
                });
            } else if (v < -0.1) {
              point.serie.offerings[point.factorName] = -1;
              d3.select(this)
                .attr('transform', function() {
                  return 'matrix(1, 0, 0, 1,' + x.bandwidth() / 2 + ',0)';
                })
                .select('path')
                .attr('d', function(d: any) {
                  return d3
                    .symbol()
                    .type(models.SymbolsLookup[d.serie.symbol])
                    .size(function() {
                      return 0;
                    })();
                });
            } else {
              point.serie.offerings[point.factorName] = Math.max(
                0,
                Math.min(1, v)
              );
              d3.select(this).attr('transform', function(d: any) {
                return (
                  'matrix(1, 0, 0, 1,' +
                  x.bandwidth() / 2 +
                  ',' +
                  y[d.factorName](d.serie.offerings[d.factorName]) +
                  ')'
                );
              });
              foreground.selectAll('.foreground .line').attr('d', path);
            }
          })
          .on('end', function(point: any) {
            //normalize value if set
            if (point.serie.offerings[point.factorName] === -1) {
              //TODO fix chart.notifyOfferingChange(point.serie, point.factorName, point.serie.offerings[point.factorName]);
              chart.removeOffering(point.serie, point.factorName);
              setRedraw({ redraw: true });
              //log.event('offering', 'remove', chart.editCode);
            } else {
              point.serie.offerings[point.factorName] = Math.max(
                0,
                Math.min(1, point.serie.offerings[point.factorName])
              );
              setRedraw({ redraw: true });
              // TODO fix chart.notifyOfferingChange(point.serie, point.factorName, point.serie.offerings[point.factorName]);
            }
          })
      );
    }

    maybeTransiton(marker).attr('transform', function(d) {
      return (
        'matrix(1, 0, 0, 1, ' +
        x.bandwidth() / 2 +
        ', ' +
        y[d.factorName](d.serie.offerings[d.factorName]) +
        ')'
      );
    });

    //save length to determine if we want transitions or not next time
    /*
    oldFactors = factorNames.slice(0);
    seriesOrder = chart.series
      .map(function(serie) {
        return serie.business;
      })
      .join('');
      */
    return () => {
      // cleanup
    };
  }, [ref, redraw, chart]);

  return [setRef];
}

const Chart = (props:{chart:models.Chart}) => {
  const [ref] = useHookWithRefCallback(props.chart);

  return <div ref={ref} id="mychart" />;
};

export default Chart;
