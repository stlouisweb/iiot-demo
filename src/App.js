import React, {Component} from 'react';
import Tabs from './tabs';
import './App.css';
import '../lib/mqttws31';
const config = require('../public/config.json');
/* global Paho */

let dirty = false;
const manifolds = {};

function bytesToNumber(buffer) {
  //const bytes = buffer; // for testing
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;
  return bytes.reduce(
    (result, byte, index) =>
      result + byte * Math.pow(256, len - index - 1),
    0);
}

class App extends Component {
  constructor() {
    super();

    React.setState = this.setState.bind(this);

    this.state = {
      alerts: [{id: 1, x: 610, y: 380}],
      limits: {cycles: 1000},
      filter: 'leak-fault',
      manifolds,
      selectedTab: 'department',
      selectedValve: null
    };
  }

  pahoSetup() {
    const clientId = `id${Date.now()}`;
    const client = new Paho.MQTT.Client(config.ip, config.port, clientId);

    client.onMessageArrived = message => {
      const topic = message.destinationName;
      const [deviceType, manifoldId, valveId, field] = topic.split('/');

      if (deviceType !== 'manifold') return;

      //console.log(`App.js x: field = "${field}"`);
      const prop =
        //field === 'ValveFault' ? 'fault' :
        field === 'ValueFault' ? 'fault' : // note typo in field name
        field === 'PressureFault' ? 'pressureFault' :
        field === 'LeakFault' ? 'leak' :
        field === 'LifeCycleCount' ? 'cycles' :
        null;
      //console.log('App.js pahoSetup: prop =', prop);

      if (!prop) return;

      const isLifeCycle = field === 'LifeCycleCount';

      const payloadBytes = isLifeCycle ? message.payloadBytes : [];
      //console.log('App.js x: payloadBytes =', payloadBytes);
      const payloadString = isLifeCycle ? '' : message.payloadString;
      //console.log('App.js x: payloadString =', payloadString);

      const value =
        field === 'ValveFault' ? payloadString === 'True' :
        field === 'PressureFault' ?
          payloadString === 'Low' || payloadString === 'High' :
        field === 'LeakFault' ? payloadString === 'True' :
        field === 'LifeCycleCount' ? bytesToNumber(payloadBytes) :
        null;
      const update = {[prop]: value};
      console.log('manifold', manifoldId, 'valve', valveId, update);
      this.updateValve(manifoldId, valveId, update);
    };

    // Documentation on the message object is at
    // https://www.eclipse.org/paho/files/jsdoc/symbols/Paho.MQTT.Message.html#duplicate
    client.connect({
      onSuccess: () => {
        console.log('App.js x: connected');
        client.subscribe('#');
      }
    });
  }

  componentDidMount() {
    this.updateValve(42, 0, {
      cycles: 1000,
      fault: false,
      leak: false,
      pressure: false
    });
    this.updateValve(42, 1, {
      cycles: 999,
      fault: false,
      leak: true,
      pressure: false
    });
    this.updateValve(42, 4, {
      cycles: 998,
      fault: true,
      leak: false,
      pressure: false
    });
    this.updateValve(42, 5, {
      cycles: 997,
      fault: false,
      leak: false,
      pressure: true
    });

    this.pahoSetup();

    setInterval(
      () => {
        if (dirty) {
          dirty = false;
          this.setState({manifolds});
        }
      },
      500);
  }

  updateValve(manifoldId, valveId, changes) {
    let valves = manifolds[manifoldId];
    if (!valves) valves = manifolds[manifoldId] = [];
    const valve = valves[valveId] || {manifoldId, valveId};
    valves[valveId] = Object.assign(valve, changes);
    dirty = true;
  }

  render() {
    const {
      alerts, filter, limits, manifolds, selectedTab, selectedValve
    } = this.state;
    return (
      <div className="app">
        <Tabs
          alerts={alerts}
          filter={filter}
          limits={limits}
          manifolds={manifolds}
          selectedTab={selectedTab}
          selectedValve={selectedValve}
        />
        <img alt="OCI logo" src="../images/oci-logo.png"/>
      </div>
    );
  }
}

export default App;
