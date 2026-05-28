"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { courses } from "@/data/courses";
import QuizHeader from "@/components/QuizHeader";
import QuestionCard from "@/components/QuestionCard";
import QuizFooter from "@/components/QuizFooter";
import type { AnswerState } from "@/types";

function getStorageKey(courseId: string) {
  return `quiz-progress-${courseId}`;
}

function loadProgress(key: string) {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function Home() {
  const [selectedCourseId, setSelectedCourseId] = useState('ethics');
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [states, setStates] = useState<Record<number, AnswerState>>({});
  const [loaded, setLoaded] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQuestionIds, setReviewQuestionIds] = useState<number[]>([]);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) ?? courses[0];
  const questions = currentCourse.questions;

  const storageKey = getStorageKey(selectedCourseId);

  useEffect(() => {
    const saved = loadProgress(storageKey);
    if (saved) {
      setAnswers(saved.answers ?? {});
      setStates(saved.states ?? {});
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answers, states }));
    } catch {}
  }, [answers, states, loaded, storageKey]);

  const correctCount = useMemo(
    () => Object.values(states).filter((s) => s === "correct").length,
    [states]
  );

  const reviewCorrectCount = useMemo(
    () => reviewQuestionIds.filter((id) => states[id] === "correct").length,
    [reviewQuestionIds, states]
  );

  const displayedQuestions = useMemo(() => {
    if (reviewMode) {
      return questions.filter((q) => reviewQuestionIds.includes(q.id));
    }
    return questions;
  }, [reviewMode, reviewQuestionIds, questions]);

  const handleAnswer = useCallback(
    (questionId: number, selected: number[], state: AnswerState) => {
      setAnswers((prev) => ({ ...prev, [questionId]: selected }));
      setStates((prev) => ({ ...prev, [questionId]: state }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setAnswers({});
    setStates({});
    setReviewMode(false);
    setReviewQuestionIds([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  const handleCourseChange = useCallback((courseId: string) => {
    setAnswers({});
    setStates({});
    setReviewMode(false);
    setReviewQuestionIds([]);
    setSelectedCourseId(courseId);
  }, []);

  const handleToggleReview = useCallback(() => {
    if (reviewMode) {
      setReviewMode(false);
      setReviewQuestionIds([]);
    } else {
      const wrongIds = questions
        .filter((q) => states[q.id] === "wrong")
        .map((q) => q.id);

      if (wrongIds.length === 0) return;

      setReviewQuestionIds(wrongIds);

      setAnswers((prev) => {
        const next = { ...prev };
        wrongIds.forEach((id) => delete next[id]);
        return next;
      });
      setStates((prev) => {
        const next = { ...prev };
        wrongIds.forEach((id) => delete next[id]);
        return next;
      });

      setReviewMode(true);
    }
  }, [reviewMode, states, questions]);

  const handleExportMistakes = useCallback(() => {
    const mistakes = questions
      .filter((q) => {
        const state = states[q.id];
        return state === "wrong" || state === null;
      })
      .map((q) => ({
        id: q.id,
        type: q.type,
        text: q.text,
        options: q.options,
        correct: q.correct,
        yourAnswer: answers[q.id] ?? [],
        explanation: q.explanation ?? "",
      }));

    const text = JSON.stringify(mistakes, null, 2);
    console.log("错题 (Mistakes):", text);
    navigator.clipboard.writeText(text).catch(() => {});
  }, [answers, states, questions]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <QuizHeader
        courses={courses}
        selectedCourseId={selectedCourseId}
        onCourseChange={handleCourseChange}
        correctCount={correctCount}
        totalCount={questions.length}
        reviewMode={reviewMode}
        reviewCorrectCount={reviewCorrectCount}
        reviewTotalCount={reviewQuestionIds.length}
      />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {displayedQuestions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">
              {reviewMode ? "所有错题都已重新答对！" : "开始答题吧！"}
            </p>
          </div>
        ) : (
          displayedQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={q.id - 1}
              answerState={states[q.id] ?? null}
              selectedOptions={answers[q.id] ?? []}
              onAnswer={handleAnswer}
            />
          ))
        )}
      </main>

      <QuizFooter
        reviewMode={reviewMode}
        onToggleReview={handleToggleReview}
        onReset={handleReset}
        onExportMistakes={handleExportMistakes}
        hasWrongQuestions={Object.values(states).some((s) => s === "wrong")}
      />
    </div>
  );
}
