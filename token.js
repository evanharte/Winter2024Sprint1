const fs = require("fs");
const path = require("path");

const crc32 = require("crc/crc32");
const { format } = require("date-fns");

const myArgs = process.argv.slice(2);

function tokenList() {
  if (DEBUG) console.log("token.tokenList()");
  fs.readFile(__dirname + "/json/token.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    console.log("** User list **");
    tokens.forEach((obj) => {
      console.log(" * " + obj.username + ": " + obj.token);
    });
  });
}

function newToken(username) {
  if (DEBUG) console.log("token.newToken()");
  let newToken = JSON.parse(`{
    "created": "1969-01-31 12:30:00",
    "username": "username",
    "email": "user@example.com",
    "phone": "5555555555",
    "token": "token",
    "expires": "1969-02-03 12:30:00",
    "confirmed": "tbd"
  }`);

  let now = new Date();
  let expires = addDays(now, 3);

  newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  newToken.username = username;
  newToken.token = crc32(username).toString(16);
  newToken.expires = `${format(expires, "yyyy-MM-dd HH:mm:ss")}`;

  fs.readFile(__dirname + "/json/token.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    userTokens = JSON.stringify(tokens);

    fs.writeFile(__dirname + "/json/token.json", userTokens, (error) => {
      if (error) throw error;
      else {
        console.log(`New token ${newToken.token} created for ${username}`);
      }
    });
  });
  return newToken.token;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function tokenApp() {
  if (DEBUG) console.log("tokenApp()");

  switch (myArgs[1]) {
    case "--count":
      if (DEBUG) console.log("--count");
      break;
    case "--list":
      if (DEBUG) console.log("--list");
      tokenList();
      break;
    case "--new":
      if (myArgs.length < 3) {
        console.log("invalid command, try node myapp token --new [username]");
      } else {
        if (DEBUG) console.log("--new");
        newToken(myArgs[2]);
      }
      break;
    default:
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
  }
}

module.exports = { tokenApp };
