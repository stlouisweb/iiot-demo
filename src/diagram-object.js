import React, {PropTypes as t} from 'react';
import {getCenter} from './polygons';

const polygonStyle = {
  fill: 'white', // 'none',
  stroke: 'blue',
  strokeWidth: 2
};

const DiagramObject = ({definition, height, instance}) => {
  const {type} = definition;

  if (type === 'polygon') {
    const {location, rotate} = instance;
    const dx = location.x;
    const dy = location.y;
    const points = definition.points.map(([x, y]) =>
      [x + dx, height - (y + dy)]);
    const [centerX, centerY] = getCenter(points);
    const transform = rotate ? `rotate(${rotate}, ${centerX}, ${centerY})` : '';

    return (
      <g>
        <polygon
          points={points}
          style={polygonStyle}
          transform={transform}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    );
  } else if (type === 'image') {
    const {height, ref, width} = definition;
    const {location} = instance;
    const {x, y} = location;
    return <image href={ref} x={x} y={y} height={height} width={width}/>;
  } else {
    return <text>unsupported type {type}</text>;
  }
};

export const instancePropType = t.shape({
  defId: t.string.isRequired,
  id: t.number.isRequired,
  location: t.shape({x: t.number, y: t.number}).isRequired,
  rotate: t.number
});

DiagramObject.propTypes = {
  definition: t.shape({
    height: t.number,
    points: t.arrayOf(t.arrayOf(t.number)),
    ref: t.string,
    type: t.string.isRequired,
    width: t.number
  }),
  height: t.number,
  instance: instancePropType
};

export default DiagramObject;
