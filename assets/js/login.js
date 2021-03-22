if (localStorage.getItem('appname_token')) {
    window.location.href = "index";
}

document.getElementsByClassName("icon")[0].addEventListener("click", function () {
    if (this.getAttribute("class") === "fa fa-eye icon") {
        document.getElementById("password").setAttribute("type", "password");
        this.setAttribute("class", "fa fa-eye-slash icon");
    } else {
        document.getElementById("password").setAttribute("type", "text");
        this.setAttribute("class", "fa fa-eye icon");
    }
});

document.getElementById("login").addEventListener("input", function (e) {
    if (e.target.value) {
        document.getElementById("login_error").innerText = "";
    } else {
        document.getElementById("login_error").innerText = "Մուտքանուն դաշտը պարտադիր է";
    }

    document.getElementById("wrong_error").innerText = "";
});

document.getElementById("password").addEventListener("input", function (e) {
    if (e.target.value) {
        document.getElementById("password_error").innerText = "";
    } else {
        document.getElementById("password_error").innerText = "Գաղտնաբառ դաշտը պարտադիր է";
    }

    document.getElementById("wrong_error").innerText = "";
});

document.getElementById("submit_form").addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("img_id").style.display = "block";
    document.getElementById("submit_btn").style.display = "none";

    var logData = document.getElementById("login").value;
    var passwordData = document.getElementById("password").value;

    var http = new XMLHttpRequest();
    var url = 'http://localhost/petct-armenia/website/petct-back/public/api/admin/login';
    var params = 'email='+logData+'&password='+passwordData;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var res = JSON.parse(http.responseText);

            if (res.error) {
                if (res.error.email) {
                    document.getElementById("login_error").innerText = res.error.email[0];
                }

                if (res.error.password) {
                    document.getElementById("password_error").innerText = res.error.password[0];
                }
            } else {
                if (res) {
                    localStorage.setItem('appname_token', res.access_token);
                    window.location.href = 'http://localhost/petct-armenia/admin-page/html/index/index';
                } else {
                    document.getElementById("wrong_error").innerText = "Սխալ Մուտքանուն կամ Գաղտնաբառ";
                }
            }

            document.getElementById("img_id").style.display = "none";
            document.getElementById("submit_btn").style.display = "block";
            
        }
    }
    http.send(params);
});