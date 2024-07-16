require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const mysql = require('mysql2');
const app = express();
const PORT = 8989;
const OAuth2 = google.auth.OAuth2;
const cookieparser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sessionoptions = {
    secret: "mysupersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionoptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    next();
})




passport.use(new GoogleStrategy({
    clientID: '1053283576174-vnbi7rpopcsie7c8o9vsm1kj38ihr4c1.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8989/oauth2callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // User authentication and profile handling goes here
    // For now, we'll just return the user profile
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });


  app.use(require('express-session')({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());




// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'karan@123',
    database: 'vijay'
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get("/", (req, res) => {
    res.render("home.ejs");
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

const oauth2Client = new OAuth2(
    '1053283576174-vnbi7rpopcsie7c8o9vsm1kj38ihr4c1.apps.googleusercontent.com',
      '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',
     'http://localhost:8989/oauth2callback'
);

app.get('/auth', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly'],
        prompt: 'consent',
    });
    res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        console.log('Tokens:', tokens);
        req.flash("success", "You have done it KP");

        const search = req.query.search || '';
        const searchType = 'message_id';
        const query = `
            SELECT 
                message_id, 
                amount, 
                debit_or_credit, 
                DATE_FORMAT(transaction_date, '%d-%m-%Y') as transaction_date, 
                TIME_FORMAT(transaction_time, '%H:%i:%s') as transaction_time, 
                info 
            FROM bankDetails2
            WHERE ${searchType} LIKE ?
        `;
        db.query(query, [`%${search}%`], (err, results) => {
            if (err) {
                console.error('Error fetching transactions:', err);
                return res.status(500).send('An error occurred while fetching transactions.');
            }
            res.render('transactionskp.ejs', { transactions: results, search: search, searchType: searchType });
        });
    } catch (error) {
        console.error('Error during OAuth callback:', error.response?.data || error.message);
        res.status(500).send('Authentication failed');
    }
});

const getEmails = async (auth, startDate, endDate) => {
    const gmail = google.gmail({ version: 'v1', auth });
    const query = `from:alerts@axisbank.com after:${startDate} before:${endDate}`;
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: query
    });
    return res.data.messages || [];
};

const getMessage = async (auth, messageId) => {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
    });
    return res.data;
};

const parseTransactionData = (message) => {
    try {
        const emailDataPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
        if (!emailDataPart) {
            console.error('No text/plain part found in the email message');
            return null;
        }

        const emailData = Buffer.from(emailDataPart.body.data, 'base64').toString('utf-8');
        console.log('Email Data:', emailData);

        const sender = message.payload.headers.find(header => header.name === 'From').value;
        const subject = message.payload.headers.find(header => header.name === 'Subject').value;
        const snippet = message.snippet;

        const amountMatch = emailData.match(/INR\s([\d,.]+)/);
        const debitCreditMatch = emailData.match(/(debited|credited)/i);
        const dateMatch = emailData.match(/\d{2}-\d{2}-\d{4}/);
        const timeMatch = emailData.match(/\d{2}:\d{2}:\d{2}\sIST/);
        const infoMatch = emailData.match(/Info-(UPI\/P2A\/\d+\/[\w\s.]+)/);

        const transaction = {
            message_id: message.id,
            sender,
            subject,
            amount: amountMatch ? amountMatch[1] : null,
            debit_or_credit: debitCreditMatch ? debitCreditMatch[1] : null,
            date: dateMatch ? dateMatch[0] : null,
            time: timeMatch ? timeMatch[0] : null,
            info: infoMatch ? infoMatch[1] : null,
            snippet
        };

        console.log('Parsed Transaction:', transaction);
        return transaction;
    } catch (error) {
        console.error('Error parsing transaction data:', error);
        return null;
    }
};

