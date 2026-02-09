import Link from "next/link";

export default function CourseNavigation({ cid }: { cid: string }) {
  return (
    <div
      id="wd-courses-navigation"
      className="wd list-group fs-5 rounded-0"
      style={{ width: 250 }}
    >
      <Link
        href={`/courses/${cid}/home`}
        id="wd-course-home-link"
        className="list-group-item active border-0"
      >
        Home
      </Link>

      <Link
        href={`/courses/${cid}/modules`}
        id="wd-course-modules-link"
        className="list-group-item text-danger border-0"
      >
        Modules
      </Link>

      <Link
        href={`/courses/${cid}/piazza`}
        id="wd-course-piazza-link"
        className="list-group-item text-danger border-0"
      >
        Piazza
      </Link>

      <Link
        href={`/courses/${cid}/zoom`}
        id="wd-course-zoom-link"
        className="list-group-item text-danger border-0"
      >
        Zoom
      </Link>

      <Link
        href={`/courses/${cid}/assignments`}
        id="wd-course-assignments-link"
        className="list-group-item text-danger border-0"
      >
        Assignments
      </Link>

      <Link
        href={`/courses/${cid}/quizzes`}
        id="wd-course-quizzes-link"
        className="list-group-item text-danger border-0"
      >
        Quizzes
      </Link>

      <Link
        href={`/courses/${cid}/grades`}
        id="wd-course-grades-link"
        className="list-group-item text-danger border-0"
      >
        Grades
      </Link>

      <Link
        href={`/courses/${cid}/people/table`}
        id="wd-course-people-link"
        className="list-group-item text-danger border-0"
      >
        People
      </Link>
    </div>
  );
}
