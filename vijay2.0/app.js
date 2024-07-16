// // const express = require('express');
// // const { google } = require('googleapis');
// // const mysql = require('mysql2');
// // const app = express();
// // const PORT = 2020;
// // const OAuth2 = google.auth.OAuth2;


// // const oauth2Client = new OAuth2(
// //     '315558729563-1faqde4j7h4nfb1clegrneaho4goock6.apps.googleusercontent.com',
// //     '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',
// //     'http://localhost:2020/oauth2callback'
// //   );

// // // MySQL connection
// // const db = mysql.createConnection({
// //   host: 'localhost',
// //   user: 'root',
// //   password: 'karan@123',
// //   database: 'vijay'
// // });

// // app.get("/",(req,res)=>{
// //     res.send("VIJAY")
// // })


// // db.connect(err => {
// //   if (err) throw err;
// //   console.log('Connected to MySQL database');
// // });


// // app.get('/auth', (req, res) => {
// //     const authUrl = oauth2Client.generateAuthUrl({
// //       access_type: 'offline',
// //       scope: ['https://www.googleapis.com/auth/gmail.readonly']
// //     });
// //     res.redirect(authUrl);
// //   });
  
// //   // Handle the OAuth 2.0 callback
// //   app.get('/oauth2callback', async (req, res) => {
// //     const { code } = req.query;
// //     const { tokens } = await oauth2Client.getToken(code);
// //     oauth2Client.setCredentials(tokens);
// //     console.log(oauth2Client.getToken(code))
// //     res.send('Authentication successful! You can close this tab.');
// //   });


// //   const getEmails = async (auth) => {
// //     const gmail = google.gmail({ version: 'v1', auth });
// //     const res = await gmail.users.messages.list({
// //       userId: 'me',
// //       q: 'from:alerts@axisbank.com' // Modify the query to match your needs
// //     });
// //     return res.data.messages || [];
// //   };
  

// //   const getMessage = async (auth, messageId) => {
// //     const gmail = google.gmail({ version: 'v1', auth });
// //     const res = await gmail.users.messages.get({
// //       userId: 'me',
// //       id: messageId,
// //       format: 'full'
// //     });
// //     return res.data;
// //   };
  
// //   const parseTransactionData = (message) => {
// //     // Implement your logic to parse the email content and extract transaction data
// //     const emailData = Buffer.from(message.payload.parts[0].body.data, 'base64').toString('utf-8');
// //     // Dummy transaction data parsing logic
// //     const transaction = {
// //       date: new Date(),
// //       amount: parseFloat(emailData.match(/Amount: \$([0-9.]+)/)[1]),
// //       description: emailData.match(/Description: (.+)/)[1]
// //     };
// //     return transaction;
// //   };

  

// //   const storeTransaction = (transaction) => {
// //     const query = 'INSERT INTO transactions (date, amount, description) VALUES (?, ?, ?)';
// //     db.query(query, [transaction.date, transaction.amount, transaction.description], (err, results) => {
// //       if (err) throw err;
// //       console.log('Transaction stored:', results.insertId);
// //     });
// //   };

// //   app.get('/fetch-transactions', async (req, res) => {
// //     try {
// //       const messages = await getEmails(oauth2Client);
// //       for (const msg of messages) {
// //         const message = await getMessage(oauth2Client, msg.id);
// //         const transaction = parseTransactionData(message);
// //         storeTransaction(transaction);
// //       }
// //       res.send('Transactions fetched and stored successfully.');
// //     } catch (err) {
// //       console.error(err);
// //       res.status(500).send('An error occurred while fetching transactions.');
// //     }
// //   });
  
  

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });


// const express = require('express');
// const { google } = require('googleapis');
// const mysql = require('mysql2');
// const app = express();
// const PORT = 2020;
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   '315558729563-1faqde4j7h4nfb1clegrneaho4goock6.apps.googleusercontent.com',
//   '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',
//   'http://localhost:2020/oauth2callback'
// );

// // MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'karan@123',
//   database: 'vijay'
// });

// app.get("/", (req, res) => {
//   res.send("VIJAY");
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('Connected to MySQL database');
// });

// app.get('/auth', (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/gmail.readonly']
//   });
//   res.redirect(authUrl);
// });

// // Handle the OAuth 2.0 callback
// app.get('/oauth2callback', async (req, res) => {
//   try {
//     const { code } = req.query;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
//     console.log('Tokens:', tokens);
//     res.send('Authentication successful! You can close this tab.');
//   } catch (error) {
//     console.error('Error during OAuth callback:', error);
//     res.status(500).send('Authentication failed');
//   }
// });

// const getEmails = async (auth) => {
//   const gmail = google.gmail({ version: 'v1', auth });
//   const res = await gmail.users.messages.list({
//     userId: 'me',
//     q: 'from:alerts@axisbank.com' // Modify the query to match your needs
//   });
//   return res.data.messages || [];
// };

// const getMessage = async (auth, messageId) => {
//   const gmail = google.gmail({ version: 'v1', auth });
//   const res = await gmail.users.messages.get({
//     userId: 'me',
//     id: messageId,
//     format: 'full'
//   });
//   return res.data;
// };

// const parseTransactionData = (message) => {
//   // Implement your logic to parse the email content and extract transaction data
//   const emailData = Buffer.from(message.payload.parts[0].body.data, 'base64').toString('utf-8');
//   // Dummy transaction data parsing logic
//   const transaction = {
//     date: new Date(),
//     amount: parseFloat(emailData.match(/Amount: \$([0-9.]+)/)[1]),
//     description: emailData.match(/Description: (.+)/)[1]
//   };
//   return transaction;
// };

// const storeTransaction = (transaction) => {
//   const query = 'INSERT INTO transactions (date, amount, description) VALUES (?, ?, ?)';
//   db.query(query, [transaction.date, transaction.amount, transaction.description], (err, results) => {
//     if (err) throw err;
//     console.log('Transaction stored:', results.insertId);
//   });
// };

// app.get('/fetch-transactions', async (req, res) => {
//   try {
//     const messages = await getEmails(oauth2Client);
//     for (const msg of messages) {
//       const message = await getMessage(oauth2Client, msg.id);
//       const transaction = parseTransactionData(message);
//       storeTransaction(transaction);
//     }
//     res.send('Transactions fetched and stored successfully.');
//   } catch (err) {
//     console.error('Error fetching transactions:', err);
//     res.status(500).send('An error occurred while fetching transactions.');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });















// const express = require('express');
// const { google } = require('googleapis');
// const mysql = require('mysql2');
// const app = express();
// const PORT = 2020;
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//       '315558729563-1faqde4j7h4nfb1clegrneaho4goock6.apps.googleusercontent.com',
//        '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',
//        'http://localhost:2020/oauth2callback'
//      );

// // MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'karan@123',
//   database: 'vijay'
// });

// app.get("/", (req, res) => {
//   res.send("VIJAY");
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('Connected to MySQL database');
// });

// app.get('/auth', (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/gmail.readonly']
//   });
//   res.redirect(authUrl);
// });

// // Handle the OAuth 2.0 callback
// app.get('/oauth2callback', async (req, res) => {
//   try {
//     const { code } = req.query;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
//     console.log('Tokens:', tokens);
//     res.send('Authentication successful! You can close this tab.');
//   } catch (error) {
//     console.error('Error during OAuth callback:', error.response?.data || error.message);
//     res.status(500).send('Authentication failed');
//   }
// });

// const getEmails = async (auth) => {
//   const gmail = google.gmail({ version: 'v1', auth });
//   const res = await gmail.users.messages.list({
//     userId: 'me',
//     q: 'from:alerts@axisbank.com' // Modify the query to match your needs
//   });
//   return res.data.messages || [];
// };

