
module.exports = function (err, req, res, next) {
    res.status(500).send("Something failed at the server.");
    console.log(err.message);
}