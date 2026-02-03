const PIECES = {
    WHITE_KING: '♔', WHITE_QUEEN: '♕', WHITE_ROOK: '♖',
    WHITE_BISHOP: '♗', WHITE_KNIGHT: '♘', WHITE_PAWN: '♙',
    BLACK_KING: '♚', BLACK_QUEEN: '♛', BLACK_ROOK: '♜',
    BLACK_BISHOP: '♝', BLACK_KNIGHT: '♞', BLACK_PAWN: '♟'
};

const PIECE_VALUES = {
    '♙': 100, '♟': 100,
    '♘': 320, '♞': 320,
    '♗': 330, '♝': 330,
    '♖': 500, '♜': 500,
    '♕': 900, '♛': 900,
    '♔': 20000, '♚': 20000
};

const PAWN_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_TABLE = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
];

const QUEEN_TABLE = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];

const KING_TABLE = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
];

const KING_ENDGAME_TABLE = [
    [-50,-40,-30,-20,-20,-30,-40,-50],
    [-30,-20,-10,  0,  0,-10,-20,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 30, 40, 40, 30,-10,-30],
    [-30,-10, 20, 30, 30, 20,-10,-30],
    [-30,-30,  0,  0,  0,  0,-30,-30],
    [-50,-30,-30,-30,-30,-30,-30,-50]
];

let board = [];
let selectedSquare = null;
let currentPlayer = 'white';
let moveHistory = [];
let capturedByPlayer = [];
let capturedByAI = [];
let gameOver = false;
let lastMove = null;
let castlingRights = { whiteKingSide: true, whiteQueenSide: true, blackKingSide: true, blackQueenSide: true };
let enPassantTarget = null;

const transpositionTable = new Map();
const killerMoves = Array(20).fill(null).map(() => [null, null]);

const initialBoard = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
];

function isWhite(piece) { return '♔♕♖♗♘♙'.includes(piece); }
function isBlack(piece) { return '♚♛♜♝♞♟'.includes(piece); }
function getPieceColor(piece) {
    if (isWhite(piece)) return 'white';
    if (isBlack(piece)) return 'black';
    return null;
}

function initBoard() {
    board = initialBoard.map(row => [...row]);
    selectedSquare = null;
    currentPlayer = 'white';
    moveHistory = [];
    capturedByPlayer = [];
    capturedByAI = [];
    gameOver = false;
    lastMove = null;
    castlingRights = { whiteKingSide: true, whiteQueenSide: true, blackKingSide: true, blackQueenSide: true };
    enPassantTarget = null;
    transpositionTable.clear();
    renderBoard();
    updateStatus();
    updateCapturedPieces();
    document.getElementById('move-history').innerHTML = '';
}