// const getMessage = async (auth, messageId) => {
//   const gmail = google.gmail({ version: 'v1', auth });
//   const res = await gmail.users.messages.get({
//     userId: 'me',
//     id: messageId,
//     format: 'full'
//   });
//   return res.data;
// };

// const parseTransactionData = (message) => {
//   // Implement your logic to parse the email content and extract transaction data
//   const emailData = Buffer.from(message.payload.parts[0].body.data, 'base64').toString('utf-8');
//   // Dummy transaction data parsing logic
//   const transaction = {
//     date: new Date(),
//     amount: parseFloat(emailData.match(/Amount: \$([0-9.]+)/)[1]),
//     description: emailData.match(/Description: (.+)/)[1]
//   };
//   return transaction;
// };

// const storeTransaction = (transaction) => {
//   const query = 'INSERT INTO transactions (date, amount, description) VALUES (?, ?, ?)';
//   db.query(query, [transaction.date, transaction.amount, transaction.description], (err, results) => {
//     if (err) throw err;
//     console.log('Transaction stored:', results.insertId);
//   });
// };

// app.get('/fetch-transactions', async (req, res) => {
//   try {
//     const messages = await getEmails(oauth2Client);
//     for (const msg of messages) {
//       const message = await getMessage(oauth2Client, msg.id);
//       const transaction = parseTransactionData(message);
//       storeTransaction(transaction);
//     }
//     res.send('Transactions fetched and stored successfully.');
//   } catch (err) {
//     console.error('Error fetching transactions:', err.response?.data || err.message);
//     res.status(500).send('An error occurred while fetching transactions.');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });












// require('dotenv').config();
// const express = require('express');
// const { google } = require('googleapis');
// const mysql = require('mysql2');
// const app = express();
// const PORT = 2020;
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//         '315558729563-1faqde4j7h4nfb1clegrneaho4goock6.apps.googleusercontent.com',
//             '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',
//             'http://localhost:2020/oauth2callback'
//           );

// // MySQL connection
// const db = mysql.createConnection({
//        host: 'localhost',
//        user: 'root',
//        password: 'karan@123',
//        database: 'vijay'
//      });

// app.get("/", (req, res) => {
//   res.send("VIJAY");
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('Connected to MySQL database');
// });

// app.get('/auth', (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/gmail.readonly']
//   });
//   res.redirect(authUrl);
// });

// // Handle the OAuth 2.0 callback
// app.get('/oauth2callback', async (req, res) => {
//   try {
//     const { code } = req.query;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
//     console.log('Tokens:', tokens);
//     res.send('Authentication successful! You can close this tab.');
//   } catch (error) {
//     console.error('Error during OAuth callback:', error.response?.data || error.message);
//     res.status(500).send('Authentication failed');
//   }
// });

// const getEmails = async (auth) => {
//   const gmail = google.gmail({ version: 'v1', auth });
//   const res = await gmail.users.messages.list({
//     userId: 'me',
//     q: 'from:alerts@axisbank.com' // Modify the query to match your needs
//   });
//   return res.data.messages || [];
// };

// const getMessage = async (auth, messageId) => {
//   const gmail = google.gmail({ version: 'v1', auth });
//   const res = await gmail.users.messages.get({
//     userId: 'me',
//     id: messageId,
//     format: 'full'
//   });
//   return res.data;
// };

// const parseTransactionData = (message) => {
//   // Implement your logic to parse the email content and extract transaction data
//   const emailData = Buffer.from(message.payload.parts[0].body.data, 'base64').toString('utf-8');
//   // Dummy transaction data parsing logic
//   const transaction = {
//     date: new Date(),
//     amount: parseFloat(emailData.match(/Amount: \$([0-9.]+)/)[1]),
//     description: emailData.match(/Description: (.+)/)[1]
//   };
//   return transaction;
// };

