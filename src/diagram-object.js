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
    console.log('diagram-object.js x: points =', points);
    const [centerX, centerY] = getCenter(points);
    console.log('diagram-object.js x: centerX =', centerX);
    console.log('diagram-object.js x: centerY =', centerY);
    const transform = rotate ? `rotate(${rotate}, ${centerX}, ${centerY})` : '';

    return (
      <g>
        <polygon
          points={points}
          style={polygonStyle}
          transform={transform}
        />
      </g>
    );
  }

  return <text>unsupported type {type}</text>;
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
