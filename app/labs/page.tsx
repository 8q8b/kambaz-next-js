"use client";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Labs() {
  const pathname = usePathname();
  return (
    <div id="wd-labs">
      <h3>Xavier Galanes</h3>
      <h1>Labs</h1>
      <Nav variant="pills">
        <NavItem>
          <NavLink href="/labs" as={Link} className={`nav-link ${pathname.endsWith("labs") ? "active" : ""}`}>
            Labs
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/labs/lab1" as={Link} id="wd-lab1-link" className={`nav-link ${pathname.endsWith("lab1") ? "active" : ""}`}>
            Lab 1: HTML Examples
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/labs/lab2" as={Link} id="wd-lab2-link" className={`nav-link ${pathname.endsWith("lab2") ? "active" : ""}`}>
            Lab 2: Cascading Style Sheet
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/labs/lab3" as={Link} id="wd-lab3-link" className={`nav-link ${pathname.endsWith("lab3") ? "active" : ""}`}>
            Lab 3: React
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/labs/lab4" as={Link} id="wd-lab4-link" className={`nav-link ${pathname.endsWith("lab4") ? "active" : ""}`}>
            Lab 4
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/" as={Link} id="wd-kambaz-link">
            Kambaz
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
}
