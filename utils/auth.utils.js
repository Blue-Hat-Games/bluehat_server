exports.verifyEmail = function (emailStr) {
    var regExp =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (emailStr.match(regExp) != null) {
        return true;
    } else {
        return false;
    }
}