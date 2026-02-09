import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignment-editor" className="p-3">
      <div className="d-flex justify-content-end mb-3">
        <Link
          href="/courses/1234/assignments"
          className="btn btn-secondary me-2"
          id="wd-assignment-cancel"
        >
          Cancel
        </Link>

        <Link
          href="/courses/1234/assignments"
          className="btn btn-danger"
          id="wd-assignment-save"
        >
          Save
        </Link>
      </div>

      {/* Assignment Name */}
      <label htmlFor="wd-name" className="form-label fw-bold">
        Assignment Name
      </label>
      <FormControl
        id="wd-name"
        className="mb-3"
        defaultValue="A1 - ENV + HTML"
      />

      {/* Description */}
      <label htmlFor="wd-description" className="form-label fw-bold">
        Description
      </label>
      <textarea
        id="wd-description"
        className="form-control mb-3"
        rows={6}
        defaultValue={`This assignment is an introduction to the course environment, tools, and basic HTML.
You can edit this later when assignments become dynamic.`}
      />

      {/* Points */}
      <label htmlFor="wd-points" className="form-label fw-bold">
        Points
      </label>
      <FormControl id="wd-points" className="mb-3" type="number" defaultValue={100} />

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
        <FormControl id="wd-due-date" className="mb-3" type="date" defaultValue="2026-05-13" />

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="wd-available-from" className="form-label">
              Available from
            </label>
            <FormControl
              id="wd-available-from"
              className="mb-3"
              type="date"
              defaultValue="2026-05-06"
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
              defaultValue="2026-05-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
