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


export default function Assignments() {
    return (
        <div id="wd-assignments" className="p-3">
            {/* Top controls */}
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

            {/* Assignment groups + items */}
            <ListGroup className="rounded-0" id="wd-assignment-list">
                <ListGroupItem className="p-0 mb-4 border-gray">
                    <div className="bg-secondary p-3 fs-4">
                        ASSIGNMENTS
                    </div>

                    <ListGroup className="rounded-0">
                        <ListGroupItem className="wd-assignment-item d-flex align-items-start p-3">
                            <div className="me-3 text-muted">
                                <FaGripVertical />
                            </div>

                            <div className="wd-assignment-green-border me-3" />

                            <div className="flex-fill">
                                <Link
                                    href="/courses/1234/assignments/editor"
                                    className="fw-bold text-decoration-none text-dark"
                                >
                                    A1 - ENV + HTML
                                </Link>
                                <div className="text-muted">
                                    <span className="text-danger">Multiple Modules</span> | Not available until May 6 at 12:00am |
                                    Due May 13 at 11:59pm | 100 pts
                                </div>
                            </div>

                            <div className="text-muted">
                                <FaEllipsisV />
                            </div>
                        </ListGroupItem>

                        <ListGroupItem className="wd-assignment-item d-flex align-items-start p-3">
                            <div className="me-3 text-muted">
                                <FaGripVertical />
                            </div>

                            <div className="wd-assignment-green-border me-3" />

                            <div className="flex-fill">
                                <Link
                                    href="/courses/1234/assignments/editor"
                                    className="fw-bold text-decoration-none text-dark"
                                >
                                    A2 - CSS + BOOTSTRAP
                                </Link>
                                <div className="text-muted">
                                    <span className="text-danger">Multiple Modules</span> | Not available until May 13 at 12:00am |
                                    Due May 20 at 11:59pm | 100 pts
                                </div>
                            </div>

                            <div className="text-muted">
                                <FaEllipsisV />
                            </div>
                        </ListGroupItem>

                        <ListGroupItem className="wd-assignment-item d-flex align-items-start p-3">
                            <div className="me-3 text-muted">
                                <FaGripVertical />
                            </div>

                            <div className="wd-assignment-green-border me-3" />

                            <div className="flex-fill">
                                <Link
                                    href="/courses/1234/assignments/editor"
                                    className="fw-bold text-decoration-none text-dark"
                                >
                                    A3 - JAVASCRIPT + REACT
                                </Link>
                                <div className="text-muted">
                                    <span className="text-danger">Multiple Modules</span> | Not available until May 20 at 12:00am |
                                    Due May 27 at 11:59pm | 100 pts
                                </div>
                            </div>

                            <div className="text-muted">
                                <FaEllipsisV />
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}
