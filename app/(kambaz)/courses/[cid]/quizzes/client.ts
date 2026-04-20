import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const QUESTIONS_API = `${HTTP_SERVER}/api/questions`;

export type Quiz = {
  _id: string;
  course: string;
  title: string;
  description?: string;
  published?: boolean;
  availableFrom?: string;
  availableUntil?: string;
  dueDate?: string;
  quizType?:
    | "GRADED_QUIZ"
    | "PRACTICE_QUIZ"
    | "GRADED_SURVEY"
    | "UNGRADED_SURVEY";
  assignmentGroup?: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
  timeLimitMinutes?: number;
  shuffleQuestions?: boolean;
  oneQuestionAtATime?: boolean;
  multipleAttempts?: boolean;
  howManyAttempts?: number;
  accessCode?: string;
  showCorrectAnswers?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  pointsPossible?: number;
};

export type QuestionChoice = { _id: string; text: string; isCorrect: boolean };

export type Question = {
  _id: string;
  quiz: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  prompt: string;
  points: number;
  order: number;
  choices?: QuestionChoice[];
  correctBoolean?: boolean;
  acceptableAnswers?: string[];
};

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get<Quiz[]>(
    `${COURSES_API}/${courseId}/quizzes`
  );
  return data;
};

export const createQuizForCourse = async (
  courseId: string,
  quiz: Record<string, unknown>
) => {
  const { data } = await axiosWithCredentials.post<Quiz>(
    `${COURSES_API}/${courseId}/quizzes`,
    quiz
  );
  return data;
};

export const findQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get<Quiz>(
    `${QUIZZES_API}/${quizId}`
  );
  return data;
};

export const updateQuiz = async (
  quizId: string,
  updates: Record<string, unknown>
) => {
  const { data } = await axiosWithCredentials.put<Quiz>(
    `${QUIZZES_API}/${quizId}`,
    updates
  );
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
};

export const setQuizPublished = async (quizId: string, published: boolean) => {
  const { data } = await axiosWithCredentials.patch<Quiz>(
    `${QUIZZES_API}/${quizId}/publish`,
    { published }
  );
  return data;
};

export const findQuestionsForQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get<Question[]>(
    `${QUIZZES_API}/${quizId}/questions`
  );
  return data;
};

export const createQuestionForQuiz = async (
  quizId: string,
  question: Record<string, unknown>
) => {
  const { data } = await axiosWithCredentials.post<Question>(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return data;
};

export const updateQuestion = async (
  questionId: string,
  updates: Record<string, unknown>
) => {
  const { data } = await axiosWithCredentials.put<Question>(
    `${QUESTIONS_API}/${questionId}`,
    updates
  );
  return data;
};

export const deleteQuestion = async (questionId: string) => {
  await axiosWithCredentials.delete(`${QUESTIONS_API}/${questionId}`);
};

export type AttemptAnswerPayload = {
  question: string;
  selectedChoiceId?: string;
  booleanAnswer?: boolean;
  textAnswer?: string;
};

export type QuizAttemptAnswer = AttemptAnswerPayload & {
  isCorrect?: boolean;
  pointsEarned?: number;
  pointsPossible?: number;
};

export type QuizAttempt = {
  _id: string;
  quiz?: string;
  user?: string;
  attemptNumber?: number;
  status?: string;
  startedAt?: string;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
  answers?: QuizAttemptAnswer[];
};

export const findLastQuizAttempt = async (quizId: string) => {
  try {
    const { data } = await axiosWithCredentials.get<QuizAttempt>(
      `${QUIZZES_API}/${quizId}/attempts/last`
    );
    return data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return null;
    }
    throw e;
  }
};

export const findInProgressQuizAttempt = async (quizId: string) => {
  try {
    const { data } = await axiosWithCredentials.get<QuizAttempt>(
      `${QUIZZES_API}/${quizId}/attempts/in-progress`
    );
    return data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return null;
    }
    throw e;
  }
};

export const startQuizAttempt = async (
  quizId: string,
  body?: { accessCode?: string }
) => {
  const { data } = await axiosWithCredentials.post<QuizAttempt>(
    `${QUIZZES_API}/${quizId}/attempts`,
    body ?? {}
  );
  return data;
};

export const getQuizAttemptById = async (attemptId: string) => {
  const { data } = await axiosWithCredentials.get<QuizAttempt>(
    `${HTTP_SERVER}/api/quiz-attempts/${attemptId}`
  );
  return data;
};

export const submitQuizAttempt = async (
  attemptId: string,
  answers: AttemptAnswerPayload[]
) => {
  const { data } = await axiosWithCredentials.post<QuizAttempt>(
    `${HTTP_SERVER}/api/quiz-attempts/${attemptId}/submit`,
    { answers }
  );
  return data;
};
