import React, {Component} from 'react';
import Tabs from './tabs';
import './App.css';

class App extends Component {
  constructor() {
    super();

    React.setState = this.setState.bind(this);

    this.state = {
      filter: 'leak-fault',
      manifolds: {},
      selectedTab: 'department'
    };
  }

  componentDidMount() {
    this.updateValve(9, 0, {
      cycles: 101,
      fault: false,
      leak: false,
      pressure: 0
    });
    this.updateValve(9, 1, {
      cycles: 0,
      fault: true,
      leak: false,
      pressure: 0
    });
    this.updateValve(9, 2, {
      cycles: 0,
      fault: false,
      leak: true,
      pressure: 0
    });
    this.updateValve(9, 3, {
      cycles: 0,
      fault: false,
      leak: false,
      pressure: 101
    });
  }

  updateValve(manifoldId, valveIndex, changes) {
    this.setState(state => {
      const {manifolds} = state;
      const valves = manifolds[manifoldId];
      const valve = valves[valveIndex];
      valves[valveIndex] = Object.assign(valve, changes);
      return {manifolds};
    });
  }

  render() {
    const {filter, manifolds, selectedTab} = this.state;
    return (
      <div className="App">
        <Tabs
          filter={filter}
          manifolds={manifolds}
          selectedTab={selectedTab}
        />
      </div>
    );
  }
}

export default App;
