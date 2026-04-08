import { useState, useRef, useEffect } from 'react';
import styles from './GameBoard.module.css';
import { clsx } from 'clsx';

// A specific grid layout that contains "BOY" and "FRIEND" connecting adjacently.
// Grid indices:
//  0  1  2  3
//  4  5  6  7
//  8  9 10 11
// 12 13 14 15
// F(0) R(1) I(2) E(3)
// X(4) X(5) N(6) X(7)
// X(8) Y(9) D(10) B(11)
// X(12) O(13) X(14) X(15)
// Let's connect BOY and FRIEND:
// F(0)-R(1)-I(2)-E(3)
//                  \
//                   N(7)
//                    \
//                     D(11)
// B(15)-O(14)-Y(10) ... wait, letters can move in any adjacent.
// Let's lay it out manually.
const LETTERS = [
  'V', 'F', 'R', 'I',
  'J', 'L', 'X', 'E',
  'B', 'O', 'Y', 'N',
  'S', 'T', 'A', 'D'
];
// FRIEND connect path: 1->2->3->7->11->15
// BOY connect path: 8->9->10
// Let's check adjacencies:
// 0(F)-1(R)-2(I)-3(E)
//  | \/ | \/ | \/ |
// 4(A)-5(L)-6(N)-7(D) (so E(3) to N(6) is adj. N(6) to D(7) is adj. F-R-I-E-N-D works).
//  | \/ | \/ | \/ |
// 8(W)-9(Y)-10(O)-11(B) (B(11) to O(10) is adj. O(10) to Y(9) is adj. B-O-Y works).
//  | \/ | \/ | \/ |
// 12(S)-13(T)-14(A)-15(R)

export default function GameBoard({ onWordFound, foundWords, isMorphing }) {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const boardRef = useRef(null);

  const getWordFromIndices = (indices) => indices.map(i => LETTERS[i]).join('');

  // Validate adjacency
  const isAdjacent = (pos1, pos2) => {
    const row1 = Math.floor(pos1 / 4);
    const col1 = pos1 % 4;
    const row2 = Math.floor(pos2 / 4);
    const col2 = pos2 % 4;
    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
  };

  const handlePointerDown = (index, e) => {
    if (isMorphing) return;
    setIsDragging(true);
    setSelectedIndices([index]);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isMorphing) return;

    // Find grid item under pointer coordinates
    const touch = e;
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target && target.dataset.index !== undefined) {
      const index = parseInt(target.dataset.index, 10);

      const lastIndex = selectedIndices[selectedIndices.length - 1];
      if (index !== lastIndex) {
        // If we are backtracking
        if (selectedIndices.length > 1 && index === selectedIndices[selectedIndices.length - 2]) {
          setSelectedIndices(prev => prev.slice(0, -1));
        }
        // If it's a new adjacent cell and not already selected
        else if (!selectedIndices.includes(index) && isAdjacent(lastIndex, index)) {
          setSelectedIndices(prev => [...prev, index]);
        }
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDragging || isMorphing) return;
    setIsDragging(false);

    const word = getWordFromIndices(selectedIndices);
    onWordFound(word);
    setSelectedIndices([]);
  };

  useEffect(() => {
    const cancelDrag = () => setIsDragging(false);
    window.addEventListener('pointerup', cancelDrag);
    return () => window.removeEventListener('pointerup', cancelDrag);
  }, []);

  return (
    <div
      className={clsx(styles.boardContainer, isMorphing && styles.morphing)}
      ref={boardRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className={styles.grid}>
        {LETTERS.map((letter, index) => {
          const isSelected = selectedIndices.includes(index);
          const isBoyFound = foundWords.includes('BOY');
          const isFriendFound = foundWords.includes('FRIEND');
          const showTargetGreen = isBoyFound && isFriendFound;

          // Identify if this letter is part of the found BOy or FRIEND
          const isBoyPath = showTargetGreen && [8, 9, 10].includes(index);
          const isFriendPath = showTargetGreen && [1, 2, 3, 7, 11, 15].includes(index);
          const isFound = isBoyPath || isFriendPath;

          return (
            <div
              key={index}
              data-index={index}
              className={clsx(
                styles.tile,
                isSelected && styles.selected,
                isFound && styles.found,
                isMorphing && isFound && styles.morphTarget,
                isMorphing && !isFound && styles.fadeTarget
              )}
              onPointerDown={(e) => handlePointerDown(index, e)}
              style={{ touchAction: 'none' }}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {isMorphing && (
        <div className={styles.spelledWordContainer}>
          {"BOYFRIEND".split('').map((char, i) => (
            <div key={i} className={styles.spelledChar} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              {char}
            </div>
          ))}
        </div>
      )}

      {/* Current word display */}
      <div className={clsx(styles.currentWord, (selectedIndices.length > 0) && styles.visible)}>
        {getWordFromIndices(selectedIndices)}
      </div>
    </div>
  );
}
