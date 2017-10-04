// Other's packages
const request = require('request');
const cheerio = require('cheerio');


function scrapeProductPage(url) {
    request(url, (err, res, html) => {
        if (!err && res.statusCode == 200) {
            console.log('Status Code: ', res.statusCode);
            console.log('Parsing Response...');
            $ = cheerio.load(html);
            let product = parseProduct($);
            let reviews = parseReviews($);
            console.log(reviews);
        }
    });
}

function parseReviews($) {
    let topReviews = $('div[data-hook="review"]');
    let reviews = [];
    topReviews.each(function(i, el) {
        reviews[i] = {
            id: $(this).attr('id'),
            reviewTitle: $(this).find('a[data-hook="review-title"]').text(),
            rating: $(this).find('.a-link-normal').attr('title').slice(0, 3),
            author: $(this).find('.author').text(),
            date: $(this).find('.review-date').text().slice(3),
            review: $(this).find('div[data-hook="review-collapsed"]').text(),
            accountURL: $(this).find('.author').attr('href')
        }
    })
    return reviews;
}

function parseProduct($) {
    let product = {};
    return product;
}

scrapeProductPage("https://www.amazon.co.uk/Girl-Dragon-Tattoo-Millennium/dp/0857054031/ref=sr_1_4?s=books&ie=UTF8&qid=1507140773&sr=1-4&keywords=the+girl+with+the+dragon+tattoo");


/**
 * Give a URL to a specific suggested Alternative App page's URL
 * this function will scrape the Playstore URL or failing that
 * the Developers Website page. Failing that it will just return
 * Alternative To URL for the page.
 *
 * Scrapes for:
 *  GPlayAppStore
 *  OfficialAppSite
 *  App's Icon URL
 *  App's GPlayStore ID.
 */
function scrapeAltAppPage(altApp) {
    return request(altApp.altToURL, (err, res, html) => {
        // if there wasn't an err with the request.`
        if (err) {
            logger.err(`Failed to fetch HTML: ${err}`);
            return err;
        }

        // Initialising Variables and Loading HTML into Cheerio
        const $ = cheerio.load(html);

        altApp = addGPlayURL(
            altApp,
            $('a[data-link-action="AppStores Link"]:contains("Google")').attr('href')
        );

        altApp = addOfficialSiteURL(
            altApp,
            $('a[data-link-action="Official Website Button"]').attr('href')
        );

        altApp.altAppIconURL = $('#appHeader').find('img').first().attr('data-src-retina');
        if (altApp.altAppIconURL) {
            altApp.altAppIconURL = altApp.altAppIconURL.substr(2);
        } else {
            altApp.altAppIconURL = '';
        }

        return db.insertAltApp(altApp);
    });
}

/**
 * Fetch fetchAlternatives
 *
 * For a specific App's Alternative page. Collect Titles and AltTo URLs
 * that are lsited for that app.
 *
 * The urls collected here will point towards another alternativeTo Page
 * that will have a store link (hopefully)
 */
function scrapePageForAlts(URLString, appID) {
    // Request the page from the Site.
    return request(URLString, (err, res, html) => {
        // if there wasn't an err with the request.
        if (err) {
            logger.err(`Failed to fetch HTML: ${err}`);
            return err;
        }

        // Initialising Variables and Loading HTML into Cheerio
        const $ = cheerio.load(html);
        const altIDs = [];
        let altApps = [];

        // Selecting All Alternative App ID's from the DOM
        $('ul#alternativeList').find('li').each((i, elem) => {
            // Each alt app has an ID for the app title.
            const val = $(elem).attr('id');
            // if the element exists on the page.
            if (val) {
                altIDs.push(val);
            }
        });

        // Bail if there were no alternative IDs.
        if (!altIDs.length) {
            logger.debug('No Alternative Apps suggested.');
            return 'No Alternative Apps suggested';
        }

        // for each ID find the Title and URL to AltTo page.
        altApps = altIDs.map((altID) => {
            // logger.debug(altID);
            const aTag = $(`#${altID}`).find('h3').find('a').first();
            return {
                title: aTag.text(),
                altToURL: `http://alternativeto.net${aTag.attr('href')}`,
                altAppIconURL: '',
                gPlayURL: '',
                gPlayAppID: '',
                officialSiteURL: '',
                appID: appID,
            };
        });

        // if no titles or URLs wer found.
        if (!altApps) {
            return 'No Alternative App links/Titles could be found. Bailing!';
        }

        altApps.forEach((altApp) => {
            scrapeAltAppPage(altApp);
        });
        return 'Apps Scraped';
    });
}

function findAppAltPage(URLString, appID) {
    // Request the page from the Site.
    return request(URLString, (err, res, html) => {
        // if there wasn't an err with the request.
        if (err) {
            logger.err(`Failed to fetch HTML: ${err}`);
            return err;
        }

        // Initialising Variables and Loading HTML into Cheerio
        const $ = cheerio.load(html);
        // check if direct link to page was found or it gave searhc results.

        const titleString = $('title').text().split(' - ')[1];
        logger.debug(titleString);
        if (titleString == 'Search on AlternativeTo.net') {
            const firstRes = $('.app-list').first().find('h3').first().find('a').first();
            const resHref = firstRes.attr('href');
            URLString = `http://alternativeto.net${resHref}`;
        }

        return scrapePageForAlts(URLString, appID);
    });
}

// (async() => {
//     const rows = await db.getAppsToFindAltsForThatHaventYetHadThemFound(10);

//     await Promise.all(rows.map(async(row) => {
//         let encodedURI = encodeURIComponent(row.title);
//         encodedURI = encodedURI.replace(new RegExp('%20', 'g'), '+');
//         findAppAltPage(
//             `http://alternativeto.net/browse/search/?license=free&platform=android&q=${encodedURI}`,
//             row.app
//         );
//         await db.updatedLastAltChecked(row.app);
//     }));
// })();