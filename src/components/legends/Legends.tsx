import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import * as models from '../../models/Chart';
import Legend from './Legend';
import Marker from './Marker';

function Legends({ chart }: { chart: models.Chart }) {
  const legendsClass = !chart.editCode ? 'no-edit' : '';

  function sortedSeries() {
    const series = chart.series.slice(0);
    series.sort((a, b) => a.business.localeCompare(b.business));
    return series;
  }

  return (
    <div id="legends" className={legendsClass}>
      {sortedSeries().map(serie => (
        <Legend
          key={serie.business}
          serie={serie}
          selected={chart.series.indexOf(serie) === chart.series.length - 1}
        />
      ))}
      {chart.editCode && (
        <Tooltip title="Click to add a new value curve">
          <div
            className="legend new-legend"
            ng-click="!chart.editCode || showAddDialog($event, 'serie')"
          >
            <Marker serie={chart.getUnusedSerie()} />
            <span className="title">New</span>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export default Legends;
