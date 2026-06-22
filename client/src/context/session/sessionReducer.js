export const initialState = {
  session: null,
  queue: null,
  isSessionActive: false,
};

export const sessionReducer = (state, action) => {
  switch (action.type) {
    case "SET_SESSION":
      return {
        ...state,
        session: action.payload.session,
        queue: action.payload.queue,
        isSessionActive: !!action.payload.session,
      };

    case "SET_RECEPTIONIST":
      return {
        ...state,
        session: state.session
          ? { ...state.session, receptionistId: action.payload.receptionist }
          : null,
      };

    case "CLEAR_RECEPTIONIST":
      return {
        ...state,
        session: state.session
          ? { ...state.session, receptionistId: null }
          : null,
      };

    case "UPDATE_QUEUE":
      return {
        ...state,
        queue: action.payload.queue,
      };

    case "CLEAR_SESSION":
      return { ...initialState };

    default:
      return state;
  }
};
