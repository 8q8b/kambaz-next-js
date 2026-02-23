import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { courses } from "../../database";

export default async function CoursesLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ cid: string }>;
}>) {
  const { cid } = await params;
  const course = courses.find((course) => course._id === cid);

  return (
    <div id="wd-courses">
      <h2>
        <Breadcrumb course={course} cid={cid} />
      </h2>

      <hr />

      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>

        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
