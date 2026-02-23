"use client";

import Link from "next/link";
import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { FaEllipsisV, FaGripVertical, FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useParams } from "next/navigation";
import * as db from "../../../database";

function formatDate(dateStr: string, time: string): string {
  const d = new Date(dateStr);
  const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
  const month = months[d.getMonth()];
  const day = d.getDate();
  return `${month} ${day} at ${time}`;
}

type Assignment = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFrom?: string;
};

export default function Assignments() {
  const { cid } = useParams();
  const courseAssignments = (db.assignments as Assignment[]).filter(
    (a) => a.course === cid
  );

  return (
    <div id="wd-assignments" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: 350 }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <FormControl
            id="wd-search-assignment"
            placeholder="Search for Assignment"
          />
        </InputGroup>

        <div className="text-nowrap">
          <Button
            variant="secondary"
            size="lg"
            className="me-2 float-end"
            id="wd-add-assignment-group"
          >
            <FaPlus className="me-2" />
            Group
          </Button>

          <Button
            variant="danger"
            size="lg"
            className="float-end"
            id="wd-add-assignment"
          >
            <FaPlus className="me-2" />
            Assignment
          </Button>

          <div className="clearfix" />
        </div>
      </div>

      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="p-0 mb-4 border-gray">
          <div className="bg-secondary p-3 fs-4">ASSIGNMENTS</div>

          <ListGroup className="rounded-0">
            {courseAssignments.map((assignment) => (
              <ListGroupItem
                key={assignment._id}
                className="wd-assignment-item d-flex align-items-start p-3"
              >
                <div className="me-3 text-muted">
                  <FaGripVertical />
                </div>

                <div className="wd-assignment-green-border me-3" />

                <div className="flex-fill">
                  <Link
                    href={`/courses/${cid}/assignments/${assignment._id}`}
                    className="fw-bold text-decoration-none text-dark"
                  >
                    {assignment.title}
                  </Link>
                  <div className="text-muted">
                    <span className="text-danger">Multiple Modules</span>
                    {assignment.availableFrom &&
                      ` | Not available until ${formatDate(assignment.availableFrom, "12:00am")}`}
                    {assignment.dueDate &&
                      ` | Due ${formatDate(assignment.dueDate, "11:59pm")}`}
                    {assignment.points != null && ` | ${assignment.points} pts`}
                  </div>
                </div>

                <div className="text-muted">
                  <FaEllipsisV />
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
