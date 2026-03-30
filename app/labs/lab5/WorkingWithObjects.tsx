"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });
    const [courseModule, setCourseModule] = useState({
        id: "MOD4550-01",
        name: "Web Development Stack",
        description: "Node, Express, React, and Next.js integration",
        course: "CS4550",
    });

    const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
    const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>

            <h4>Module</h4>
            <p className="text-muted small">State mirrors the server module; use the links to read or update it.</p>
            <a id="wd-get-module" className="btn btn-primary me-2 mb-2"
                href={`${MODULE_API_URL}`}>
                Get Module
            </a>
            <a id="wd-get-module-name" className="btn btn-primary mb-2"
                href={`${MODULE_API_URL}/name`}>
                Get Module Name
            </a>
            <div className="clearfix" />
            <a id="wd-update-module-name"
                className="btn btn-primary float-end"
                href={`${MODULE_API_URL}/name/${encodeURIComponent(courseModule.name)}`}>
                Update Module Name
            </a>
            <FormControl className="w-75 mb-2" id="wd-module-name"
                value={courseModule.name}
                onChange={(e) =>
                    setCourseModule({ ...courseModule, name: e.target.value })}
            />
            <hr />

            <h4>Modifying Properties</h4>
            <a id="wd-update-assignment-title"
                className="btn btn-primary float-end"
                href={`${ASSIGNMENT_API_URL}/title/${encodeURIComponent(assignment.title)}`}>
                Update Title
            </a>
            <FormControl className="w-75" id="wd-assignment-title"
                value={assignment.title}
                onChange={(e) =>
                    setAssignment({ ...assignment, title: e.target.value })}
            />
            <hr />

            <a id="wd-update-assignment-score"
                className="btn btn-primary float-end"
                href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                Update Score
            </a>
            <FormControl className="w-75 mb-2" id="wd-assignment-score" type="number"
                value={assignment.score}
                onChange={(e) =>
                    setAssignment({
                        ...assignment,
                        score: Number.parseInt(e.target.value, 10) || 0,
                    })}
            />

            <a id="wd-update-assignment-completed"
                className="btn btn-primary float-end"
                href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                Update Completed
            </a>
            <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="wd-assignment-completed"
                    checked={assignment.completed}
                    onChange={(e) =>
                        setAssignment({ ...assignment, completed: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="wd-assignment-completed">
                    Completed
                </label>
            </div>
            <hr />

            <h4>Module description</h4>
            <a id="wd-update-module-description"
                className="btn btn-primary float-end"
                href={`${MODULE_API_URL}/description/${encodeURIComponent(courseModule.description)}`}>
                Update Module Description
            </a>
            <FormControl as="textarea" rows={3} className="w-75 mb-2" id="wd-module-description"
                value={courseModule.description}
                onChange={(e) =>
                    setCourseModule({ ...courseModule, description: e.target.value })}
            />
            <hr />

            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary"
                href={`${HTTP_SERVER}/lab5/assignment`}>
                Get Assignment
            </a><hr />
            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary"
                href={`${HTTP_SERVER}/lab5/assignment/title`}>
                Get Title
            </a><hr />
        </div>
    );
}
