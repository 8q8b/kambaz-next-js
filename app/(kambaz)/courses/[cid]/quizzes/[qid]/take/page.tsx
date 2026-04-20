"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../client";
import type { Question, Quiz, QuizAttempt } from "../../client";
import QuizQuestionForm from "../../QuizQuestionForm";
import type { AnswerState } from "../../quizTakingHelpers";
import { buildSubmitPayload, shuffleQuestions } from "../../quizTakingHelpers";

function QuizTakeContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const attemptId = searchParams.get("attempt") ?? undefined;

  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty =
    !!currentUser &&
    ((currentUser as { role?: string }).role === "FACULTY" ||
      (currentUser as { role?: string }).role === "ADMIN");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptMeta, setAttemptMeta] = useState<QuizAttempt | null>(null);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isFaculty && cid && qid) {
      router.replace(`/courses/${cid}/quizzes/${qid}`);
    }
  }, [isFaculty, cid, qid, router]);

  const orderedQuestions = useMemo(() => {
    const sorted = [...questions].sort((a, b) => a.order - b.order);
    if (!quiz?.shuffleQuestions || !attemptId) return sorted;
    return shuffleQuestions(sorted, attemptId);
  }, [questions, quiz?.shuffleQuestions, attemptId]);

  const load = useCallback(async () => {
    if (!qid || !attemptId || isFaculty) return;
    setLoading(true);
    setError(null);
    try {
      const [q, qs, att] = await Promise.all([
        client.findQuizById(qid),
        client.findQuestionsForQuiz(qid),
        client.getQuizAttemptById(attemptId),
      ]);
      if (att.status === "SUBMITTED") {
        router.replace(`/courses/${cid}/quizzes/${qid}/result?attempt=${attemptId}`);
        return;
      }
      setQuiz(q);
      setQuestions(qs);
      setAttemptMeta(att);
    } catch {
      setError("Unable to load this quiz attempt.");
    } finally {
      setLoading(false);
    }
  }, [qid, attemptId, isFaculty, router, cid]);

  useEffect(() => {
    load();
  }, [load]);

  const limitMin = Number(quiz?.timeLimitMinutes) || 0;
  const deadlineMs =
    limitMin > 0 && attemptMeta?.startedAt
      ? new Date(attemptMeta.startedAt).getTime() + limitMin * 60_000
      : null;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!deadlineMs) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [deadlineMs]);

  const secondsLeft =
    deadlineMs != null ? Math.max(0, Math.floor((deadlineMs - now) / 1000)) : null;
  const timedOut = secondsLeft === 0;

  const oneAt = !!quiz?.oneQuestionAtATime;
  const visibleQuestions = oneAt
    ? orderedQuestions.slice(step, step + 1)
    : orderedQuestions;

  const updateAnswer = (questionId: string, next: AnswerState[string]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: next }));
  };

  const handleSubmit = async () => {
    if (!attemptId || timedOut) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = buildSubmitPayload(orderedQuestions, answers);
      const submitted = await client.submitQuizAttempt(attemptId, payload);
      router.replace(`/courses/${cid}/quizzes/${qid}/result?attempt=${submitted._id}`);
    } catch (e: unknown) {
      const msg =
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message === "string"
          ? (e as { response: { data: { message: string } } }).response.data.message
          : "Submit failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!cid || !qid) return null;
  if (isFaculty) return null;

  if (!attemptId) {
    return (
      <div className="p-3">
        <Alert variant="warning">Missing attempt. Open this quiz from the quiz details page.</Alert>
        <Link href={`/courses/${cid}/quizzes/${qid}`} className="btn btn-secondary btn-sm">
          Quiz details
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-3 text-muted">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading quiz…
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="p-3">
        <Alert variant="danger">{error}</Alert>
        <Link href={`/courses/${cid}/quizzes/${qid}`} className="btn btn-secondary btn-sm">
          Back
        </Link>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div id="wd-quiz-take" className="p-3">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h4 className="mb-1">{quiz.title}</h4>
          <div className="text-muted small">
            Attempt {attemptMeta?.attemptNumber ?? "—"}
            {secondsLeft != null && (
              <>
                {" · "}
                <span className={timedOut ? "text-danger fw-bold" : ""}>
                  Time left: {Math.floor(secondsLeft / 60)}:
                  {String(secondsLeft % 60).padStart(2, "0")}
                </span>
              </>
            )}
          </div>
        </div>
        <Link href={`/courses/${cid}/quizzes/${qid}`}>
          <Button variant="outline-secondary" size="sm">
            Leave (save by submitting)
          </Button>
        </Link>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {timedOut ? (
        <Alert variant="danger">
          Time is up. Return to the quiz page and contact your instructor if you need help.
        </Alert>
      ) : null}

      <ol className="ps-3">
        {visibleQuestions.map((question, idx) => {
          const displayIndex = oneAt ? step + idx + 1 : orderedQuestions.indexOf(question) + 1;
          return (
            <li key={question._id} className="mb-4">
              <div className="fw-semibold">
                Question {displayIndex}. {question.prompt}{" "}
                <span className="text-muted">({question.points} pts)</span>
              </div>
              <QuizQuestionForm
                question={question}
                value={answers[question._id] || {}}
                onChange={(next) => updateAnswer(question._id, next)}
                disabled={submitting || timedOut}
              />
            </li>
          );
        })}
      </ol>

      {oneAt && orderedQuestions.length > 0 ? (
        <div className="d-flex gap-2 mb-4">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={step === 0 || submitting || timedOut}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={step >= orderedQuestions.length - 1 || submitting || timedOut}
            onClick={() => setStep((s) => Math.min(orderedQuestions.length - 1, s + 1))}
          >
            Next
          </Button>
        </div>
      ) : null}

      <Button variant="danger" disabled={submitting || timedOut} onClick={() => void handleSubmit()}>
        {submitting ? (
          <>
            <Spinner size="sm" animation="border" className="me-2" />
            Submitting…
          </>
        ) : (
          "Submit quiz"
        )}
      </Button>
    </div>
  );
}

export default function QuizTakePage() {
  return (
    <Suspense
      fallback={
        <div className="p-3 text-muted">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading…
        </div>
      }
    >
      <QuizTakeContent />
    </Suspense>
  );
}
