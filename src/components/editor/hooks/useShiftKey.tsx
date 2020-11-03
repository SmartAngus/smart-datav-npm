import { useReducer, useCallback } from "react";

const initialState = {
  isShiftKey:false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "keydown":
      return {
        isShiftKey: true
      }
    case "keyup":
      return {
        isShiftKey:false
      }
  }
}

const useShiftKey = () => {
  const [state, dispatch] = useReducer(reducer,initialState)

  const keydown = useCallback(() => {
      dispatch({ type: "keydown" });
  }, [dispatch]);

  const keyup = useCallback(() => {
      dispatch({ type: "keyup" });
  }, [dispatch]);



  return { isShiftKey:state.isShiftKey, keydown, keyup};
};

export { useShiftKey };
