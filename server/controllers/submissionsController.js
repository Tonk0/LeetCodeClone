const query = require('../db/db');
const findUserByToken = require('../helpers/FindUserByToken');
const getSubmissions = async (req, res) => {
  const { token } = req.cookies;
  const user = await findUserByToken(token);
  if (!user) {
    return res.status(401).json({message: 'Пользователь не авторизован'})
  }
  const {search, statuses, page = 1} = req.query;
  const queryString = `
    SELECT st.name as status, t.title, s.submitted_at FROM Submissions s
    JOIN Statuses st ON s.status_id = st.id
    JOIN Tasks t ON s.task_id = t.id
    WHERE s.user_id = $1
    AND ($2::text IS NULL OR t.title ILIKE '%' || $2 || '%')
    AND ($3::text[] is NULL OR st.name = ANY($3))
    LIMIT 20 OFFSET $4
  `
  const data = (await query(queryString, [user.id, search ?? null, statuses?.split(','), page > 0 ? (page - 1)*20 : 0])).rows;
  res.status(200).json(data);
}
const getNumOfPage = async (req, res) => {
  const { token } = req.cookies;
  const user = await findUserByToken(token);
  if (!user) {
    return res.status(401).json({message: 'Пользователь не авторизован'})
  }
  const {search, statuses} = req.query;
  const queryString = `
    SELECT COUNT(DISTINCT s.id) FROM Submissions s
    JOIN Statuses st ON s.status_id = st.id
    JOIN Tasks t ON s.task_id = t.id
    WHERE s.user_id = $1
    AND ($2::text IS NULL OR t.title ILIKE '%' || $2 || '%')
    AND ($3::text[] is NULL OR st.name = ANY($3))
  `
  const data = (await query(queryString, [user.id, search ?? null, statuses?.split(',')]));
  res.status(200).json({numOfPages: Math.ceil(data.rows[0].count/20)});
}

module.exports = {
  getSubmissions,
  getNumOfPage
}