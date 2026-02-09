"use client";

import Link from "next/link";
import { Nav } from "react-bootstrap";

export default function TOC() {
  return (
    <Nav variant="pills" className="gap-2">
      <Nav.Link as={Link} href="/labs">
        Labs
      </Nav.Link>

      <Nav.Link as={Link} href="/labs/lab1">
        Lab 1
      </Nav.Link>

      <Nav.Link as={Link} href="/labs/lab2">
        Lab 2
      </Nav.Link>

      <Nav.Link as={Link} href="/labs/lab3">
        Lab 3
      </Nav.Link>

      <Nav.Link as={Link} href="/">
        Kambaz
      </Nav.Link>
    </Nav>
  );
}
