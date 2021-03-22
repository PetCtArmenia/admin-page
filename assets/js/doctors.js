//Doctors Page
if (url === "doctors") {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/doctors');

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        var res = xhr.response;

        for (var i = 0; i < res.length; i++) {
            document.getElementById("doctors-table").innerHTML += `
            <tr>
                <td>${res[i].name}</td>
                
                <td>${setLang(res[i].lang_id)}</td>
                
                <td>
                    <a href="doctors-more?id=${res[i].id}" class="btn btn-info">Դիտել ավելին</a>
                </td>

                <td>
                    <a href="doctors-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                </td>

                <td>
                    <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջել</button>
                </td>
            </tr>
        `;
        }

        for (var x = 0; x < document.querySelectorAll('.deleteBtn').length; x++) {
            document.querySelectorAll('.deleteBtn')[x].addEventListener("click", function() {
                if (confirm("Համոզված եք որ ուզում եք ջնջնել")) {
                    var element = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open("DELETE", API_URL + '/doctor-delete/' + this.getAttribute("data-id"), true);

                    xhr.onload = function() {
                        var res = JSON.parse(xhr.responseText);

                        if (xhr.readyState == 4 && xhr.status == "200") {
                            if (res.status === "Success") {
                                element.parentElement.parentElement.remove();
                            }
                        }
                    }
                    xhr.send(null);
                }
            });
        }

        document.getElementsByClassName('loader-image-container')[0].remove();
    }
}

//Adding doctors page
if (url === "add-doctor") {
    var ckeditorText;

    ClassicEditor.create(document.querySelector('#editor'))
        .then(editor => {
            ckeditorText = editor;
        }).catch(error => {
            console.error(error);
        });

    function store() {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementsByClassName("btn-primary")[0].style.display = "none";

        var name = document.getElementById("name").value;
        var profession = document.getElementById("profession").value;
        var phone = document.getElementById("phone").value;
        var description = ckeditorText.getData();
        var lang = document.getElementById('lang').value;

        var http = new XMLHttpRequest();
        http.open('POST', API_URL + '/add-doctors', true);

        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                var res = JSON.parse(http.response);

                document.getElementById("wait_loader").style.display = "none";
                document.getElementsByClassName("btn-primary")[0].style.display = "block";

                if (res.status === "Success") {
                    document.getElementById("doctors-edit-success-alert").style.display = "block";
                    document.getElementById("doctors-edit-danger-alert").style.display = "none";

                    document.getElementById("doctors-edit-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";

                    setTimeout(function() {
                        document.getElementById("doctors-edit-success-alert").style.display = "none";
                    }, 2000);

                    document.getElementById("name").value = '';
                    document.getElementById("profession").value = '';
                    document.getElementById("phone").value = '';
                    ckeditorText.setData("");

                } else {
                    document.getElementById("doctors-edit-danger-alert").innerHTML = '';

                    document.getElementById("doctors-edit-danger-alert").style.display = "block";
                    document.getElementById("doctors-edit-danger-alert").innerHTML += `<ul>
                                ${res.name          !== undefined   ? '<li>'+res.name+'</li>' : ''}
                                ${res.profession    !== undefined   ? '<li>'+res.profession+'</li>' : ''}
                                ${res.phone         !== undefined   ? '<li>'+res.phone+'</li>' : ''}
                                ${res.description   !== undefined   ? '<li>'+res.description+'</li>' : ''}
                            </ul>`;
                }

                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
        http.send('name=' + name + '&profession=' + profession + '&phone=' + phone + '&description=' + description + '&lang_id=' + lang);

    }
}

//Doctors More Page
if (url === "doctors-more") {
    function convertPhoneNumber(phone) {
        if (phone === "" || phone === "-" || phone === undefined) {
            return "-";
        }

        phone = String(phone);

        var news0 = "0" + phone.slice(0, 2) + " ";
        var news1 = news0 + phone.slice(2, 4) + "-";
        var news2 = news1 + phone.slice(4, 6) + "-";
        var news3 = news2 + phone.slice(6, 8);

        return news3;
    }

    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/doctors/' + id);

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        document.getElementById("content-title").innerText = xhr.response.name;

        document.getElementsByClassName("card-body")[0].innerHTML += `
            <strong>Մասնագիտություն</strong>
            <p>${xhr.response.profession}</p>

            <strong>Հեռախոս</strong>
            <p>${convertPhoneNumber(xhr.response.phone)}</p>

            <strong>Նկարագրություն</strong>
            ${xhr.response.description}

            <a href="doctors-edit?id=${xhr.response.id}" class="btn btn-secondary">Փոխել</a>
        `;

        document.getElementById("price-loader").remove();
    }
}

//Doctors Edit Code
if (url === "doctors-edit") {
    var ckeditorText;

    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/doctors/' + id);

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        var res = xhr.response;

        document.getElementById("name-inp").value = res.name;
        document.getElementById("profession-inp").value = res.profession;
        document.getElementById("phone-inp").value = res.phone;

        ClassicEditor.create(document.querySelector('#editor'))
            .then(editor => {
                editor.setData(res.description);
                ckeditorText = editor;
            }).catch(error => {
                console.error(error);
            });

        document.getElementsByClassName("more_see_container")[0].innerHTML += `
            <a href="doctors-more?id=${res.id}" class="btn btn-info">Դիտել ավելին</a>
        `;

        document.getElementById("editing-index-slide-loader").remove();
        document.getElementById("editing-form").style.display = "block";
    };

    function update() {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementsByClassName("btn-success")[0].style.display = "none";

        var data = {};
        data.name = document.getElementById("name-inp").value;
        data.profession = document.getElementById("profession-inp").value;
        data.phone = document.getElementById("phone-inp").value;
        data.description = ckeditorText.getData();

        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/doctors/' + id, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.onload = function() {
            var res = JSON.parse(xhr.responseText);

            if (xhr.readyState == 4 && xhr.status == "200") {

                document.getElementById("wait_loader").style.display = "none";
                document.getElementsByClassName("btn-success")[0].style.display = "block";

                if (res.status === "Success") {
                    document.getElementById("doctors-edit-success-alert").style.display = "block";
                    document.getElementById("doctors-edit-danger-alert").style.display = "none";

                    document.getElementById("doctors-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    setTimeout(function() {
                        document.getElementById("doctors-edit-success-alert").style.display = "none";
                    }, 2000);

                } else {
                    document.getElementById("doctors-edit-danger-alert").innerHTML = '';

                    document.getElementById("doctors-edit-danger-alert").style.display = "block";
                    document.getElementById("doctors-edit-danger-alert").innerHTML += `<ul>
                            ${res.name          !== undefined   ? '<li>'+res.name+'</li>' : ''}
                            ${res.profession    !== undefined   ? '<li>'+res.profession+'</li>' : ''}
                            ${res.phone         !== undefined   ? '<li>'+res.phone+'</li>' : ''}
                            ${res.description   !== undefined   ? '<li>'+res.description+'</li>' : ''}
                        </ul>`;
                }
            } else {
                console.error(res);
            }

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }

        xhr.send(json);
    }
}