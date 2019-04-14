export const getPublicToken = publicToken => {
  console.log("In getPublicToken method with publicToken:", publicToken);
  fetch("http://localhost:8000/get_access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      public_token: publicToken
    })
  })
    .then(res => res.json())
    .then(res => {
      return res;
    });
};
