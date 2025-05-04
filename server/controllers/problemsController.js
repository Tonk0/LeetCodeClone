const query = require("../db/db");
const findUserByToken = require('../helpers/FindUserByToken');
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

module.exports = {
  getProblems,
  getNumOfPage,
  getProblem
}