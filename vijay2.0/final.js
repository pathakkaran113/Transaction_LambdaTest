const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// Configure passport for Google OAuth
passport.use(new GoogleStrategy({
  clientID: '315558729563-1faqde4j7h4nfb1clegrneaho4goock6.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3030/oauth2callback'
},
  function (accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
  }
));

// Serialize and deserialize user information for session handling
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Initialize passport and session handling
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'karan@123',
  database: 'vijay'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Route to start the authentication process
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/gmail.readonly'] })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Google OAuth2 callback route
app.get('/oauth2callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    req.session.accessToken = req.user.accessToken;
    req.session.refreshToken = req.user.refreshToken;
    res.redirect('/transactions');
  }
);

// Function to fetch emails
const getEmails = async (auth, startDate, endDate) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const query = `from:alerts@axisbank.com after:${startDate} before:${endDate}`;
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query
  });
  return res.data.messages || [];
};

// Function to fetch email message
const getMessage = async (auth, messageId) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
    timeout: 50000
  });
  return res.data;
};

// Function to parse transaction data from email
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

// Function to store transaction in the database
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

app.get("/profile", (req, res) => {
  res.render('profile.ejs');
})


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

// Fetch transactions based on dates
app.get('/fetch-transactions', async (req, res) => {
  const { endDate } = req.query;
  try {
    const startDate = await fetchStartDate(); //"2024-07-05";  // Replace with actual logic to fetch start date
    console.log('Start Date:', startDate);

    if (!startDate) {
      return res.status(400).send('No start date found.');
    }

    const oauth2Client = new OAuth2(
      '315558729563-1faqde4j7h4nfb1clegrneaho4goock6.apps.googleusercontent.com',
      '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',
      'http://localhost:3030/oauth2callback'
    );

    oauth2Client.setCredentials({
      access_token: req.session.accessToken,
      refresh_token: req.session.refreshToken
    });

    oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        req.session.refreshToken = tokens.refresh_token;
      }
      req.session.accessToken = tokens.access_token;
    });

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

// Route to fetch transactions and calculate total amount
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

app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

app.get('/', (req, res) => {
  res.render("home.ejs");
});


app.get('/chatbot', (req, res) => {
           res.send('<h1>Home</h1><a href="http://127.0.0.1:5502/shiva.html">Take Advise from Our Expert</a>');
          });

// Start the server
app.listen(3030, () => {
  console.log('Server is running on http://localhost:3030');
});
