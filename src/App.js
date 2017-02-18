import React, {Component} from 'react';
import Tabs from './tabs';
import './App.css';
import '../lib/mqttws31';
const config = require('../public/config.json');
//const config = {ip: '192.168.3.10', port: 9001};
/* global Paho */

const MAX_PRESSURES = 25;
const manifolds = {};
let dirty = false;

function bytesToNumber(buffer) {
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;
  return bytes.reduce(
    (result, byte, index) =>
      result + byte * Math.pow(256, len - index - 1),
    0);
}

function isBoolean(field) {
  return ['LeakFault', 'ValueFault'].includes(field);
}

function isBytes(field) {
  return [
    'DurationOfLast1_2Signal',
    'DurationOfLast1_4Signal',
    'EqualizationAveragePressure',
    'EqualizationPressureRate',
    'LifeCycleCount',
    'ManifoldSerialNumber',
    'ResidualOfDynamicAnalysis',
    'SupplyPressure',
    'ValveSerialNumber'
  ].includes(field);
}

function getValue(field, string, bytes) {
  return isBoolean(field) ? string === 'True' :
    isBytes(field) ? bytesToNumber(bytes) :
    field === 'PressureFault' ? string === 'Low' || string === 'High' :
    null;
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
    console.log('App.js: config =', config);
    const client = new Paho.MQTT.Client(config.ip, config.port, clientId);

    client.onMessageArrived = message => {
      const topic = message.destinationName;

      const [deviceType, manifoldId, stationNumber, field] = topic.split('/');

      if (deviceType !== 'manifold') return;

      //console.log(`App.js x: field = "${field}"`);
      const prop =
        field === 'DurationOfLast1_2Signal' ? 'durationLast12' :
        field === 'DurationOfLast1_4Signal' ? 'durationLast14' :
        field === 'LeakFault' ? 'leakFault' :
        field === 'LifeCycleCount' ? 'cycles' :
        field === 'PressureFault' ? 'pressureFault' :
        field === 'StationNumber' ? 'station' :
        field === 'SupplyPressure' ? 'pressure' :
        //field === 'ValveFault' ? 'fault' :
        field === 'ValueFault' ? 'fault' : // note typo in field name
        field === 'ValveSerialNumber' ? 'valveSerialId' :
        null;
      //console.log('App.js pahoSetup: prop =', prop);

      if (!prop) return;

      const value = getValue(
        field, message.payloadString, message.payloadBytes);
      console.log('topic:', topic, 'value:', value);

      const update = {[prop]: value};
      //console.log('manifold', manifoldId, 'valve', stationNumber, update);
      this.updateValve(manifoldId, stationNumber, update);
    };

    // Documentation on the message object is at
    // https://www.eclipse.org/paho/files/jsdoc/symbols/Paho.MQTT.Message.html#duplicate
    client.connect({
      onSuccess: () => {
        client.subscribe('#');
      }
    });
  }

  componentDidMount() {
    this.updateValve(4, 0, {
      cycles: 1000,
      fault: false,
      leakFault: false,
      pressureFault: false
    });
    this.updateValve(4, 1, {
      cycles: 999,
      fault: false,
      leakFault: true,
      pressureFault: false
    });
    this.updateValve(4, 4, {
      cycles: 998,
      fault: true,
      leakFault: false,
      pressureFault: false
    });
    this.updateValve(4, 5, {
      cycles: 997,
      fault: false,
      leakFault: false,
      pressureFault: true
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

  updateValve(manifoldId, stationNumber, changes) {
    let valves = manifolds[manifoldId];
    if (!valves) valves = manifolds[manifoldId] = [];
    const valve = valves[stationNumber] || {manifoldId, stationNumber};

    const {pressure} = changes;
    if (pressure !== undefined) {
      let {pressures} = valve;
      if (!pressures) {
        const initial = [];
        initial.length = MAX_PRESSURES;
        initial.fill(0, 0, MAX_PRESSURES);
        pressures = valve.pressures = initial;
      }
      pressures.push(pressure);
      if (pressures.length > MAX_PRESSURES) pressures.shift();
    }

    valves[stationNumber] = Object.assign(valve, changes);
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
        <img alt="OCI logo" className="oci-logo" src="../images/oci-logo.png"/>
      </div>
    );
  }
}

export default App;