// const storeTransaction = (transaction) => {
//   const query = 'INSERT INTO transactions (date, amount, description) VALUES (?, ?, ?)';
//   db.query(query, [transaction.date, transaction.amount, transaction.description], (err, results) => {
//     if (err) throw err;
//     console.log('Transaction stored:', results.insertId);
//   });
// };

// app.get('/fetch-transactions', async (req, res) => {
//   try {
//     const messages = await getEmails(oauth2Client);
//     for (const msg of messages) {
//       const message = await getMessage(oauth2Client, msg.id);
//       const transaction = parseTransactionData(message);
//       storeTransaction(transaction);
//     }
//     res.send('Transactions fetched and stored successfully.');
//   } catch (err) {
//     console.error('Error fetching transactions:', err.response?.data || err.message);
//     res.status(500).send('An error occurred while fetching transactions.');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
















// require('dotenv').config();
// const express = require('express');
// const { google } = require('googleapis');
// const mysql = require('mysql2');
// const app = express();
// const PORT = 2020;
// const OAuth2 = google.auth.OAuth2;
// const cookieparser = require("cookie-parser");
// const session = require("express-session");
// const flash = require("connect-flash");
// const path  = require("path");

// app.set("view engine" , "ejs");
// app.set("views",path.join(__dirname,"views") );


// const sessionoptions = {
//     secret:"mysupersecretkey" ,
//     resave:false,
//     saveUninitialized:true,
//     cookie :{
//         expires : Date.now() + (7 * 24 * 60 * 60 * 1000),
//         maxAge : 7 * 24 * 60 * 60 * 1000,
//         httpOnly : true,

//     }
// }

// app.use(session(sessionoptions));
// app.use(flash());


// app.use((req,res,next) => {
//     res.locals.success = req.flash("success");
//     next();
// })

// const oauth2Client = new OAuth2(
//     '315558729563-1faqde4j7h4nfb1clegrneaho4goock6.apps.googleusercontent.com',
//         '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',
//         'http://localhost:2020/oauth2callback'
//       );

// // MySQL connection
// const db = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: 'karan@123',
//    database: 'vijay'
//  });

// app.get("/", (req, res) => {
//   res.render("home.ejs");
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log('Connected to MySQL database');
// });

// app.get('/auth', (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/gmail.readonly'],
//     prompt: 'consent',
//   });
//   res.redirect(authUrl);
// });

// app.get('/oauth2callback', async (req, res) => {
//   try {
//     const { code } = req.query;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
//     console.log('Tokens:', tokens);
//     //res.send('Authentication successful! You can close this tab.');
//     req.flash("success" , "you have done it kp");
//     res.render("desti.ejs");
//   } catch (error) {
//     console.error('Error during OAuth callback:', error.response?.data || error.message);
//     res.status(500).send('Authentication failed');
//   }
// });

// // const getEmails = async (auth) => {
// //   const gmail = google.gmail({ version: 'v1', auth });
// //   const res = await gmail.users.messages.list({
// //     userId: 'me',
// //     q: 'from:alerts@axisbank.com' // Modify the query to match your needs
// //   });
// //   return res.data.messages || [];
// // };

// // const getMessage = async (auth, messageId) => {
// //   const gmail = google.gmail({ version: 'v1', auth });
// //   const res = await gmail.users.messages.get({
// //     userId: 'me',
// //     id: messageId,
// //     format: 'full'
// //   });
// //   return res.data;
// // };

// // const parseTransactionData = (message) => {
// //   try {
// //     const emailData = Buffer.from(message.payload.parts[0].body.data, 'base64').toString('utf-8');
// //     console.log('Email Data:', emailData); // Log email data for debugging
// //     const amountMatch = emailData.match(/Amount: \ INR([0-9.]+)/);
// //     const descriptionMatch = emailData.match(/Description: (.+)/);

// //     if (!amountMatch || !descriptionMatch) {
// //       console.error('Failed to parse transaction data:', emailData);
// //       return null;
// //     }

