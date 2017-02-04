import React, {PropTypes as t} from 'react';
import {getCenter} from './polygons';
import mapN from './map-n';
import {valveHasFault} from './faults';
console.log('diagram-object.js x: valveHasFault =', valveHasFault);

const VALVE_HEIGHT = 18; //25;
const VALVE_SPACING = 3;
const VALVE_WIDTH = 5; //7;

function getManifold(manifoldId, location, valveCount, manifolds, filter) {
  const manifold = manifolds[manifoldId];

  const dx = location.x;
  const dy = location.y;

  return (
    <g className="manifold">
      {
        mapN(valveCount, index => {
          const valveDx = index * (VALVE_WIDTH + VALVE_SPACING);
          const startX = dx + valveDx;
          const points = [
            [startX, dy],
            [startX, dy + VALVE_HEIGHT],
            [startX + VALVE_WIDTH, dy + VALVE_HEIGHT],
            [startX + VALVE_WIDTH, dy],
          ];
          const id = `manifold${manifoldId}-valve${index + 1}`;

          const valve = manifold && manifold[index];
          const cssClass = valveHasFault(filter, valve) ? 'alert' : '';
          return (
            <polygon
              className={`valve ${cssClass}`}
              id={id}
              key={id}
              points={points}
            />
          );
        })
      }
    </g>
  );
}

const DiagramObject = ({definition, filter, height, instance, manifolds}) => {
  if (instance.defId === 'manifold') {
    const {id, location, valveCount} = instance;
    return getManifold(id, location, valveCount, manifolds, filter);
  }

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
          className="polygon"
          points={points}
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
  filter: t.string,
  height: t.number,
  instance: instancePropType,
  manifolds: t.object
};

export default DiagramObject;
