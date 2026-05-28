"use client";

import { useState, useCallback } from "react";
import type { Question, AnswerState } from "@/types";

interface QuestionCardProps {
  question: Question;
  index: number;
  answerState: AnswerState;
  selectedOptions: number[];
  onAnswer: (questionId: number, selected: number[], state: AnswerState) => void;
}

export default function QuestionCard({
  question,
  index,
  answerState,
  selectedOptions,
  onAnswer,
}: QuestionCardProps) {
  const [localSelected, setLocalSelected] = useState<number[]>(selectedOptions);

  const isAnswered = answerState !== null;

  const handleSingleSelect = useCallback(
    (optionIndex: number) => {
      if (isAnswered) return;
      const isCorrect = question.correct.includes(optionIndex);
      onAnswer(question.id, [optionIndex], isCorrect ? "correct" : "wrong");
    },
    [isAnswered, question.correct, question.id, onAnswer]
  );

  const handleMultipleToggle = useCallback(
    (optionIndex: number) => {
      if (isAnswered) return;
      setLocalSelected((prev) => {
        if (prev.includes(optionIndex)) {
          return prev.filter((i) => i !== optionIndex);
        }
        return [...prev, optionIndex];
      });
    },
    [isAnswered]
  );

  const handleMultipleSubmit = useCallback(() => {
    if (isAnswered || localSelected.length === 0) return;
    const correct = question.correct;
    const isCorrect =
      localSelected.length === correct.length &&
      localSelected.every((i) => correct.includes(i));
    onAnswer(question.id, [...localSelected], isCorrect ? "correct" : "wrong");
  }, [isAnswered, localSelected, question.correct, question.id, onAnswer]);

  const getOptionClasses = (optionIndex: number) => {
    const base =
      "relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 min-h-[44px] text-left w-full";

    if (!isAnswered) {
      const isLocallySelected = localSelected.includes(optionIndex);
      if (question.type === "multiple" && isLocallySelected) {
        return `${base} border-blue-400 bg-blue-50 cursor-pointer`;
      }
      return `${base} border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-md cursor-pointer`;
    }

    const isSelected = selectedOptions.includes(optionIndex);
    const isCorrectOption = question.correct.includes(optionIndex);

    if (answerState === "correct") {
      if (isCorrectOption) {
        return `${base} border-green-500 bg-green-50`;
      }
      return `${base} border-gray-200 bg-white opacity-60`;
    }

    if (question.type === "single") {
      if (isSelected && !isCorrectOption) {
        return `${base} border-red-500 bg-red-50`;
      }
      if (isCorrectOption) {
        return `${base} border-green-500 bg-green-50`;
      }
      return `${base} border-gray-200 bg-white opacity-60`;
    }

    if (isSelected && isCorrectOption) {
      return `${base} border-green-500 bg-green-50`;
    }
    if (isSelected && !isCorrectOption) {
      return `${base} border-red-500 bg-red-50`;
    }
    if (!isSelected && isCorrectOption) {
      return `${base} border-yellow-500 border-dashed bg-yellow-50`;
    }
    return `${base} border-gray-200 bg-white opacity-60`;
  };

  const isSubmitDisabled = localSelected.length === 0 || isAnswered;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm shrink-0">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 leading-relaxed">{question.text}</p>
          <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {question.type === "single" ? "单选题" : "多选题"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, optIndex) => (
          <button
            key={optIndex}
            type="button"
            onClick={() => {
              if (isAnswered) return;
              if (question.type === "single") {
                handleSingleSelect(optIndex);
              } else {
                handleMultipleToggle(optIndex);
              }
            }}
            disabled={isAnswered}
            className={getOptionClasses(optIndex)}
          >
            <span
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-200 ${
                !isAnswered
                  ? localSelected.includes(optIndex)
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 text-gray-400"
                  : selectedOptions.includes(optIndex)
                  ? question.correct.includes(optIndex)
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-red-500 bg-red-500 text-white"
                  : question.correct.includes(optIndex)
                  ? "border-yellow-500 text-yellow-600"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {String.fromCharCode(65 + optIndex)}
            </span>
            <span className="text-sm text-gray-700">{option}</span>
          </button>
        ))}
      </div>

      {question.type === "multiple" && (
        <div className="mt-4 flex justify-end">
          {!isAnswered ? (
            <button
              type="button"
              onClick={handleMultipleSubmit}
              disabled={isSubmitDisabled}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              提交
            </button>
          ) : (
            <span className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium">
              已作答
            </span>
          )}
        </div>
      )}
    </div>
  );
}