// //     const transaction = {
// //       date: new Date(),
// //       amount: parseFloat(amountMatch[1]),
// //       description: descriptionMatch[1]
// //     };

// //     console.log('Parsed Transaction:', transaction); // Log parsed transaction for debugging
// //     return transaction;
// //   } catch (error) {
// //     console.error('Error parsing transaction data:', error);
// //     return null;
// //   }
// // };

// // const storeTransaction = (transaction) => {
// //   const query = 'INSERT INTO transactions (date, amount, description) VALUES (?, ?, ?)';
// //   db.query(query, [transaction.date, transaction.amount, transaction.description], (err, results) => {
// //     if (err) {
// //       console.error('Error storing transaction:', err);
// //       return;
// //     }
// //     console.log('Transaction stored:', results.insertId);
// //   });
// // };

// // app.get('/fetch-transactions', async (req, res) => {
// //   try {
// //     const messages = await getEmails(oauth2Client);
// //     if (!messages.length) {
// //       console.log('No messages found.');
// //       return res.send('No transactions found.');
// //     }

// //     for (const msg of messages) {
// //       const message = await getMessage(oauth2Client, msg.id);
// //       const transaction = parseTransactionData(message);
// //       if (transaction) {
// //         storeTransaction(transaction);
// //       }
// //     }
// //     res.send('Transactions fetched and stored successfully.');
// //   } catch (err) {
// //     console.error('Error fetching transactions:', err.response?.data || err.message);
// //     res.status(500).send('An error occurred while fetching transactions.');
// //   }
// // });










// const getEmails = async (auth) => {
//     const gmail = google.gmail({ version: 'v1', auth });
//     const res = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'from:alerts@axisbank.com' // Modify the query to match your needs
//     });
//     return res.data.messages || [];
//   };
  
//   const getMessage = async (auth, messageId) => {
//     const gmail = google.gmail({ version: 'v1', auth });
//     const res = await gmail.users.messages.get({
//       userId: 'me',
//       id: messageId,
//       format: 'full'
//     });
//     return res.data;
//   };
  
//   const parseTransactionData = (message) => {
//     try {
//       const emailDataPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
//       if (!emailDataPart) {
//         console.error('No text/plain part found in the email message');
//         return null;
//       }
  
//       const emailData = Buffer.from(emailDataPart.body.data, 'base64').toString('utf-8');
//       console.log('Email Data:', emailData); // Log email data for debugging
  
//       const sender = message.payload.headers.find(header => header.name === 'From').value;
//       const subject = message.payload.headers.find(header => header.name === 'Subject').value;
//       const snippet = message.snippet;
  
//       const transaction = {
//         message_id: message.id,
//         sender,
//         subject,
//         snippet
//       };
  
//       console.log('Parsed Transaction:', transaction); // Log parsed transaction for debugging
//       return transaction;
//     } catch (error) {
//       console.error('Error parsing transaction data:', error);
//       return null;
//     }
//   };
  
// //   const storeTransaction = (transaction) => {
// //     const query = 'INSERT INTO transactions (message_id, sender, subject, snippet) VALUES (?, ?, ?, ?)';
// //     db.query(query, [
// //       transaction.message_id,
// //       transaction.sender,
// //       transaction.subject,
// //       transaction.snippet
// //     ], (err, results) => {
// //       if (err) {
// //         console.error('Error storing transaction:', err);
// //         return;
// //       }
// //       console.log('Transaction stored:', results.insertId);
// //     });
// //   };

// const storeTransaction = (transaction) => {
//     const insertTransactionQuery = 'INSERT INTO transactions (message_id, sender, subject, snippet) VALUES (?, ?, ?, ?)';
  
//     db.query(insertTransactionQuery, [
//       transaction.message_id,
//       transaction.sender,
//       transaction.subject,
//       transaction.snippet
//     ], (err, results) => {
//       if (err) {
//         console.error('Error storing transaction:', err);
//         return;
//       }
//       console.log('Transaction stored:', results.insertId);
  
