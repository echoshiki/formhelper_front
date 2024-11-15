import { Button } from "@/components/ui/button"
import { useState } from "react";

const Game = () => {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [move, setMove] = useState(0);
    const currentSquares = history[move];
    const nextPlayer = move%2 === 0 ? "X" : "O";
    const winnerInfo = calculateWinner(currentSquares);
    const winnerLines = winnerInfo ? winnerInfo.lines : [];

    let Message = move === 0 ? '游戏开始！' : '下一步走棋的是：' + nextPlayer;
    Message = winnerInfo ? '游戏结束！获胜的是：' + winnerInfo.winner : 
                (move === 9 ? '游戏结束！本轮结果：平局。' : Message);

    const handleClickSquare = (key: number) => {
        if (currentSquares[key] || winnerInfo) {
            return ;
        }
        const nextSquares = currentSquares.slice();
        nextSquares[key] = nextPlayer;
        const nextHistory = [...history.slice(0, move + 1), nextSquares];
        setHistory(nextHistory);
        setMove(move => move + 1);
    }

    const jumpTo = (key: number) => {
        setMove(key);
    }

    return (
        <>
            <p className="text-sm my-5">{Message}</p>
            <div className="flex space-x-5">
                <div className="flex flex-wrap w-96 h-96">
                    {currentSquares.map((item, key) => (
                        <Button key={key} 
                            variant={`outline`}
                            className={`w-32 h-32 ${winnerLines.includes(key) && 'bg-indigo-600 text-white'}`}
                            onClick={() => handleClickSquare(key)} >{item}</Button>
                    ))} 
                </div>
                <div className="">
                    {history.map((_item, key) => (
                        <p key={key} ><a href="#" onClick={() => jumpTo(key)} className="underline">
                            #{key}. {key > 0 ? `跳至第 ${key} 步` : `跳至最开始`}
                        </a></p>  
                    ))}
                </div>
            </div>
            
        </>
    )
}

function calculateWinner (squares: number[]) {
    const winnerLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < winnerLines.length; i++) {
        const [a, b, c] = winnerLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return {
                winner: squares[a],
                lines: winnerLines[i]
            }
        }
    }
    return false;
}

export default Game;