const storeTransaction = (transaction) => {
    const checkTransactionQuery = 'SELECT COUNT(*) AS count FROM transactions WHERE message_id = ?';
    db.query(checkTransactionQuery, [transaction.message_id], (err, results) => {
        if (err) {
            console.error('Error checking transaction:', err);
            return;
        }

        if (results[0].count > 0) {
            console.log('Transaction already exists, skipping:', transaction.message_id);
            return;
        }

        const insertTransactionQuery = 'INSERT INTO transactions (message_id, sender, subject, snippet) VALUES (?, ?, ?, ?)';
        db.query(insertTransactionQuery, [
            transaction.message_id,
            transaction.sender,
            transaction.subject,
            transaction.snippet
        ], (err, results) => {
            if (err) {
                console.error('Error storing transaction:', err);
                return;
            }
            console.log('Transaction stored:', results.insertId);

            // Convert date to MySQL format (YYYY-MM-DD)
            const [day, month, year] = transaction.date.split('-');
            const formattedDate = `${year}-${month}-${day}`;

            const insertBankDetailsQuery = `
                INSERT INTO bankDetails2 (message_id, amount, debit_or_credit, transaction_date, transaction_time, info)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.query(insertBankDetailsQuery, [
                transaction.message_id,
                parseFloat(transaction.amount.replace(/,/g, '')), // Convert amount to a number
                transaction.debit_or_credit,
                formattedDate, // transaction.date,
                transaction.time.split(' ')[0], // Extract time part and convert to TIME format if necessary
                transaction.info
            ], (err, results) => {
                if (err) {
                    console.error('Error storing bank details:', err);
                    return;
                }
                console.log('Bank details stored:', results.insertId);
            });
        });
    });
};


app.get('/transactions', (req, res) => {
    const search = req.query.search || '';
    const searchType = req.query.searchType || 'message_id';
  
    let queryTotal;
    let queryTransactions;
    let queryParams = [];
  
    if (searchType === 'month') {
      queryTotal = `
        SELECT SUM(amount) AS total_amount 
        FROM bankDetails2 
        WHERE debit_or_credit = "debited" 
        AND MONTH(transaction_date) = ? 
        AND YEAR(transaction_date) = YEAR(CURDATE())
      `;
      queryTransactions = `
        SELECT 
          message_id, 
          amount, 
          debit_or_credit, 
          DATE_FORMAT(transaction_date, '%d-%m-%Y') as transaction_date, 
          TIME_FORMAT(transaction_time, '%H:%i:%s') as transaction_time, 
          info 
        FROM bankDetails2
        WHERE MONTH(transaction_date) = ? 
        AND YEAR(transaction_date) = YEAR(CURDATE())
      `;
      queryParams.push(search);
    } else {
      queryTotal = 'SELECT SUM(amount) AS total_amount FROM bankDetails2 WHERE debit_or_credit = "debited"';
      queryTransactions = `
        SELECT 
          message_id, 
          amount, 
          debit_or_credit, 
          DATE_FORMAT(transaction_date, '%d-%m-%Y') as transaction_date, 
          TIME_FORMAT(transaction_time, '%H:%i:%s') as transaction_time, 
          info 
        FROM bankDetails2
        WHERE ${searchType} LIKE ?
      `;
      queryParams.push(`%${search}%`);
    }
  
    // First query to get total amount
    db.query(queryTotal, queryParams, (err, totalResults) => {
      if (err) {
        console.error('Error fetching total amount:', err);
        return res.status(500).send('An error occurred while fetching the total amount.');
      }
  
      // Second query to get transaction details
      db.query(queryTransactions, queryParams, (err, transactionResults) => {
        if (err) {
          console.error('Error fetching transactions:', err);
          return res.status(500).send('An error occurred while fetching transactions.');
        }
  
        // Render the EJS template with fetched data
        res.render('transactionskp.ejs', { 
          transactions: transactionResults, 
          total: totalResults[0]?.total_amount || 0, // Access total_amount from totalResults
          search: search, 
          searchType: searchType 
        });
      });
    });
  });


  async function fetchStartDate() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT transaction_date FROM bankDetails2 ORDER BY id DESC LIMIT 1 OFFSET 1';
        
        db.query(query, (error, results) => {
            if (error) {
                return reject(error);  // Reject the promise if there's an error with the query
            }
            if (results.length > 0) {
                const transactionDate = new Date(results[0].transaction_date);
                const formattedDate = transactionDate.toISOString().split('T')[0];  // Format to YYYY-MM-DD
                resolve(formattedDate);
            } else {
                resolve(null);  // Resolve with null if no results are found
            }
        });
    });
  }
  
  
  
  app.get('/fetch-transactions', async (req, res) => {
      const { endDate } = req.query;
      try {
          const startDate = await fetchStartDate();
          console.log('Start Date:', startDate);
  
          if (!startDate) {
              return res.status(400).send('No start date found.');
          }
  
          const messages = await getEmails(oauth2Client, startDate, endDate);
          if (!messages.length) {
              console.log('No messages found.');
              return res.send('No transactions found.');
          }
  
          for (const msg of messages) {
              const message = await getMessage(oauth2Client, msg.id);
              const transaction = parseTransactionData(message);
              if (transaction) {
                  storeTransaction(transaction);
              }
          }
  
          res.render("data.ejs");
      } catch (err) {
          console.error('Error fetching transactions:', err.response?.data || err.message);
          res.status(500).send('An error occurred while fetching transactions.');
      }
  });

  app.post('/sum-amounts', (req, res) => {
    const month = req.body.month;
    const year = 2024;
  
    const query = `
        SELECT SUM(amount) AS total_amount 
        FROM bankDetails2 
        WHERE debit_or_credit = "debited" 
        AND MONTH(transaction_date) = ? 
        AND YEAR(transaction_date) = ?
    `;
    
    db.query(query, [month, year], (err, results) => {
        if (err) {
            console.error('Error fetching total amount:', err);
            return res.status(500).send('An error occurred while fetching the total amount.');
        }
        res.render('totalsum.ejs', { total: results[0].total_amount });
    });
  });
  
  
  app.get('/addExpenses', (req, res) => {
      res.render("addexpenses.ejs")
  });
  
  app.post('/addExpenses', (req, res) => {
      const {
          message_id = null,
          amount,
          debit_or_credit = null,
          transaction_date = null,
          transaction_time = null,
          transaction_info = null
      } = req.body;
  
      const query = `
          INSERT INTO bankDetails2 (message_id, amount, debit_or_credit, transaction_date, transaction_time, info)
          VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      db.query(query, [message_id, amount, debit_or_credit, transaction_date, transaction_time, transaction_info], (err, results) => {
          if (err) {
              console.error('Error inserting transaction:', err);
              return res.status(500).send('An error occurred while inserting the transaction.');
          }
          res.send('Transaction submitted successfully.');
      });
  });
  
//   app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//   });
  