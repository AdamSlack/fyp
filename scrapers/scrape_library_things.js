const fs = require('fs');
const spawn = require('child_process');

const userNames = JSON.parse(fs.readFileSync('../data/topThousandReviewers.json'));

userNames.forEach((userName) => {
    console.log('Scraping:', userName);
    spawn.spawnSync('node', ['./library_things_reviewers_scraper.js', userName])
});