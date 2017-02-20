import React, {Component} from 'react';

import Tabs from './tabs';
import './App.css';
import '../lib/mqttws31';
//const config = require('../public/config.json');
const config = {ip: '192.168.3.10', port: 9001};
console.log('App.js: config =', config);
/* global Paho */

const MAX_PRESSURES = 25;
const manifolds = {};
let dirty = false;

function bytesToNumber(buffer) {
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;
  return bytes.reduce(
    (result, byte, index) => result + byte * Math.pow(256, len - index - 1),
    0
  );
}

function isBoolean(field) {
  return ['LeakFault', 'ValueFault', 'ValveFault'].includes(field);
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

function isText(field) {
  return [
    'PartNumber',
  ].includes(field);
}

function getValue(field, message) {
  //console.log('App.js getValue: field =', field);
  if (isBoolean(field)) {
    return message.payloadString === 'True';
  } else if (isBytes(field)) {
    return bytesToNumber(message.payloadBytes);
  } else if (isText(field)) {
    return message.payloadString;
  } else if (field === 'PressureFault') {
    const string = message.payloadString;
    return string === 'Low' || string === 'High';
  } else {
    return null;
  }
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
    //console.log('App.js pahoSetup: entered');
    const clientId = `id${Date.now()}`;

    let client;

    function onConnectionLost() {
      console.log('Paho connection lost, reconnecting ...');
      connect();
    }

    const that = this;
    function onMessageArrived(message) {
      const topic = message.destinationName;
      //console.log('App.js onMessageArrived: topic =', topic);

      const [deviceType, manifoldId, stationNumber, field] = topic.split('/');

      if (deviceType !== 'manifold') return;

      //console.log(`App.js x: field = "${field}"`);
      const prop =
        //field === 'DurationOfLast1_2Signal' ? 'durationLast12' :
        //field === 'DurationOfLast1_4Signal' ? 'durationLast14' :
        field === 'LeakFault' ? 'leakFault' :
        field === 'LifeCycleCount' ? 'cycles' :
        field === 'PartNumber' ? 'partNumber' :
        field === 'PressureFault' ? 'pressureFault' :
        field === 'StationNumber' ? 'station' :
        field === 'SupplyPressure' ? 'pressure' :
        field === 'ValveFault' ? 'fault' :
        field === 'ValueFault' ? 'fault' : // note typo in field name
        field === 'ValveSerialNumber' ? 'valveSerialId' :
        null;
      //console.log('App.js pahoSetup: prop =', prop);

      // If the field in the message is not one we care about ...
      if (!prop) return;

      const value = getValue(field, message);

      const update = {[prop]: value};
      //console.log('manifold', manifoldId, 'valve', stationNumber, update);
      that.updateValve(manifoldId, stationNumber, update);
    }

    function connect() {
      console.log('App.js connect: entered');
      client = new Paho.MQTT.Client(config.ip, config.port, clientId);
      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;

      // Documentation on the message object is at
      // https://www.eclipse.org/paho/files/jsdoc/symbols/Paho.MQTT.Message.html#duplicate
      client.connect({
        onSuccess: () => {
          console.log('got new connection');
          client.subscribe('#');
        }
      });
    }

    connect();
  }

  componentDidMount() {
    this.pahoSetup();

    setInterval(
      () => {
        if (dirty) {
          dirty = false;
          this.setState({manifolds});
        }
      },
      500
    );
  }

  updateValve(manifoldId, stationNumber, changes) {
    // Get current data for the valve being updated.
    let valves = manifolds[manifoldId];
    if (!valves) valves = manifolds[manifoldId] = [];
    const valve = valves[stationNumber] || {manifoldId, stationNumber};

    // If the pressure changed ...
    const {pressure} = changes;
    if (pressure !== undefined) {
      let {pressures} = valve;
      if (!pressures) {
        // Create any array of zero pressures.
        const initial = [];
        initial.length = MAX_PRESSURES;
        initial.fill(0, 0, MAX_PRESSURES);
        pressures = valve.pressures = initial;
      }
      // Add the new pressure value to the end of the array.
      pressures.push(pressure);
      // Remove the oldest pressure value from the beginning of the array.
      pressures.shift();
    }

    // Update the data for the valve.
    valves[stationNumber] = Object.assign(valve, changes);
    //console.log('App.js updateValve: valves[stationNumber] =', valves[stationNumber]);

    dirty = true;
  }

  render() {
    const {
      alerts,
      filter,
      limits,
      manifolds,
      selectedTab,
      selectedValve
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
        <img alt="OCI logo" className="oci-logo" src="../images/oci-logo.png" />
      </div>
    );
  }
}

export default App;
