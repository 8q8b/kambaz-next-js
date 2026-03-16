"use client";
import { ReactNode, useEffect } from "react";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const course = courses.find((c: any) => c._id === cid);
  const isEnrolled =
    currentUser &&
    enrollments.some(
      (e: any) => e.user === (currentUser as any)._id && e.course === cid
    );

  useEffect(() => {
    if (!currentUser || !isEnrolled) {
      router.replace("/dashboard");
    }
  }, [currentUser, isEnrolled, router]);

  if (!currentUser || !isEnrolled) {
    return null;
  }

  return (
    <div id="wd-courses">
      <h2>
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course?.name}
      </h2>
      <hr />
      <div className="d-flex">
        <div>
          <CourseNavigation cid={cid as string} />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
 }
 