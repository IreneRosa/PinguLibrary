import type { Book, Loan } from './types.js';

const demoBooks: Book[] = [
  { id: 'demo-1', title: 'La regina degli scacchi', year: 2014, language: 'Italiano', genres: ['Romanzo'], authors: [{ name: 'Walter', surname: 'Tevis' }], publishers: [{ name: 'Oscar Mondadori' }], availability: true, description: 'La storia di Beth Harmon e della sua ascesa nel mondo degli scacchi.' },
  { id: 'demo-2', title: 'Il barone rampante', year: 1957, language: 'Italiano', genres: ['Classico'], authors: [{ name: 'Italo', surname: 'Calvino' }], publishers: [{ name: 'Einaudi' }], availability: false, description: 'Un ragazzo sceglie di vivere sugli alberi e osservare il mondo da una nuova prospettiva.' },
  { id: 'demo-3', title: 'Klara e il sole', year: 2021, language: 'Italiano', genres: ['Fantascienza'], authors: [{ name: 'Kazuo', surname: 'Ishiguro' }], publishers: [{ name: 'Einaudi' }], availability: true, description: 'Un’amica artificiale racconta il legame tra tecnologia, cura e umanità.' }
];

const state: { books: Book[]; loans: Loan[] } = { books: [], loans: [] };
const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
const authorName = (book: Book) => book.authors?.map(author => `${author.name ?? ''} ${author.surname ?? ''}`.trim()).join(', ') || 'Autore non indicato';
const bookName = (book?: Book) => book?.title || 'Libro non indicato';
const showError = (target: HTMLElement, message: string) => { target.textContent = message; target.classList.remove('hidden'); };
const hideError = (target: HTMLElement) => target.classList.add('hidden');

function renderStats() {
  const available = state.books.filter(book => book.availability).length;
  const activeLoans = state.loans.filter(loan => !loan.returned).length;
  $('#catalog-stats').innerHTML = `
    <div class="stat"><strong>${state.books.length}</strong><span>Libri nel catalogo</span></div>
    <div class="stat"><strong>${available}</strong><span>Disponibili ora</span></div>
    <div class="stat"><strong>${activeLoans}</strong><span>Prestiti attivi</span></div>`;
}

function renderBooks(books = state.books) {
  const grid = $('#books-grid');
  if (!books.length) { grid.innerHTML = '<div class="empty">Nessun libro trovato. Prova a cambiare i filtri.</div>'; return; }
  grid.innerHTML = books.map(book => `
    <article class="book-card">
      <div class="cover">${book.img ? `<img src="${escapeHtml(book.img)}" alt="Copertina di ${escapeHtml(book.title)}">` : `<span class="cover-placeholder">${escapeHtml((book.title ?? 'P').slice(0, 1).toUpperCase())}</span>`}</div>
      <div class="book-content">
        <h3>${escapeHtml(book.title || 'Senza titolo')}</h3>
        <div class="book-meta">${escapeHtml(authorName(book))} · ${book.year ?? 'Anno n.d.'}</div>
        <p class="book-description">${escapeHtml(book.description || 'Nessuna descrizione disponibile.')}</p>
        <div class="card-footer"><span class="badge ${book.availability ? 'available' : 'unavailable'}">${book.availability ? 'Disponibile' : 'In prestito'}</span><button class="link-button" data-book-id="${escapeHtml(book.id ?? '')}">Gestisci</button></div>
      </div>
    </article>`).join('');
}

function renderLoans() {
  const list = $('#loans-list');
  if (!state.loans.length) { list.innerHTML = '<div class="empty">Nessun prestito registrato.</div>'; return; }
  list.innerHTML = state.loans.map(loan => `
    <article class="loan-row">
      <div><div class="loan-label">Libro</div><div class="loan-title">${escapeHtml(bookName(loan.book))}</div></div>
      <div><div class="loan-label">Lettore</div><div>${escapeHtml(`${loan.user?.name ?? ''} ${loan.user?.surname ?? ''}`.trim() || 'Utente non indicato')}</div></div>
      <div><div class="loan-label">Rientro previsto</div><div>${loan.loanEndDate ? new Date(loan.loanEndDate).toLocaleDateString('it-IT') : 'Non indicato'}</div></div>
      <span class="badge ${loan.returned ? 'available' : 'unavailable'}">${loan.returned ? 'Restituito' : 'In corso'}</span>
    </article>`).join('');
}

function loadData() {
  state.books = demoBooks.map(book => ({ ...book }));
  state.loans = [];
  renderStats(); renderBooks(); renderLoans();
}

