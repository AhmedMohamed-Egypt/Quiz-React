import { useEffect, useReducer } from "react";
import Progress from "./components/Progress";
import Loading from "./components/Loading";
const initialState = {
  questions: [],
  status: "isLoading",
  indexQuestions:0,
  answer:null,
  points:0,
  rightAnswer:"",
  
  
};
function reducer(snState, action) {
  switch (action.type) {
    
    case "dataRecived": {
      return { ...snState, questions: action.payload,status:"recieved" };
    }
    case "fail": {
      return { ...snState, status: action.payload, status: "fail" };
    }
    case "answer":{
      const {index,correctOption,points} = action.payload
      const calculatePoints = index===correctOption && points
      

      return {...snState,answer:action.payload,points:snState.points+calculatePoints,rightAnswer:correctOption}
    }
    case "getPoints":{
      return{...snState,points:action.payload}
    }
    case "nextQuestion":{
      const nextQuestion =  snState.indexQuestions < snState.questions.length -1  ? snState.indexQuestions+1 : snState.indexQuestions
   
      return{...snState,indexQuestions:nextQuestion,answer:null,rightAnswer:""}
    }
    case "reset":{
      return {questions:snState.questions,status:snState.status,indexQuestions:0,points:0,rightAnswer:"",answer:null}
    }
    default:{
      throw new Error ("Action not known")
    }
  }
}
function App() {
  const [{ status, questions,indexQuestions,answer,rightAnswer,points}, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      fetch(`http://localhost:8000/questions`)
        .then((res) => res.json())
        .then((data) => dispatch({ type: "dataRecived", payload: data }));
      throw new Error("failed");
    } catch (error) {
      
      dispatch({ type: "fail", payload: error.message });
    }
  }, []);
  const showNextBtn= answer!==null && indexQuestions<questions.length-1
  const showResetBtn = answer!==null && indexQuestions===questions.length-1

  return (
    <div className="App">
      <div className="container">
     
        {status !== "recieved" ? <Loading/> :
         <>
          <Progress questions= {questions} indexQuestions={indexQuestions} points={points}/>
         {questions.map((itemQuestion,index)=>index===indexQuestions&&
         <div key={index}>
         <p className="">{itemQuestion.question}</p>
        
         <div className="button-container">
         {itemQuestion.options.map((item,index)=><button disabled={answer!==null&&true} 
          onClick={()=>{dispatch({type:"answer",payload:{index:index,correctOption:itemQuestion.correctOption,points:itemQuestion.points}});}} key={index} className={`btn btn-info ${rightAnswer===index?'right':''}`}>{item}</button>)}
         </div>  
         </div>
         )}
         {showNextBtn &&  <button onClick={()=>{dispatch({type:'nextQuestion'})}} className="btn btn-primary">Next</button>}
         {showResetBtn && <button onClick={()=>dispatch({type:"reset"})} className="btn btn-danger">Reset</button>}
        </>}
       
      </div>
    </div>
  );
}

export default App;
