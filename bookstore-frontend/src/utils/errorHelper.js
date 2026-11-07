// Converts any Axios error into a simple object for the screen.
// Our backend always sends: { message, validationErrors? }
export function parseApiError(error) {
  if (!error.response) {
    return {
      message: "Cannot reach the server. Please check that the backend is running.",
      fieldErrors: {},
    };
  }

  const data = error.response.data || {};
  return {
    message: data.message || "Something went wrong. Please try again.",
    fieldErrors: data.validationErrors || {},
  };
}