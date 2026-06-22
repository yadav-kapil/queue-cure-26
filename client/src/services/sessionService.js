export const fetchSession = async (dispatch) => {
  try {
    const res = await fetch("/api/session/current", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.session) {
      dispatch({
        type: "CLEAR_SESSION",
      });
      return data;
    }

    dispatch({
      type: "SET_SESSION",
      payload: {
        session: data.session,
        queue: data.queue,
      },
    });
    return data;
  } catch (err) {
    console.error("Error fetching current session:", err);
    dispatch({
      type: "CLEAR_SESSION",
    });
    throw err;
  }
};
