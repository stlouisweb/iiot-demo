import React, {Component, PropTypes as t} from 'react';
import Dialog from './dialog';

class ValveDialog extends Component {
  static propTypes = {
    valve: t.object,
  };

  closeDialog = () => React.setState({selectedValve: null});

  render() {
    const {valve} = this.props;
    if (!valve) return null;

    const pairs = [
      {label: 'Station #', property: 'stationId'},
      {label: 'Manifold Serial #', property: 'manifoldId'},
      {label: 'Valve Serial #', property: 'valveId'},
      {label: 'Valve Fault', property: 'fault'},
      {label: 'Leak Fault', property: 'leak'},
      {label: 'Pressure Fault', property: 'pressureFault'},
      {label: 'Lifecycle Count', property: 'cycles'},
      {label: 'Supply Pressure', property: 'pressure'},
      {label: 'Duration Last 1-4', property: 'duration14'},
      {label: 'Duration Last 1-2', property: 'duration12'},
      {label: 'Equalization Avg. Pressure', property: 'eqAvgPressure'},
      {label: 'Equalization Pressure Rate', property: 'eqPressureRate'},
      {label: 'Residual Dynamic Analysis', property: 'resDynAnalysis'}
    ];
    const dialogButtons = [
      {label: 'OK', onClick: this.closeDialog}
    ];

    function getValue(property) {
      const value = valve[property];
      return typeof value === 'boolean' ?
        value ? 'Yes' : 'No' :
        value;
    }

    return (
      <Dialog
        buttons={dialogButtons}
        className="valve-dialog"
        onClose={this.closeDialog}
        show={valve !== null}
        size="small"
        title={`Valve ${valve.id}`}
      >
        {
          pairs.map((pair, index) =>
            <div key={index}>
              <label>{pair.label}:</label>
              <div className="dialog-value">{getValue(pair.property)}</div>
            </div>)
        }
      </Dialog>
    );
  }
}

export default ValveDialog;
