import React, {Component, PropTypes as t} from 'react';
import {anyHasFault} from './faults';

class Filters extends Component {
  static propTypes = {
    filter: t.string,
    manifolds: t.object
  };

  cssClasses = thisFilter => {
    const {filter, manifolds} = this.props;
    const c1 = thisFilter === filter ? 'depressed-btn' : '';
    const c2 = anyHasFault(thisFilter, manifolds) ? 'alert' : '';
    return `${c1} ${c2}`;
  }

  onClick = event => {
    const {id} = event.target;
    console.log('filters.js onClick: id =', id);
    React.setState({filter: id});
  };

  render() {
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
        <button
          className={`toggle-btn ${this.cssClasses('pressure-fault')}`}
          id="pressure-fault"
          onClick={this.onClick}
        >
          Pressure Fault
        </button>
        <button
          className={`toggle-btn ${this.cssClasses('lifecycle')}`}
          id="lifecycle"
          onClick={this.onClick}
        >
          Lifecycle
        </button>
      </div>
    );
  }
}

export default Filters;
