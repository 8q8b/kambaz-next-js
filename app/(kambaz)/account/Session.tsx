import * as client from "./client";
import * as enrollmentsClient from "../enrollments/client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { setEnrollments } from "../enrollments/reducer";
import { useDispatch } from "react-redux";
import axios from "axios";
export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
      if (currentUser) {
        const enrollments = await enrollmentsClient.findMyEnrollments();
        dispatch(setEnrollments(enrollments));
      } else {
        dispatch(setEnrollments([]));
      }
    } catch (err: any) {
      // 401 is normal before login; avoid noisy console errors.
      if (!(axios.isAxiosError(err) && err.response?.status === 401)) {
        console.error(err);
      }
      dispatch(setCurrentUser(null));
      dispatch(setEnrollments([]));
    }
    setPending(false);
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  if (!pending) {
    return children;
  }
}

