//
//  Parsing topThousandReviews usernames from LibraryThings' list of top reviewers.
//
const fs = require('fs');

// parse file
const fileContents = fs.readFileSync('../data/topThousandReviewers.txt').toString();

// split names
const messyUsers = fileContents.split('), ');

// clean names
const cleanUsers = messyUsers.map((mess) => mess.split(' (')[0]);

// write names
fs.writeFileSync('../data/topThousandReviewers.json', JSON.stringify(cleanUsers, null, 2));

//eof