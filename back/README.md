# trombi-back
A node/express backend server for the so-named "trombi" starter Angular Application.

The server uses the file students.json as a "database", which is read on server start, updated in-memory, and saved before app shutdown by catching SIGINT (see bin/www and app.js).
