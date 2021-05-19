const express = require('express');
const { projects } = require('./data/data.json');
const app = express();

/* ------------------------------------------------------------- */

// App Middleware & View Engine
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

/* -------------------------------------------------------------- */
// "Home" route
app.get('/', (req, res) => {
  res.render('index', { projects });
});

// "About" route
app.get('/about', (req, res) => {
  res.render('about');
});

// Dynamic "project" routes
app.get('/project/:id', (req, res, next) => {
  const projectId = req.params.id;
  const project = projects[projectId];

  res.render('project', { project });
});

/* -------------------------------------------------------------- */
/* ERROR HANDLERS */

// 404 Handler
app.use((req, res, next) => {
  const err = new Error('The page you requested cannot be found');
  err.status = 404;
  console.log(`${err.status}. ${err.message}`);
  next(err);
});

// Global Handler
app.use((error, req, res, next) => {
  // Ensure Error Object Has Status & Message Properties Defined
  error.status = error.status || 500;
  error.message = error.message || 'Server error';

  // Set Response Status
  res.status(error.status);

  // Render Template Based On Status Code
  if (res.statusCode === 404) {
    res.render('page-not-found', { error });
  } else {
    console.log(`Sorry. There has been an error`);

    res.render('error', {
      error: {
        status: error.status,
        message: 'Server error',
      },
    });
  }
});
/* -------------------------------------------------------------- */
// Start the server
app.listen(3000, () => {
  console.log('The Server is ON!');
});
