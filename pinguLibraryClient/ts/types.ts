export interface Author {
  name?: string;
  surname?: string;
}

export interface Publisher {
  name?: string;
  city?: string;
}

export interface User {
  name?: string;
  surname?: string;
  email?: string;
  telephone?: string;
}

export interface Book {
  id?: string;
  title?: string;
  img?: string;
  year?: number;
  genres?: string[];
  description?: string;
  language?: string;
  publishers?: Publisher[];
  authors?: Author[];
  availability?: boolean;
}

export interface Loan {
  id?: string;
  book?: Book;
  user?: User;
  loanStartDate?: string;
  loanEndDate?: string;
  returned?: boolean;
}

export interface ApiError {
  code?: number;
  message?: string;
}
