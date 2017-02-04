import React, {Component} from 'react';
import Diagram from './diagram';
import Filters from './filters';

import boothShapes from './booth.json';

class Tabs extends Component {
  state = {
    selectedTab: 'department'
  };

  getBtnClass = id => this.state.selectedTab === id ? 'selected' : '';

  getContent = () => {
    const {selectedTab} = this.state;
    return selectedTab === 'facility' ?
      <div>The facility view is coming soon!</div> :
      selectedTab === 'department' ?
      [
        <Diagram key="diagram" shapes={boothShapes}/>,
        <Filters key="filters"/>
      ] :
      <div>invalid tab</div>;
  };

  onClick = event => this.setState({selectedTab: event.target.id});

  render() {
    return (
      <div className="tabs">
        <div className="tab-buttons">
          <button
            className={this.getBtnClass('facility')}
            id="facility"
            onClick={this.onClick}
          >
            Facility
          </button>
          <button
            className={this.getBtnClass('department')}
            id="department"
            onClick={this.onClick}
          >
            Department
          </button>
        </div>
        <div className="tab-content">
          {this.getContent()}
        </div>
      </div>
    );
  }
}

export default Tabs;
