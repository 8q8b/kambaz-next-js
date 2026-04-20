import type { AttemptAnswerPayload, Question, Quiz, QuizAttempt } from "./client";

export function maxAttemptsForQuiz(quiz: Quiz): number {
  if (!quiz.multipleAttempts) return 1;
  const n = Number(quiz.howManyAttempts);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(100, Math.floor(n));
}

export function canStartNewSubmittedAttempt(quiz: Quiz, lastSubmitted: QuizAttempt | null) {
  const max = maxAttemptsForQuiz(quiz);
  const used = lastSubmitted?.attemptNumber ?? 0;
  return used < max;
}

/** Deterministic shuffle (Fisher–Yates) for stable order per attempt id. */
export function shuffleQuestions(questions: Question[], seedStr: string): Question[] {
  const arr = [...questions].sort((a, b) => a.order - b.order);
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed + seedStr.charCodeAt(i) * (i + 1)) >>> 0;
  }
  const rnd = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type AnswerState = Record<
  string,
  { selectedChoiceId?: string; booleanAnswer?: boolean | null; textAnswer?: string }
>;

export function buildSubmitPayload(
  orderedQuestions: Question[],
  state: AnswerState
): AttemptAnswerPayload[] {
  return orderedQuestions.map((q) => {
    const s = state[q._id] || {};
    const base: AttemptAnswerPayload = { question: q._id };
    if (q.type === "multiple_choice" && s.selectedChoiceId) {
      base.selectedChoiceId = s.selectedChoiceId;
    }
    if (q.type === "true_false" && typeof s.booleanAnswer === "boolean") {
      base.booleanAnswer = s.booleanAnswer;
    }
    if (q.type === "fill_blank" && s.textAnswer != null && String(s.textAnswer).trim() !== "") {
      base.textAnswer = String(s.textAnswer);
    }
    return base;
  });
}

export function normalizeFillBlankAnswer(value: string) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function scoreQuestionForPreview(
  question: Question,
  state: AnswerState[string] | undefined
): { isCorrect: boolean; pointsEarned: number; pointsPossible: number } {
  const pointsPossible = Number(question.points) || 0;
  if (!state) {
    return { isCorrect: false, pointsEarned: 0, pointsPossible };
  }
  if (question.type === "multiple_choice") {
    const id = state.selectedChoiceId;
    if (!id) return { isCorrect: false, pointsEarned: 0, pointsPossible };
    const choice = (question.choices || []).find((c) => c._id === id);
    if (!choice?.isCorrect) return { isCorrect: false, pointsEarned: 0, pointsPossible };
    return { isCorrect: true, pointsEarned: pointsPossible, pointsPossible };
  }
  if (question.type === "true_false") {
    if (typeof state.booleanAnswer !== "boolean") {
      return { isCorrect: false, pointsEarned: 0, pointsPossible };
    }
    if (state.booleanAnswer === question.correctBoolean) {
      return { isCorrect: true, pointsEarned: pointsPossible, pointsPossible };
    }
    return { isCorrect: false, pointsEarned: 0, pointsPossible };
  }
  if (question.type === "fill_blank") {
    const raw = state.textAnswer;
    if (raw == null || String(raw).trim() === "") {
      return { isCorrect: false, pointsEarned: 0, pointsPossible };
    }
    const normalized = normalizeFillBlankAnswer(String(raw));
    const acceptable = (question.acceptableAnswers || []).map((a) =>
      normalizeFillBlankAnswer(String(a))
    );
    if (acceptable.some((a) => a === normalized)) {
      return { isCorrect: true, pointsEarned: pointsPossible, pointsPossible };
    }
    return { isCorrect: false, pointsEarned: 0, pointsPossible };
  }
  return { isCorrect: false, pointsEarned: 0, pointsPossible };
}

export function scoreAllForPreview(questions: Question[], state: AnswerState) {
  let score = 0;
  let maxScore = 0;
  const perQuestion = questions.map((q) => {
    const row = scoreQuestionForPreview(q, state[q._id]);
    maxScore += row.pointsPossible;
    score += row.pointsEarned;
    return { questionId: q._id, ...row };
  });
  return { score, maxScore, perQuestion };
}
