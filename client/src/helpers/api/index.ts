export interface regData {
  login: string;
  email: string;
  password: string;
}
export interface logData {
  login: string;
  password: string;
}

export const fetchAuth = async <T>(endpoint: string, data: T) => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({message: 'Неизвестная ошибка'}));
    throw new Error(errData.message);
  }
  return response.json();
}
