import React, {Component, PropTypes as t} from 'react';
import DiagramObject, {instancePropType} from './diagram-object';
import Dialog from './dialog';
import mapN from './map-n';
const svgPanZoom = require('svg-pan-zoom');

const PADDING = 10;

class Diagram extends Component {
  static propTypes = {
    filter: t.string.isRequired,
    limits: t.object.isRequired,
    manifolds: t.object,
    selectedValve: t.object,
    shapes: t.shape({
      definitions: t.object,
      height: t.number,
      instances: t.arrayOf(instancePropType),
      width: t.number
    })
  };

  closeDialog = () => React.setState({selectedValve: null});

  componentDidMount() {
    const svg = document.querySelector('.diagram-svg');
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
    const {filter, limits, manifolds, selectedValve, shapes} = this.props;
    const {definitions, height, instances, width} = shapes;
    const viewBox =
      `${-PADDING} ${-PADDING} ${width + PADDING} ${height + PADDING}`;
    console.log('diagram.js render: viewBox =', viewBox);

    const dialogButtons = [
      {label: 'OK', onClick: this.closeDialog}
    ];

    return (
      <div className="diagram">
        <Dialog
          buttons={dialogButtons}
          show={selectedValve !== null}
        >
          Describe the valve here!
        </Dialog>
        <svg className="diagram-svg" viewBox={viewBox}>
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
                  selectedValve={selectedValve}
                />
              );
            })
          }
        </svg>
      </div>
    );
  }
}

export default Diagram;
