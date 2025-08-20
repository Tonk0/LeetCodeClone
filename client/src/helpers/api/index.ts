/* eslint-disable @typescript-eslint/no-throw-literal */
export interface RegData {
  login: string;
  email: string;
  password: string;
}
export interface LogData {
  login: string;
  password: string;
}
type Status = 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Memory Limit Exceeded' | 'Compilation Error';
export interface ProblemsQuery {
  search: string | undefined;
  tags: string | undefined;
  status: string | undefined;
  page: number;
}
export interface Problem {
  id: number;
  title: string;
  statuses: Array<Status>;
}
export interface ProblemDesc {
  id: number;
  title: string;
  description: string;
}
export interface ProblemPageQuery {
  search?: string | undefined;
  tags?: string | undefined;
  status?: string | undefined;
}
export interface SubmissionsQuery {
  search: string | undefined;
  page: number;
  statuses: string | undefined;
}
export interface Submission {
  id: number;
  status: string;
  title: string;
  submitted_at: string;
}
export interface SubmissionForProblem {
  id: number;
  memory_used: number;
  execution_time: number;
  submitted_at: string;
  programming_language: string;
  status: string;
}

export interface Tag {
  id: number,
  name: string,
}
/* AUTH HANDLERS */
export const fetchAuth = async <T>(endpoint: string, data: T) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  return response.json();
};
export const verifyAuth = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/check`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Не авторизован');
  }
  return 'Успешно';
};

/* PROBLEM HANDLERS */

export const fetchProblems = async (query: ProblemsQuery): Promise<Problem[]> => {
  const {
    search, tags, page, status,
  } = query;
  let queryString = `?page=${page}`;
  if (search) {
    queryString += `&search=${encodeURIComponent(search)}`;
  }
  if (tags) {
    queryString += `&tags=${encodeURIComponent(tags)}`;
  }
  if (status) {
    queryString += `&status=${encodeURIComponent(status)}`;
  }
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/problems${queryString}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  return response.json();
};

export const fetchPagesForProblems = async (query: ProblemPageQuery):
Promise<{ numOfPages: number }> => {
  const { search, status, tags } = query;
  let queryString = '';
  if (search) {
    queryString += `&search=${encodeURIComponent(search)}`;
  }
  if (tags) {
    queryString += `&tags=${encodeURIComponent(tags)}`;
  }
  if (status) {
    queryString += `&status=${encodeURIComponent(status)}`;
  }
  queryString = queryString.replace('&', '?');

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/problems/pageCount${queryString}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  return response.json();
};

export const fetchProblem = async (problemId: string): Promise<ProblemDesc> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/problems/${problemId}`, {
    method: 'GET',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  return response.json();
};

export const fetchSubmissionsForProblem = async (problemId: string):
Promise<SubmissionForProblem[]> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/problems/${problemId}/submissions`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  return response.json();
};

export const fetchTemplate = async (id: string, language: string):
Promise<{ template: string }> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/problems/${id}/template?language=${encodeURIComponent(language)}`, {
    method: 'GET',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  return response.json();
};

export const sendUserCode = async (id:string, lang: string, code: string) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/problems/${id}/sendCode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lang, code }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw {
      message: errData.message,
      status: response.status,
    };
  }
  return response.json();
};
/* SUBMISSION HANDLERS */

export const fetchSubmissions = async (query: SubmissionsQuery): Promise<Submission[]> => {
  const {
    search, page, statuses,
  } = query;
  let queryString = `?page=${page}`;
  if (search) {
    queryString += `&search=${encodeURIComponent(search)}`;
  }
  if (statuses) {
    queryString += `&statuses=${encodeURIComponent(statuses)}`;
  }
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/submissions${queryString}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  return response.json();
};

/* TAGS HANDLERS */

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tags`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Неизвестная ошибка' }));
    throw new Error(errData.message);
  }
  return response.json();
};
