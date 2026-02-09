import Link from "next/link";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "react-bootstrap";

export default function Dashboard() {
  const courses = [
    {
      id: "1234",
      code: "CS1234",
      name: "React JS",
      desc: "Full Stack software developer",
      img: "/images/reactjs.jpg",
    },
    {
      id: "2345",
      code: "CS2345",
      name: "Node JS",
      desc: "Backend development",
      img: "/images/nodejs.jpg",
    },
    {
      id: "3456",
      code: "CS3456",
      name: "MongoDB",
      desc: "NoSQL databases",
      img: "/images/mongodb.jpg",
    },
    {
      id: "4567",
      code: "CS4567",
      name: "TypeScript",
      desc: "Typed JavaScript",
      img: "/images/typescript.jpg",
    },
    {
      id: "5678",
      code: "CS5678",
      name: "Web Security",
      desc: "Secure web apps",
      img: "/images/security.jpg",
    },
    {
      id: "6789",
      code: "CS6789",
      name: "UI/UX",
      desc: "Design better interfaces",
      img: "/images/uiux.jpg",
    },
    {
      id: "7890",
      code: "CS7890",
      name: "DevOps",
      desc: "Deploy and scale",
      img: "/images/devops.jpg",
    },
  ];

  return (
    <div id="wd-dashboard" className="p-4">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {courses.map((course) => (
            <Col key={course.id} className="wd-dashboard-course" style={{ maxWidth: 300 }}>
              <Card className="h-100">
                <Link
                  href={`/courses/${course.id}/home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg variant="top" src={course.img} />

                  <CardBody>
                    <CardTitle>
                      {course.code} {course.name}
                    </CardTitle>

                    <CardText className="wd-dashboard-course-title">
                      {course.desc}
                    </CardText>

                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
