"use client";

import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../client";
import type { Quiz, QuizAttempt } from "../client";
import { availabilityLabel, formatShortDate, getAvailabilityState } from "../availability";
import { canStartNewSubmittedAttempt } from "../quizTakingHelpers";

function apiErrorMessage(e: unknown, fallback: string) {
  if (axios.isAxiosError(e) && typeof e.response?.data?.message === "string") {
    return e.response.data.message;
  }
  return fallback;
}

export default function QuizDetailsPage() {
  const params = useParams();
  const router = useRouter();
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
  const [inProgress, setInProgress] = useState<QuizAttempt | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState<QuizAttempt | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!qid) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await client.findQuizById(qid);
        if (!cancelled) setQuiz(data);
        if (!cancelled && !isFaculty) {
          const [ip, last] = await Promise.all([
            client.findInProgressQuizAttempt(qid),
            client.findLastQuizAttempt(qid),
          ]);
          if (!cancelled) {
            setInProgress(ip);
            setLastSubmitted(last);
          }
        } else if (!cancelled) {
          setInProgress(null);
          setLastSubmitted(null);
        }
      } catch {
        if (!cancelled) setError("Unable to load this quiz.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [qid, isFaculty]);

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

  const availability = getAvailabilityState(quiz);
  const needsCode = !!(quiz.accessCode && String(quiz.accessCode).trim() !== "");
  const canTakeWindow = availability === "open";
  const canStartMore =
    !isFaculty &&
    quiz.published &&
    canTakeWindow &&
    !inProgress &&
    canStartNewSubmittedAttempt(quiz, lastSubmitted);

  const handleStartQuiz = async () => {
    if (!qid || !cid) return;
    setActionError(null);
    setStarting(true);
    try {
      const body = needsCode ? { accessCode: accessCode.trim() } : undefined;
      const att = await client.startQuizAttempt(qid, body);
      router.push(`/courses/${cid}/quizzes/${qid}/take?attempt=${att._id}`);
    } catch (e) {
      setActionError(apiErrorMessage(e, "Could not start the quiz."));
    } finally {
      setStarting(false);
    }
  };

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
        <div className="mt-4 p-3 border rounded">
          <h5 className="mb-3">Take this quiz</h5>
          {!quiz.published ? (
            <p className="text-muted mb-0">This quiz is not published yet.</p>
          ) : !canTakeWindow ? (
            <p className="text-muted mb-0">
              {availability === "not_yet"
                ? "This quiz is not available yet."
                : "This quiz is closed."}
            </p>
          ) : (
            <>
              {actionError ? <Alert variant="danger">{actionError}</Alert> : null}
              {needsCode ? (
                <Form.Group className="mb-3" controlId="wd-quiz-access-code">
                  <Form.Label>Access code</Form.Label>
                  <Form.Control
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter the code from your instructor"
                  />
                </Form.Group>
              ) : null}

              <div className="d-flex flex-wrap gap-2">
                {inProgress ? (
                  <Link
                    href={`/courses/${cid}/quizzes/${qid}/take?attempt=${inProgress._id}`}
                    className="btn btn-danger"
                  >
                    Continue quiz
                  </Link>
                ) : canStartMore ? (
                  <Button
                    variant="danger"
                    disabled={starting || (needsCode && accessCode.trim() === "")}
                    onClick={() => void handleStartQuiz()}
                  >
                    {starting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Starting…
                      </>
                    ) : (
                      "Start quiz"
                    )}
                  </Button>
                ) : (
                  <span className="text-muted">No attempts remaining.</span>
                )}

                {lastSubmitted ? (
                  <Link
                    href={`/courses/${cid}/quizzes/${qid}/result?attempt=${lastSubmitted._id}`}
                    className="btn btn-outline-secondary"
                  >
                    View last submission
                  </Link>
                ) : null}
              </div>

              {lastSubmitted &&
              typeof lastSubmitted.score === "number" &&
              typeof lastSubmitted.maxScore === "number" ? (
                <div className="text-muted small mt-2">
                  Last score:{" "}
                  <strong>
                    {lastSubmitted.score} / {lastSubmitted.maxScore}
                  </strong>
                </div>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}
