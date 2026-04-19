"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../client";
import type { Quiz } from "../client";
import { availabilityLabel, formatShortDate } from "../availability";

export default function QuizDetailsPage() {
  const params = useParams();
  const cid =
    typeof params.cid === "string"
      ? params.cid
      : Array.isArray(params.cid)
        ? params.cid[0]
        : undefined;
  const qid =
    typeof params.qid === "string"
      ? params.qid
      : Array.isArray(params.qid)
        ? params.qid[0]
        : undefined;
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty =
    !!currentUser &&
    ((currentUser as { role?: string }).role === "FACULTY" ||
      (currentUser as { role?: string }).role === "ADMIN");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!qid) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await client.findQuizById(qid);
        if (!cancelled) setQuiz(data);
      } catch {
        if (!cancelled) setError("Unable to load this quiz.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [qid]);

  if (!cid || !qid) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-3 text-muted">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading…
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-3">
        <p className="text-danger">{error || "Quiz not found."}</p>
        <Link href={`/courses/${cid}/quizzes`} className="btn btn-secondary">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  return (
    <div id="wd-quiz-details" className="p-3">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h3 className="mb-1">{quiz.title}</h3>
          <div className="text-muted small">
            {quiz.published ? "Published" : "Draft"} · {availabilityLabel(quiz)}
            {quiz.pointsPossible != null && ` · ${quiz.pointsPossible} pts possible`}
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link href={`/courses/${cid}/quizzes`}>
            <Button variant="secondary" size="sm">
              All quizzes
            </Button>
          </Link>
          {isFaculty && (
            <>
              <Link href={`/courses/${cid}/quizzes/${qid}/edit`}>
                <Button variant="danger" size="sm">
                  Edit
                </Button>
              </Link>
              <Link href={`/courses/${cid}/quizzes/${qid}/preview`}>
                <Button variant="outline-danger" size="sm">
                  Preview
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {quiz.description ? (
        <p className="mb-4">{quiz.description}</p>
      ) : (
        <p className="text-muted mb-4">No description.</p>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <div className="border rounded p-3 h-100">
            <div className="fw-bold text-muted small">Availability</div>
            <div>From: {formatShortDate(quiz.availableFrom)}</div>
            <div>Until: {formatShortDate(quiz.availableUntil)}</div>
            <div>Due: {formatShortDate(quiz.dueDate)}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3 h-100">
            <div className="fw-bold text-muted small">Attempts & timing</div>
            <div>
              Attempts:{" "}
              {quiz.multipleAttempts
                ? `${quiz.howManyAttempts ?? 1} allowed`
                : "Single attempt"}
            </div>
            <div>
              Time limit:{" "}
              {quiz.timeLimitMinutes && quiz.timeLimitMinutes > 0
                ? `${quiz.timeLimitMinutes} minutes`
                : "None"}
            </div>
            <div>Access code: {quiz.accessCode ? "Required" : "None"}</div>
          </div>
        </div>
      </div>

      {!isFaculty && (
        <div className="mt-4 p-3 bg-light border rounded">
          <strong>Students:</strong> taking and reviewing graded attempts will appear
          here in the quiz-taking flow.
        </div>
      )}
    </div>
  );
}
