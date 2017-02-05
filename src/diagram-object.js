import React, {Component, PropTypes as t} from 'react';
import {
  getCenter, getCenterOfMany, getRectangle, getTransform
} from './polygons';
import mapN from './map-n';
import {valveHasFault} from './faults';

const VALVE_HEIGHT = 18; //25;
const VALVE_SPACING = 3;
const VALVE_WIDTH = 5; //7;

export const instancePropType = t.shape({
  id: t.number,
  location: t.shape({x: t.number, y: t.number}).isRequired,
  angle: t.number,
  text: t.string
});

class DiagramObject extends Component {

  static propTypes = {
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
    limits: t.object.isRequired,
    manifoldId: t.number,
    manifolds: t.object
  };

  getManifold = () => {
    const {filter, height, instance, limits, manifolds} = this.props;
    const {angle, location, manifoldId, valveCount} = instance;
    const manifold = manifolds[manifoldId];

    const dx = location.x;
    const dy = location.y;

    // Get the polygons for each of the valves in this manifold.
    const valvePolygons = mapN(valveCount, index => {
      const valveDx = index * (VALVE_WIDTH + VALVE_SPACING);
      const minX = dx + valveDx;
      const minY = height - dy;
      return getRectangle(minX, minY, VALVE_WIDTH, -VALVE_HEIGHT);
    });

    // Get the transformation to be applied to this manifold.
    const [centerX, centerY] = getCenterOfMany(valvePolygons);

    return (
      <g
        className="manifold"
        key={manifold}
        transform={getTransform(angle, centerX, centerY)}
      >
        {
          mapN(valveCount, index => {
            const valveId = `manifold${manifoldId}-valve${index + 1}`;

            const valve = manifold && manifold[index];
            const cssClass =
              valveHasFault(limits, filter, valve) ? 'alert' : '';

            return (
              <polygon
                className={`valve ${cssClass}`}
                id={valveId}
                key={valveId}
                onClick={this.onValveClick}
                points={valvePolygons[index]}
              />
            );
          })
        }
      </g>
    );
  }

  /**
   * The location for text should be its center.
   * This makes rotation work as expected.
   */
  getText = () => {
    const {height, instance} = this.props;
    const {angle, location, text} = instance;
    const pieces = text.split('\n');
    const {x, y} = location;
    const yFlipped = height - y;
    return (
      <text
        className="diagram-text"
        dominantBaseline="central"
        textAnchor="middle"
        transform={getTransform(angle, x, yFlipped)}
        x={x}
        y={yFlipped}
      >
        {
          pieces.map((piece, index) =>
            <tspan key={index} x={location.x} dy={index * 7}>
              {piece}
            </tspan>)
        }
      </text>
    );
  };

  onValveClick = event => {
    const {id} = event.target;
    const match = /^manifold(\d+)-valve(\d+)$/.exec(id);
    const [, manifoldId, valveId] = match;

    const {manifolds} = this.props;
    const manifold = manifolds[manifoldId];
    const valve = manifold[valveId - 1];
    console.log('diagram-object.js onValveClick: valve =', valve);
    React.setState({selectedValve: valve});
  };

  render() {
    const {definition, height, instance} = this.props;
    const {manifoldId, text} = instance;

    if (manifoldId) return this.getManifold();

    if (text) return this.getText();

    const {type} = definition;

    if (type === 'polygon') {
      const {angle, location} = instance;
      const dx = location.x;
      const dy = location.y;
      const points = definition.points.map(([x, y]) =>
        [x + dx, height - (y + dy)]);
      const [centerX, centerY] = getCenter(points);

      return (
        <g>
          <polygon
            className="polygon"
            points={points}
            transform={getTransform(angle, centerX, centerY)}
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
  }
}

export default DiagramObject;
