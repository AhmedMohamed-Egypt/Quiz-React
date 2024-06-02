function Score({points,highScore}) {
    const calculateHighScor = highScore > points ? highScore : points
    return (
        <div>
            <p className="text-center score">You Scored: {points}</p>
            <p>High Score : {highScore}</p>
        </div>
    )
}

export default Score
