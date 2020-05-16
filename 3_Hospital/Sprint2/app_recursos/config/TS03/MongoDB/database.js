if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb://heroku_3m85lvzl:s6hpllq75l32v0nqaab7fsie30@ds133252.mlab.com:33252/heroku_3m85lvzl"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/stepesbd"}
}