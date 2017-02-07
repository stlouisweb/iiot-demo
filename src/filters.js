import React, {Component, PropTypes as t} from 'react';
import {anyHasFault} from './faults';

class Filters extends Component {
  static propTypes = {
    filter: t.string,
    limits: t.object,
    manifolds: t.object
  };

  cssClasses = thisFilter => {
    const {filter, limits, manifolds} = this.props;
    const c1 = thisFilter === filter ? 'depressed-btn' : '';
    const c2 = anyHasFault(limits, thisFilter, manifolds) ? 'alert' : '';
    return `${c1} ${c2}`;
  }

  onClick = event => {
    const {id} = event.target;
    React.setState({filter: id});
  };

  onLimitChange = (event, limitName) => {
    const {value} = event.target;
    React.setState(state => {
      const {limits} = state;
      limits[limitName] = value;
      return {limits};
    });
  };

  onCyclesChange = event => this.onLimitChange(event, 'cycles');
  //onPressureMinChange = event => this.onLimitChange(event, 'pressureMin');
  //onPressureMaxChange = event => this.onLimitChange(event, 'pressureMax');

  render() {
    const {limits} = this.props;

    return (
      <div className="filters">
        <button
          className={`toggle-btn ${this.cssClasses('leak-fault')}`}
          id="leak-fault"
          onClick={this.onClick}
        >
          Leak Fault
        </button>

        <button
          className={`toggle-btn ${this.cssClasses('valve-fault')}`}
          id="valve-fault"
          onClick={this.onClick}
        >
          Valve Fault
        </button>

        <div className="filter-row">
          <button
            className={`toggle-btn ${this.cssClasses('pressure-fault')}`}
            id="pressure-fault"
            onClick={this.onClick}
          >
            Pressure Fault
          </button>
          {/*
          <div>
            <label>Min:</label>
            <input
              className="form-control number-input"
              type="number"
              onChange={this.onPressureMinChange}
              value={limits.pressureMin}
            />
            <br/>
            <label>Max:</label>
            <input
              className="form-control number-input"
              type="number"
              onChange={this.onPressureMaxChange}
              value={limits.pressureMax}
            />
          </div>
          */}
        </div>
        <div className="filter-row">
          <button
            className={`toggle-btn ${this.cssClasses('lifecycle')}`}
            id="lifecycle"
            onClick={this.onClick}
          >
            Lifecycle
          </button>
          <label>Cycles:</label>
          <input
            className="form-control number-input"
            type="number"
            onChange={this.onCyclesChange}
            value={limits.cycles}
          />
        </div>
      </div>
    );
  }
}

export default Filters;
