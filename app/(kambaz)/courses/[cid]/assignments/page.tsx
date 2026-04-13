"use client";

import Link from "next/link";
import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { FaEllipsisV, FaGripVertical, FaSearch, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setAssignments } from "./reducer";
import { useState, useEffect } from "react";
import * as client from "./client";

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
  availableUntil?: string;
};

export default function Assignments() {
  const params = useParams();
  const cid =
    typeof params.cid === "string"
      ? params.cid
      : Array.isArray(params.cid)
        ? params.cid[0]
        : undefined;
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchAssignments = async () => {
    if (!cid) return;
    const list = await client.findAssignmentsForCourse(cid);
    dispatch(setAssignments(list));
  };

  useEffect(() => {
    fetchAssignments();
  }, [cid]);

  const isFaculty =
    currentUser && (currentUser as any).role === "FACULTY";

  const courseAssignments = (assignments as Assignment[]).filter(
    (a) => a.course === cid
  );

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId || !cid) return;
    await client.deleteAssignment(deleteConfirmId);
    const list = await client.findAssignmentsForCourse(cid);
    dispatch(setAssignments(list));
    setDeleteConfirmId(null);
  };

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

          {isFaculty && (
            <Link href={`/courses/${cid}/assignments/new`}>
              <Button
                variant="danger"
                size="lg"
                className="float-end"
                id="wd-add-assignment"
              >
                <FaPlus className="me-2" />
                Assignment
              </Button>
            </Link>
          )}

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

                <div className="d-flex align-items-center text-muted">
                  {isFaculty && (
                    <FaTrash
                      className="text-danger me-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteConfirmId(assignment._id);
                      }}
                      id={`wd-delete-assignment-${assignment._id}`}
                    />
                  )}
                  <FaEllipsisV />
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>

      <Modal
        show={deleteConfirmId !== null}
        onHide={() => setDeleteConfirmId(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirmId(null)}
            id="wd-delete-assignment-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            id="wd-delete-assignment-confirm"
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
