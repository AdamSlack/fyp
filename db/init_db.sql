

begin;

create table book_details(
    id              serial  not null,
    title           text    not null,
    author          text    not null,
    length          int64   not null,
    publisher       text    not null,
    date_published  date    not null,
    isbn_10         text    not null,
    isbn_13         text    not null,
    page_url        text    not null,
    review_page_url text    not null,
);


commit;