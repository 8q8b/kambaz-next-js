"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../client";
import type { Question, Quiz } from "../../client";

export default function QuizPreviewPage() {
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFaculty && cid) {
      router.replace(`/courses/${cid}/quizzes`);
    }
  }, [isFaculty, cid, router]);

  useEffect(() => {
    if (!qid || !isFaculty) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [q, qs] = await Promise.all([
          client.findQuizById(qid),
          client.findQuestionsForQuiz(qid),
        ]);
        if (!cancelled) {
          setQuiz(q);
          setQuestions(qs);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [qid, isFaculty]);

  if (!cid || !qid) return null;
  if (!isFaculty) return null;

  return (
    <div id="wd-quiz-preview" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 className="mb-0">Preview: {quiz?.title ?? "Quiz"}</h4>
        <div className="d-flex gap-2">
          <Link href={`/courses/${cid}/quizzes/${qid}/edit`}>
            <Button variant="outline-secondary" size="sm">
              Edit quiz
            </Button>
          </Link>
          <Link href={`/courses/${cid}/quizzes/${qid}`}>
            <Button variant="secondary" size="sm">
              Details
            </Button>
          </Link>
        </div>
      </div>
      <p className="text-muted small">
        Faculty preview is read-only. Student attempts and grading run through the take
        flow without persisting from this screen.
      </p>

      {loading ? (
        <div className="text-muted">
          <Spinner size="sm" animation="border" className="me-2" />
          Loading…
        </div>
      ) : (
        <ol className="ps-3">
          {questions.map((question, idx) => (
            <li key={question._id} className="mb-4">
              <div className="fw-bold">
                Q{idx + 1}. {question.prompt}{" "}
                <span className="text-muted">({question.points} pts)</span>
              </div>
              {question.type === "multiple_choice" && (
                <ul>
                  {(question.choices || []).map((c) => (
                    <li key={c._id}>
                      {c.text}
                      {c.isCorrect ? (
                        <span className="text-success ms-2">(correct)</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
              {question.type === "true_false" && (
                <div>
                  Correct:{" "}
                  <strong>{question.correctBoolean === true ? "True" : "False"}</strong>
                </div>
              )}
              {question.type === "fill_blank" && (
                <div>
                  Acceptable:{" "}
                  <strong>{(question.acceptableAnswers || []).join(", ")}</strong>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
