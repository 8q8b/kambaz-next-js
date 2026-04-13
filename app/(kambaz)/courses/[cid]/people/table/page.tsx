"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as coursesClient from "../../../client";
import PeopleTable from "./PeopleTable";

export default function CoursePeoplePage() {
  const { cid } = useParams();
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    if (!cid) return;
    const list = await coursesClient.findUsersForCourse(cid as string);
    setUsers(list ?? []);
  };

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  return (
    <div>
      <h3>People</h3>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
