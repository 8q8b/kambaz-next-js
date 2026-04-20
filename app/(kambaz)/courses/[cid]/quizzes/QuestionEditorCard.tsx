"use client";

import { useState, useEffect } from "react";
import { Button, FormControl, FormLabel, InputGroup } from "react-bootstrap";
import type { Question, QuestionChoice } from "./client";
import * as client from "./client";

function newChoice(): QuestionChoice {
  return {
    _id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `c-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text: "",
    isCorrect: false,
  };
}

export default function QuestionEditorCard({
  question,
  onRemoved,
  onUpdated,
}: {
  question: Question;
  onRemoved: (id: string) => void;
  onUpdated: (q: Question) => void;
}) {
  const [draft, setDraft] = useState<Question>(question);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(question);
  }, [question]);

  const persist = async (body: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await client.updateQuestion(question._id, body);
      onUpdated(updated);
      setDraft(updated);
    } catch (e: unknown) {
      const msg =
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (e as { response: { data: { message: string } } }).response.data
              .message
          : "Could not save question";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (draft.type === "multiple_choice") {
      const choices = draft.choices || [];
      await persist({
        type: draft.type,
        prompt: draft.prompt,
        points: draft.points,
        order: draft.order,
        choices,
        acceptableAnswers: [],
        correctBoolean: undefined,
      });
      return;
    }
    if (draft.type === "true_false") {
      await persist({
        type: draft.type,
        prompt: draft.prompt,
        points: draft.points,
        order: draft.order,
        correctBoolean: draft.correctBoolean === true,
        choices: [],
        acceptableAnswers: [],
      });
      return;
    }
    const answers = (draft.acceptableAnswers || [])
      .map((a) => String(a).trim())
      .filter(Boolean);
    await persist({
      type: draft.type,
      prompt: draft.prompt,
      points: draft.points,
      order: draft.order,
      acceptableAnswers: answers,
      choices: [],
      correctBoolean: undefined,
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this question?")) return;
    setSaving(true);
    setError(null);
    try {
      await client.deleteQuestion(question._id);
      onRemoved(question._id);
    } catch {
      setError("Could not delete question");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="text-muted small">
          {draft.type.replace(/_/g, " ")} · {draft._id.slice(0, 8)}…
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-danger"
            size="sm"
            className="wd-quiz-admin-btn"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </Button>
          <Button variant="danger" size="sm" className="wd-quiz-admin-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
      {error && <div className="text-danger small mb-2">{error}</div>}

      <FormLabel className="fw-bold">Prompt</FormLabel>
      <FormControl
        className="mb-2"
        value={draft.prompt}
        onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
      />

      <FormLabel className="fw-bold">Points</FormLabel>
      <FormControl
        type="number"
        className="mb-3"
        style={{ maxWidth: 120 }}
        value={draft.points}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          setDraft({ ...draft, points: Number.isFinite(n) ? n : 0 });
        }}
      />

      {draft.type === "multiple_choice" && (
        <div>
          <FormLabel className="fw-bold">Choices (exactly one correct)</FormLabel>
          {(draft.choices || []).map((c, idx) => (
            <InputGroup key={c._id} className="mb-2">
              <InputGroup.Text>
                <input
                  type="radio"
                  name={`correct-${draft._id}`}
                  checked={c.isCorrect}
                  onChange={() => {
                    const choices = (draft.choices || []).map((ch, i) => ({
                      ...ch,
                      isCorrect: i === idx,
                    }));
                    setDraft({ ...draft, choices });
                  }}
                />
              </InputGroup.Text>
              <FormControl
                value={c.text}
                onChange={(e) => {
                  const choices = [...(draft.choices || [])];
                  choices[idx] = { ...c, text: e.target.value };
                  setDraft({ ...draft, choices });
                }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const choices = (draft.choices || []).filter((_, i) => i !== idx);
                  setDraft({ ...draft, choices });
                }}
              >
                −
              </Button>
            </InputGroup>
          ))}
          <Button
            variant="outline-secondary"
            size="sm"
            className="wd-quiz-admin-btn"
            onClick={() =>
              setDraft({
                ...draft,
                choices: [...(draft.choices || []), newChoice()],
              })
            }
          >
            Add choice
          </Button>
        </div>
      )}

      {draft.type === "true_false" && (
        <div>
          <FormLabel className="fw-bold">Correct answer</FormLabel>
          <div className="d-flex gap-3">
            <label className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={`tf-${draft._id}`}
                checked={draft.correctBoolean === true}
                onChange={() => setDraft({ ...draft, correctBoolean: true })}
              />
              <span className="form-check-label">True</span>
            </label>
            <label className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={`tf-${draft._id}`}
                checked={draft.correctBoolean === false}
                onChange={() => setDraft({ ...draft, correctBoolean: false })}
              />
              <span className="form-check-label">False</span>
            </label>
          </div>
        </div>
      )}

      {draft.type === "fill_blank" && (
        <div>
          <FormLabel className="fw-bold">Acceptable answers (one per line)</FormLabel>
          <textarea
            className="form-control"
            rows={3}
            value={(draft.acceptableAnswers || []).join("\n")}
            onChange={(e) =>
              setDraft({
                ...draft,
                acceptableAnswers: e.target.value.split("\n"),
              })
            }
          />
        </div>
      )}
    </div>
  );
}
