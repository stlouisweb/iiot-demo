import React, {Component} from 'react';
import Tabs from './tabs';
import './App.css';

class App extends Component {
  constructor() {
    super();

    React.setState = this.setState.bind(this);

    this.state = {
      limits: {
        cycles: 1000,
        pressureMin: 500,
        pressureMax: 1000
      },
      filter: 'leak-fault',
      manifolds: {},
      selectedTab: 'department'
    };
  }

  componentDidMount() {
    this.updateValve(9, 0, {
      cycles: 1000,
      fault: false,
      leak: false,
      pressure: 400
    });
    this.updateValve(9, 1, {
      cycles: 999,
      fault: true,
      leak: false,
      pressure: 600
    });
    this.updateValve(9, 2, {
      cycles: 998,
      fault: false,
      leak: true,
      pressure: 900
    });
    this.updateValve(9, 3, {
      cycles: 997,
      fault: false,
      leak: false,
      pressure: 1001
    });
    this.updateValve(9, 4, {
      cycles: 0,
      fault: false,
      leak: false,
      pressure: 0
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
    const {filter, limits, manifolds, selectedTab} = this.state;
    return (
      <div className="App">
        <Tabs
          filter={filter}
          limits={limits}
          manifolds={manifolds}
          selectedTab={selectedTab}
        />
      </div>
    );
  }
}

export default App;
