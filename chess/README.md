# Chess Game

This is a simple chess game implemented in JavaScript. It allows two players to play against each other on a virtual chessboard.

## Features

- Interactive chessboard with drag-and-drop functionality
- Highlights possible moves for selected pieces
- Enforces basic chess rules and move validation
- Detects check and checkmate conditions
- Undo and redo moves
- Saves game state in local storage

## Getting Started

To run the chess game locally, follow these steps:

1. Clone the repository or download the source code.
2. Open the `index.html` file in a web browser.
3. The game will start automatically, and you can begin playing.

## How to Play

1. The game starts with the white player's turn.
2. Click on a piece to select it. The possible moves for that piece will be highlighted on the board.
3. Click on a highlighted square to move the selected piece to that position.
4. The game will alternate turns between the white and black players.
5. The game will detect check and checkmate conditions and display the appropriate status message.
6. To undo a move, click the "Undo" button. To redo an undone move, click the "Redo" button.
7. The game state is automatically saved in the browser's local storage, so you can resume the game even if you close the browser or refresh the page.

## Files

- `index.html`: The main HTML file that displays the chessboard and game elements.
- `styles.css`: The CSS file that defines the styles for the chessboard and pieces.
- `gameLogic.js`: Contains the `ChessGame` class that handles the game logic and rules.
- `script.js`: The main JavaScript file that interacts with the DOM and handles user interactions.
- `img/`: Directory containing the chess piece images.

## Dependencies

The chess game does not have any external dependencies. It is built using pure JavaScript, HTML, and CSS.

## Browser Compatibility

The game should work in modern web browsers that support HTML5, CSS3, and JavaScript ES6 features.

## License

This chess game is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgements

The chess piece images used in this game are sourced from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:PNG_chess_pieces/Standard_transparent).

## Contributing

Contributions to the chess game are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## Contact

If you have any questions or feedback, feel free to contact the project maintainer at [email@example.com](mailto:email@example.com).
