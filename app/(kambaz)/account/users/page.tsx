"use client";
import { useState, useEffect, type ChangeEvent } from "react";
import { FormControl } from "react-bootstrap";
import PeopleTable from "../../courses/[cid]/people/table/PeopleTable";
import * as client from "../client";
import { FaPlus } from "react-icons/fa";
export default function Users() {
    const [users, setUsers] = useState<any[]>([]);
    const [role, setRole] = useState("");
    const filterUsersByRole = async (role: string) => {
        setRole(role);
        if (role) {
            const users = await client.findUsersByRole(role);
            setUsers(users);
        } else {
            fetchUsers();
        }
    };
    const [name, setName] = useState("");
    const filterUsersByName = async (name: string) => {
        setName(name);
        if (name) {
            const users = await client.findUsersByPartialName(name);
            setUsers(users);
        } else {
            fetchUsers();
        }
    };
    const loadUsersForCurrentFilters = async () => {
        if (role) {
            setUsers(await client.findUsersByRole(role));
        } else if (name) {
            setUsers(await client.findUsersByPartialName(name));
        } else {
            setUsers(await client.findAllUsers());
        }
    };

    const createUser = async () => {
        const stamp = Date.now();
        const username = `newuser${stamp}`;
        await client.createUser({
            firstName: "New",
            lastName: `User${stamp}`,
            username,
            loginId: username,
            password: "password123",
            email: `email${stamp}@neu.edu`,
            section: "S101",
            role: "STUDENT",
        });
        await loadUsersForCurrentFilters();
    };

    const fetchUsers = async () => {
        const users = await client.findAllUsers();
        setUsers(users);
    };
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            const list = await client.findAllUsers();
            if (!cancelled) {
                setUsers(list);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);
    return (
        <div>
            <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
                <FaPlus className="me-2" />
                Users
            </button>
            <h3>Users</h3>
            <FormControl onChange={(e: ChangeEvent<HTMLInputElement>) => filterUsersByName(e.target.value)} placeholder="Search people"
                className="float-start w-25 me-2 wd-filter-by-name" />
            <select value={role} onChange={(e: ChangeEvent<HTMLSelectElement>) => filterUsersByRole(e.target.value)}
                className="form-select float-start w-25 wd-select-role" >
                <option value="">All Roles</option>    <option value="STUDENT">Students</option>
                <option value="TA">Assistants</option> <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Administrators</option>
            </select>
            <PeopleTable users={users} fetchUsers={fetchUsers} />
        </div>
    );
}
