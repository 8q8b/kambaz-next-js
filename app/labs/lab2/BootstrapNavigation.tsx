"use client";

import { Nav, Card, Button } from "react-bootstrap";

export default function BootstrapNavigation() {
  return (
    <div id="wd-bootstrap-navigation">
      <h3>Bootstrap Navigation</h3>

      <Nav variant="tabs" defaultActiveKey="home" className="mb-3">
        <Nav.Item>
          <Nav.Link eventKey="home">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="modules">Modules</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="grades">Grades</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="settings">Settings</Nav.Link>
        </Nav.Item>
      </Nav>
      <h3>Bootstrap Cards</h3>

      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src="/images/stacked.jpg" />
        <Card.Body>
          <Card.Title>Stacked Course</Card.Title>
          <Card.Text>
            This is a sample Bootstrap card used in the CSS lab.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>

    </div>
  );
}
