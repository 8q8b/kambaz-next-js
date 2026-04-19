"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaEllipsisV, FaPlus, FaRegCircle, FaSearch } from "react-icons/fa";
import { RootState } from "../../../store";
import * as client from "./client";
import type { Quiz } from "./client";
import { availabilityLabel, formatShortDate } from "./availability";

type RowQuiz = Quiz & {
  lastScore?: number | null;
  lastMax?: number | null;
  questionCount?: number;
};

export default function QuizzesPage() {
  const params = useParams();
  const router = useRouter();
  const cid =
    typeof params.cid === "string"
      ? params.cid
      : Array.isArray(params.cid)
        ? params.cid[0]
        : undefined;
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty =
    !!currentUser &&
    ((currentUser as { role?: string }).role === "FACULTY" ||
      (currentUser as { role?: string }).role === "ADMIN");

  const [quizzes, setQuizzes] = useState<RowQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    if (!cid) return;
    setLoading(true);
    try {
      const list = await client.findQuizzesForCourse(cid);
      const enriched = await Promise.all(
        list.map(async (q) => {
          try {
            const [detail, questions] = await Promise.all([
              client.findQuizById(q._id),
              client.findQuestionsForQuiz(q._id),
            ]);
            return {
              ...detail,
              questionCount: questions.length,
            };
          } catch {
            return { ...q, questionCount: 0 };
          }
        })
      );
      if (!isFaculty) {
        const withAttempts = await Promise.all(
          enriched.map(async (q) => {
            try {
              const a = await client.findLastQuizAttempt(q._id);
              return {
                ...q,
                lastScore: a.score ?? null,
                lastMax: a.maxScore ?? null,
              };
            } catch {
              return { ...q, lastScore: null, lastMax: null };
            }
          })
        );
        setQuizzes(withAttempts);
      } else {
        setQuizzes(enriched);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [cid, isFaculty]);

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleAddQuiz = async () => {
    if (!cid || !isFaculty) return;
    const created = await client.createQuizForCourse(cid, {
      title: "Untitled Quiz",
      description: "",
      published: false,
    });
    router.push(`/courses/${cid}/quizzes/${created._id}/edit`);
  };

  const handlePublish = async (quizId: string, published: boolean) => {
    await client.setQuizPublished(quizId, published);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await client.deleteQuiz(deleteId);
    setDeleteId(null);
    await load();
  };

  return (
    <div id="wd-quizzes" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <InputGroup style={{ maxWidth: 360 }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <FormControl
            placeholder="Search for Quiz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        {isFaculty && (
          <Button variant="danger" size="lg" onClick={handleAddQuiz} id="wd-add-quiz">
            <FaPlus className="me-2" />
            Quiz
          </Button>
        )}
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem className="p-0 mb-3 border-gray">
          <div className="bg-secondary p-3 fs-5">QUIZZES</div>
          {loading ? (
            <div className="p-4 text-center text-muted">
              <Spinner animation="border" size="sm" className="me-2" />
              Loading quizzes…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-muted">
              {quizzes.length === 0 ? (
                isFaculty ? (
                  <>No quizzes yet. Create one to get started.</>
                ) : (
                  <>No quizzes are available in this course yet.</>
                )
              ) : (
                <>No quizzes match your search.</>
              )}
            </div>
          ) : (
            <ListGroup variant="flush" className="rounded-0">
              {filtered.map((quiz) => (
                <ListGroupItem
                  key={quiz._id}
                  className="d-flex align-items-start py-3 wd-quiz-row"
                >
                  <div className="me-3 mt-1 text-success">
                    {quiz.published ? (
                      <FaCheckCircle title="Published" />
                    ) : (
                      <FaRegCircle className="text-muted" title="Unpublished" />
                    )}
                  </div>
                  <div className="flex-fill">
                    <Link
                      href={`/courses/${cid}/quizzes/${quiz._id}`}
                      className="fw-bold text-decoration-none text-dark"
                    >
                      {quiz.title}
                    </Link>
                    <div className="text-muted small">
                      <span className="text-danger">{availabilityLabel(quiz)}</span>
                      {" · "}
                      {quiz.published ? "Published" : "Draft"}
                      {quiz.dueDate && ` · Due ${formatShortDate(quiz.dueDate)}`}
                      {quiz.questionCount != null && ` · ${quiz.questionCount} questions`}
                      {quiz.pointsPossible != null && ` · ${quiz.pointsPossible} pts`}
                    </div>
                    {!isFaculty && (
                      <div className="small mt-1">
                        {quiz.lastScore != null && quiz.lastMax != null ? (
                          <span>
                            Last score:{" "}
                            <strong>
                              {quiz.lastScore} / {quiz.lastMax}
                            </strong>
                          </span>
                        ) : (
                          <span className="text-muted">No attempts yet</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {isFaculty && (
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          variant="link"
                          className="text-muted p-0 border-0"
                          id={`wd-quiz-menu-${quiz._id}`}
                        >
                          <FaEllipsisV />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            as={Link}
                            href={`/courses/${cid}/quizzes/${quiz._id}/edit`}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            as={Link}
                            href={`/courses/${cid}/quizzes/${quiz._id}/preview`}
                          >
                            Preview
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          {quiz.published ? (
                            <Dropdown.Item
                              onClick={() => handlePublish(quiz._id, false)}
                            >
                              Unpublish
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item
                              onClick={() => handlePublish(quiz._id, true)}
                            >
                              Publish
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() => setDeleteId(quiz._id)}
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </ListGroupItem>
      </ListGroup>

      <Modal show={deleteId !== null} onHide={() => setDeleteId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This removes the quiz, all questions, and student attempts. Continue?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
