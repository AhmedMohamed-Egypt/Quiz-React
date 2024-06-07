function WelcomeScreen({dispatch}) {
    return (
        <div className="startQuiz">
           <h3>Welcome to start Quiz </h3>
          
           <ul className="list-group">
            <li>How it works?</li>
            <li>1-Clicking the question will calculate direclty the points </li>
            <li>2-will move to next question as soon as click on current question</li>
            <li>3-By the end you will see your score</li>
            <li>4-Do your Best </li>
           </ul>
           <button className="btn btn-info" onClick={()=>dispatch({type:"start"})}>Start Quiz</button>
        </div>
    )
}

export default WelcomeScreen
