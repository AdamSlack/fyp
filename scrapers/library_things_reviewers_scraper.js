const request = require('request');
const cheerio = require('cheerio');
const zlib = require('zlib');
const db = new(require('../db/db'))('scraper');


function scrapeReviewersPage(accName) {
    var headers = {
        'Origin': 'https://www.librarything.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'Referer': 'https://www.librarything.com/profile_reviews.php?view=' + accName,
        'X-Requested-With': 'XMLHttpRequest',
        'Connection': 'keep-alive'
    };

    // var dataString = 'view=Shrike58&offset=0&sort=0&type=0&container=mainreviews&showCount=10000&bookid=&workid=&optionalTitle=&uniqueID=6gos2v8MHUdAxEzHS29R1duquQ40qAwK&languagePick=&mode=profile';

    var dataString = 'view=' + accName + '&offset=0&sort=0&type=0&container=mainreviews&showCount=10000&bookid=&workid=&optionalTitle=&languagePick=&mode=profile';

    var options = {
        url: 'https://www.librarything.com/ajax_profilereviews.php',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    // Chunking idea from Nick Fishman http://nickfishman.com/post/49533681471/nodejs-http-requests-with-gzip-deflate-compression
    var req = request(options);
    req.on('response', function(res) {
        console.log('Status Code: ', res.statusCode);
        console.log('Chuncking Response...');

        if (res.statusCode != 200) {
            throw new Error('Request failed, Status code != 200...');
        }

        var chunks = [];
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });

        res.on('end', function() {
            var buffer = Buffer.concat(chunks);
            if (res.headers['content-encoding'] == 'gzip') {
                zlib.gunzip(buffer, function(err, decompressed) {
                    if (!err) {
                        console.log('Buffer unzipped, Parsing Response...');
                        $ = cheerio.load(decompressed.toString());
                        let reviews = parseReviews($);
                        insertReviewer(accName, reviews.length);
                        insertReviews(reviews);
                    } else {
                        throw new Error('Failed to unzip:', err);
                    }
                });
            }
        });
    });

}

function parseReviews($) {
    let topReviews = $('.bookReview');
    let reviews = [];
    topReviews.each(function(i, el) {
        let reviewHeader = $(this).find('.postinfo').find('a');
        reviews[i] = {
                book: $(reviewHeader[0]).text(),
                bookURL: $(reviewHeader[0]).attr('href'),
                bookAuthor: $(reviewHeader[1]).text(),
                bookAuthorURL: $(reviewHeader[1]).attr('href'),
                review: $(this).find('.commentText').text(),
                ratingURL: $(this).find('.rating').find('img').attr('src'),
                dateString: $(this).find('.controlItems').text(),
                reviewURL: $(this).find('.controlItems').find('a').attr('href')
            }
            /*{
                       id: $(this).attr('id'),
                       reviewTitle: $(this).find('a[data-hook="review-title"]').text(),
                       rating: $(this).find('.a-link-normal').attr('title').slice(0, 3),
                       author: $(this).find('.author').text(),
                       date: $(this).find('.review-date').text().slice(3),
                       review: $(this).find('div[data-hook="review-collapsed"]').text(),
                       accountURL: $(this).find('.author').attr('href')
                   }*/
    })
    return reviews;
}

function insertReviewer(reviewer, reviewCount) {
    console.log('Inserting Reviewer into the database');
    db.insertReviewer(reviewer, reviewCount);
}

function insertReviews(reviews) {
    console.log(reviews.length);
}

function parseProduct($) {
    let product = {};
    return product;
}

scrapeReviewersPage('Shrike58');