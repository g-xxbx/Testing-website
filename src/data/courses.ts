import type { Question } from '@/types'
import { questions as ethicsQuestions } from './questions'
import xiRaw from './习近平思想_全部章节.json'

export interface CourseInfo {
  id: string
  name: string
  questions: Question[]
}

function flattenXiQuestions(raw: typeof xiRaw): Question[] {
  let id = 1
  const result: Question[] = []
  for (const hw of raw.homeworks) {
    for (const q of hw.questions) {
      result.push({
        id: id++,
        type: q.type as 'single' | 'multiple',
        text: q.text,
        options: q.options,
        correct: q.correct,
      })
    }
  }
  return result
}

export const courses: CourseInfo[] = [
  {
    id: 'ethics',
    name: '工程伦理及项目管理',
    questions: ethicsQuestions,
  },
  {
    id: 'xi',
    name: '习近平新时代中国特色社会主义思想概论',
    questions: flattenXiQuestions(xiRaw),
  },
]
