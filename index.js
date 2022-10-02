// to generate the id
class Counter {
  static counter;

  static getCounter() {
    if (this.counter)  {
      this.counter++
    }
    else {
      this.counter = 1;
    }

    return this.counter;
  }
}

class Book {
  constructor(title, author) {
    this.id = Counter.getCounter();
    this.title = title;
    this.author = author;
    this.reviews = [];
  }

  addReview(author, text) {
    this.reviews.push(new Review(author, text));
  }
}

class Review {
  constructor(author, text) {
    this.id = Counter.getCounter();
    this.author = author;
    this.text = text;
  }
}

class DOMManager {
  static books = [];

  static deleteBook(id) {
    this.books = this.books.filter(function(f) {return f.id != id});
    this.render();
  }

  static createBook() {
    let bookName = $('#new-book-title').val()
    let bookAuthor = $('#new-book-author').val();

    if (bookName == "" || bookAuthor == "") {
      alert("You need to fill out the name of the author and the title of the book.");
    }
    else {
      this.books.push(new Book(bookName, bookAuthor));

      $('#new-book-title').val('');
      $('#new-book-author').val('');

      this.render();
    }
  }

  static addReview(id) {
    for(let book of this.books) {
      if (book.id == id) {
        let reviewAuthor = $('#' + book.id + '-review-author').val();
        let reviewText = $('#' + book.id + '-review-text').val();

        if (reviewAuthor == "" || reviewText == "") {
          alert('The name of the author or the book review is missing.');
        }
        else {
          book.reviews.push(new Review(reviewAuthor, reviewText));
          this.render();
        }
      }
    }
  }

  static deleteReview(bookId, reviewId) {
    for(let book of this.books) {
      if (book.id == bookId) {
        for(let review of book.reviews) {
          if (review.id == reviewId) {
            book.reviews = book.reviews.filter(function(f) {return f.id != reviewId});
          }
        }
      }
    }

    this.render();
  }

  static render() {
    $('#app').empty();

    for(let book of this.books) {
      $('#app').prepend(
        `
        <div id="${book.id}" class="card">
          <div class="card-header">
            <h2>${book.title}</h2>
            <div>${book.author}</div>
            <button class="btn btn-danger" onclick="DOMManager.deleteBook('${book.id}')">Delete</button>
          </div>
          <div class="card-body">
            <div class="card">
              <input type="text" id="${book.id}-review-author" class="form-control" placeholder="Author Review">
              <textarea id="${book.id}-review-text" class="form-control" placeholder="Book Review"></textarea>
            </div>
            <button id="${book.id}-new_review" onclick="DOMManager.addReview('${book.id}')" class="btn btn-primary form-control">Add</button>
          </div>
        </div>
        <br>
        `
      )

      for(let review of book.reviews) {
        $(`#${book.id}`).find('.card-body').append(
          `<p>
            <div id="name-${book.id}"><strong>Author: </strong>${review.author}</div>
            <div id="name-${book.id}">${review.text}</div>
            <button class="btn btn-danger" onclick="DOMManager.deleteReview('${book.id}', '${review.id}')">Delete Review</button>
          </p>`
        );
      }
    }
  }
}

$('#create-new-book').click(() => {
  DOMManager.createBook();
})

DOMManager.render();
