import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaCheckCircle, FaBan, FaBell, FaChartBar, FaBullhorn } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: 300 }}>
      <h4>Course Status</h4>

      <div className="d-flex mb-3">
        <Button variant="secondary" className="w-50 me-1" id="wd-unpublish">
          <FaBan className="me-2" />
          Unpublish
        </Button>
        <Button variant="success" className="w-50 ms-1" id="wd-publish">
          <FaCheckCircle className="me-2" />
          Published
        </Button>
      </div>

      <ListGroup className="rounded-0" id="wd-course-status-actions">
        <ListGroupItem className="border-gray">
          <FaPlus className="me-2" />
          Import Existing Content
        </ListGroupItem>
        <ListGroupItem className="border-gray">
          <FaPlus className="me-2" />
          Import From Commons
        </ListGroupItem>
        <ListGroupItem className="border-gray">
          <FaPlus className="me-2" />
          Choose Home Page
        </ListGroupItem>
        <ListGroupItem className="border-gray">
          <FaChartBar className="me-2" />
          View Course Stream
        </ListGroupItem>
        <ListGroupItem className="border-gray">
          <FaBullhorn className="me-2" />
          New Announcement
        </ListGroupItem>
        <ListGroupItem className="border-gray">
          <FaChartBar className="me-2" />
          New Analytics
        </ListGroupItem>
        <ListGroupItem className="border-gray">
          <FaBell className="me-2" />
          View Course Notifications
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
