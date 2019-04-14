const express = require("express");
const bodyParser = require("body-parser");
import { Client, environments } from "plaid";

const vars = {
  PLAID_CLIENT_ID: "5c52345ce341ed0010a522f1",
  PLAID_SECRET: "259a3db7aec2d3314a6e545d056a10",
  PLAID_PUBLIC_KEY: "134893e5d974bced3a52c91e8e6b5a",
  PLAID_ENV: "development"
};

const client = new Client(
  vars.PLAID_CLIENT_ID,
  vars.PLAID_SECRET,
  vars.PLAID_PUBLIC_KEY,
  environments[vars.PLAID_ENV],
  { version: "2018-05-22" }
);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/get_access_token", (req, res) => {
  const { public_token: PUBLIC_TOKEN } = req.body;
  console.log(PUBLIC_TOKEN);
  client.exchangePublicToken(PUBLIC_TOKEN, (err, tokenResponse) => {
    console.log(err, tokenResponse);
    if (err) {
      return res.json({ err });
    }

    const { access_token: ACCESS_TOKEN, item_id: ITEM_ID } = tokenResponse;
    res.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null
    });
  });
});

app.post("/transactions", (req, res) => {
  console.log("In /transactions POST endpoint.");
  const { accessToken } = req.body;
  console.log(accessToken);

  client.getTransactions(
    accessToken,
    "2018-01-01",
    "2019-04-14",
    (err, result) => {
      if (err) {
        return res.json({ err });
      }

      const { transactions } = result;
      console.log(transactions);
    }
  );
});

app.listen(8000, () => {
  console.log("Express server listening on 8000.");
});
