import React from 'react';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Create from '@material-ui/icons/Create';
import * as models from '../../models/Chart';
import Marker from './Marker';

const dashs: string[] = ['0', '5,5', '10,10', '20,10,5,5,5,10'];

function Legend({
  serie,
  selected
}: {
  serie: models.Serie;
  selected?: boolean;
}) {
  const [isHover, setHover] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  function handleMarkerClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className={selected ? 'legend selected' : 'legend'}>
      <div
        className="selector"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        ng-click="chart.manualMoveSerieToTop(serie)"
      >
        <Create style={{ color: selected || isHover ? serie.color : '' }} />
      </div>
      <Marker onClick={handleMarkerClick} serie={serie} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <div className="markerEditor clearfix">
          <Grid container wrap="wrap">
            {models.colors.map(color => (
              <div
                key={color}
                aria-label="color"
                className={serie.color === color ? 'color selected' : 'color'}
                style={{ backgroundColor: color }}
                onClick={() => {serie.color=color}}
              />
            ))}
          </Grid>
          <Grid container wrap="wrap">
            {models.symbols.map(symbol => (
              <div
                key={symbol}
                aria-label="symbol"
                className={serie.symbol === symbol ? 'color selected' : 'color'}
                onClick={() => {serie.symbol = symbol}}
              >
                <svg width="100%" height="100%" viewBox="-8 -8 16 16">
                  <path
                    d={models.symbolsPaths[symbol]}
                    stroke={serie.color}
                    fill={serie.color}
                  />
                </svg>
              </div>
            ))}
            {dashs.map(dash => (
              <div
                key={dash}
                aria-label="dash"
                className={serie.dash === dash ? 'color selected' : 'color'}
                onClick={()=> {serie.dash=dash}}
              >
                <svg width="100%" height="100%" viewBox="0 0 32 32">
                  <path
                    d="m0,16h64"
                    className="dash"
                    strokeDasharray={dash}
                    stroke={serie.color}
                    fill={serie.color}
                  />
                </svg>
              </div>
            ))}
          </Grid>
        </div>
      </Popover>
      <span
        className="title"
        ng-click="!chart.editCode || showRemoveDialog($event, 'serie', serie)"
      >
        {serie.business}
      </span>
    </div>
  );
}

export default Legend;
