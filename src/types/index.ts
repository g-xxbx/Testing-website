export type QuestionType = "single" | "multiple";

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options: string[];
  correct: number[];
  explanation?: string;
}

export type AnswerState = "correct" | "wrong" | null;
