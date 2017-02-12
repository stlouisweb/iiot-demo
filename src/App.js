import React, {Component} from 'react';
import Tabs from './tabs';
import './App.css';
import '../lib/mqttws31';
/* global Paho */

const MQTT_IP = '10.201.200.60';
const MQTT_PORT = 9001;

function bytesToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

class App extends Component {
  constructor() {
    super();

    React.setState = this.setState.bind(this);

    this.state = {
      alerts: [{id: 1, x: 610, y: 380}],
      limits: {cycles: 1000},
      filter: 'leak-fault',
      manifolds: {},
      selectedTab: 'department',
      selectedValve: null
    };

    //this.pahoSetup();
  }

  pahoSetup() {
    const clientId = 'myWsClient'; //TODO: Make this unique!
    const client = new Paho.MQTT.Client(MQTT_IP, MQTT_PORT, clientId);

    client.onMessageArrived = message => {
      const topic = message.destinationName;
      const [deviceType, manifoldId, valveId, field] = topic.split('/');

      if (deviceType !== 'manifold') return;

      console.log('App.js x: field =', field);
      const prop =
        field === 'ValveFault' ? 'fault' :
        field === 'PressureFault' ? 'pressureFault' :
        field === 'LeakFault' ? 'leak' :
        field === 'LifeCycleCount' ? 'cycles' :
        null;

      if (!prop) return;

      const {payloadBytes, payloadString} = message;
      if (field === 'LifeCycleCount') {
        console.log('App.js x: payloadBytes =', payloadBytes);
      }
      const value =
        field === 'ValveFault' ? payloadString === 'True' :
        field === 'PressureFault' ?
          payloadString === 'Low' || payloadString === 'High' :
        field === 'LeakFault' ? payloadString === 'True' :
        field === 'LifeCycleCount' ? bytesToBase64(payloadBytes) :
        null;
      console.log('App.js x: prop =', prop);
      console.log('App.js x: value =', value);
      const update = {[prop]: value};
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
    this.updateValve(9, 0, {
      cycles: 1000,
      fault: false,
      leak: false,
      pressure: true
    });
    this.updateValve(9, 1, {
      cycles: 999,
      fault: true,
      leak: false,
      pressure: false
    });
    this.updateValve(9, 2, {
      cycles: 998,
      fault: false,
      leak: true,
      pressure: false
    });
    this.updateValve(9, 3, {
      cycles: 997,
      fault: false,
      leak: false,
      pressure: true
    });
    this.updateValve(9, 4, {
      cycles: 0,
      fault: false,
      leak: false,
      pressure: true
    });
    this.updateValve(9, 5, {
      cycles: 0,
      fault: false,
      leak: false,
      pressure: false
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
    const {
      alerts, filter, limits, manifolds, selectedTab, selectedValve
    } = this.state;
    return (
      <div className="App">
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
