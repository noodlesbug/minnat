// Game state object
const gameState = {
    level: 1,
    score: 0,
    currentWord: '',
    displayWord: '',
    availableLetters: [],
    dinoPosition: 0,
    currentLetterIndex: 0,
    wordList: [
        'CAT', 'DOG', 'SUN', 'RUN',          // Level 1
        'CAKE', 'FISH', 'JUMP', 'STAR',      // Level 2
        'HORSE', 'PLANT', 'BEACH', 'CLOUD',  // Level 3
        'SCHOOL', 'ROCKET', 'SUNSET', 'GUITAR' // Level 4
    ]
};

// Elements
const wordDisplay = document.getElementById('word-display');
const floor = document.getElementById('floor');
const dino = document.getElementById('dino');
const levelElement = document.getElementById('level');
const scoreElement = document.getElementById('score');

// Initialize game
function initGame() {
    // Set the initial word based on level
    setCurrentWord();
    
    // Create the floor with random letters
    createFloorLetters();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update the UI
    updateUI();
}

// Set the current word based on level
function setCurrentWord() {
    const wordIndex = Math.min(gameState.level - 1, gameState.wordList.length - 1);
    const levelWords = gameState.wordList.filter(word => 
        Math.ceil(word.length / 2) === Math.min(gameState.level, 4));
    
    gameState.currentWord = levelWords[Math.floor(Math.random() * levelWords.length)];
    gameState.displayWord = '_'.repeat(gameState.currentWord.length);
}

// Create the floor letters
function createFloorLetters() {
    // Clear existing floor
    floor.innerHTML = '';
    
    // Create a pool of letters including the word letters and some random ones
    const wordLetters = Array.from(gameState.currentWord);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let floorLetters = [];
    
    // Add the remaining letters from the word
    for (let letter of gameState.currentWord) {
        if (!floorLetters.includes(letter)) {
            floorLetters.push(letter);
        }
    }
    
    // Add random letters until we have 10 letters
    while (floorLetters.length < 10) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!floorLetters.includes(randomLetter)) {
            floorLetters.push(randomLetter);
        }
    }
    
    // Shuffle the letters
    floorLetters = shuffleArray(floorLetters);
    gameState.availableLetters = floorLetters;
    
    // Create the floor letter elements
    floorLetters.forEach((letter, index) => {
        const letterElement = document.createElement('div');
        letterElement.classList.add('floor-letter');
        letterElement.textContent = letter;
        letterElement.dataset.index = index;
        floor.appendChild(letterElement);
    });
    
    // Position the dino above the first letter
    positionDino(0);
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Position the dino above a letter
function positionDino(index) {
    const letterElements = document.querySelectorAll('.floor-letter');
    
    // Remove selected class from all letters
    letterElements.forEach(el => el.classList.remove('selected'));
    
    // Add selected class to the current letter
    letterElements[index].classList.add('selected');
    
    // Calculate position
    const letterElement = letterElements[index];
    const letterRect = letterElement.getBoundingClientRect();
    const floorRect = floor.getBoundingClientRect();
    
    // Set dino position (adjust as needed)
    const leftPosition = letterElement.offsetLeft + letterElement.offsetWidth / 2 - 20;
    dino.style.left = leftPosition + 'px';
    
    // Update current letter index
    gameState.currentLetterIndex = index;
}

// Set up event listeners
function setupEventListeners() {
    document.addEventListener('keydown', handleKeyPress);
}

// Handle key presses
function handleKeyPress(event) {
    const letterElements = document.querySelectorAll('.floor-letter');
    
    switch(event.key) {
        case 'ArrowLeft':
            // Move dino left
            if (gameState.currentLetterIndex > 0) {
                positionDino(gameState.currentLetterIndex - 1);
            }
            break;
        case 'ArrowRight':
            // Move dino right
            if (gameState.currentLetterIndex < letterElements.length - 1) {
                positionDino(gameState.currentLetterIndex + 1);
            }
            break;
        case 'Enter':
            // Select the current letter
            selectLetter();
            break;
    }
}

// Select a letter
function selectLetter() {
    const selectedLetter = gameState.availableLetters[gameState.currentLetterIndex];
    
    // Check if the letter is in the word and not already found
    const foundIndices = [];
    for (let i = 0; i < gameState.currentWord.length; i++) {
        if (gameState.currentWord[i] === selectedLetter && gameState.displayWord[i] === '_') {
            foundIndices.push(i);
        }
    }
    
    if (foundIndices.length > 0) {
        // Update the display word with the found letter
        let newDisplayWord = gameState.displayWord.split('');
        foundIndices.forEach(i => {
            newDisplayWord[i] = selectedLetter;
        });
        gameState.displayWord = newDisplayWord.join('');
        
        // Update the score (10 points per correct letter)
        gameState.score += 10 * foundIndices.length;
        
        // Check if the word is complete
        if (!gameState.displayWord.includes('_')) {
            // Word complete - move to next level after delay
            setTimeout(() => {
                gameState.level++;
                levelElement.textContent = `LEVEL: ${gameState.level}`;
                
                // Bonus for completing a word
                gameState.score += 50;
                
                // Set up the next word
                setCurrentWord();
                createFloorLetters();
            }, 1000);
        }
        
        // Update the UI
        updateUI();
    }
}

// Update the UI
function updateUI() {
    // Update score
    scoreElement.textContent = `SCORE: ${gameState.score}`;
    
    // Update level
    levelElement.textContent = `LEVEL: ${gameState.level}`;
    
    // Update word display
    wordDisplay.innerHTML = '';
    for (let char of gameState.displayWord) {
        const letterBox = document.createElement('div');
        letterBox.classList.add('letter-box');
        letterBox.textContent = char;
        wordDisplay.appendChild(letterBox);
    }
}

// Start the game when the page loads
window.onload = initGame;
