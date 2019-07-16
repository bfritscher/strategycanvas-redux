import React from 'react';
import * as models from '../../models/Chart';

function Marker(props: any) {
  const serie = props.serie;
  return (
    <div className="marker" onClick={props.onClick}>
      <svg width="100%" height="100%">
        <path
          d="m0,16h36"
          className="dash"
          strokeDasharray={serie.dash}
          stroke={serie.color}
          fill={serie.color}
        />
        <path
          transform="translate(18,15.5) scale(1.4)"
          d={models.symbolsPaths[serie.symbol]}
          stroke={serie.color}
          fill={serie.color}
        />
      </svg>
    </div>
  );
}

export default Marker;
