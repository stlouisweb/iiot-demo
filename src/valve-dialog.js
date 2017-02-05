import React, {Component, PropTypes as t} from 'react';
import Dialog from './dialog';
import {LineChart, Themes} from 'formidable-charts';

function getChartSeries() {
  const SERIES_COUNT = 3;
  const DATA_POINTS = 10;
  const MAX_Y = 30;

  const chartSeries = [];
  for (let seriesNumber = 0; seriesNumber < SERIES_COUNT; seriesNumber++) {
    const data = [];
    for (let x = 0; x < DATA_POINTS; x++) {
      data.push({x, y: Math.random() * MAX_Y});
    }
    chartSeries.push({data});
  }

  return chartSeries;
}

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
        title={`Valve ${valve.valveId}`}
      >
        {
          pairs.map((pair, index) =>
            <div key={index}>
              <label>{pair.label}:</label>
              <div className="dialog-value">{getValue(pair.property)}</div>
            </div>)
        }

        <LineChart series={getChartSeries()} theme={Themes.dark} x="x" y="y"/>
      </Dialog>
    );
  }
}

export default ValveDialog;
