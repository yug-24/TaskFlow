import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeader = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const fetchTasks = async () => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/tasks`, { headers });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export const createTask = async (task: object) => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

export const updateTask = async (id: string, updates: object) => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

export const deleteTask = async (id: string) => {
  const headers = await getAuthHeader();
  await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers,
  });
};

export const toggleTask = async (id: string) => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers,
  });
  if (!res.ok) throw new Error('Failed to toggle task');
  return res.json();
};

export const fetchHabits = async () => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/habits`, { headers });
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
};

export const createHabit = async (habit: object) => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/habits`, {
    method: 'POST',
    headers,
    body: JSON.stringify(habit),
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
};

export const updateHabit = async (id: string, updates: object) => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/habits/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update habit');
  return res.json();
};

export const deleteHabit = async (id: string) => {
  const headers = await getAuthHeader();
  await fetch(`${API_BASE_URL}/habits/${id}`, {
    method: 'DELETE',
    headers,
  });
};
