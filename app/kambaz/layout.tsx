"use client";

import KambazNavigation from "./navigation";

export default function KambazLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="wd-kambaz-layout" style={{ display: "flex" }}>
      <div style={{ width: "200px" }}>
        <KambazNavigation />
      </div>
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
}
