# trombi-back
A backend node/express server for a starter Angular Application
available at [trombi-front](https://github.com/dmolinarius/trombi-front).

Uses local file students.json as a "database", read on server start, updated in-memory, and saved before app shutdown by catching SIGINT (see bin/www and app.js)
