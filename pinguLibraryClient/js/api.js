const API_BASE_URL = 'http://localhost:8080/api';
async function request(path, options) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
        ...options
    });
    if (!response.ok) {
        let message = `Errore ${response.status}`;
        try {
            const error = await response.json();
            message = error.message ?? message;
        }
        catch {
            // Some API errors have no response body.
        }
        throw new Error(message);
    }
    if (response.status === 204)
        return undefined;
    return response.json();
}
export const libraryApi = {
    getBooks: () => request('/books'),
    searchBooks: (filters) => {
        const query = new URLSearchParams(filters).toString();
        return request(`/books/findByInfo${query ? `?${query}` : ''}`);
    },
    getLoans: () => request('/loans'),
    createBook: (book) => request('/books', { method: 'POST', body: JSON.stringify(book) }),
    updateBook: (id, book) => request(`/books/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(book) }),
    deleteBook: (id) => request(`/books/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    createLoan: (loan) => request('/loans', { method: 'POST', body: JSON.stringify(loan) }),
    updateLoan: (id, loan) => request(`/loans/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(loan) }),
    deleteLoan: (id) => request(`/loans/${encodeURIComponent(id)}`, { method: 'DELETE' })
};
