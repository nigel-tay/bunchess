const body = document.querySelector('body');

const gameId = body.dataset.gameid;
const orientation = body.dataset.orientation;

console.info(gameId, orientation);
const onDrop = (src, dst, piece) => {
    console.info(`src=${src}, dst=${dst}, piece=${piece}`);
    const move = { src, dst, piece };

    // PATCH /chess/:gameId
    fetch(`/chess/${gameId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(move),
    })
    .then(resp => console.info('RESPONSE: ', resp))
    .catch(err => console.error('ERROR: ', err))
}

// Create configuration
const config = {
    draggable: true,
    position: 'start',
    orientation,
    onDrop
}

// Create instance of game
const chess = Chessboard('chess', config);

// Create an SSE connection
const sse = new EventSource('/chess/stream');