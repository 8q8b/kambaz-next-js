"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../client";
import type { Question, Quiz, QuizAttempt, QuizAttemptAnswer } from "../../client";

function choiceLabel(question: Question | undefined, choiceId?: string) {
  if (!question || question.type !== "multiple_choice" || !choiceId) return "—";
  const c = (question.choices || []).find((x) => x._id === choiceId);
  return c?.text ?? "—";
}

function QuizResultContent() {
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
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFaculty && cid && qid) {
      router.replace(`/courses/${cid}/quizzes/${qid}`);
    }
  }, [isFaculty, cid, qid, router]);

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
      if (att.status !== "SUBMITTED") {
        router.replace(`/courses/${cid}/quizzes/${qid}/take?attempt=${attemptId}`);
        return;
      }
      setQuiz(q);
      setQuestions(qs);
      setAttempt(att);
    } catch {
      setError("Unable to load results for this attempt.");
    } finally {
      setLoading(false);
    }
  }, [qid, attemptId, isFaculty, router, cid]);

  useEffect(() => {
    load();
  }, [load]);

  const byId = new Map(questions.map((x) => [x._id, x]));
  const showCorrect = !!quiz?.showCorrectAnswers;

  const renderAnswerReview = (a: QuizAttemptAnswer) => {
    const q = byId.get(a.question);
    if (!q) return <div className="text-muted small">Question no longer available.</div>;

    if (q.type === "multiple_choice") {
      return (
        <div className="small">
          <div>Your answer: {choiceLabel(q, a.selectedChoiceId)}</div>
          {showCorrect && (
            <div className="text-muted">
              Correct: {(q.choices || []).find((c) => c.isCorrect)?.text ?? "—"}
            </div>
          )}
        </div>
      );
    }
    if (q.type === "true_false") {
      return (
        <div className="small">
          <div>Your answer: {typeof a.booleanAnswer === "boolean" ? String(a.booleanAnswer) : "—"}</div>
          {showCorrect && (
            <div className="text-muted">Correct: {String(q.correctBoolean)}</div>
          )}
        </div>
      );
    }
    return (
      <div className="small">
        <div>Your answer: {a.textAnswer ?? "—"}</div>
        {showCorrect && (
          <div className="text-muted">
            Accepted: {(q.acceptableAnswers || []).join(", ") || "—"}
          </div>
        )}
      </div>
    );
  };

  if (!cid || !qid) return null;
  if (isFaculty) return null;

  if (!attemptId) {
    return (
      <div className="p-3">
        <Alert variant="warning">No attempt selected.</Alert>
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
        Loading results…
      </div>
    );
  }

  if (error || !quiz || !attempt) {
    return (
      <div className="p-3">
        <Alert variant="danger">{error || "Not found."}</Alert>
        <Link href={`/courses/${cid}/quizzes/${qid}`} className="btn btn-secondary btn-sm">
          Back
        </Link>
      </div>
    );
  }

  const rows = (attempt.answers || []).slice().sort((a, b) => {
    const qa = byId.get(a.question);
    const qb = byId.get(b.question);
    return (qa?.order ?? 0) - (qb?.order ?? 0);
  });

  return (
    <div id="wd-quiz-result" className="p-3">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h4 className="mb-1">Results: {quiz.title}</h4>
          <div className="text-muted small">
            Attempt {attempt.attemptNumber ?? "—"} · Submitted{" "}
            {attempt.submittedAt
              ? new Date(attempt.submittedAt).toLocaleString()
              : "—"}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link href={`/courses/${cid}/quizzes/${qid}`}>
            <Button variant="secondary" size="sm">
              Quiz details
            </Button>
          </Link>
          <Link href={`/courses/${cid}/quizzes`}>
            <Button variant="outline-secondary" size="sm">
              All quizzes
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded p-3 mb-4 bg-light">
        <div className="fs-5">
          Score:{" "}
          <strong>
            {attempt.score ?? 0} / {attempt.maxScore ?? 0}
          </strong>
        </div>
        {!showCorrect && (
          <div className="text-muted small mt-1">
            Your instructor chose not to show correct answers for this quiz.
          </div>
        )}
      </div>

      <h5 className="mb-3">By question</h5>
      <ol className="ps-3">
        {rows.map((a) => {
          const q = byId.get(a.question);
          const graded =
            typeof a.pointsEarned === "number" && typeof a.pointsPossible === "number";
          const correctKnown = typeof a.isCorrect === "boolean";
          return (
            <li key={a.question} className="mb-4">
              <div className="fw-semibold">
                {q?.prompt ?? "Question"}
                {graded && (
                  <span className="text-muted ms-2">
                    ({a.pointsEarned}/{a.pointsPossible} pts)
                  </span>
                )}
              </div>
              {renderAnswerReview(a)}
              {correctKnown && (
                <div className={`small mt-1 ${a.isCorrect ? "text-success" : "text-danger"}`}>
                  {a.isCorrect ? "Correct" : "Incorrect"}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function QuizResultPage() {
  return (
    <Suspense
      fallback={
        <div className="p-3 text-muted">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading…
        </div>
      }
    >
      <QuizResultContent />
    </Suspense>
  );
}
