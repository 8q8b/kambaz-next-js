"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  "Home",
  "Modules",
  "Piazza",
  "Zoom",
  "Assignments",
  "Quizzes",
  "Grades",
  "People",
];


function linkToPath(label: string): string {
  if (label === "People") return "people/table";
  return label.toLowerCase();
}

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();
  const base = `/courses/${cid}`;

  return (
    <div
      id="wd-courses-navigation"
      className="wd list-group fs-5 rounded-0"
      style={{ width: 250 }}
    >
      {links.map((label) => {
        const pathSegment = linkToPath(label);
        const href = `${base}/${pathSegment}`;
        const isPeople = label === "People";
        const isQuizzes = label === "Quizzes";
        const isActive = isPeople
          ? pathname.startsWith(href) || pathname === `${base}/people`
          : isQuizzes
            ? pathname === href || pathname.startsWith(`${base}/quizzes/`)
            : pathname === href || (label === "Home" && pathname === base);
        const id = `wd-course-${label.toLowerCase()}-link`;

        return (
          <Link
            key={label}
            href={href}
            id={id}
            className={`list-group-item border-0 ${isActive ? "active" : "text-danger"}`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
