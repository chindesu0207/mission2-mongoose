const headers = require("./headers");

function handleError(res, error) {
  res.writeHead(400, headers);
  let message = "";
  if(error){
    message = error.message;
  }else{
    message = "No found or input error" 
  }
  res.write(
    JSON.stringify({
      status: "false",
      message
    })
  );
  res.end();
}

module.exports = handleError;