function openModal(title: string, content: string, onSubmit: (form: HTMLFormElement) => Promise<void>) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true"><div class="modal-header"><h2>${title}</h2><button class="close" type="button" aria-label="Chiudi">×</button></div>${content}</div></div>`;
  const backdrop = root.querySelector<HTMLElement>('.modal-backdrop')!;
  const close = () => { root.innerHTML = ''; };
  root.querySelector('.close')!.addEventListener('click', close);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
  root.querySelector('form')!.addEventListener('submit', async event => { event.preventDefault(); await onSubmit(event.currentTarget as HTMLFormElement); close(); });
}

function openBookModal() {
  openModal('Aggiungi un libro', `<form><div class="form-grid"><label class="field full">Titolo<input class="input" name="title" required></label><label class="field">Autore<input class="input" name="author" required></label><label class="field">Anno<input class="input" name="year" type="number"></label><label class="field">Genere<input class="input" name="genre"></label><label class="field">Lingua<input class="input" name="language" value="Italiano"></label><label class="field full">Descrizione<textarea class="input" name="description" rows="3"></textarea></label></div><div class="modal-actions"><button class="secondary" type="button" onclick="this.closest('.modal-backdrop').remove()">Annulla</button><button class="primary">Salva libro</button></div></form>`, async form => {
    const data = new FormData(form);
    const [name, ...surname] = String(data.get('author') || '').trim().split(' ');
    const book: Book = { title: String(data.get('title')), year: Number(data.get('year')) || undefined, genres: [String(data.get('genre') || '')].filter(Boolean), language: String(data.get('language') || ''), description: String(data.get('description') || ''), authors: [{ name, surname: surname.join(' ') }], availability: true };
    state.books.unshift({ ...book, id: `local-${Date.now()}` }); renderStats(); renderBooks();
  });
}

function openLoanModal() {
  const options = state.books.map(book => `<option value="${escapeHtml(book.id ?? book.title ?? '')}">${escapeHtml(book.title)}</option>`).join('');
  openModal('Registra un prestito', `<form><div class="form-grid"><label class="field full">Libro<select class="input" name="book" required>${options}</select></label><label class="field">Nome lettore<input class="input" name="name" required></label><label class="field">Cognome lettore<input class="input" name="surname" required></label><label class="field">Email<input class="input" name="email" type="email"></label><label class="field">Rientro previsto<input class="input" name="endDate" type="date" required></label></div><div class="modal-actions"><button class="secondary" type="button" onclick="this.closest('.modal-backdrop').remove()">Annulla</button><button class="primary">Registra prestito</button></div></form>`, async form => {
    const data = new FormData(form); const book = state.books.find(item => (item.id ?? item.title) === data.get('book'));
    const loan: Loan = { book, user: { name: String(data.get('name')), surname: String(data.get('surname')), email: String(data.get('email') || '') }, loanStartDate: new Date().toISOString(), loanEndDate: new Date(`${data.get('endDate')}T12:00:00`).toISOString(), returned: false };
    state.loans.unshift({ ...loan, id: `local-loan-${Date.now()}` }); if (book) book.availability = false; renderStats(); renderBooks(); renderLoans();
  });
}

function openLoginModal() {
  openModal('Accedi alla tua area', `<form><div class="form-grid"><label class="field full">Email<input class="input" name="email" type="email" autocomplete="email" required></label><label class="field full">Password<input class="input" name="password" type="password" autocomplete="current-password" required></label></div><p class="subtle">L'accesso sarà collegato al servizio utenti quando sarà disponibile nell'API.</p><div class="modal-actions"><button class="secondary" type="button" onclick="this.closest('.modal-backdrop').remove()">Annulla</button><button class="primary">Accedi</button></div></form>`, async form => {
    const email = String(new FormData(form).get('email'));
    $('#login-button').textContent = email.split('@')[0] || 'Profilo';
  });
}

function setupEvents() {
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-view]').forEach(item => item.classList.remove('active')); button.classList.add('active');
    $('#catalog-view').classList.toggle('hidden', button.dataset.view !== 'catalog'); $('#loans-view').classList.toggle('hidden', button.dataset.view !== 'loans');
  }));
  $('#add-book').addEventListener('click', openBookModal); $('#add-loan').addEventListener('click', openLoanModal); $('#login-button').addEventListener('click', openLoginModal);
  $('#search-form').addEventListener('submit', event => { event.preventDefault(); const filters: Record<string, string> = {}; new FormData(event.currentTarget as HTMLFormElement).forEach((value, key) => { if (value) filters[key] = String(value); }); renderBooks(state.books.filter(book => Object.values(filters).every(value => `${book.title} ${authorName(book)} ${book.year} ${book.genres?.join(' ')}`.toLowerCase().includes(value.toLowerCase())))); });
  $('#reset-search').addEventListener('click', () => { ($('#search-form') as HTMLFormElement).reset(); renderBooks(); hideError($('#catalog-error')); });
}

setupEvents(); loadData();
