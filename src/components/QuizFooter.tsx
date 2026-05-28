"use client";

interface QuizFooterProps {
  reviewMode: boolean;
  onToggleReview: () => void;
  onReset: () => void;
  onExportMistakes: () => void;
  hasWrongQuestions: boolean;
}

export default function QuizFooter({
  reviewMode,
  onToggleReview,
  onReset,
  onExportMistakes,
  hasWrongQuestions,
}: QuizFooterProps) {
  return (
    <footer className="sticky bottom-0 z-10 bg-white/95 backdrop-blur-sm border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
        >
          重置所有答案
        </button>
        <button
          type="button"
          onClick={onToggleReview}
          disabled={!reviewMode && !hasWrongQuestions}
          className={`px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-colors duration-200 ${
            reviewMode
              ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
              : hasWrongQuestions
              ? "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              : "border-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          {reviewMode ? "退出回顾" : "错题回顾"}
        </button>
        <button
          type="button"
          onClick={onExportMistakes}
          className="px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 sm:ml-auto"
        >
          导出错题
        </button>
      </div>
    </footer>
  );
}
