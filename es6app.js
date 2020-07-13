class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToBooklist(book) {
    const bookList = document.getElementById("book-list");

    //Create table row
    const row = document.createElement("tr");

    //Insert table data
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;

    //Append to booklist
    bookList.appendChild(row);
  }

  showAlert(message, className) {
    //Create div
    const div = document.createElement("div");
    //Add class to div
    div.className = `alert ${className}`;
    //Append message in div
    div.appendChild(document.createTextNode(message));
    //Select parent element
    const container = document.querySelector(".container");
    //Select form element
    const form = document.querySelector("#book-form");
    //Insert div before form
    container.insertBefore(div, form);

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearBook() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBooks(book) {
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => {
      //Initiate the UI
      const ui = new UI();

      ui.addBookToBooklist(book);
    });
  }

  static removeBooks(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Event listener for reload/display
document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event Listener for add
document.getElementById("book-form").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  const book = new Book(title, author, isbn);

  //Initiate the UI
  const ui = new UI();

  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill in all fields in the form", "error");
  } else {
    ui.addBookToBooklist(book);
    //Add to LS
    Store.addBooks(book);
    ui.showAlert("Successfully added book to booklist!!", "success");
    ui.clearBook();
  }

  e.preventDefault();
});

// Event listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  //Initiate the UI
  const ui = new UI();

  //Call delete function
  ui.deleteBook(e.target);

  //Remove from LS
  Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert("Book removed", "success");

  e.preventDefault();
});
