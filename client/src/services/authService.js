export const verifyUser = async (dispatch) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/api/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      dispatch({
        type: "LOGOUT",
      });
      return;
    }

    dispatch({
      type: "LOGIN",
      payload: {
        user: data.user,
      },
    });
  } catch (err) {
    dispatch({
      type: "LOGOUT",
    });
  }
};
