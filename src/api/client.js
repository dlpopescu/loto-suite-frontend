// API Client - Clean ES6 module for backend communication

// API_BASE configured for production backend
const API_BASE = 'https://dlpopescu.ro';

// Cache for games to avoid repeated API calls
let gamesCache = null;

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function getAllGames() {
    if (gamesCache) return gamesCache;
    const response = await fetch(`${API_BASE}/api/games`);
    if (!response.ok) throw new Error('Failed to fetch games');
    const json = await response.json();
    gamesCache = json.data || json;
    return gamesCache;
}

export async function getGameById(gameId) {
    const allGames = await getAllGames();
    return allGames.find(g => g.id === gameId);
}

export async function getDrawDatesAsync(daysBack) {
    const url = `${API_BASE}/api/draw-dates?days_back=${daysBack}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch draw dates');
    const json = await response.json();
    return json.data || json;
}

export async function getDrawResults(game, date) {
    const url = `${API_BASE}/api/draw-results?game=${encodeURIComponent(game)}&date=${encodeURIComponent(date)}`;
    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch draw results');
    }

    const json = await response.json();
    return json.data || json;
}

export async function checkNumbers(gameId, variante, noroc, date) {    
    const jsonPayload = JSON.stringify(
        {
            game_id: gameId,       
            variante: variante,        
            noroc: noroc,              
            date: convertToGoDate(date)
        });

    const response = await fetch(`${API_BASE}/api/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonPayload
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check numbers');
    }

    const checkResultJson = await response.json();
    const checkResult = checkResultJson.data || checkResultJson;
    
    return checkResult;
}

// export async function clearCache() {    
//     const response = await fetch(`${API_BASE}/api/clear-cache`, {
//         method: 'POST'
//     });

//     if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to clear cache');
//     }
// }

export async function scanTicket(gameId, imageData) {
    const base64 = arrayBufferToBase64(imageData);
    const response = await fetch(`${API_BASE}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: gameId, image_data: base64 })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to scan ticket');
    }
    return await response.json();
}

function convertToGoDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}
