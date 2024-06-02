function NextButton({dispatch}) {
    return (
        <button onClick={()=>{dispatch({type:'nextQuestion'})}} className="btn btn-primary">Next</button>
    )
}

export default NextButton
