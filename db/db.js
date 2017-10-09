const config = require('../config/config.json');
const pg = require('pg');

class DB {
    /**
     *  DB Class constructor - Initialises all config for pg db connections
     *  as well as a pool for connecting to xray db.
     */
    constructor(module) {
        // WISHLIST: initialise pool for desired db option from the config here.
        const dbCfg = config.db;
        dbCfg.user = config[module].db.user;
        dbCfg.password = config[module].db.password;
        dbCfg.max = 10;
        dbCfg.idleTimeoutMillis = 30000;

        // this initializes a connection pool
        // it will keep idle connections open for 30 seconds
        // and set a limit of maximum 10 idle clients
        this.pool = new pg.Pool(dbCfg);

        this.pool.on('error', (err) => {
            console.log('idle client error', err.message, err.stack);
        });
    }

    // export the query method for passing queries to the pool
    query(text, values) {
        try {
            if (values) console.log('query:', text, values);
            else console.log('query:', text);
            return this.pool.query(text, values);
        } catch (err) {
            console.log('Error With Postgres Query');
            throw err;
        }
    }

    async connect() {
        try {
            console.log('connecting to db pool');
            const ret = await this.pool.connect();
            ret.lquery = (text, values) => {
                if (values) console.log('lquery:', text, values);
                else console.log('lquery:', text);
                return ret.query(text, values);
            };

            return ret;
        } catch (err) {
            console.log('Failed To Connect To Pool', err);
            throw err;
        }
    }

    /**
     *  Add a search term to the table if it doesn't already exist.
     */
    async selectAppID() {
        console.log('Inserting an appID into the comments DB.');
        const client = await this.connect();
        try {
            const res = await client.lquery('select * from appid order by last_scraped nulls first limit 1');
            if (res.rowCount == 1) {
                const row = res.rows[0];
                return {
                    appID: row.id,
                    idNum: row.id_num,
                    lastScraped: row.last_scraped
                }
            } else {
                throw 'Incorrect amount of Rows returned...';
            }
        } catch (err) {
            console.log('Error Querying the DB.', err)
        } finally {
            client.release();
        }
        return {
            appID: '',
            idNum: -1,
            lastScraped: undefined
        }
    }

    async setScrapedDate(idNum) {
        console.log('Updating App ID\'s last scraped date');
        const client = await this.connect();
        try {
            const res = await client.lquery('update appID set last_scraped = CURRENT_TIMESTAMP where id_num = $1', [idNum]);
        } catch (err) {
            console.log('Error Updating last_scraped date of', appID, '\n\n', err);
        } finally {
            client.release();
        }
    }

    async insertReviewer(reviewer, reviewCount) {
        console.log('Inserting Reviewer into the database');
        console.log('Reviewer:', reviewer);
        const client = await this.connect();
        try {
            console.log('Checking if reviwer exists in the database');
            let res = await client.lquery('select * from reviewers where reviewer = $1', [reviewer]);
            if (res.rowCount == 0) {
                console.log('Reviewer Doesn\' exist, inserting into the DB now.')
                await client.lquery('insert into reviewers(reviewer, review_count) values ($1, $2)', [reviewer, reviewCount]);
            } else if (res.rows[0].review_count != reviewCount) {
                console.log('reviwer exists and review count differs');
                await client.lquery('update reviewers set review_count = $1 where reviewer = $2', [reviewCount, reviewer]);
            } else {
                console.log('Reviewer Exists, and no changes exist. Moving on.');
            }
        } catch (err) {
            console.log('Error inserting reviewer into the database', err);
        } finally {
            client.release();
        }
    }


    async insertReview(review) {
        console.log('Inserting review into the database.');
        console.log('Review:', review);
        const client = await this.connect();
        try {
            //await client.lquery(
            //    'insert into comments(app_id_num, app_id, author, date_written, rating, json_object) values ($1,$2,$3,$4,$5, $6)', [idNum, appID, comment.author, comment.date, comment.rating.replace(/\D/g, ''), JSON.stringify(comment)]
            //);
        } catch (err) {
            console.log('Error inserting comment into the database', err);
        } finally {
            client.release();
        }
    }
}

module.exports = DB;