import React, {Component} from 'react';

class Filters extends Component {

  onClick = event => {
    const {id} = event.target;
    console.log('filters.js onClick: id =', id);
  };

  render() {
    return (
      <div className="filters">
        <button
          className="filter-btn"
          id="leak-fault"
          onClick={this.onClick}
        >
          Leak Fault
        </button>
        <button
          className="filter-btn fault"
          id="valve-fault"
          onClick={this.onClick}
        >
          Valve Fault
        </button>
        <button
          className="filter-btn"
          id="pressure-fault"
          onClick={this.onClick}
        >
          Pressure Fault
        </button>
        <button
          className="filter-btn"
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
