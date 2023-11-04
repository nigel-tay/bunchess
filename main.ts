import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { v4 } from 'uuid';
import { EventSource } from 'express-ts-sse';

// Establish port
const port = process.env.PORT || 3000;

// Create instance of SSE Server
const sse = new EventSource();

// Create app instance
const app = express();

// Configure render
app.engine('html', engine({ defaultLayout: false }));
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

app.get('/chess', express.urlencoded({ extended: true }),
        (req, resp) => {
            
            const gameId = req.query.gameId;
            const orientation = 'black';
            resp.status(200).render('chess', { gameId, orientation });
        }
)

// SSE endpoint
app.get('/chess/stream', sse.init);

// PATCH /chess/:gameId
app.patch('/chess/:gameIdFromParams', express.json(),
        (req, resp) => {
            // Get gameId from path
            const gameId = req.params.gameIdFromParams;
            const move = req.body;

            console.info(`GameId: ${gameId}: `, move);

            // data should be stringifies normally, but the current library we are using helps us do that
            sse.send({ event: gameId, data: move });

            resp.status(201).json({ timeStamp: (new Date()).getTime() });
        }
)

// Serve from static dir
app.use(express.static(__dirname + '/static'))

// Start express application
app.listen(port, () => console.info(`Application bound to port ${port} at ${new Date()}`));