//       // Execute the second query after the first one completes
//       const insertBankDetailsQuery = `
//         INSERT INTO bankDetails (message_id, amount, debit_or_credit, transaction_date)
//         SELECT 
//           message_id, 
//           CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(snippet, 'INR ', -1), ' ', 1) AS DECIMAL(10, 2)) AS amount, 
//           SUBSTRING_INDEX(subject, ' ', 1) AS debit_or_credit, 
//           DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(SUBSTRING_INDEX(snippet, 'on ', -1), ' ', 1), '%d-%m-%Y'), '%Y-%m-%d') AS transaction_date 
//         FROM transactions
//         WHERE message_id = ?
//       `;
  
//       db.query(insertBankDetailsQuery, [transaction.message_id], (err, results) => {
//         if (err) {
//           console.error('Error storing bank details:', err);
//           return;
//         }
//         console.log('Bank details stored:', results.insertId);
//       });
//     });
//   };


// //   app.get('/transactions', (req, res) => {
    

// //     const query = 'SELECT * FROM bankDetails';

   
      


// //     db.query(query, (err, results) => {
// //       if (err) {
// //         console.error('Error fetching transactions:', err);
// //         return res.status(500).send('An error occurred while fetching transactions.');
// //       }
// //       res.render('transactionskp.ejs', { transactions: results });
// //     });
// //   });


// app.get('/transactions', (req, res) => {
//     const search = req.query.search || '';
//     const searchType = req.query.searchType || 'message_id';
  
//     // Query with search functionality
//     const query = `
//       SELECT * FROM bankDetails
//       WHERE ${searchType} LIKE ?
//     `;
  
//     db.query(query, [`%${search}%`], (err, results) => {
//       if (err) {
//         console.error('Error fetching transactions:', err);
//         return res.status(500).send('An error occurred while fetching transactions.');
//       }
//       res.render('transactionskp.ejs', { transactions: results, search: search, searchType: searchType });
//     });
//   });
  
  
  
//   app.get('/fetch-transactions', async (req, res) => {
//     try {
//       const messages = await getEmails(oauth2Client);
//       if (!messages.length) {
//         console.log('No messages found.');
//         return res.send('No transactions found.');
//       }
  
//       for (const msg of messages) {
//         const message = await getMessage(oauth2Client, msg.id);
//         const transaction = parseTransactionData(message);
//         if (transaction) {
//           storeTransaction(transaction);
//         }
//       }
      
//       //res.send('Transactions fetched and stored successfully.');
//       res.render("data.ejs");

//     } catch (err) {
//       console.error('Error fetching transactions:', err.response?.data || err.message);
//       res.status(500).send('An error occurred while fetching transactions.');
//     }
//   });


//   app.get('/sum-amounts', (req, res) => {
//     const query = 'SELECT SUM(amount) AS total_amount FROM bankDetails  WHERE debit_or_credit = "Debit" ';
    
//     db.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching total amount:', err);
//         return res.status(500).send('An error occurred while fetching the total amount.');
//       }
//       res.render('totalsum.ejs', { total: results[0].total_amount });
//     });
//   });


//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   }); 



























  require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const mysql = require('mysql2');
const app = express();
const PORT = 2020;
const OAuth2 = google.auth.OAuth2;
const cookieparser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path  = require("path");
const bodyParser = require("body-parser");

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
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

const oauth2Client = new OAuth2(
    '315558729563-1faqde4j7h4nfb1clegrneaho4goock6.apps.googleusercontent.com',
    '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',
    'http://localhost:2020/oauth2callback'
);

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'karan@123',
    database: 'vijay'
});

app.get("/", (req, res) => {
    res.render("home.ejs");
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.get('/auth', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
       scope: ['https://www.googleapis.com/auth/gmail.readonly'],
     
        prompt: 'consent',
    });
    res.redirect(authUrl);
});

