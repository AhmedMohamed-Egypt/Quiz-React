import { useEffect, useReducer, useState } from "react";

const initialState = {
  questions: [],
  isLoading:false,
  status: "",
  index:0,
};
function reducer(snStat, action) {
  switch (action.type) {
    case "loading": {
      return { ...snStat, isLoading: action.payload };
    }
    case "fetch": {
      return { ...snStat, status: action.payload };
    }

    case "dataRecieved": {
      return { ...snStat, questions: action.payload, status: "recieved" };
    }
    case "failed": {
      return { ...snStat, status: action.payload };
    }
    case "finish": {
      return { ...snStat, status: action.payload };
    }

    default:
      throw new Error("Action not known");
  }
}
function FetchQuestions(link) {
  const [{ status, questions,isLoading ,index}, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    async function getData() {
      dispatch({ type: "loading", payload: true });
      try {
        
        const res = await fetch(`http://localhost:8000/questions`);
        if (!res.ok) throw new Error("check Link");
        const data = await res.json();
        if (res.ok) dispatch({ type: "dataRecieved", payload: data });
      } catch (error) {
        if (error.message) {
          dispatch({ type: "failed", payload: error.message });
        }
      }
      dispatch({ type: "loading", payload: false });
     
    }

    getData();
  }, []);
  return { status, questions,isLoading,index };
}

export { FetchQuestions };
