import { ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";

export default function Modules() {
  return (
    <div id="wd-modules">
      <ModulesControls />
      <br />
      <br />

      <ListGroup className="rounded-0" id="wd-modules-list">
        {/* Week 1 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">Week 1</div>

          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ListGroup className="wd-content rounded-0 mt-2">
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Introduction to the course
                </ListGroupItem>
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Learn what is Web Development
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>

            <ListGroupItem className="wd-lesson p-3 ps-1">
              <span className="wd-title">READING</span>
              <ListGroup className="wd-content rounded-0 mt-2">
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Full Stack Developer - Chapter 1
                </ListGroupItem>
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Full Stack Developer - Chapter 2
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>

            <ListGroupItem className="wd-lesson p-3 ps-1">
              <span className="wd-title">SLIDES</span>
              <ListGroup className="wd-content rounded-0 mt-2">
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Introduction to Web Development
                </ListGroupItem>
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Creating an HTTP server with Node.js
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 2 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">Week 2</div>

          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ListGroup className="wd-content rounded-0 mt-2">
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Learn how to create user interfaces
                </ListGroupItem>
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Learn how to style with CSS
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 3 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">Week 3</div>

          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ListGroup className="wd-content rounded-0 mt-2">
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Learn JavaScript basics
                </ListGroupItem>
                <ListGroupItem className="wd-content-item border-0 ps-3">
                  Learn DOM manipulation
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