// app.get('/auth', (req, res) => {
//     // Construct the query for Gmail API
//     const query = encodeURIComponent('in:sent after:2024/06/20 before:2024/06/25');
    
//     // Generate the OAuth2 URL with the Gmail API endpoint
//     const authUrl = `https://www.googleapis.com/gmail/v1/users/me/messages?q=${query}`;

//     // Redirect the user to the generated authentication URL
//     res.redirect(authUrl);
// });

// app.get('/oauth2callback', async (req, res) => {
//     try {
//         const { code } = req.query;
       
//         const { tokens } = await oauth2Client.getToken(code);
//         oauth2Client.setCredentials(tokens);
//         console.log('Tokens:', tokens);
//         req.flash("success", "You have done it KP");
//         res.render("desti.ejs");
//     } catch (error) {
//         console.error('Error during OAuth callback:', error.response?.data || error.message);
//         res.status(500).send('Authentication failed');
//     }
// });


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
      FROM bankDetails
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


  

// const getEmails = async (auth) => {
//     const gmail = google.gmail({ version: 'v1', auth });
//     const res = await gmail.users.messages.list({
//         userId: 'me',
//         q: 'from:alerts@axisbank.com after:2024/06/20 before:2024/06/24' 
//     });
//     return res.data.messages || [];
// };

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

// const storeTransaction = (transaction) => {
//     const insertTransactionQuery = 'INSERT INTO transactions (message_id, sender, subject, snippet) VALUES (?, ?, ?, ?)';

//     db.query(insertTransactionQuery, [
//         transaction.message_id,
//         transaction.sender,
//         transaction.subject,
//         transaction.snippet
//     ], (err, results) => {
//         if (err) {
//             console.error('Error storing transaction:', err);
//             return;
//         }
//         console.log('Transaction stored:', results.insertId);

//         const insertBankDetailsQuery = `
//             INSERT INTO bankDetails (message_id, amount, debit_or_credit, transaction_date, transaction_time, info)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `;

//         db.query(insertBankDetailsQuery, [
//             transaction.message_id,
//             parseFloat(transaction.amount.replace(/,/g, '')), // Convert amount to a number
//             transaction.debit_or_credit,
//             transaction.date,
//             transaction.time,
//             transaction.info
//         ], (err, results) => {
//             if (err) {
//                 console.error('Error storing bank details:', err);
//                 return;
//             }
//             console.log('Bank details stored:', results.insertId);
//         });
//     });
// };


// const storeTransaction = (transaction) => {
//   const insertTransactionQuery = 'INSERT INTO transactions (message_id, sender, subject, snippet) VALUES (?, ?, ?, ?)';

//   db.query(insertTransactionQuery, [
//       transaction.message_id,
//       transaction.sender,
//       transaction.subject,
//       transaction.snippet
//   ], (err, results) => {
//       if (err) {
//           console.error('Error storing transaction:', err);
//           return;
//       }
//       console.log('Transaction stored:', results.insertId);


//       // Convert date to MySQL format (YYYY-MM-DD)
//       const [day, month, year] = transaction.date.split('-');
//       const formattedDate = `${year}-${month}-${day}`;


//       const insertBankDetailsQuery = `
//           INSERT INTO bankDetails (message_id, amount, debit_or_credit, transaction_date, transaction_time, info)
//           VALUES (?, ?, ?, ?, ?, ?)
//       `;

//       db.query(insertBankDetailsQuery, [
//           transaction.message_id,
//           parseFloat(transaction.amount.replace(/,/g, '')), // Convert amount to a number
//           transaction.debit_or_credit,
//           formattedDate,// transaction.date,
//           transaction.time.split(' ')[0], // Extract time part and convert to TIME format if necessary
//           transaction.info
//       ], (err, results) => {
//           if (err) {
//               console.error('Error storing bank details:', err);
//               return;
//           }
//           console.log('Bank details stored:', results.insertId);
//       });
//   });
// };


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
              
  

