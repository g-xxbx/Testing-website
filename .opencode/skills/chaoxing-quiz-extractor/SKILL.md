# Skill: chaoxing-quiz-extractor

# 超星学习通选择题摘录 Skill

提取学习通课程作业/考试中的选择题（题干 + 选项 + 正确答案 + 解析），输出为结构化 JSON。

## 工作流程

### Step 1: 用户登录

1. Open a new browser page to `https://i.chaoxing.com`
2. Wait for redirect to login page (`passport2.chaoxing.com`)
3. **Tell the user to manually enter their credentials** — OpenCode cannot bypass their SSO/CAS login
4. After login, the user should see the "个人空间" (dashboard) with their course list

### Step 2: 进入目标课程作业页面

1. Use `list_pages` + `take_snapshot` to find the target course in the course list iframe
2. Note the course URL has format: `https://mooc1-1.chaoxing.com/mooc-ans/visit/stucoursemiddle?courseid=XXX&clazzid=YYY&...`
3. Navigate to the course page, then click the "作业" tab (or navigate with `pageHeader=8`)
4. Wait for the iframe to load the homework list

### Step 3: 获取作业的 ID 数据

The homework list page is cross-origin when embedded in an iframe. **Open a new page directly** with the iframe's URL to access it directly.

**Key URL patterns:**

| Page | URL Pattern |
|------|-------------|
| Homework list | `https://mooc1.chaoxing.com/mooc-ans/mooc2/work/list?courseId=XXX&classId=YYY&...` |
| Homework view (作答记录) | `https://mooc1.chaoxing.com/mooc-ans/mooc2/work/view?courseId=XXX&classId=YYY&cpi=ZZZ&workId=WID&answerId=AID&enc=ENC&selectTimes=1` |

**Key data extraction points:**

- **作答记录 links**: `onclick="answerList(workId, answerId, 'enc')"` — contains all needed IDs
- **Main homework links** (no 作答记录): find via `data` attribute containing the work/task/view URL with `workId` and `answerId`
- **智能分析 links**: URL contains `relationId` which equals `workId`

### Step 4: 逐个提取作业详情

For each homework with an answer record:

1. Navigate to the view page URL with `selectTimes=1` (avoids the commitment dialog)
2. Wait for `document.readyState === "complete"`
3. Run the extraction script below

### Step 5: 提取脚本

```javascript
() => {
  const title = document.querySelector('h2')?.textContent?.trim() || '';
  const allH3 = document.querySelectorAll('h3');
  const questions = [];

  allH3.forEach(h3 => {
    const text = h3.textContent.trim();
    if (!text || !/^\d+/.test(text)) return;

    let container = h3.closest('[class]');
    while (container && !container.querySelector('li')) {
      container = container.parentElement;
    }
    if (!container || container.querySelector('h3') !== h3) return;

    const options = [];
    container.querySelectorAll('li').forEach(li => {
      options.push(li.textContent.trim());
    });

    const fullText = container.textContent;
    let myAnswer = '', correctAnswer = '', score = '', explanation = '';

    const myMatch = fullText.match(/我的答案[：:]\s*([ABCDE]+)/);
    if (myMatch) myAnswer = myMatch[1];

    const correctMatch = fullText.match(/正确答案[：:]\s*([ABCDE]+)/);
    if (correctMatch) correctAnswer = correctMatch[1];

    const scoreMatch = fullText.match(/([\d.]+)\s*分/);
    if (scoreMatch) score = scoreMatch[1];

    const explMatch = fullText.match(/答案解析[：:]\s*([^\n]+?)(?=AI讲解|$)/);
    if (explMatch) explanation = explMatch[1].trim();

    const type = text.includes('多选题') ? 'multiple' : 'single';
    const numMatch = text.match(/^(\d+)\./);
    const num = numMatch ? numMatch[1] : '';

    questions.push({
      id: num,
      type,
      text: text.replace(/^\d+\.\s*/, '').trim(),
      options,
      correct: correctAnswer ? correctAnswer.split('').map(c => c.charCodeAt(0) - 65) : [],
      myAnswer,
      correctAnswer,
      score,
      explanation
    });
  });

  return JSON.stringify({ title, questions }, null, 2);
}
```

Use `evaluate_script` with `filePath` to save each chapter's JSON to disk.

### Step 6: 合并结果

Merge all individual chapter JSON files into one combined file.

## 常见问题和注意事项

### 跨域 iframe 限制

课程主页和作业列表在 **不同子域名** 下：
- 主页: `mooc2-ans.chaoxing.com`
- 作业列表 iframe: `mooc1.chaoxing.com`

无法通过 JS 直接访问 iframe DOM。**解决方案**：在新标签页中直接打开 iframe 的 URL。

### 无"作答记录"的作业

有些作业没有"作答记录"链接，但仍有答题数据。在主链接的 `data` 属性中可直接提取 `workId` 和 `answerId`。

### 诚信承诺书弹窗

首次查看作业时可能出现"在线学习诚信承诺书"弹窗。解决方案：
1. 使用 `selectTimes=1` 参数（默认选择最近一次提交，跳过弹窗）
2. 如果弹窗仍出现，勾选 checkbox 后点击"开始学习"

### JSON 双重编码

`evaluate_script` 保存的 JSON 文件内容是一个被 `JSON.stringify` 过的字符串（双重编码）。读取时需解析两次：
```javascript
const inner = JSON.parse(raw);   // string → string
const data = JSON.parse(inner);  // string → object
```

### 输出数据结构

```typescript
interface Question {
  id: string;
  type: "single" | "multiple";
  text: string;
  options: string[];
  correct: number[];
  myAnswer: string;
  correctAnswer: string;
  score: string;
  explanation: string;
}

interface Homework {
  title: string;
  questionCount: number;
  questions: Question[];
}

interface FinalOutput {
  course: string;
  totalHomework: number;
  totalQuestions: number;
  homeworks: Homework[];
}
```

## 限制

- 仅适用于**已完成**的作业
- "待批阅"的作业无法提取
- 依赖页面 DOM 结构，若超星改版可能导致选择器失效
