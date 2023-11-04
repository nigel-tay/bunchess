import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { v4 } from 'uuid';

// Establish port
const port = process.env.PORT || 3000;

// Create app instance
const app = express();

// Configure render
app.engine('html', engine({ defaultLayout: false }))
app.set('view engine', 'html'); // html is the file suffix


// Log incoming requests
app.use(morgan('combined'));

// POST /chess
app.post('/chess', express.urlencoded({ extended: true }), 
        (req, resp) => {
            const gameId = v4().substring(0, 8);
            const orientation = 'white';

            resp.status(200).render('chess', { gameId, orientation });
        }
    )





// Serve from static dir
app.use(express.static(__dirname + '/static'))

// Start express application
app.listen(port, () => console.info(`Application bound to port ${port} at ${new Date()}`));