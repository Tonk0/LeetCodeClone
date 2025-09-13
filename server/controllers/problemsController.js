const query = require("../db/db");
const findUserByToken = require('../helpers/FindUserByToken');
const runContainer = require("../helpers/RunContainer");
const getProblems = async (req, res) => {
  const {search, tags, page = 1, status} = req.query
  const { token } = req.cookies;
  const user = await findUserByToken(token);
  const queryString = `
    SELECT DISTINCT t.id, t.title,
      CASE 
        WHEN $4::integer IS NULL THEN NULL
        ELSE (
              SELECT array_agg(s.name) FROM submissions sub
              JOIN Statuses s ON sub.status_id = s.id
              WHERE sub.task_id = t.id
              AND ($4::integer IS NULL OR sub.user_id = $4)
        ) END as statuses
    FROM TASKS t
    LEFT JOIN task_tags tt ON t.id = tt.task_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE ($1::text IS NULL OR t.title ILIKE '%' || $1 || '%') AND ($2::text[] IS NULL OR tg.name = ANY($2))
    AND (
      $5::text IS NULL
      OR $4 IS NULL
      OR (
        $5 = 'solved' AND EXISTS (
          SELECT 1 FROM submissions sub
          JOIN statuses s ON sub.status_id = s.id
          WHERE sub.task_id = t.id AND sub.user_id = $4 AND s.name = 'Accepted'
        )
      )
      OR (
        $5 = 'attempted' AND EXISTS (
          SELECT 1 FROM submissions sub
          WHERE sub.task_id = t.id AND sub.user_id = $4
        ) AND NOT EXISTS (
            SELECT 1 FROM submissions sub
            JOIN statuses s ON sub.status_id = s.id
            WHERE sub.task_id = t.id AND sub.user_id = $4 AND s.name = 'Accepted'
        )
      )
    )
    LIMIT 20 OFFSET $3
  `
  const data = (await query(queryString, [search ?? null, tags?.split(','), page > 0 ? (page - 1)*20 : 0, user?.id, status ?? null])).rows;
  res.status(200).json(data)
}

const getProblem = async (req, res) => {
  const { id } = req.params;
  const queryString = `
    SELECT * FROM Tasks t WHERE t.id = $1
  `
  const data = (await query(queryString, [id])).rows;
  if (data.length <= 0) {
    return res.status(404).json({message: 'Задача не найдена'})
  }
  res.status(200).json(data[0]);
}

const getSubmissionsForProblem = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  const user = await findUserByToken(token);
  if (!user) {
    return res.status(401).json({message: 'Пользователь не найден'});
  }
  const queryString = `
    SELECT s.id, memory_used, execution_time, submitted_at, code, pm.name as programming_language, st.name as status FROM Submissions s
    LEFT JOIN Programming_Languages pm ON s.programming_language_id = pm.id
    LEFT JOIN Statuses st ON s.status_id = st.id
    WHERE task_id = $1 AND user_id = $2
    ORDER BY s.submitted_at DESC
  `
  const data = (await query(queryString, [id, user.id])).rows;
  res.status(200).json(data);
}

const getNumOfPage = async (req, res) => {
  const {search, tags, status} = req.query
  const { token } = req.cookies;
  const user = await findUserByToken(token);
  const queryString = `
    SELECT COUNT(DISTINCT t.id)
    FROM TASKS t
    LEFT JOIN task_tags tt ON t.id = tt.task_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE ($1::text IS NULL OR t.title ILIKE '%' || $1 || '%') AND ($2::text[] IS NULL OR tg.name = ANY($2))
    AND (
      $4::text IS NULL
      OR $3::integer IS NULL
      OR (
        $4 = 'solved' AND EXISTS (
          SELECT 1 FROM submissions sub
          JOIN statuses s ON sub.status_id = s.id
          WHERE sub.task_id = t.id AND sub.user_id = $3 AND s.name = 'Accepted'
        )
      )
      OR (
        $4 = 'attempted' AND EXISTS (
          SELECT 1 FROM submissions sub
          WHERE sub.task_id = t.id AND sub.user_id = $3
        ) AND NOT EXISTS (
            SELECT 1 FROM submissions sub
            JOIN statuses s ON sub.status_id = s.id
            WHERE sub.task_id = t.id AND sub.user_id = $3 AND s.name = 'Accepted'
        )
      )
    )
  `
  const data = (await query(queryString, [search ?? null, tags?.split(','), user?.id, status ?? null]));
  res.status(200).json({numOfPages: data.rows[0].count});
}

const getTemplate = async (req, res) => {
  const { id } = req.params;
  const { language } = req.query;
  const queryString = `
    SELECT template FROM Task_Templates tt
    JOIN Programming_Languages pl ON tt.programming_language_id = pl.id
    WHERE tt.task_id = $1 AND pl.name = $2
  `

  const data = (await query(queryString, [id, language])).rows[0];

  res.status(200).json(data);
}

const postSubmission = async (req, res) => {
  const {token} = req.cookies;
  const user = await findUserByToken(token);
  if (!user) {
    return res.status(401).json({message: 'Пользователь не авторизован'});
  }
  const { id } = req.params;
  const {lang, code} = req.body;
  try {
    const submissionObject = await runContainer(id, lang, code);
    const queryString = `
      INSERT INTO Submissions
        (user_id, task_id, status_id, memory_used, execution_time, code, programming_language_id, error_data, wrong_test_case_id, user_output, user_log)
      VALUES (
        $1,
        $2,
        (SELECT id FROM Statuses WHERE name = $3),
        $4,
        $5,
        $6,
        (SELECT id FROM Programming_Languages WHERE name = $7),
        $8,
        $9,
        $10,
        $11
      )
      RETURNING id
    `
    const values = [user.id, id, submissionObject.status, submissionObject.memory ?? null, submissionObject.runtime ?? null, code, lang, submissionObject.errorData ?? null, submissionObject.testCase?.id ?? null, JSON.stringify(submissionObject.userOutput) ?? null, JSON.stringify(submissionObject.userLog) ?? null]
    const data = (await query(queryString, values)).rows[0];
    return res.status(200).json({...submissionObject, userOutput: submissionObject.userOutput ?? 'null'});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Что-то пошло не так'});
  }
  // const queryString = `
  //   INSERT INTO Submissions
  //     (user_id, task_id, status_id, memory_used, execution_time, code, programming_language_id)
  //   VALUES (
  //     $1,
  //     $2,
  //     (SELECT id FROM Statuses WHERE name = $3),
  //     $4,
  //     $5,
  //     $6,
  //     (SELECT id FROM Programming_Languages WHERE name = $7)
  //   )
  //   RETURNING id
  // `
  // try {
  //   const submissionObject = await runContainer(id, lang, code);
  //   const values = [user.id, id, submissionObject.status, submissionObject.memory ?? null, submissionObject.runtime ?? null, code, lang]
  //   const data = (await query(queryString, values)).rows[0];
  //   return res.status(200).json(submissionObject);
  // } catch (err) {
  //   return res.status(500).json({message: 'Что-то пошло не так'})
  // }
}

module.exports = {
  getProblems,
  getNumOfPage,
  getProblem,
  getSubmissionsForProblem,
  getTemplate, 
  postSubmission,
}