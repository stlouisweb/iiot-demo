import React from 'react';
import {Col, Nav, NavItem, Row, Tab} from 'react-bootstrap';
import Diagram from './diagram';
import Filters from './filters';

import boothShapes from './booth.json';

const Tabs = () =>
  <Tab.Container id="left-tabs-example" defaultActiveKey="department">
    <Row className="clearfix">
      <Col sm={2}>
        <Nav bsStyle="pills" stacked>
          <NavItem eventKey="facility">
            Facility
          </NavItem>
          <NavItem eventKey="department">
            Department
          </NavItem>
        </Nav>
      </Col>
      <Col sm={10}>
        <Tab.Content animation>
          <Tab.Pane eventKey="facility">
            Facility content goes here!
          </Tab.Pane>
          <Tab.Pane eventKey="department">
            <Diagram shapes={boothShapes}/>
            <Filters/>
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>;

Tabs.displayName = 'Tabs';

export default Tabs;
