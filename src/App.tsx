import React, { useState } from 'react';
import { TreeIcon, PlayIcon, ResetIcon } from './components/Icons';
import Board from './components/Board';
import Timer from './components/Timer';
import Menu from './components/Menu';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const { 
    state, 
    handleCellClick, 
    startGame, 
    resetGame, 
    handleTimeUp,
    toggleDarkMode,
    toggleSolution,
  } = useGameLogic();

  // Get share URL with seed if game is started
  const shareUrl = state.isStarted && state.seed 
    ? `${window.location.origin}?seed=${state.seed}`
    : undefined;

  return (
    <div className={`min-h-screen transition-colors ${
      state.isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-b from-green-900 to-green-700'
    }`}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Menu 
          isDarkMode={state.isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          shareUrl={shareUrl}
        />

        <div className={`rounded-xl shadow-2xl p-8 max-w-xl w-full ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${state.isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                <TreeIcon />
              </div>
              <h1 className={`text-3xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>CrossTree</h1>
            </div>
            {state.isStarted && !state.isWon && !state.showingSolution && (
              <Timer 
                duration={180} 
                onTimeUp={handleTimeUp}
                isPaused={state.isWon || state.showingSolution} 
              />
            )}
          </div>

          <Board 
            board={state.board}
            territories={state.territories}
            errors={state.errors}
            territoryErrors={state.territoryErrors}
            onCellClick={handleCellClick}
            disabled={!state.isStarted || state.isTimeUp || state.isWon}
            isDarkMode={state.isDarkMode}
            errorMessage={state.errorMessage}
            solution={state.solution}
            showingSolution={state.showingSolution}
          />

          <div className="mt-8 flex flex-col items-center gap-4">
            {!state.isStarted ? (
              <button
                onClick={() => startGame()}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <div className="w-5 h-5">
                  <PlayIcon />
                </div>
                Play Game
              </button>
            ) : (
              <>
                <div className="flex gap-4">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-5 h-5">
                      <ResetIcon />
                    </div>
                    Reset Game
                  </button>

                  <button
                    onClick={toggleSolution}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {state.showingSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                </div>

                {state.isWon && !state.showingSolution && (
                  <div className="text-xl font-bold text-green-600 animate-bounce">
                    🎄 Congratulations! You won! 🎄
                  </div>
                )}

                {state.isTimeUp && !state.isWon && !state.showingSolution && (
                  <div className="text-xl font-bold text-red-600">
                    Time's up! Try again!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;