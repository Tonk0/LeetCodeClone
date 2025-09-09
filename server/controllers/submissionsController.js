const { response } = require('express');
const query = require('../db/db');
const findUserByToken = require('../helpers/FindUserByToken');
const getSubmissions = async (req, res) => {
  const { token } = req.cookies;
  const user = await findUserByToken(token);
  if (!user) {
    // return res.status(401).json({message: 'Пользователь не авторизован'})
    return res.status(200).json([]);
  }
  const {search, statuses, page = 1} = req.query;
  const queryString = `
    SELECT s.id, st.name as status, t.title, s.submitted_at FROM Submissions s
    JOIN Statuses st ON s.status_id = st.id
    JOIN Tasks t ON s.task_id = t.id
    WHERE s.user_id = $1
    AND ($2::text IS NULL OR t.title ILIKE '%' || $2 || '%')
    AND ($3::text[] is NULL OR st.name = ANY($3))
    ORDER BY s.submitted_at DESC
    LIMIT 20 OFFSET $4
  `
  const data = (await query(queryString, [user.id, search ?? null, statuses?.split(','), page > 0 ? (page - 1)*20 : 0])).rows;
  res.status(200).json(data);
}

const getSubmission = async (req, res) => {
  const {token} = req.cookies;
  const user = await findUserByToken(token);
  if (!user) {
    return res.status(401).json({message: 'Попытка не найдена'})
  }
  const {id} = req.params;
  // const queryString = `SELECT * FROM Submissions s WHERE s.id = $1 AND s.user_id = $2`;
  // const data = (await query(queryString, [id, user.id])).rows;
  // if (data.length <= 0) {
  //   return res.status(404).json({message: 'Попытка не найдена'})
  // }
  // res.status(200).json(data[0]);
  const queryString = `
    SELECT s.*, st.name as status, pl.name as programming_language,
    (SELECT COUNT(*) FROM Test_Cases WHERE task_id = s.task_id) as total_test_cases,
    (SELECT COUNT(*) + 1 FROM Test_Cases tc2 WHERE tc2.task_id = s.task_id AND tc2.id < s.wrong_test_case_id) as wrong_test_case_number, 
    tc.input as test_case_input,
    tc.expected_output as test_case_expected_output
    FROM Submissions s
    JOIN Statuses st ON s.status_id = st.id
    JOIN Programming_Languages pl ON s.programming_language_id = pl.id
    LEFT JOIN Test_Cases tc ON s.wrong_test_case_id = tc.id
    WHERE s.id = $1 AND s.user_id = $2
  `
  const data = (await query(queryString, [id, user.id])).rows;
  if (data.length <= 0) {
    return res.status(404).json({message: 'Попытка не найдена'})
  }
  const submission = data[0];

  const errorStatuses = ['Time Limit Exceeded', 'Runtime Error', 'Memory Limit Exceeded', 'Compilation Error'];
  const isError = errorStatuses.includes(submission.status);
  const isCorrect = submission.status === 'Accepted';
  let attempt;
  if (isError) {
    attempt = {
      isError: true,
      status: submission.status,
      errorData: submission.error_data || undefined
    };
  } else if (isCorrect) {
    attempt = {
      isError: false,
      isCorrect: true,
      status: submission.status,
      numOfTestCases: submission.total_test_cases,
      runtime: parseFloat(submission.execution_time) || 0,
      memory: submission.memory_used || 0,
    }
  } else {
    attempt = {
      isError: false,
      isCorrect: false,
      status: submission.status,
      numOfTestCases: submission.total_test_cases,
      wrongTestCase: submission.wrong_test_case_number || 0,
      testCase: submission.wrong_test_case_number ? {
        id: submission.wrong_test_case_id,
        task_id: submission.task_id,
        input: submission.test_case_input,
        expected_output: submission.test_case_expected_output
      } : null,
      userOutput: submission.user_output || null,
      userLog: submission.user_log ? JSON.parse(submission.user_log) : []
    }
  }
  const response = {
    id: submission.id,
    submitted_at: submission.submitted_at,
    programming_language: submission.programming_language,
    status: submission.status,
    code: submission.code,
    attemptData: attempt
  }
  res.status(200).json(response);
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
  getNumOfPage,
  getSubmission
}