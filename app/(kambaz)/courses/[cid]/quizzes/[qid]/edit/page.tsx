"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  FormCheck,
  FormControl,
  FormLabel,
  FormSelect,
  Nav,
  Spinner,
  Tab,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../client";
import type { Question, Quiz } from "../../client";
import QuestionEditorCard from "../../QuestionEditorCard";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function QuizEditorPage() {
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

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");
  const [hasTimeLimit, setHasTimeLimit] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    availableFrom: "",
    availableUntil: "",
    dueDate: "",
    quizType: "GRADED_QUIZ" as NonNullable<Quiz["quizType"]>,
    assignmentGroup: "QUIZZES" as NonNullable<Quiz["assignmentGroup"]>,
    timeLimitMinutes: 0,
    shuffleQuestions: false,
    oneQuestionAtATime: false,
    multipleAttempts: false,
    howManyAttempts: 1,
    accessCode: "",
    showCorrectAnswers: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
  });

  useEffect(() => {
    if (!isFaculty && cid) {
      router.replace(`/courses/${cid}/quizzes`);
    }
  }, [isFaculty, cid, router]);

  const loadAll = async () => {
    if (!qid) return;
    setLoading(true);
    setError(null);
    try {
      const [q, qs] = await Promise.all([
        client.findQuizById(qid),
        client.findQuestionsForQuiz(qid),
      ]);
      setQuiz(q);
      setQuestions(qs);
      setForm({
        title: q.title ?? "",
        description: q.description ?? "",
        availableFrom: q.availableFrom ?? "",
        availableUntil: q.availableUntil ?? "",
        dueDate: q.dueDate ?? "",
        quizType: q.quizType ?? "GRADED_QUIZ",
        assignmentGroup: q.assignmentGroup ?? "QUIZZES",
        timeLimitMinutes: q.timeLimitMinutes ?? 0,
        shuffleQuestions: !!q.shuffleQuestions,
        oneQuestionAtATime: !!q.oneQuestionAtATime,
        multipleAttempts: !!q.multipleAttempts,
        howManyAttempts: q.howManyAttempts ?? 1,
        accessCode: q.accessCode ?? "",
        showCorrectAnswers: q.showCorrectAnswers !== false,
        webcamRequired: !!q.webcamRequired,
        lockQuestionsAfterAnswering: !!q.lockQuestionsAfterAnswering,
      });
      setHasTimeLimit((q.timeLimitMinutes ?? 0) > 0);
    } catch {
      setError("Unable to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!qid || !isFaculty) return;
    loadAll();
  }, [qid, isFaculty]);

  const nextOrder = useMemo(() => {
    if (!questions.length) return 0;
    return Math.max(...questions.map((q) => q.order ?? 0)) + 1;
  }, [questions]);

  const persistMetadata = async (): Promise<boolean> => {
    if (!qid) return false;
    setSaving(true);
    setError(null);
    try {
      const updated = await client.updateQuiz(qid, {
        title: form.title.trim() || "Untitled Quiz",
        description: form.description,
        availableFrom: form.availableFrom || undefined,
        availableUntil: form.availableUntil || undefined,
        dueDate: form.dueDate || undefined,
        quizType: form.quizType,
        assignmentGroup: form.assignmentGroup,
        timeLimitMinutes: hasTimeLimit ? form.timeLimitMinutes : 0,
        shuffleQuestions: form.shuffleQuestions,
        oneQuestionAtATime: form.oneQuestionAtATime,
        multipleAttempts: form.multipleAttempts,
        howManyAttempts: form.howManyAttempts,
        accessCode: form.accessCode || undefined,
        showCorrectAnswers: form.showCorrectAnswers,
        webcamRequired: form.webcamRequired,
        lockQuestionsAfterAnswering: form.lockQuestionsAfterAnswering,
      });
      setQuiz(updated);
      return true;
    } catch {
      setError("Save failed.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const ok = await persistMetadata();
    if (ok && cid) router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    if (!qid) return;
    const ok = await persistMetadata();
    if (!ok) return;
    setSaving(true);
    try {
      const published = await client.setQuizPublished(qid, true);
      setQuiz(published);
      if (cid) router.push(`/courses/${cid}/quizzes`);
    } catch {
      setError("Could not publish quiz.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (cid) router.push(`/courses/${cid}/quizzes`);
  };

  const addQuestion = async (type: Question["type"] = "multiple_choice") => {
    if (!qid) return;
    setSaving(true);
    setError(null);
    try {
      let body: Record<string, unknown> = {
        type,
        prompt:
          type === "multiple_choice"
            ? "New multiple choice question"
            : type === "true_false"
              ? "New true/false question"
              : "New fill-in-the-blank question",
        points: 1,
        order: nextOrder,
      };
      if (type === "multiple_choice") {
        body = {
          ...body,
          choices: [
            { _id: randomId(), text: "Option A", isCorrect: true },
            { _id: randomId(), text: "Option B", isCorrect: false },
          ],
        };
      } else if (type === "true_false") {
        body = { ...body, correctBoolean: true, choices: [] };
      } else {
        body = { ...body, acceptableAnswers: ["answer"], choices: [] };
      }
      const created = await client.createQuestionForQuiz(qid, body);
      setQuestions([...questions, created].sort((a, b) => a.order - b.order));
      setActiveTab("questions");
    } catch (e: unknown) {
      setError("Could not add question.");
    } finally {
      setSaving(false);
    }
  };

  if (!cid || !qid) return null;
  if (!isFaculty) return null;

  if (loading || !quiz) {
    return (
      <div className="p-3 text-muted">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading editor…
      </div>
    );
  }

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  return (
    <div id="wd-quiz-editor" className="p-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div>
          <h4 className="mb-0">Edit quiz</h4>
          <div className="text-muted small">
            {quiz.published ? "Published" : "Draft"} · {questions.length} questions ·{" "}
            {totalPoints} pts total
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link href={`/courses/${cid}/quizzes/${qid}/preview`}>
            <Button variant="outline-secondary" size="sm" className="wd-quiz-admin-btn">
              Preview
            </Button>
          </Link>
          <Link href={`/courses/${cid}/quizzes/${qid}`}>
            <Button variant="outline-secondary" size="sm" className="wd-quiz-admin-btn">
              Details
            </Button>
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <Tab.Container
        activeKey={activeTab}
        onSelect={(k) => setActiveTab((k as typeof activeTab) || "details")}
      >
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="details">
            <div className="d-flex justify-content-end gap-2 mb-3">
              <Button variant="secondary" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="outline-danger" onClick={handleSaveAndPublish} disabled={saving}>
                Save & Publish
              </Button>
            </div>

            <FormLabel className="fw-bold">Title</FormLabel>
            <FormControl
              className="mb-3"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <FormLabel className="fw-bold">Description / instructions</FormLabel>
            <textarea
              className="form-control mb-3"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="row">
              <div className="col-md-4 mb-3">
                <FormLabel>Available from</FormLabel>
                <FormControl
                  type="date"
                  value={form.availableFrom}
                  onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormLabel>Available until</FormLabel>
                <FormControl
                  type="date"
                  value={form.availableUntil}
                  onChange={(e) => setForm({ ...form, availableUntil: e.target.value })}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormLabel>Due</FormLabel>
                <FormControl
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <FormLabel>Quiz type</FormLabel>
                <FormSelect
                  value={form.quizType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quizType: e.target.value as NonNullable<Quiz["quizType"]>,
                    })
                  }
                >
                  <option value="GRADED_QUIZ">Graded Quiz</option>
                  <option value="PRACTICE_QUIZ">Practice Quiz</option>
                  <option value="GRADED_SURVEY">Graded Survey</option>
                  <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                </FormSelect>
              </div>
              <div className="col-md-6 mb-3">
                <FormLabel>Assignment group</FormLabel>
                <FormSelect
                  value={form.assignmentGroup}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      assignmentGroup: e.target.value as NonNullable<Quiz["assignmentGroup"]>,
                    })
                  }
                >
                  <option value="QUIZZES">Quizzes</option>
                  <option value="EXAMS">Exams</option>
                  <option value="ASSIGNMENTS">Assignments</option>
                  <option value="PROJECT">Project</option>
                </FormSelect>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <FormCheck
                  className="mb-2"
                  type="checkbox"
                  id="wd-time-limit-enabled"
                  label="Time limit"
                  checked={hasTimeLimit}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasTimeLimit(checked);
                    setForm({
                      ...form,
                      timeLimitMinutes: checked
                        ? form.timeLimitMinutes > 0
                          ? form.timeLimitMinutes
                          : 20
                        : 0,
                    });
                  }}
                />
                <FormLabel>Minutes</FormLabel>
                <FormControl
                  type="number"
                  min={1}
                  value={hasTimeLimit ? form.timeLimitMinutes : ""}
                  disabled={!hasTimeLimit}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    setForm({ ...form, timeLimitMinutes: Number.isFinite(n) ? Math.max(1, n) : 1 });
                  }}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormLabel>Access code (optional)</FormLabel>
                <FormControl
                  value={form.accessCode}
                  onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
                />
              </div>
              <div className="col-md-4 mb-3">
                <FormLabel>How many attempts</FormLabel>
                <FormControl
                  type="number"
                  min={1}
                  value={form.howManyAttempts}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    setForm({ ...form, howManyAttempts: Number.isFinite(n) ? Math.max(1, n) : 1 });
                  }}
                  disabled={!form.multipleAttempts}
                />
              </div>
            </div>

            <FormCheck
              className="mb-2"
              type="checkbox"
              id="wd-shuffle"
              label="Shuffle questions"
              checked={form.shuffleQuestions}
              onChange={(e) => setForm({ ...form, shuffleQuestions: e.target.checked })}
            />
            <FormCheck
              className="mb-2"
              type="checkbox"
              id="wd-one-q"
              label="One question at a time"
              checked={form.oneQuestionAtATime}
              onChange={(e) => setForm({ ...form, oneQuestionAtATime: e.target.checked })}
            />
            <FormCheck
              className="mb-2"
              type="checkbox"
              id="wd-multi-att"
              label="Allow multiple attempts"
              checked={form.multipleAttempts}
              onChange={(e) => setForm({ ...form, multipleAttempts: e.target.checked })}
            />
            <FormCheck
              className="mb-2"
              type="checkbox"
              id="wd-webcam-required"
              label="Webcam required"
              checked={form.webcamRequired}
              onChange={(e) => setForm({ ...form, webcamRequired: e.target.checked })}
            />
            <FormCheck
              className="mb-2"
              type="checkbox"
              id="wd-lock-after-answering"
              label="Lock questions after answering"
              checked={form.lockQuestionsAfterAnswering}
              onChange={(e) =>
                setForm({ ...form, lockQuestionsAfterAnswering: e.target.checked })
              }
            />
            <FormCheck
              className="mb-3"
              type="checkbox"
              id="wd-show-correct"
              label="Show correct answers after submission"
              checked={form.showCorrectAnswers}
              onChange={(e) => setForm({ ...form, showCorrectAnswers: e.target.checked })}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="questions">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <Button
                size="sm"
                variant="outline-danger"
                className="wd-quiz-admin-btn"
                disabled={saving}
                onClick={() => addQuestion()}
              >
                + New Question
              </Button>
              <div className="d-flex gap-2">
                <Button variant="secondary" size="sm" className="wd-quiz-admin-btn" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" className="wd-quiz-admin-btn" onClick={handleSave} disabled={saving}>
                  Save quiz
                </Button>
              </div>
            </div>

            {questions.length === 0 ? (
              <p className="text-muted">No questions yet. Add one using the button above.</p>
            ) : (
              questions.map((q) => (
                <QuestionEditorCard
                  key={q._id}
                  question={q}
                  onRemoved={(id) => setQuestions(questions.filter((x) => x._id !== id))}
                  onUpdated={(updated) =>
                    setQuestions(
                      questions.map((x) => (x._id === updated._id ? updated : x))
                    )
                  }
                />
              ))
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
