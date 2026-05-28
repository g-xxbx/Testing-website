"use client";

import type { CourseInfo } from "@/data/courses";

interface QuizHeaderProps {
  courses: CourseInfo[];
  selectedCourseId: string;
  onCourseChange: (courseId: string) => void;
  correctCount: number;
  totalCount: number;
  reviewMode?: boolean;
  reviewCorrectCount?: number;
  reviewTotalCount?: number;
}

export default function QuizHeader({
  courses,
  selectedCourseId,
  onCourseChange,
  correctCount,
  totalCount,
  reviewMode = false,
  reviewCorrectCount = 0,
  reviewTotalCount = 0,
}: QuizHeaderProps) {
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const reviewPercentage = reviewTotalCount > 0 ? Math.round((reviewCorrectCount / reviewTotalCount) * 100) : 0;
  const currentCourse = courses.find((c) => c.id === selectedCourseId) ?? courses[0];

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-800">
            {reviewMode ? "错题回顾" : currentCourse.name}
          </h1>
          <span className="text-sm text-gray-500">
            {reviewMode ? (
              <>
                <span className="font-semibold text-blue-500">{reviewCorrectCount}</span>
                <span className="mx-1">/</span>
                <span>{reviewTotalCount}</span>
                <span className="ml-2 font-semibold text-blue-500">{reviewPercentage}%</span>
              </>
            ) : (
              <>
                <span className="font-semibold text-blue-500">{correctCount}</span>
                <span className="mx-1">/</span>
                <span>{totalCount}</span>
                <span className="ml-2 font-semibold text-blue-500">{percentage}%</span>
              </>
            )}
          </span>
        </div>
        {!reviewMode && (
          <div className="flex gap-2 mb-3">
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => onCourseChange(course.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedCourseId === course.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {course.name}
              </button>
            ))}
          </div>
        )}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              reviewMode
                ? "bg-gradient-to-r from-orange-400 to-orange-500"
                : "bg-gradient-to-r from-blue-400 to-blue-500"
            }`}
            style={{ width: `${reviewMode ? reviewPercentage : percentage}%` }}
          />
        </div>
      </div>
    </header>
  );
}
