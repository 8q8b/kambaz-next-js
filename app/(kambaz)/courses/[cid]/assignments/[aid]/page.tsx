"use client";

import Link from "next/link";
import { Button, FormControl } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { setAssignments } from "../reducer";
import { useState, useEffect } from "react";
import * as client from "../client";

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

const emptyForm = {
  name: "",
  description: "",
  points: 100,
  dueDate: "",
  availableFrom: "",
  availableUntil: "",
};

export default function AssignmentEditor() {
  const params = useParams();
  const cid =
    typeof params.cid === "string"
      ? params.cid
      : Array.isArray(params.cid)
        ? params.cid[0]
        : undefined;
  const aid =
    typeof params.aid === "string"
      ? params.aid
      : Array.isArray(params.aid)
        ? params.aid[0]
        : undefined;
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser && (currentUser as any).role === "FACULTY";

  const isNew = aid === "new";
  const assignment = !isNew
    ? (assignments as Assignment[]).find((a) => a._id === aid)
    : null;

  const [form, setForm] = useState(emptyForm);
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);

  useEffect(() => {
    if (isNew && !isFaculty && cid) {
      router.replace(`/courses/${cid}/assignments`);
    }
  }, [isNew, isFaculty, cid, router]);

  useEffect(() => {
    if (!cid) return;
    let cancelled = false;
    const load = async () => {
      setAssignmentsLoaded(false);
      const list = await client.findAssignmentsForCourse(cid);
      if (!cancelled) {
        dispatch(setAssignments(list));
        setAssignmentsLoaded(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [cid, dispatch]);

  useEffect(() => {
    if (assignment) {
      setForm({
        name: assignment.title ?? "",
        description: assignment.description ?? "",
        points: assignment.points ?? 100,
        dueDate: assignment.dueDate ?? "",
        availableFrom: assignment.availableFrom ?? "",
        availableUntil: assignment.availableUntil ?? "",
      });
    } else if (isNew) {
      setForm(emptyForm);
    }
  }, [assignment, isNew]);

  if (isNew && !isFaculty) {
    return null;
  }

  if (!isNew && assignmentsLoaded && !assignment) {
    return (
      <div id="wd-assignment-editor" className="p-3">
        <p className="text-muted">Assignment not found.</p>
        {cid && (
          <Link href={`/courses/${cid}/assignments`} className="btn btn-secondary">
            Back to Assignments
          </Link>
        )}
      </div>
    );
  }

  if (!isNew && !assignmentsLoaded) {
    return (
      <div id="wd-assignment-editor" className="p-3">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  const readOnly = !isFaculty;

  const handleSave = async () => {
    if (!cid) return;
    if (isNew) {
      const newAssignment = await client.createAssignmentForCourse(cid, {
        title: form.name,
        description: form.description,
        points: form.points,
        dueDate: form.dueDate,
        availableFrom: form.availableFrom,
        availableUntil: form.availableUntil,
      });
      dispatch(setAssignments([...assignments, newAssignment]));
    } else {
      const updated = await client.updateAssignment({
        ...assignment!,
        title: form.name,
        description: form.description,
        points: form.points,
        dueDate: form.dueDate,
        availableFrom: form.availableFrom,
        availableUntil: form.availableUntil,
      });
      dispatch(
        setAssignments(
          assignments.map((a) =>
            a._id === updated._id ? updated : a
          )
        )
      );
    }
    router.push(`/courses/${cid}/assignments`);
  };

  const handleCancel = () => {
    if (cid) router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignment-editor" className="p-3">
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="secondary"
          className="me-2"
          id="wd-assignment-cancel"
          onClick={handleCancel}
        >
          {readOnly ? "Back" : "Cancel"}
        </Button>
        {!readOnly && (
          <Button
            variant="danger"
            id="wd-assignment-save"
            onClick={handleSave}
          >
            Save
          </Button>
        )}
      </div>

      {/* Assignment Name */}
      <label htmlFor="wd-name" className="form-label fw-bold">
        Assignment Name
      </label>
      <FormControl
        id="wd-name"
        className="mb-3"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        readOnly={readOnly}
      />

      {/* Description */}
      <label htmlFor="wd-description" className="form-label fw-bold">
        Description
      </label>
      <textarea
        id="wd-description"
        className="form-control mb-3"
        rows={6}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        readOnly={readOnly}
      />

      {/* Points */}
      <label htmlFor="wd-points" className="form-label fw-bold">
        Points
      </label>
      <FormControl
        id="wd-points"
        className="mb-3"
        type="number"
        value={form.points}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          setForm({ ...form, points: isNaN(n) ? 0 : n });
        }}
        readOnly={readOnly}
      />

      {/* Assignment Group */}
      <label htmlFor="wd-group" className="form-label fw-bold">
        Assignment Group
      </label>
      <select id="wd-group" className="form-select mb-3" defaultValue="ASSIGNMENTS">
        <option value="ASSIGNMENTS">ASSIGNMENTS</option>
        <option value="QUIZZES">QUIZZES</option>
        <option value="EXAMS">EXAMS</option>
        <option value="PROJECT">PROJECT</option>
      </select>

      {/* Display Grade as */}
      <label htmlFor="wd-display-grade-as" className="form-label fw-bold">
        Display Grade as
      </label>
      <select
        id="wd-display-grade-as"
        className="form-select mb-3"
        defaultValue="Percentage"
      >
        <option>Percentage</option>
        <option>Points</option>
        <option>Complete/Incomplete</option>
      </select>

      {/* Submission Type */}
      <label htmlFor="wd-submission-type" className="form-label fw-bold">
        Submission Type
      </label>
      <select id="wd-submission-type" className="form-select mb-3" defaultValue="Online">
        <option>Online</option>
        <option>On Paper</option>
        <option>No Submission</option>
      </select>

      {/* Online Entry Options */}
      <div className="border p-3 mb-3">
        <div className="fw-bold mb-2">Online Entry Options</div>

        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="wd-text-entry" defaultChecked />
          <label className="form-check-label" htmlFor="wd-text-entry">
            Text Entry
          </label>
        </div>

        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="wd-website-url" defaultChecked />
          <label className="form-check-label" htmlFor="wd-website-url">
            Website URL
          </label>
        </div>

        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="wd-media-recordings" />
          <label className="form-check-label" htmlFor="wd-media-recordings">
            Media Recordings
          </label>
        </div>

        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="wd-student-annotation" />
          <label className="form-check-label" htmlFor="wd-student-annotation">
            Student Annotation
          </label>
        </div>

        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="wd-file-upload" defaultChecked />
          <label className="form-check-label" htmlFor="wd-file-upload">
            File Uploads
          </label>
        </div>
      </div>

      {/* Assign */}
      <div className="border p-3">
        <div className="fw-bold mb-3">Assign</div>

        <label htmlFor="wd-assign-to" className="form-label">
          Assign to
        </label>
        <FormControl id="wd-assign-to" className="mb-3" defaultValue="Everyone" />

        <label htmlFor="wd-due-date" className="form-label">
          Due
        </label>
        <FormControl
          id="wd-due-date"
          className="mb-3"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          readOnly={readOnly}
        />

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="wd-available-from" className="form-label">
              Available from
            </label>
            <FormControl
              id="wd-available-from"
              className="mb-3"
              type="date"
              value={form.availableFrom}
              onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
              readOnly={readOnly}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="wd-until" className="form-label">
              Until
            </label>
            <FormControl
              id="wd-until"
              className="mb-3"
              type="date"
              value={form.availableUntil}
              onChange={(e) => setForm({ ...form, availableUntil: e.target.value })}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
