//파일별로 컨트롤러 분리하기

exports.responseTest = function (req, res, next) {
    res.send('respond with a resource');
}