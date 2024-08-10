(()=>{"use strict";class e{constructor(){this.pieceValues=new Map,this.verbosityLevel=0,this.gameModel=void 0,this.config=void 0,this.evaluationWeights={kingSafety:200,material:100,pieceActivity:10,mobility:10,pawnStructure:20,center:15,development:15,pieceSafety:150},this.pieceValues=new Map([["pawn",100],["knight",320],["bishop",330],["rook",500],["queen",900],["king",2e4]])}initialize(e,t){this.gameModel=e,this.config=t,this.verbosityLevel=t.verbosityLevel||0,t.evaluationWeights&&(this.evaluationWeights={...this.evaluationWeights,...t.evaluationWeights}),console.log("Initializing BasicAIPlayer: config=".concat(JSON.stringify(t)))}async calculateBestMove(e){if(!e||!e.currentTurn)return console.error("Invalid game state received in calculateBestMove"),null;console.log("AI Move: ".concat(e.currentTurn," - ").concat(JSON.stringify(this.config))),this.verbosityLevel>=1&&console.group("calculateBestMove");const t=this.config.depthLimit||3;this.verbosityLevel>=1&&console.log("Search Depth: ".concat(t,", Time Limit: ").concat(this.config.timeLimit||5e3,"ms"));let o=[];const i=this.getLegalMoves(e);if(0===i.length)return this.verbosityLevel>=0&&console.error("No legal moves available. Possible stalemate or checkmate."),this.verbosityLevel>=1&&console.groupEnd(),null;o=i.map((t=>({move:t,score:this.evaluatePosition(this.gameModel.makeMove(e,t),e.currentTurn)}))),this.verbosityLevel>=1&&console.log("Total Legal Moves: ".concat(i.length));const n=Date.now(),r=this.config.timeLimit||5e3;return 0===i.length?(console.error("No legal moves found. Returning null."),null):new Promise(((s,c)=>{const a=(c,l)=>{let h=this,u=h.verbosityLevel;function g(){if(0===o.length)return u>=0&&console.error("No valid moves found within tim e limit"),void s(null);const e=h.selectMoveWithRandomness(o);if(null===e)return u>=0&&console.error("No valid moves available after selection"),void s(null);u>=1&&console.log("Selected move: ".concat(e.piece.type," ").concat(e.from.x,",").concat(e.from.y," -> ").concat(e.to.x,",").concat(e.to.y)),u>=1&&console.groupEnd(),s(e)}if(Date.now()-n>r)return u>=1&&console.log("Time limit reached."),void g.call(this);for(let n=c;n<l&&n<i.length;n++){const r=i[n];let s=0;this.verbosityLevel>=1&&console.group("Evaluating move ".concat(n+1,"/").concat(i.length,": ").concat(r.piece.color," ").concat(r.piece.type," ").concat(r.from.x,",").concat(r.from.y," -> ").concat(r.to.x,",").concat(r.to.y));try{const i=performance.now();s=-this.negamax(t-1,this.gameModel.makeMove(e,r)),this.verbosityLevel>=1&&(console.log("Move evaluation time: ".concat((performance.now()-i).toFixed(2),"ms")),console.log("Score: ".concat(s))),o=o.filter((e=>e.move!==r)),o.push({move:r,score:s})}catch(d){this.verbosityLevel>=0&&console.error("Error evaluating move: ".concat(d.message)),this.verbosityLevel>=1&&console.error("Current state during error:",JSON.stringify(e,null,2)),this.verbosityLevel>=1&&console.error("Current state during error:",JSON.stringify(e,null,2)),this.verbosityLevel>=1&&console.error("Move causing error:",JSON.stringify(r,null,2))}finally{this.verbosityLevel>=1&&console.groupEnd(),u>=2&&console.log("Move: ".concat(r.piece.color," ").concat(r.piece.type," from (").concat(r.from.x,",").concat(r.from.y,") to (").concat(r.to.x,",").concat(r.to.y,"), Score: ").concat(s))}}l>=i.length?g.call(this):setTimeout((()=>a(l,l+10)),0)};a(0,10)}))}evaluatePosition(e,t){return[{value:this.evaluateKingSafety(e,t),weight:this.evaluationWeights.kingSafety},{value:this.evaluateMaterial(e,t),weight:this.evaluationWeights.material},{value:this.evaluatePieceActivity(e,t),weight:this.evaluationWeights.pieceActivity},{value:this.evaluateMobility(e,t),weight:this.evaluationWeights.mobility},{value:this.evaluatePawnStructure(e,t),weight:this.evaluationWeights.pawnStructure},{value:this.evaluateCenter(e,t),weight:this.evaluationWeights.center},{value:this.evaluateDevelopment(e,t),weight:this.evaluationWeights.development},{value:this.evaluatePieceSafety(e,t),weight:this.evaluationWeights.pieceSafety}].reduce(((e,t)=>e+t.value*t.weight),0)}evaluatePawnStructure(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.currentTurn,o=0;const i=e.board.filter((e=>"pawn"===e.type&&e.color===t));o-=this.evaluateDoubledPieces(i),o-=this.evaluateIsolatedPieces(i);const n=e.board.filter((e=>"pawn"===e.type&&e.color!==t));return o+=this.evaluateAdvancedPieces(i,n),this.verbosityLevel>=3&&console.log("Evaluated pawn structure for ".concat(t,": ").concat(o)),o}getLegalMoves(e){this.verbosityLevel>=3&&(console.group("getLegalMoves"),console.log("Current turn: ".concat(e.currentTurn)));try{const t=e.board.filter((t=>t.color===e.currentTurn)).flatMap((t=>{const o=this.gameModel.calculatePossibleMoves(e,t);return this.verbosityLevel>=3&&console.log("Possible moves for ".concat(t.color," ").concat(t.type," at (").concat(t.position.x,",").concat(t.position.y,"):"),o),o.map((e=>({from:t.position,to:e,piece:t})))}));return this.verbosityLevel>=3&&console.log("Total legal moves found: ".concat(t.length)),t}finally{this.verbosityLevel>=3&&console.groupEnd()}}evaluateKingSafety(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.currentTurn,o=0;const i=e.board.find((e=>"king"==e.type&&e.color==t));if(!i)return this.verbosityLevel>=1&&console.warn("No ".concat(t," king found on the board. Returning default score.")),0;this.gameModel.isInCheck(e,t)&&(o-=50);return o+=10*e.board.filter((e=>e.color==t&&Math.abs(e.position.x-i.position.x)<=1&&Math.abs(e.position.y-i.position.y)<=1)).length,this.verbosityLevel>=3&&console.log("King safety for ".concat(t,": ").concat(o)),o}calculateMobilityScore(e,t){let o=this.getLegalMoves(t).filter((t=>t.piece.color==e)).length;return this.verbosityLevel>=3&&console.log("Mobility score for ".concat(e,": ").concat(o)),o}evaluatePieceSafety(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.currentTurn,o=0;for(const i of e.board){const n=this.gameModel.getAttackersOfSquare(e,i.position,"white"===i.color?"black":"white"),r=this.gameModel.getAttackersOfSquare(e,i.position,i.color);if(n.length>0){const e=this.pieceValues.get(i.type)||0,s=Math.min(...n.map((e=>this.pieceValues.get(e.type)||0))),c=e*n.length/((r.length+1)*Math.max(s,1));o+=i.color===t?-c:c}}return o}negamax(e,t){if(!t||!t.currentTurn)return console.error("Invalid game state received in negamax"),0;t.currentTurn;const o=this.verbosityLevel,i=this.gameModel,n=this;return function e(t,r,s,c){const a=c.currentTurn;o>=2&&console.group("Negamax: depth=".concat(t,", alpha=").concat(r,", beta=").concat(s));try{if(t<=0){let e=n.evaluatePosition(c,a);return o>=2&&console.log("Leaf node reached: depth=".concat(t,", score=").concat(e)),e}if(i.isInCheckmate(c,a))return o>=2&&console.log("Checkmate found at depth ".concat(t)),-2e4+t;if(i.isStalemate(c))return o>=2&&console.log("Stalemate found at depth ".concat(t)),0;const l=n.getLegalMoves(c);if(0===l.length)return o>=2&&console.log("No legal moves found at depth ".concat(t)),i.isInCheck(c,a)?-2e4+t:0;o>=2&&console.log("Legal moves at depth ".concat(t,": ").concat(l.length));let h=-1/0;for(const n of l){o>=2&&console.group("Evaluating move: ".concat(n.piece.color," ").concat(n.piece.type," from (").concat(n.from.x,",").concat(n.from.y,") to (").concat(n.to.x,",").concat(n.to.y,")"));try{const a=-e(t-1,-s,-r,i.makeMove(c,n));if(o>=2&&console.log("Move: ".concat(JSON.stringify(n),", Score: ").concat(a)),a>h&&(o>=2&&console.log("New best move found: ".concat(n.piece.type," from (").concat(n.from.x,",").concat(n.from.y,") to (").concat(n.to.x,",").concat(n.to.y,"), score: ").concat(a)),h=a),a>r&&(o>=2&&console.log("New alpha: ".concat(n.piece.type," from (").concat(n.from.x,",").concat(n.from.y,") to (").concat(n.to.x,",").concat(n.to.y,"), score: ").concat(a)),r=a),r>=s){o>=2&&console.log("New best move found: ".concat(n.piece.type," from (").concat(n.from.x,",").concat(n.from.y,") to (").concat(n.to.x,",").concat(n.to.y,"), score: ").concat(a)),o>=2&&console.log("Beta cutoff at depth ".concat(t));break}}finally{o>=2&&console.groupEnd(),o>=2&&console.log("Move: ".concat(n.piece.color," ").concat(n.piece.type," from (").concat(n.from.x,",").concat(n.from.y,") to (").concat(n.to.x,",").concat(n.to.y,"), Score: ").concat(h,", Alpha: ").concat(r,", Beta: ").concat(s))}}return o>=2&&console.log("Negamax result: ".concat(h)),h}finally{o>=2&&console.groupEnd()}}(e||3,-1/0,1/0,t)}evaluateCenter(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.currentTurn;const o=[{x:3,y:3},{x:3,y:4},{x:4,y:3},{x:4,y:4}];let i=0;for(const n of o){const o=this.gameModel.getPieceAt(e,n);o&&(i+=o.color===t?10:-10),i+=this.gameModel.isUnderAttack(e,n,t)?5:-5}return i}evaluateDevelopment(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.currentTurn,o=0;const i="white"===t?0:7;for(const n of e.board.filter((e=>e.color===t)))"pawn"!==n.type&&"king"!==n.type&&n.position.y!==i&&(o+=10);return o}selectMoveWithRandomness(e){let t=this.config.randomnessFactor||.1;if(this.verbosityLevel>=2&&(e.forEach((e=>console.log("Move: ".concat(JSON.stringify(e.move),", Score: ").concat(e.score)))),console.log("Selecting move with randomness factor: ".concat(t))),e.sort(((e,t)=>t.score-e.score)),0===e.length)return this.verbosityLevel>=0&&console.error("No valid moves available"),null;const o=e.reduce(((e,o)=>e+Math.exp(o.score*t)),0),i=Math.random()*o;let n=0;for(let r=0;r<e.length;r++){const o=e[r];if(n+=Math.exp(o.score*t),i<=n)return e[r].move;this.verbosityLevel>=3&&console.log("Move ".concat(r,": ").concat(JSON.stringify(e[r].move),", Score: ").concat(e[r].score,", Weight: ").concat(o.score))}return e[0].move}evaluateMaterial(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.currentTurn,o=0;for(const i of e.board){const e=this.pieceValues.get(i.type)||0;o+=i.color==t?e:-e}return o}evaluatePieceActivity(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.currentTurn,o=0;for(const i of e.board){const n=this.gameModel.calculatePossibleMoves(e,i)||[];n&&(o+=n.length*(i.color===t?1:-1),n||this.verbosityLevel>=1&&console.error("No moves found for piece: ".concat(JSON.stringify(i))))}return this.verbosityLevel>=3&&console.log("Piece activity evaluation: ".concat(o)),o}evaluateMobility(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.currentTurn;const o=this.calculateMobilityScore("white",e),i=this.calculateMobilityScore("black",e);return"white"===t?o-i:i-o}evaluateDoubledPieces(e){const t=e.map((e=>e.position.x));return 10*-t.filter(((e,o)=>t.indexOf(e)!==o)).length}evaluateIsolatedPieces(e){const t=e.map((e=>e.position.x));return 15*-t.filter((e=>!t.some((t=>1==Math.abs(t-e))))).length}evaluateAdvancedPieces(e,t){return 20*e.filter((e=>!t.some((t=>Math.abs(t.position.x-e.position.x)<=1&&("white"==e.color&&t.position.y>e.position.y||"black"==e.color&&t.position.y<e.position.y))))).length}}const t=["1","2","3","4","5","6","7","8"],o=["a","b","c","d","e","f","g","h"];function i(e){if("object"===typeof(i=e)&&"x"in i&&"y"in i)return e;var i;if(Array.isArray(e))return{x:e[0],y:e[1],z:e[2]};if("string"===typeof e){const[i,n]=e.split("");return{x:o.indexOf(i),y:t.indexOf(n)}}throw new Error("Invalid position format")}class n{constructor(){this.width=8,this.height=8,this.depth=1}getRank(e){return(e.y+1).toString()}getFile(e){return String.fromCharCode(97+e.x)}getAllPositions(){const e=[];for(let t=0;t<this.width;t++)for(let o=0;o<this.height;o++)e.push({x:t,y:o});return e}isValidPosition(e){return e.x>=0&&e.x<this.width&&e.y>=0&&e.y<this.height}getAdjacentPositions(e){const t=[],o=[{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:1,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1}];for(const i of o){const o={x:e.x+i.x,y:e.y+i.y};this.isValidPosition(o)&&t.push(o)}return t}getDistance(e,t){return Math.max(Math.abs(e.x-t.x),Math.abs(e.y-t.y))}positionToString(e){const t=String.fromCharCode(97+e.x),o=e.y+1;let i="".concat(t).concat(o);return console.log("Converted position to string:",e,"->",i),i}stringToPosition(e){const t=e.charAt(0).toLowerCase(),o=parseInt(e.charAt(1));return{x:t.charCodeAt(0)-97,y:o-1}}getInitialPiecePositions(){const e=new Map,t=["R","N","B","Q","K","B","N","R"];for(let o=0;o<8;o++)e.set("wP".concat(o),{x:o,y:1}),e.set("bP".concat(o),{x:o,y:6}),e.set("w".concat(t[o]).concat(o<5?1:2),{x:o,y:0}),e.set("b".concat(t[o]).concat(o<5?1:2),{x:o,y:7});return e}arePositionsInLine(e,t){return e.x===t.x||e.y===t.y||Math.abs(e.x-t.x)===Math.abs(e.y-t.y)}getPositionsBetween(e,t){const o=[],i=Math.sign(t.x-e.x),n=Math.sign(t.y-e.y);let r=e.x+i,s=e.y+n;for(;r!==t.x||s!==t.y;)o.push({x:r,y:s}),r+=i,s+=n;return o}getPromotionRanks(){const e=[];for(let t=0;t<this.width;t++)e.push(this.getRank({x:t,y:0})),e.push(this.getRank({x:t,y:this.height-1}));return e}isDiagonalMove(e,t){return Math.abs(e.x-t.x)===Math.abs(e.y-t.y)}isOrthogonalMove(e,t){return e.x===t.x||e.y===t.y}getAttackersOfSquare(e,t,o){throw new Error("Method not implemented.")}}class r{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];this.initialState=void 0,this.undoneMoves=[],this.className="MoveHistory",this.isInitializing=!1,this.moves=[],this.moves=[...t],this.initialState=[...e]}copyInitialState(){return[...this.initialState]}resetWithNewState(e){console.debug("".concat(this.className,": Resetting move history with new initial state")),this.initialState=[...e],this.clear()}addMove(e){return this.isInitializing||this.moves.some((t=>t.from.x===e.from.x&&t.from.y===e.from.y&&t.to.x===e.to.x&&t.to.y===e.to.y))||(this.moves.push(e),this.undoneMoves=[],this.isInitializing=!1),this}getLastMove(){return this.moves.length>0?this.moves[this.moves.length-1]:null}clear(){this.moves=[],this.undoneMoves=[]}undoLastMove(){if(this.canUndo()){const e=this.moves.pop();return this.undoneMoves.push(e),{move:e,boardState:null}}return{move:null,boardState:null}}redoMove(){if(this.canRedo()){const e=this.undoneMoves.pop();return this.moves.push(e),e}return null}canRedo(){return this.undoneMoves.length>0}canUndo(){return this.moves.length>0}clone(){const e=new r([...this.initialState],[...this.moves]);return e.moves=[...this.moves],e.undoneMoves=[...this.undoneMoves],e}getUndoneMovesCount(){return this.undoneMoves.length}getMovesCount(){return this.moves.length}}const s={randomUUID:"undefined"!==typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};var c,a=new Uint8Array(16);function l(){if(!c&&!(c="undefined"!==typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return c(a)}for(var h=[],u=0;u<256;++u)h.push((u+256).toString(16).slice(1));function g(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return(h[e[t+0]]+h[e[t+1]]+h[e[t+2]]+h[e[t+3]]+"-"+h[e[t+4]]+h[e[t+5]]+"-"+h[e[t+6]]+h[e[t+7]]+"-"+h[e[t+8]]+h[e[t+9]]+"-"+h[e[t+10]]+h[e[t+11]]+h[e[t+12]]+h[e[t+13]]+h[e[t+14]]+h[e[t+15]]).toLowerCase()}const d=function(e,t,o){if(s.randomUUID&&!t&&!e)return s.randomUUID();var i=(e=e||{}).random||(e.rng||l)();if(i[6]=15&i[6]|64,i[8]=63&i[8]|128,t){o=o||0;for(var n=0;n<16;++n)t[o+n]=i[n];return t}return g(i)};class v{constructor(){this.geometry=void 0,this.geometry=new n}makeMove(e,t){e.capturedPieces||(e.capturedPieces={white:[],black:[]});const o=e.board.find((e=>e.position.x===t.from.x&&e.position.y===t.from.y&&e.type===t.piece.type&&e.color===t.piece.color));if(!o)return console.error("[StandardChessModel] Pieces at this position:",e.board.filter((e=>e.position.x===t.from.x&&e.position.y===t.from.y))),console.warn("No ".concat(t.piece.color," ").concat(t.piece.type," found at position: ").concat(JSON.stringify(t.from))),e;const i=this.getPieceAt(e,t.to),n={...e,board:e.board.filter((e=>e.id!==o.id)),currentTurn:"white"===e.currentTurn?"black":"white",moveHistory:new r(e.moveHistory.initialState,e.moveHistory.moves).addMove(t),capturedPieces:{white:[...e.capturedPieces.white],black:[...e.capturedPieces.black]}};if(i&&(n.capturedPieces[i.color].push(i),n.board=n.board.filter((e=>e.id!==i.id))),"pawn"!==o.type||0!==t.to.y&&7!==t.to.y)n.board.push({...o,position:t.to,hasMoved:!0});else{const e=t.promotionType||"queen";n.board.push({...o,position:t.to,hasMoved:!0,type:e})}if("king"===o.type&&2===Math.abs(t.to.x-t.from.x)){const o=t.to.x>t.from.x,i=o?7:0,r=o?t.to.x-1:t.to.x+1,s=this.getPieceAt(e,{x:i,y:t.from.y});s&&(n.board=n.board.filter((e=>e.id!==s.id)),n.board.push({...s,position:{x:r,y:t.from.y},hasMoved:!0}))}return n}getAttackersOfSquare(e,t,o){const n=i(t);return e.board.filter((t=>t.color===o&&this.calculatePossibleMoves(e,t).some((e=>e.x===n.x&&e.y===n.y))))}isLegalMove(e,t){const o=this.getPieceAt(e,t.from);return o?o.color!==e.currentTurn?(console.log("[StandardChessModel] It's not ".concat(o.color,"'s turn")),!1):!!this.isWithinBoardBounds(t.to)&&!!this.getLegalMovesForPiece(e,o).some((e=>e.x===t.to.x&&e.y===t.to.y)):(console.log("[StandardChessModel] No piece found at position: ".concat(JSON.stringify(t.from))),!1)}isThreefoldRepetition(e){const t=e.moveHistory.moves.map((t=>this.getBoardStateString(e))).reduce(((e,t)=>(e[t]=(e[t]||0)+1,e)),{});return console.log("[StandardChessModel] Position counts:",t),!1}getWinner(e){const t=e.board.find((e=>"king"===e.type&&"white"===e.color)),o=e.board.find((e=>"king"===e.type&&"black"===e.color));return t?o?t||o?this.isInCheckmate(e,"white")?(console.log("[StandardChessModel] Black wins by checkmate"),"black"):this.isInCheckmate(e,"black")?(console.log("[StandardChessModel] White wins by checkmate"),"white"):this.isStalemate(e)?(console.log("[StandardChessModel] Stalemate"),"draw"):this.isThreefoldRepetition(e)?(console.log("[StandardChessModel] Threefold repetition"),"draw"):this.isInsufficientMaterial(e)?(console.log("[StandardChessModel] Insufficient material"),"draw"):null:(console.log("[StandardChessModel] Both kings are missing"),"draw"):(console.log("[StandardChessModel] Black king is missing"),"white"):(console.log("[StandardChessModel] White king is missing"),"black")}getInitialState(){const e=this.getInitialBoardState();return{board:e,currentTurn:"white",moveHistory:new r(e),capturedPieces:{white:[],black:[]},gameMode:"head-to-head"}}calculatePossibleMoves(e,t){const o=[],{x:i,y:n}=t.position,r="white"===t.color?1:-1;switch(t.type){case"pawn":if("white"===t.color&&4===n||"black"===t.color&&3===n){var s;let t=(null===(s=e.moveHistory)||void 0===s?void 0:s.moves)||[];const c=t.length>0?t[t.length-1]:null;c&&"pawn"===c.piece.type&&2===Math.abs(c.from.y-c.to.y)&&1===Math.abs(c.to.x-i)&&c.to.y===n&&o.push({x:c.to.x,y:n+r})}const c={x:i,y:n+r};if(this.isWithinBoardBounds(c)&&!this.getPieceAt(e,c)){o.push({x:i,y:n+r});const s=n+2*r;("white"===t.color&&1===n||"black"===t.color&&6===n)&&this.isWithinBoardBounds({x:i,y:s})&&!this.getPieceAt(e,{x:i,y:s})&&o.push({x:i,y:s})}[-1,1].forEach((s=>{const c={x:i+s,y:n+r};if(this.isWithinBoardBounds(c)){const i=this.getPieceAt(e,c);i&&i.color!==t.color&&o.push(c)}}));break;case"rook":o.push(...this.getStraightMoves(e,t));break;case"knight":[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach((e=>{let[t,r]=e;o.push({x:i+t,y:n+r})}));break;case"bishop":o.push(...this.getDiagonalMoves(e,t));break;case"queen":o.push(...this.getStraightMoves(e,t),...this.getDiagonalMoves(e,t));break;case"king":for(let r=-1;r<=1;r++)for(let s=-1;s<=1;s++)if(0!==r||0!==s){const c={x:i+r,y:n+s};if(this.isWithinBoardBounds(c)){const i=this.getPieceAt(e,c);i?i.color!==t.color&&o.push(c):o.push(c)}}const a=this.getPieceAt(e,{x:7,y:"white"===t.color?0:7});t.hasMoved||!a||"rook"!==a.type||a.hasMoved||this.getPieceAt(e,{x:i+1,y:n})||this.getPieceAt(e,{x:i+2,y:n})||o.push({x:i+2,y:n});const l=this.getPieceAt(e,{x:0,y:"white"===t.color?0:7});t.hasMoved||!l||"rook"!==l.type||l.hasMoved||this.getPieceAt(e,{x:i-1,y:n})||this.getPieceAt(e,{x:i-2,y:n})||this.getPieceAt(e,{x:i-3,y:n})||o.push({x:i-2,y:n})}return o.filter((o=>(!this.getPieceAt(e,o)||this.getPieceAt(e,o).color!==t.color)&&this.isWithinBoardBounds(o)))}isGameOver(e){return null!==this.getWinner(e)||this.isThreefoldRepetition(e)}isInCheck(e,t){const o=e.board.find((e=>"king"===e.type&&e.color===t));if(!o)return console.warn("No ".concat(t," king found on the board")),!1;const i="white"===t?"black":"white";return this.getAttackersOfSquare(e,o.position,i).length>0}isUnderAttack(e,t,o){return this.isPositionUnderAttack({board:e.board,currentTurn:o},i(t),o)}isInCheckmate(e,t){return e.board.find((e=>"king"===e.type&&e.color===t))?!!this.isInCheck(e,t)&&this.getPiecesByColor(e,t).every((t=>0===this.getLegalMovesForPiece(e,t).length)):(console.warn("No ".concat(t," king found on the board")),!1)}isStalemate(e){return!this.isInCheck(e,e.currentTurn)&&this.getPiecesByColor(e,e.currentTurn).every((t=>0===this.getLegalMovesForPiece(e,t).length))}getPiecesByColor(e,t){return e.board.filter((e=>e.color===t))}getLegalMovesForPiece(e,t){return this.calculatePossibleMoves(e,t).filter((o=>{const i=this.makeMove(e,{from:t.position,to:o,piece:t});return!this.isInCheck(i,t.color)}))}getPieceAt(e,t){const o=i(t);return e.board.find((e=>e.position.x===o.x&&e.position.y===o.y))||null}isWithinBoardBounds(e){return e.x>=0&&e.x<8&&e.y>=0&&e.y<8}isPositionUnderAttack(e,t,o){return e.board.some((i=>i.color===o&&this.calculatePossibleMoves(e,i).some((e=>e.x===t.x&&e.y===t.y))))}isInsufficientMaterial(e){const t=e.board;if(t.length>4)return!1;if(t.every((e=>"king"===e.type)))return!0;if(3===t.length)return t.some((e=>"bishop"===e.type||"knight"===e.type));if(4===t.length){const e=t.filter((e=>"bishop"===e.type)),o=t.filter((e=>"knight"===e.type));if(2===e.length){return(e[0].position.x+e[0].position.y)%2===(e[1].position.x+e[1].position.y)%2}if(2===o.length)return!0}return!1}undoMove(e){const t=e.moveHistory.moves[e.moveHistory.moves.length-1];if(!t)return e;let o=new r(e.moveHistory.initialState,e.moveHistory.moves.slice(0,-1));o.undoneMoves=[t,...e.moveHistory.undoneMoves];const i={...e,board:[...e.board],currentTurn:"white"===e.currentTurn?"black":"white",moveHistory:o},n=this.getPieceAt(i,t.to);if(n&&(n.position=t.from),t.capturedPiece){i.board.push(t.capturedPiece);const e=t.capturedPiece.color;i.capturedPieces[e]=i.capturedPieces[e].filter((e=>e.id!==t.capturedPiece.id))}return i}redoMove(e){const t=e.moveHistory.undoneMoves[0];if(!t)return e;let o=new r(e.moveHistory.initialState,[...e.moveHistory.moves,t]);o.undoneMoves=e.moveHistory.undoneMoves.slice(1);const i={...e,board:[...e.board],currentTurn:"white"===e.currentTurn?"black":"white",moveHistory:o},n=this.getPieceAt(i,t.from);return n&&(n.position=t.to),t.capturedPiece&&(i.board=i.board.filter((e=>e.id!==t.capturedPiece.id)),i.capturedPieces[t.capturedPiece.color].push(t.capturedPiece)),i}importState(e){const t=JSON.parse(e);if(!t.board||!Array.isArray(t.board))throw new Error("Invalid state: board is missing or not an array");if(!t.currentTurn||"white"!==t.currentTurn&&"black"!==t.currentTurn)throw new Error("Invalid state: currentTurn is missing or invalid");if(t.moveHistory?t.moveHistory instanceof r||(t.moveHistory=new r(t.board,t.moveHistory._moves||[])):t.moveHistory=new r([]),!t.capturedPieces||"object"!==typeof t.capturedPieces)throw new Error("Invalid state: capturedPieces is missing or not an array");return t}exportState(e){return JSON.stringify(e)}getBoardStateString(e){return e.board.map((e=>"".concat(e.type).concat(e.color).concat(e.position.x).concat(e.position.y))).sort().join("")}getInitialBoardState(){const e=[],t=(t,o,i,n)=>{e.push({type:t,color:o,position:{x:i,y:n},id:d(),hasMoved:!1})};t("rook","white",0,0),t("knight","white",1,0),t("bishop","white",2,0),t("queen","white",3,0),t("king","white",4,0),t("bishop","white",5,0),t("knight","white",6,0),t("rook","white",7,0);for(let o=0;o<8;o++)t("pawn","white",o,1);t("rook","black",0,7),t("knight","black",1,7),t("bishop","black",2,7),t("queen","black",3,7),t("king","black",4,7),t("bishop","black",5,7),t("knight","black",6,7),t("rook","black",7,7);for(let o=0;o<8;o++)t("pawn","black",o,6);return e}getStraightMoves(e,t){return this.getMovesInDirections(e,t,[[1,0],[-1,0],[0,1],[0,-1]])}getDiagonalMoves(e,t){return this.getMovesInDirections(e,t,[[1,1],[1,-1],[-1,1],[-1,-1]])}getMovesInDirections(e,t,o){const i=[],{x:n,y:r}=t.position;for(const[s,c]of o)for(let o=1;o<8;o++){const a=n+o*s,l=r+o*c;if(!this.isWithinBoardBounds({x:a,y:l}))break;const h=this.getPieceAt(e,{x:a,y:l});if(h){h.color!==t.color&&i.push({x:a,y:l});break}i.push({x:a,y:l})}return i}}const y={depthLimit:2,timeLimit:3e3,randomnessFactor:.1,verbosityLevel:0};self.onmessage=async t=>{const o=new e,i=new v,{currentState:n,aiConfig:r=y}=t.data||{};if(!n)return void console.log("Invalid game state received in worker onmessage");if(!n.currentTurn)return void console.log("Invalid game state received in worker onmessage");const s={...y,...r};if(console.log("AI config:",s),self.postMessage({type:"status",message:"AI calculation started"}),n&&n.currentTurn)try{console.log("AI calculation started"),o.initialize(i,s);const e=await o.calculateBestMove(n);console.log("Best move found: ".concat(e)),e?self.postMessage({type:"move",move:e}):self.postMessage({type:"error",error:"No valid move found"})}catch(c){c instanceof Error&&"AbortError"!==c.name?(console.error("AI calculation error:",c),self.postMessage({type:"error",error:c.message})):console.log("AI calculation aborted")}else self.postMessage({type:"error",error:"Invalid game state received in worker"})}})();