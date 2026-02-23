"use client";

import React from "react";
import { usePathname } from "next/navigation";

function pathToLabel(pathname: string, cid: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const courseIndex = segments.indexOf("courses");
  const cidIndex = courseIndex >= 0 ? courseIndex + 1 : -1;
  const afterCid = cidIndex >= 0 ? segments.slice(cidIndex + 1) : [];
  if (afterCid.length === 0) return "Home";
  if (afterCid[0] === "people" && (afterCid[1] === "table" || !afterCid[1]))
    return "People";
  const segment = afterCid[0];
  if (!segment) return "Home";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Breadcrumb({
  course,
  cid,
}: {
  course: { name: string } | undefined;
  cid: string;
}) {
  const pathname = usePathname();
  const sectionLabel = pathToLabel(pathname, cid);

  return (
    <span id="wd-breadcrumb" className="text-danger">
      Course {course?.name} &gt; {sectionLabel}
    </span>
  );
}
