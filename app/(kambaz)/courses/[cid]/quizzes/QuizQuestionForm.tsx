"use client";

import { Form } from "react-bootstrap";
import type { Question } from "./client";

export type QuestionAnswerValue = {
  selectedChoiceId?: string;
  booleanAnswer?: boolean | null;
  textAnswer?: string;
};

type Props = {
  question: Question;
  value: QuestionAnswerValue;
  onChange: (next: QuestionAnswerValue) => void;
  disabled?: boolean;
};

export default function QuizQuestionForm({ question, value, onChange, disabled }: Props) {
  if (question.type === "multiple_choice") {
    return (
      <div className="mt-2">
        {(question.choices || []).map((c) => (
          <Form.Check
            key={c._id}
            type="radio"
            name={`q-${question._id}`}
            id={`q-${question._id}-${c._id}`}
            label={c.text}
            checked={value.selectedChoiceId === c._id}
            disabled={disabled}
            onChange={() => onChange({ ...value, selectedChoiceId: c._id })}
          />
        ))}
      </div>
    );
  }

  if (question.type === "true_false") {
    return (
      <div className="mt-2 d-flex flex-column gap-1">
        <Form.Check
          type="radio"
          name={`q-${question._id}`}
          id={`q-${question._id}-t`}
          label="True"
          checked={value.booleanAnswer === true}
          disabled={disabled}
          onChange={() => onChange({ ...value, booleanAnswer: true })}
        />
        <Form.Check
          type="radio"
          name={`q-${question._id}`}
          id={`q-${question._id}-f`}
          label="False"
          checked={value.booleanAnswer === false}
          disabled={disabled}
          onChange={() => onChange({ ...value, booleanAnswer: false })}
        />
      </div>
    );
  }

  return (
    <Form.Control
      className="mt-2"
      type="text"
      value={value.textAnswer ?? ""}
      disabled={disabled}
      onChange={(e) => onChange({ ...value, textAnswer: e.target.value })}
      placeholder="Your answer"
    />
  );
}
