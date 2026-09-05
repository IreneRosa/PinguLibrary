import type { Book, Loan } from './types.js';

const API_BASE_URL = 'http://localhost:8080/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options
  });

  if (!response.ok) {
    let message = `Errore ${response.status}`;
    try {
      const error = await response.json() as { message?: string };
      message = error.message ?? message;
    } catch {
      // Some API errors have no response body.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const libraryApi = {
  getBooks: () => request<Book[]>('/books'),
  searchBooks: (filters: Record<string, string>) => {
    const query = new URLSearchParams(filters).toString();
    return request<Book[]>(`/books/findByInfo${query ? `?${query}` : ''}`);
  },
  getLoans: () => request<Loan[]>('/loans'),
  createBook: (book: Book) => request<Book>('/books', { method: 'POST', body: JSON.stringify(book) }),
  updateBook: (id: string, book: Book) => request<Book>(`/books/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(book) }),
  deleteBook: (id: string) => request<void>(`/books/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createLoan: (loan: Loan) => request<Loan>('/loans', { method: 'POST', body: JSON.stringify(loan) }),
  updateLoan: (id: string, loan: Loan) => request<Loan>(`/loans/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(loan) }),
  deleteLoan: (id: string) => request<void>(`/loans/${encodeURIComponent(id)}`, { method: 'DELETE' })
};
