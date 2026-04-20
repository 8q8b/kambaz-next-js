"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../client";
import type { Question, Quiz } from "../../client";
import QuizQuestionForm from "../../QuizQuestionForm";
import type { AnswerState } from "../../quizTakingHelpers";
import { scoreAllForPreview, shuffleQuestions } from "../../quizTakingHelpers";

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
  const [answers, setAnswers] = useState<AnswerState>({});
  const [graded, setGraded] = useState<ReturnType<typeof scoreAllForPreview> | null>(null);

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

  const orderedQuestions = useMemo(() => {
    const sorted = [...questions].sort((a, b) => a.order - b.order);
    if (!quiz?.shuffleQuestions || !qid) return sorted;
    return shuffleQuestions(sorted, `preview-${qid}`);
  }, [questions, quiz?.shuffleQuestions, qid]);

  const updateAnswer = (questionId: string, next: AnswerState[string]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: next }));
    setGraded(null);
  };

  const handleGradePreview = () => {
    setGraded(scoreAllForPreview(orderedQuestions, answers));
  };

  const handleReset = () => {
    setAnswers({});
    setGraded(null);
  };

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
      <Alert variant="info" className="py-2 small">
        This preview does not save attempts or grades to the server. Use{" "}
        <strong>Grade preview</strong> to score your answers in the browser (same rules as
        the live quiz).
      </Alert>

      {loading ? (
        <div className="text-muted">
          <Spinner size="sm" animation="border" className="me-2" />
          Loading…
        </div>
      ) : (
        <>
          <ol className="ps-3">
            {orderedQuestions.map((question, idx) => (
              <li key={question._id} className="mb-4">
                <div className="fw-semibold">
                  Q{idx + 1}. {question.prompt}{" "}
                  <span className="text-muted">({question.points} pts)</span>
                </div>
                <QuizQuestionForm
                  question={question}
                  value={answers[question._id] || {}}
                  onChange={(next) => updateAnswer(question._id, next)}
                />
              </li>
            ))}
          </ol>

          <div className="d-flex flex-wrap gap-2 mb-4">
            <Button variant="danger" onClick={handleGradePreview}>
              Grade preview
            </Button>
            <Button variant="outline-secondary" onClick={handleReset}>
              Reset answers
            </Button>
          </div>

          {graded ? (
            <div className="border rounded p-3 bg-light">
              <h5 className="mb-2">Preview score</h5>
              <p className="mb-3">
                <strong>
                  {graded.score} / {graded.maxScore}
                </strong>
              </p>
              <ul className="list-unstyled mb-0 small">
                {graded.perQuestion.map((row) => {
                  const q = orderedQuestions.find((x) => x._id === row.questionId);
                  return (
                    <li key={row.questionId} className="mb-2">
                      <span className={row.isCorrect ? "text-success" : "text-danger"}>
                        {row.isCorrect ? "✓" : "✗"}
                      </span>{" "}
                      <span className="text-muted">
                        ({row.pointsEarned}/{row.pointsPossible} pts)
                      </span>{" "}
                      {q ? q.prompt.slice(0, 80) : row.questionId}
                      {q && q.prompt.length > 80 ? "…" : ""}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
