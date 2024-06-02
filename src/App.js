import { useEffect, useReducer } from "react";
import Progress from "./components/Progress";
import Loading from "./components/Loading";
import NextButton from "./components/NextButton";
import Score from "./components/Score";
const initialState = {
  questions: [],
  isLoading: "",
  status: "isLoading",
  indexQuestions: 0,
  answer: null,
  points: 0,
  rightAnswer: "",
  highScore :0,

};
function reducer(snState, action) {
  switch (action.type) {
    case "loading": {
      return { ...snState, isLoading: action.payload };
    }
    case "dataRecived": {
      return { ...snState, questions: action.payload, status: "recieved" };
    }
    case "fail": {
      return { ...snState, status: "Failure" };
    }
    case "answer": {
      const { index, correctOption, points } = action.payload;
      const calculatePoints = index === correctOption && points;
      const statusFinish = snState.indexQuestions===snState.questions.length-1  ?  'Finish' : snState.status
      

      return {
        ...snState,
        answer: action.payload,
        points: snState.points + calculatePoints,
        rightAnswer: correctOption,
        status : statusFinish,
        highScore:snState.highScore > snState.points+calculatePoints ? snState.highScore : snState.points+calculatePoints
      };
    }
 
    case "nextQuestion": {
      const nextQuestion =
        snState.indexQuestions < snState.questions.length - 1
          ? snState.indexQuestions + 1
          : snState.indexQuestions;
     
       
      return {
        ...snState,
        indexQuestions: nextQuestion,
        answer: null,
        rightAnswer: "",
       
      };
    }
    case "reset": {
      return {
        questions: snState.questions,
        status: "recieved",
        indexQuestions: 0,
        points: 0,
        rightAnswer: "",
        answer: null,
        highScore:snState.highScore
      };
    }
    default: {
      throw new Error("Action not known");
    }
  }
}

function App() {
  const [
    {
      status,
      questions,
      indexQuestions,
      answer,
      rightAnswer,
      points,
      highScore,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
/*
  useEffect(() => {
    try {
      fetch(`https://api.jsonbin.io/v3/b/665c5eeae41b4d34e4fd58de`, {
        method: "GET",
        headers: {
          "X-Master-Key":
            "$2a$10$bkQ6PP7ismynZk0.2aEYcO2nFKtVrWXGMzwhhUoTikXBuRGm0qPTu",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    } catch (error) {
      console.log(error);
    }
  }, []);
*/
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:8000/questions`);
        if (!res.ok) {
          throw new Error("there is an error ");
        } else {
          const data = await res.json();
          dispatch({ type: "dataRecived", payload: data });
        }
      } catch (error) {
        dispatch({ type: "fail", payload: error.message });
      }
    }
    fetchData();
  }, []);
  const showNextBtn = answer !== null && indexQuestions < questions.length - 1;
  
  const showUI = status === "recieved";
  const showError = status === "Failure";
  const Loader = status === "isLoading";

  return (
    <div className="App">
      <div className="container">
        {Loader && <Loading/>}
        {showError&&<p className="badge text-bg-danger">{status}</p>}
        {showUI && (
          <>
            <Progress
              questions={questions}
              indexQuestions={indexQuestions}
              points={points}
            />
            {questions.map(
              (itemQuestion, index) =>
                index === indexQuestions && (
                  <div key={index}>
                    <p className="">{itemQuestion.question}</p>

                    <div className="button-container">
                      {itemQuestion.options.map((item, index) => (
                        <button
                          disabled={answer !== null && true}
                          onClick={() => {
                            dispatch({
                              type: "answer",
                              payload: {
                                index: index,
                                correctOption: itemQuestion.correctOption,
                                points: itemQuestion.points,
                              },
                            });
                          }}
                          key={index}
                          className={`btn btn-info ${
                            rightAnswer === index ? "right" : ""
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )
            )}
           
            {showNextBtn && <NextButton dispatch={dispatch} />}
         
           
          </>
        )}
       
        {status==='Finish'&&<div className="finishScreen">
              <Score points={points} highScore={highScore}/>
              <button
                onClick={() => dispatch({ type: "reset" })}
                className="btn btn-danger"
              >
                Reset
              </button>
            </div>}
      
       
      </div>
    </div>
  );
}

export default App;
