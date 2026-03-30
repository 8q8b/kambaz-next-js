"use client";
import * as client from "../courses/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCourse,
  deleteCourse,
  updateCourse,
  setCourses,
} from "../courses/reducer";
import { setEnrollments } from "../enrollments/reducer";
import * as enrollmentsClient from "../enrollments/client";
import { RootState } from "../store";

export default function Dashboard() {
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });
  const [showAllCourses, setShowAllCourses] = useState(false);

  const dispatch = useDispatch();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const isFaculty = currentUser && (currentUser as any).role === "FACULTY";

  const isEnrolled = (courseId: string) =>
    currentUser &&
    enrollments.some(
      (e: any) => e.user === (currentUser as any)._id && e.course === courseId
    );
  const fetchCourses = async () => {
    try {
      const courses = await client.findMyCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEnrollments = async () => {
    if (!currentUser) {
      dispatch(setEnrollments([]));
      return;
    }
    try {
      const list = await enrollmentsClient.findMyEnrollments();
      dispatch(setEnrollments(list));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, [currentUser]);
  useEffect(() => {
    fetchEnrollments();
  }, [currentUser]);

  const coursesToShow =
    !currentUser
      ? courses
      : showAllCourses
        ? courses
        : courses.filter((c: any) => isEnrolled(c._id));
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };
  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c) => {
        if (c._id === course._id) { return course; }
        else { return c; }
    })));};


  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h1 id="wd-dashboard-title" className="mb-0">
          Dashboard
        </h1>
        {currentUser && (
          <Button
            variant="primary"
            id="wd-enrollments-btn"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            Enrollments
          </Button>
        )}
      </div>
      <hr />

      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) =>
              setCourse({ ...course, name: e.target.value })
            }
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        Published Courses ({coursesToShow.length})
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {coursesToShow.map((c: any) => {
            const enrolled = isEnrolled(c._id);
            return (
              <Col
                key={c._id}
                className="wd-dashboard-course"
                style={{ width: "300px" }}
              >
                <Card>
                  <CardImg
                    src="/images/reactjs.jpg"
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {c.description}
                    </CardText>
                    {enrolled ? (
                      <Link
                        href={`/courses/${c._id}/home`}
                        className="wd-dashboard-course-link text-decoration-none"
                      >
                        <Button variant="primary">Go</Button>
                      </Link>
                    ) : (
                      <Button variant="primary" disabled>
                        Go
                      </Button>
                    )}
                    {currentUser && (
                      enrolled ? (
                        <Button
                          variant="danger"
                          className="float-end ms-2"
                          id={`wd-unenroll-${c._id}`}
                          onClick={async () => {
                            await enrollmentsClient.unenrollFromCourse(c._id);
                            const list = await enrollmentsClient.findMyEnrollments();
                            dispatch(setEnrollments(list));
                          }}
                        >
                          Unenroll
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          className="float-end ms-2"
                          id={`wd-enroll-${c._id}`}
                          onClick={async () => {
                            await enrollmentsClient.enrollInCourse(c._id);
                            const list = await enrollmentsClient.findMyEnrollments();
                            dispatch(setEnrollments(list));
                          }}
                        >
                          Enroll
                        </Button>
                      )
                    )}
                    {isFaculty && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onDeleteCourse(course._id);
                        }}
                        className="btn btn-danger float-end"
                        id="wd-delete-course-click"
                      >
                        Delete
                      </button>
                    )}
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
