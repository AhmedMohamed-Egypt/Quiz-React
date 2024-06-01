function Progress({questions,indexQuestions,points}) {
    const numQuestions = questions.length 
    const totalWidth = (100) / (numQuestions)
    const totalPoints = questions.reduce((acc,cur)=>{
        return acc+ cur.points
    },0)
    return (
       <div className="">
        <div className="progress">
            <span className="progress__bar" style={{"width":`${totalWidth * (indexQuestions+1)}%`}}></span>
        </div>
        <div className="numQuestions d-flex align-items-center justify-content-between">
            <p>{indexQuestions+1}/{numQuestions} Questions</p>
            <p>{points}/<b>{totalPoints}</b></p>
        </div>
       </div>
    )
}

export default Progress
