import React, {Component, PropTypes as t} from 'react';
import DiagramObject, {instancePropType} from './diagram-object';
import mapN from './map-n';
const svgPanZoom = require('svg-pan-zoom');

const PADDING = 10;

class Diagram extends Component {
  static propTypes = {
    filter: t.string.isRequired,
    limits: t.object.isRequired,
    manifolds: t.object,
    shapes: t.shape({
      definitions: t.object,
      height: t.number,
      instances: t.arrayOf(instancePropType),
      width: t.number
    })
  };

  componentDidMount() {
    const svg = document.querySelector('.diagram');
    if (svg) svgPanZoom(svg, {controlIconsEnabled: true});

    // Update state with manifold details.
    const {instances} = this.props.shapes;
    const manifoldInstances =
      instances.filter(instance => instance.defId === 'manifold');
    const manifolds = manifoldInstances.reduce(
      (manifoldMap, manifold) => {
        const valves = mapN(manifold.valveCount, () => ({
          cycles: 0,
          fault: false,
          leak: false,
          pressure: 0
        }));

        manifoldMap[manifold.id] = valves;
        return manifoldMap;
      },
      {});
    React.setState({manifolds});
  }

  render() {
    const {filter, limits, manifolds, shapes} = this.props;
    const {definitions, height, instances, width} = shapes;
    const viewBox =
      `${-PADDING} ${-PADDING} ${width + PADDING} ${height + PADDING}`;
    console.log('diagram.js render: viewBox =', viewBox);
    return (
      <svg className="diagram" viewBox={viewBox}>
        {
          instances.map(instance => {
            const definition = definitions[instance.defId];
            return (
              <DiagramObject
                definition={definition}
                filter={filter}
                height={height}
                instance={instance}
                key={instance.id}
                limits={limits}
                manifolds={manifolds}
              />
            );
          })
        }
      </svg>
    );
  }
}

export default Diagram;