function renderBoard(animateFrom = null, animateTo = null) {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            const isWhiteSquare = (row + col) % 2 === 0;
            square.className = `square ${isWhiteSquare ? 'white-square' : 'black-square'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            
            const piece = board[row][col];
            if (piece) {
                const pieceSpan = document.createElement('span');
                pieceSpan.className = 'piece';
                pieceSpan.textContent = piece;
                if (animateTo && animateTo.row === row && animateTo.col === col) {
                    pieceSpan.classList.add('moving');
                }
                square.appendChild(pieceSpan);
            }
            
            if (lastMove) {
                if ((row === lastMove.fromRow && col === lastMove.fromCol) ||
                    (row === lastMove.toRow && col === lastMove.toCol)) {
                    square.classList.add('last-move');
                }
            }
            
            if ((piece === '♔' && isInCheck('white')) || (piece === '♚' && isInCheck('black'))) {
                square.classList.add('check');
            }
            
            square.addEventListener('click', () => handleSquareClick(row, col));
            chessboard.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    if (gameOver || currentPlayer !== 'white') return;
    const piece = board[row][col];
    
    if (selectedSquare) {
        const moves = getValidMoves(selectedSquare.row, selectedSquare.col);
        const move = moves.find(m => m.row === row && m.col === col);
        
        if (move) {
            makeMove(selectedSquare.row, selectedSquare.col, row, col);
            clearSelection();
            if (!gameOver) setTimeout(aiMove, 300);
        } else if (piece && getPieceColor(piece) === 'white') {
            selectSquare(row, col);
        } else {
            clearSelection();
        }
    } else if (piece && getPieceColor(piece) === 'white') {
        selectSquare(row, col);
    }
}

function selectSquare(row, col) {
    clearSelection();
    selectedSquare = { row, col };
    const squares = document.querySelectorAll('.square');
    squares[row * 8 + col].classList.add('selected');
    const moves = getValidMoves(row, col);
    moves.forEach(move => {
        const idx = move.row * 8 + move.col;
        squares[idx].classList.add(board[move.row][move.col] ? 'possible-capture' : 'possible-move');
    });
}

function clearSelection() {
    selectedSquare = null;
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected', 'possible-move', 'possible-capture');
    });
}

function getValidMoves(row, col, boardState = board) {
    const piece = boardState[row][col];
    if (!piece) return [];
    const color = getPieceColor(piece);
    const moves = getPossibleMoves(row, col, boardState);
    
    return moves.filter(move => {
        const testBoard = boardState.map(r => [...r]);
        testBoard[move.row][move.col] = testBoard[row][col];
        testBoard[row][col] = '';
        return !isInCheck(color, testBoard);
    });
}

function getPossibleMoves(row, col, boardState = board) {
    const piece = boardState[row][col];
    if (!piece) return [];
    const color = getPieceColor(piece);
    const moves = [];
    
    const addMove = (r, c) => {
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const target = boardState[r][c];
            if (!target || getPieceColor(target) !== color) {
                moves.push({ row: r, col: c });
                return !target;
            }
        }
        return false;
    };

    if (piece === '♙' || piece === '♟') {
        const direction = piece === '♙' ? -1 : 1;
        const startRow = piece === '♙' ? 6 : 1;
        
        if (!boardState[row + direction]?.[col]) {
            moves.push({ row: row + direction, col });
            if (row === startRow && !boardState[row + 2 * direction][col]) {
                moves.push({ row: row + 2 * direction, col });
            }
        }
        
        [-1, 1].forEach(dc => {
            const newCol = col + dc;
            if (newCol >= 0 && newCol < 8) {
                const target = boardState[row + direction][newCol];
                if (target && getPieceColor(target) !== color) {
                    moves.push({ row: row + direction, col: newCol });
                }
                if (enPassantTarget && enPassantTarget.row === row + direction && enPassantTarget.col === newCol) {
                    moves.push({ row: row + direction, col: newCol, enPassant: true });
                }
            }
        });
    }
    
    if (piece === '♘' || piece === '♞') {
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addMove(row+dr, col+dc));
    }

    if (piece === '♗' || piece === '♝') {
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col - i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col + i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col - i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col + i)) break;
    }

    if (piece === '♖' || piece === '♜') {
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row, col - i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row, col + i)) break;
    }

    if (piece === '♕' || piece === '♛') {
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col - i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col + i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col - i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col + i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row - i, col)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row + i, col)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row, col - i)) break;
        for (let i = 1; i < 8; i++) if (!addMove(row, col + i)) break;
    }

    if (piece === '♔' || piece === '♚') {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr !== 0 || dc !== 0) addMove(row + dr, col + dc);
            }
        }

        if (!isInCheck(color, boardState)) {
            if (color === 'white') {
                if (castlingRights.whiteKingSide && !boardState[7][5] && !boardState[7][6] &&
                    !isSquareAttacked(7, 5, 'black', boardState) && !isSquareAttacked(7, 6, 'black', boardState)) {
                    moves.push({ row: 7, col: 6, castling: 'kingSide' });
                }
                if (castlingRights.whiteQueenSide && !boardState[7][1] && !boardState[7][2] && !boardState[7][3] &&
                    !isSquareAttacked(7, 2, 'black', boardState) && !isSquareAttacked(7, 3, 'black', boardState)) {
                    moves.push({ row: 7, col: 2, castling: 'queenSide' });
                }
            } else {
                if (castlingRights.blackKingSide && !boardState[0][5] && !boardState[0][6] &&
                    !isSquareAttacked(0, 5, 'white', boardState) && !isSquareAttacked(0, 6, 'white', boardState)) {
                    moves.push({ row: 0, col: 6, castling: 'kingSide' });
                }
                if (castlingRights.blackQueenSide && !boardState[0][1] && !boardState[0][2] && !boardState[0][3] &&
                    !isSquareAttacked(0, 2, 'white', boardState) && !isSquareAttacked(0, 3, 'white', boardState)) {
                    moves.push({ row: 0, col: 2, castling: 'queenSide' });
                }
            }
        }
    }
    
    return moves;
}

function isSquareAttacked(row, col, byColor, boardState = board) {
    const isWhiteAttacker = byColor === 'white';
    const pawnDir = isWhiteAttacker ? 1 : -1;
    const pawn = isWhiteAttacker ? '♙' : '♟';
    
    if (row + pawnDir >= 0 && row + pawnDir < 8) {
        if (col - 1 >= 0 && boardState[row + pawnDir][col - 1] === pawn) return true;
        if (col + 1 < 8 && boardState[row + pawnDir][col + 1] === pawn) return true;
    }

    const knight = isWhiteAttacker ? '♘' : '♞';
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && boardState[nr][nc] === knight) return true;
    }

    const king = isWhiteAttacker ? '♔' : '♚';
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && boardState[nr][nc] === king) return true;
        }
    }

    const rook = isWhiteAttacker ? '♖' : '♜';
    const queen = isWhiteAttacker ? '♕' : '♛';
    for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        for (let i = 1; i < 8; i++) {
            const nr = row + dr * i, nc = col + dc * i;
            if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
            const piece = boardState[nr][nc];
            if (piece) {
                if (piece === rook || piece === queen) return true;
                break;
            }
        }
    }

    const bishop = isWhiteAttacker ? '♗' : '♝';
    for (const [dr, dc] of [[1,1],[1,-1],[-1,1],[-1,-1]]) {
        for (let i = 1; i < 8; i++) {
            const nr = row + dr * i, nc = col + dc * i;
            if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
            const piece = boardState[nr][nc];
            if (piece) {
                if (piece === bishop || piece === queen) return true;
                break;
            }
        }
    }
    
    return false;
}

function isInCheck(color, boardState = board) {
    const king = color === 'white' ? '♔' : '♚';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (boardState[r][c] === king) {
                return isSquareAttacked(r, c, color === 'white' ? 'black' : 'white', boardState);
            }
        }
    }
    return false;
}

function makeMove(fromRow, fromCol, toRow, toCol, promotionPiece = null) {
    const piece = board[fromRow][fromCol];
    const captured = board[toRow][toCol];
    const color = getPieceColor(piece);

    const moveData = {
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        piece, captured,
        castlingRights: { ...castlingRights },
        enPassantTarget: enPassantTarget ? { ...enPassantTarget } : null
    };

    const moves = getPossibleMoves(fromRow, fromCol);
    const move = moves.find(m => m.row === toRow && m.col === toCol);
    
    if (move?.enPassant) {
        const capturedPawnRow = color === 'white' ? toRow + 1 : toRow - 1;
        moveData.enPassantCapture = { row: capturedPawnRow, col: toCol };
        const capturedPawn = board[capturedPawnRow][toCol];
        (color === 'white' ? capturedByPlayer : capturedByAI).push(capturedPawn);
        board[capturedPawnRow][toCol] = '';
    }

    if (move?.castling) {
        if (move.castling === 'kingSide') {
            board[toRow][5] = board[toRow][7];
            board[toRow][7] = '';
        } else {
            board[toRow][3] = board[toRow][0];
            board[toRow][0] = '';
        }
        moveData.castling = move.castling;
    }

    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';

    if (captured) (color === 'white' ? capturedByPlayer : capturedByAI).push(captured);

    if ((piece === '♙' && toRow === 0) || (piece === '♟' && toRow === 7)) {
        if (promotionPiece) {
            board[toRow][toCol] = promotionPiece;
            moveData.promotion = promotionPiece;
        } else if (color === 'white') {
            showPromotionModal(toRow, toCol, color);
            return;
        } else {
            board[toRow][toCol] = '♛';
            moveData.promotion = '♛';
        }
    }

    if (piece === '♔') { castlingRights.whiteKingSide = false; castlingRights.whiteQueenSide = false; }
    if (piece === '♚') { castlingRights.blackKingSide = false; castlingRights.blackQueenSide = false; }
    if (piece === '♖' || (fromRow === 7 && fromCol === 0)) castlingRights.whiteQueenSide = false;
    if (piece === '♖' || (fromRow === 7 && fromCol === 7)) castlingRights.whiteKingSide = false;
    if (piece === '♜' || (fromRow === 0 && fromCol === 0)) castlingRights.blackQueenSide = false;
    if (piece === '♜' || (fromRow === 0 && fromCol === 7)) castlingRights.blackKingSide = false;
    
    enPassantTarget = ((piece === '♙' || piece === '♟') && Math.abs(toRow - fromRow) === 2)
        ? { row: (fromRow + toRow) / 2, col: fromCol } : null;
    
    moveHistory.push(moveData);
    lastMove = { fromRow, fromCol, toRow, toCol };
    addMoveToHistory(moveData);
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    
    renderBoard({ row: fromRow, col: fromCol }, { row: toRow, col: toCol });
    updateStatus();
    updateCapturedPieces();
    checkGameEnd();
}

function showPromotionModal(row, col, color) {
    const modal = document.getElementById('promotion-modal');
    const piecesContainer = document.getElementById('promotion-pieces');
    const pieces = color === 'white' ? ['♕', '♖', '♗', '♘'] : ['♛', '♜', '♝', '♞'];
    piecesContainer.innerHTML = pieces.map(p => `<span onclick="selectPromotion('${p}', ${row}, ${col})">${p}</span>`).join('');
    modal.classList.add('active');
}

window.selectPromotion = function(piece, row, col) {
    board[row][col] = piece;
    document.getElementById('promotion-modal').classList.remove('active');
    moveHistory[moveHistory.length - 1].promotion = piece;
    currentPlayer = 'black';
    renderBoard();
    updateStatus();
    checkGameEnd();
    if (!gameOver) setTimeout(aiMove, 300);
};

function addMoveToHistory(moveData) {
    const files = 'abcdefgh', ranks = '87654321';
    const from = files[moveData.from.col] + ranks[moveData.from.row];
    const to = files[moveData.to.col] + ranks[moveData.to.row];
    let notation = moveData.piece + from + (moveData.captured ? 'x' : '-') + to;
    if (moveData.promotion) notation += '=' + moveData.promotion;
    if (moveData.castling === 'kingSide') notation = 'O-O';
    if (moveData.castling === 'queenSide') notation = 'O-O-O';
    
    const historyDiv = document.getElementById('move-history');
    const moveNum = Math.ceil(moveHistory.length / 2);
    historyDiv.innerHTML += moveHistory.length % 2 === 1 ? `${moveNum}. ${notation} ` : `${notation}<br>`;
    historyDiv.scrollTop = historyDiv.scrollHeight;
}

function checkGameEnd() {
    const color = currentPlayer;
    let hasLegalMoves = false;
    
    outer: for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] && getPieceColor(board[r][c]) === color && getValidMoves(r, c).length > 0) {
                hasLegalMoves = true;
                break outer;
            }
        }
    }
    
    if (!hasLegalMoves) {
        gameOver = true;
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        
        if (isInCheck(color)) {
            title.textContent = 'チェックメイト！';
            message.textContent = color === 'white' ? 'AIの勝利です。また挑戦してください！' : 'おめでとうございます！あなたの勝利です！';
        } else {
            title.textContent = 'ステイルメイト';
            message.textContent = '引き分けです。';
        }
        modal.classList.add('active');
    }
}

function updateStatus() {
    const status = document.getElementById('status');
    if (gameOver) return;
    
    if (currentPlayer === 'white') {
        status.textContent = isInCheck('white') ? '⚠️ チェック！あなたの番です' : 'あなたの番です（白）';
        status.className = 'status';
    } else {
        status.textContent = 'AIが考えています...';
        status.className = 'status thinking';
    }
}

function updateCapturedPieces() {
    document.getElementById('player-captured').textContent = capturedByPlayer.join(' ');
    document.getElementById('ai-captured').textContent = capturedByAI.join(' ');
}

function getBoardHash(boardState) {
    return boardState.flat().join('');
}

function evaluateBoard(boardState) {
    let score = 0, whiteMaterial = 0, blackMaterial = 0;
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = boardState[r][c];
            if (!piece) continue;
            
            const value = PIECE_VALUES[piece];
            const isWhitePiece = isWhite(piece);
            isWhitePiece ? whiteMaterial += value : blackMaterial += value;
            
            const evalRow = isWhitePiece ? r : 7 - r;
            let posValue = 0;
            
            if (piece === '♙' || piece === '♟') posValue = PAWN_TABLE[evalRow][c];
            else if (piece === '♘' || piece === '♞') posValue = KNIGHT_TABLE[evalRow][c];
            else if (piece === '♗' || piece === '♝') posValue = BISHOP_TABLE[evalRow][c];
            else if (piece === '♖' || piece === '♜') posValue = ROOK_TABLE[evalRow][c];
            else if (piece === '♕' || piece === '♛') posValue = QUEEN_TABLE[evalRow][c];
            else if (piece === '♔' || piece === '♚') {
                posValue = (whiteMaterial + blackMaterial - 40000 < 2600) ? KING_ENDGAME_TABLE[evalRow][c] : KING_TABLE[evalRow][c];
            }
            
            score += isWhitePiece ? (value + posValue) : -(value + posValue);
        }
    }
    
    return score;
}

function getAllMoves(color, boardState) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = boardState[r][c];
            if (piece && getPieceColor(piece) === color) {
                for (const move of getValidMoves(r, c, boardState)) {
                    moves.push({ fromRow: r, fromCol: c, toRow: move.row, toCol: move.col, castling: move.castling, enPassant: move.enPassant });
                }
            }
        }
    }
    return moves;
}

function applyMove(boardState, move) {
    const newBoard = boardState.map(row => [...row]);
    const piece = newBoard[move.fromRow][move.fromCol];
    
    newBoard[move.toRow][move.toCol] = piece;
    newBoard[move.fromRow][move.fromCol] = '';

    if (move.castling === 'kingSide') { newBoard[move.toRow][5] = newBoard[move.toRow][7]; newBoard[move.toRow][7] = ''; }
    else if (move.castling === 'queenSide') { newBoard[move.toRow][3] = newBoard[move.toRow][0]; newBoard[move.toRow][0] = ''; }
    if (move.enPassant) newBoard[getPieceColor(piece) === 'white' ? move.toRow + 1 : move.toRow - 1][move.toCol] = '';
    if (piece === '♟' && move.toRow === 7) newBoard[move.toRow][move.toCol] = '♛';
    if (piece === '♙' && move.toRow === 0) newBoard[move.toRow][move.toCol] = '♕';
    
    return newBoard;
}

function estimateMoveValue(boardState, move, depth) {
    let score = 0;
    const piece = boardState[move.fromRow][move.fromCol];
    const captured = boardState[move.toRow][move.toCol];
    
    if (captured) score += 10 * PIECE_VALUES[captured] - PIECE_VALUES[piece];
    if ((piece === '♟' && move.toRow === 7) || (piece === '♙' && move.toRow === 0)) score += 900;
    
    const killer = killerMoves[depth];
    if (killer && killer[0] && killer[0].fromRow === move.fromRow && killer[0].fromCol === move.fromCol &&
        killer[0].toRow === move.toRow && killer[0].toCol === move.toCol) score += 90;
    else if (killer && killer[1] && killer[1].fromRow === move.fromRow && killer[1].fromCol === move.fromCol &&
        killer[1].toRow === move.toRow && killer[1].toCol === move.toCol) score += 80;
    
    return score;
}

function storeKillerMove(move, depth) {
    if (depth < killerMoves.length) {
        if (!killerMoves[depth][0] || (killerMoves[depth][0].fromRow !== move.fromRow || killerMoves[depth][0].toRow !== move.toRow)) {
            killerMoves[depth][1] = killerMoves[depth][0];
            killerMoves[depth][0] = move;
        }
    }
}

function quiescence(boardState, alpha, beta, color) {
    const standPat = evaluateBoard(boardState);
    
    if (color === 'white') {
        if (standPat >= beta) return beta;
        if (standPat > alpha) alpha = standPat;
    } else {
        if (standPat <= alpha) return alpha;
        if (standPat < beta) beta = standPat;
    }
    
    const moves = getAllMoves(color, boardState).filter(m => boardState[m.toRow][m.toCol]);
    
    for (const move of moves) {
        const newBoard = applyMove(boardState, move);
        const score = quiescence(newBoard, alpha, beta, color === 'white' ? 'black' : 'white');
        
        if (color === 'white') {
            if (score >= beta) return beta;
            if (score > alpha) alpha = score;
        } else {
            if (score <= alpha) return alpha;
            if (score < beta) beta = score;
        }
    }
    
    return color === 'white' ? alpha : beta;
}

function minimax(boardState, depth, alpha, beta, isMaximizing, color, ply = 0) {
    const hash = getBoardHash(boardState) + depth + color;
    const cached = transpositionTable.get(hash);
    if (cached && cached.depth >= depth) return cached;
    
    if (depth === 0) {
        const score = quiescence(boardState, alpha, beta, color);
        return { score };
    }
    
    const moves = getAllMoves(color, boardState);
    
    if (moves.length === 0) {
        const score = isInCheck(color, boardState) ? (isMaximizing ? -100000 + ply : 100000 - ply) : 0;
        return { score };
    }
    
    moves.sort((a, b) => estimateMoveValue(boardState, b, ply) - estimateMoveValue(boardState, a, ply));
    
    let bestMove = moves[0];
    
    if (isMaximizing) {
        let maxScore = -Infinity;
        for (const move of moves) {
            const newBoard = applyMove(boardState, move);
            const result = minimax(newBoard, depth - 1, alpha, beta, false, 'black', ply + 1);
            
            if (result.score > maxScore) { maxScore = result.score; bestMove = move; }
            alpha = Math.max(alpha, result.score);
            if (beta <= alpha) { storeKillerMove(move, ply); break; }
        }
        const entry = { score: maxScore, move: bestMove, depth };
        transpositionTable.set(hash, entry);
        return entry;
    } else {
        let minScore = Infinity;
        for (const move of moves) {
            const newBoard = applyMove(boardState, move);
            const result = minimax(newBoard, depth - 1, alpha, beta, true, 'white', ply + 1);
            
            if (result.score < minScore) { minScore = result.score; bestMove = move; }
            beta = Math.min(beta, result.score);
            if (beta <= alpha) { storeKillerMove(move, ply); break; }
        }
        const entry = { score: minScore, move: bestMove, depth };
        transpositionTable.set(hash, entry);
        return entry;
    }
}

function aiMove() {
    if (gameOver || currentPlayer !== 'black') return;
    const depth = parseInt(document.getElementById('difficulty').value);
    
    setTimeout(() => {
        if (transpositionTable.size > 100000) transpositionTable.clear();
        const result = minimax(board, depth, -Infinity, Infinity, false, 'black');
        if (result.move) makeMove(result.move.fromRow, result.move.fromCol, result.move.toRow, result.move.toCol);
    }, 10);
}

function undo() {
    if (moveHistory.length < 2) return;
    
    for (let i = 0; i < 2; i++) {
        if (moveHistory.length === 0) break;
        const move = moveHistory.pop();
        
        board[move.from.row][move.from.col] = move.piece;
        board[move.to.row][move.to.col] = move.captured || '';
        
        if (move.enPassantCapture) {
            board[move.enPassantCapture.row][move.enPassantCapture.col] = getPieceColor(move.piece) === 'white' ? '♟' : '♙';
            (getPieceColor(move.piece) === 'white' ? capturedByPlayer : capturedByAI).pop();
        }
        
        if (move.castling === 'kingSide') { board[move.to.row][7] = board[move.to.row][5]; board[move.to.row][5] = ''; }
        else if (move.castling === 'queenSide') { board[move.to.row][0] = board[move.to.row][3]; board[move.to.row][3] = ''; }
        
        if (move.captured) (getPieceColor(move.piece) === 'white' ? capturedByPlayer : capturedByAI).pop();
        
        castlingRights = { ...move.castlingRights };
        enPassantTarget = move.enPassantTarget;
    }
    
    currentPlayer = 'white';
    lastMove = moveHistory.length > 0 ? {
        fromRow: moveHistory[moveHistory.length - 1].from.row,
        fromCol: moveHistory[moveHistory.length - 1].from.col,
        toRow: moveHistory[moveHistory.length - 1].to.row,
        toCol: moveHistory[moveHistory.length - 1].to.col
    } : null;
    
    gameOver = false;
    document.getElementById('game-over-modal').classList.remove('active');
    renderBoard();
    updateStatus();
    updateCapturedPieces();
    
    const historyDiv = document.getElementById('move-history');
    historyDiv.innerHTML = '';
    moveHistory.forEach((m, i) => {
        const files = 'abcdefgh', ranks = '87654321';
        let notation = m.piece + files[m.from.col] + ranks[m.from.row] + (m.captured ? 'x' : '-') + files[m.to.col] + ranks[m.to.row];
        if (m.promotion) notation += '=' + m.promotion;
        if (m.castling === 'kingSide') notation = 'O-O';
        if (m.castling === 'queenSide') notation = 'O-O-O';
        historyDiv.innerHTML += i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ${notation} ` : `${notation}<br>`;
    });
}

document.getElementById('new-game').addEventListener('click', initBoard);
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('play-again').addEventListener('click', () => {
    document.getElementById('game-over-modal').classList.remove('active');
    initBoard();
});

initBoard();
