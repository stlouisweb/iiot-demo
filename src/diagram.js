import React, {Component, PropTypes as t} from 'react';
import DiagramObject, {instancePropType} from './diagram-object';
const svgPanZoom = require('svg-pan-zoom');

const PADDING = 10;

class Diagram extends Component {
  static propTypes = {
    shapes: t.shape({
      definitions: t.object,
      height: t.number,
      instances: t.arrayOf(instancePropType),
      width: t.number
    })
  };

  componentDidUpdate() {
    const svg = document.querySelector('.diagram');
    if (svg) svgPanZoom(svg, {controlIconsEnabled: true});
  }

  render() {
    const {definitions, height, instances, width} = this.props.shapes;
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
                height={height}
                instance={instance}
                key={instance.id}
              />
            );
          })
        }
      </svg>
    );
  }
}

export default Diagram;
