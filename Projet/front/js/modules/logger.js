let logger = (function(){

    function postLog(username) {
        console.log(username);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username
            },
            success: () => {
                window.location.href = "/";
            },
        });
    }

    return {
        sendLogin(username) {
            postLog(username);
        }
    }
})();