// app.get('/transactions', (req, res) => {
//     const search = req.query.search || '';
//     const searchType = req.query.searchType || 'message_id';

//     const query = `
//       SELECT * FROM bankDetails
//       WHERE ${searchType} LIKE ?
//     `;

//     db.query(query, [`%${search}%`], (err, results) => {
//         if (err) {
//             console.error('Error fetching transactions:', err);
//             return res.status(500).send('An error occurred while fetching transactions.');
//         }
//         res.render('transactionskp.ejs', { transactions: results, search: search, searchType: searchType });
//     });
// });

app.get('/transactions', (req, res) => {
  const search = req.query.search || '';
  const searchType = req.query.searchType || 'message_id';

  const query = `
    SELECT 
      message_id, 
      amount, 
      debit_or_credit, 
      DATE_FORMAT(transaction_date, '%d-%m-%Y') as transaction_date, 
      TIME_FORMAT(transaction_time, '%H:%i:%s') as transaction_time, 
      info 
    FROM bankDetails
    WHERE ${searchType} LIKE ?
  `;

  db.query(query, [`%${search}%`], (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).send('An error occurred while fetching transactions.');
    }
    res.render('transactionskp.ejs', { transactions: results, search: search, searchType: searchType });
  });
});

// app.get('/fetch-start-date', (req, res) => {
//     const query = 'SELECT transaction_date FROM bankDetails ORDER BY transaction_date ASC LIMIT 1';
  
//     db.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching start date:', err);
//         return res.status(500).send('An error occurred while fetching start date.');
//       }
  
//       // Extract the start date from the first row
//       const startDate = results.length > 0 ? results[0].transaction_date.toISOString().split('T')[0] : '';
  
//       // Render the form template with the fetched start date
//       //res.render('.ejs', { startDate });
//     });
//   });



app.get('/fetch-transactions', async (req, res) => {
    const {startDate , endDate } = req.query;
   // const startDate = `SELECT transaction_date FROM bankDetails2 ORDER BY id DESC LIMIT 1 OFFSET 2`;
    try {
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



// app.get('/fetch-transactions', async (req, res) => {
//   try {
//       // Check if bankDetails table is empty
//       db.query('SELECT COUNT(*) AS count FROM bankDetails', async (err, results) => {
//           if (err) {
//               console.error('Error checking bankDetails table:', err);
//               return res.status(500).send('An error occurred while checking bankDetails table.');
//           }

//           if (results[0].count > 0) {
//               // If table is not empty, render transactionskp.ejs
//               return res.redirect('/transactions');
//           }

//           // If table is empty, fetch and store transactions
//           const messages = await getEmails(oauth2Client);
//           if (!messages.length) {
//               console.log('No messages found.');
//               return res.send('No transactions found.');
//           }

//           for (const msg of messages) {
//               const message = await getMessage(oauth2Client, msg.id);
//               const transaction = parseTransactionData(message);
//               if (transaction) {
//                   storeTransaction(transaction);
//               }
//           }

//           res.render("data.ejs");
//       });
//   } catch (err) {
//       console.error('Error fetching transactions:', err.response?.data || err.message);
//       res.status(500).send('An error occurred while fetching transactions.');
//   }
// });

app.get('/sum-amounts', (req, res) => {
    const query = 'SELECT SUM(amount) AS total_amount FROM bankDetails WHERE debit_or_credit = "debited"';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching total amount:', err);
            return res.status(500).send('An error occurred while fetching the total amount.');
        }
        res.render('totalsum.ejs', { total: results[0].total_amount });
    });
});

app.get('/addExpenses',(req,res)=>{
    res.render("addexpenses.ejs")
})


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
      INSERT INTO bankDetails (message_id, amount, debit_or_credit, transaction_date, transaction_time, info)
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
