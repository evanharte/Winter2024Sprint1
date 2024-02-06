const fs = require("fs");
const myArgs = process.argv.slice(2);

const { configjson } = require("./templates");

function displayConfig() {
  if (DEBUG) console.log("config.displayConfig()");
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error;
    console.log(JSON.parse(data));
  });
}

function resetConfig() {
  if (DEBUG) console.log("config.resetConfig()");
  let configdata = JSON.stringify(configjson, null, 2);
  fs.writeFile(__dirname + "/json/config.json", configdata, (error) => {
    if (error) throw error;
    console.log("config.json has been reset to original state.");
  });
}

function setConfig() {
  if (DEBUG) console.log("config.setConfig()");
  if (DEBUG) console.log(myArgs);

  let match = false;
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error;
    if (DEBUG) console.log(JSON.parse(data));
    let cfg = JSON.parse(data);
    for (let key of Object.keys(cfg)) {
      console.log(`K E Y: ${key}`);
      if (key === myArgs[2]) {
        cfg[key] = myArgs[3];
        match = true;
      }
    }
    if (!match) {
      console.log(`invalid key: ${myArgs[2]}, try another.`);
    }
    if (DEBUG) console.log(cfg);
    data = JSON.stringify(cfg, null, 2);
    fs.writeFile(__dirname + "/json/config.json", data, (error) => {
      if (error) throw error;
      if (DEBUG) console.log("config file successfully updated.");
    });
  });
}

function configApp() {
  if (DEBUG) console.log("configApp()");

  switch (myArgs[1]) {
    case "--show":
      if (DEBUG) console.log("configApp()");
      displayConfig();
      break;
    case "--reset":
      if (DEBUG) console.log("--reset");
      resetConfig();
      break;
    case "--display":
      if (DEBUG) console.log("--display displayConfig()");
      displayConfig();
      break;

    case "--set":
      if (DEBUG) console.log("--set");
      setConfig();
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
  }
}

module.exports = { configApp }; // ??
