

begin;


create table reviewers(
    id           serial not null,
    reviewer     text   not null primary key,
    review_count int    not null
);

create table reviews(
    id              serial not null,
    book_title      text   not null,
    book_url        text   not null,
    book_author     text   not null,
    book_author_url text   not null,
    review_author   text   not null references reviewers(reviewer),
    review_date     date   not null,
    review_url      text   not null,
    book_isbn       text   not null,
    review          text   not null,
    rating          int    not null,
    constraint book_review_pkey primary key (review_author, book_title)
);

create table book_details(
    id              serial  not null,
    title           text    not null,
    author          text    not null,
    length          int     not null,
    publisher       text    not null,
    date_published  date    not null,
    isbn_10         text    not null,
    isbn_13         text    not null,
    page_url        text    not null,
    review_page_url text    not null,
);


commit;