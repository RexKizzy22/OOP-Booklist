// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() {}

UI.prototype.render = function(newBook) {
  // Get booklist
  const bookList = document.getElementById("book-list");
  // Create new table row
  const row = document.createElement("tr");
  // Create table data
  row.innerHTML = `
    <td>${newBook.title}</td>
    <td>${newBook.author}</td>
    <td>${newBook.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;
  // Append row to booklist
  bookList.appendChild(row);
}

UI.prototype.clearFields = function() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
}

UI.prototype.showAlert = function(msg, className) {
  // Create alert div
  const div = document.createElement("div");
  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(msg));
  // Show alert div
  const container = document.querySelector(".container");
  const form = document.querySelector("#book-form");
  // Render before heading
  container.insertBefore(div, form);
  // Clear alert after 3 secs
  setTimeout(function() {
    document.querySelector(".alert").remove();
  }, 3000);
}

UI.prototype.deleteBook = function(target) {
  if (target.classList.contains("delete")) {
    target.parentElement.parentElement.remove();
  }
}

// Local storage class
function Store() {}

Store.prototype.getBooks = function() {
  let books;
  // Get book items from local storage
  if (localStorage.getItem("books") === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }

  return books;
}

Store.prototype.addBookToLS = function(newBook) {
  // Instantiate Store
  let store = new Store();
  // Add to local storage
  let books = store.getBooks();
  books.push(newBook);

  localStorage.setItem("books", JSON.stringify(books));
}

Store.prototype.displayBooks = function() {
  // Instantiate Store
  let store = new Store();
  // Add to local storage
  let books = store.getBooks();
  // Instantiate UI
  const ui = new UI();
  // Display books in UI
  books.forEach(function(book) {
    ui.render(book);
  });
  localStorage.setItem("books", JSON.stringify(books));
}

Store.prototype.deleteBookFromLS = function(bookItem) {
  // Instantiate Store
  let store = new Store();
  // Add to local storage
  let books = store.getBooks();
  // Delete book item
  books = books.filter(function(book) {
    return book.isbn !== bookItem;
  });

  localStorage.setItem("books", JSON.stringify(books));
}


// Add event listener to form
document.getElementById("book-form").addEventListener("submit", function(e) {
  // Get UI values
  const title = document.getElementById("title").value,
        author = document.getElementById("author").value,
        isbn = document.getElementById("isbn").value;

  // Instantiate new Book
  const newBook = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();

  // Validata input
  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill all fields", "error");
  } else {
    // Render new book in UI
    ui.render(newBook);
    // Show alert
    ui.showAlert("Book sucessfully added!", "success");
    // Instantiate LS
    const ls = new Store();
    // Add book to LS
    ls.addBookToLS(newBook);
    // Clear input fields
    ui.clearFields();
  }

  e.preventDefault();
});

document.querySelector("#book-list").addEventListener("click", function(e) {
  // Instantiate UI
  const ui = new UI();
  // Implement event delegation
  ui.deleteBook(e.target);
  // Show alert
  ui.showAlert("Book sucessfully deleted!", "success");
  // Instantiate LS
  const ls = new Store();
  // Delete from local storage
  ls.deleteBookFromLS(e.target.parentElement.previousElementSibling.textContent);

  e.preventDefault();
})

// Event listener for reload
document.addEventListener("DOMContentLoaded", function() {
  // Instantiate LS
  const ls = new Store();
  // Render books
  ls.displayBooks();
})
