if (url === "advantages") {
    var xhr = new XMLHttpRequest();
        
    xhr.open('GET', API_URL + '/advantages');

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        var res = xhr.response;

        for (var i = 0; i < res.length; i++) {
            document.getElementById("advantages-table").innerHTML += `
                <tr>
                    <td>${setLang(res[i].lang_id)}</td>

                    <td>
                        <a href="advantages-more?id=${res[i].id}" class="btn btn-info">Դիտել ավելին</a>
                    </td>

                    <td>
                        <a href="advantages-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                    </td>

                    <td>
                        <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջել</button>
                    </td>
                </tr>
            `;
        }

        document.getElementsByClassName('loader-image-container')[0].remove();

        for (var x = 0; x < document.querySelectorAll('.deleteBtn').length; x++) {
            document.querySelectorAll('.deleteBtn')[x].addEventListener("click", function () {
                var element = this;

                if (confirm("Համոզված եք որ ուզում եք ջնջնել")) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("DELETE", API_URL + '/advantages-delete/'+element.getAttribute("data-id"), true);
        
                    xhr.onload = function () {
                        var res = JSON.parse(xhr.responseText);

                        if (xhr.readyState == 4 && xhr.status == "200") {
                            if (res.status === "Success") {
                                element.parentElement.parentElement.remove();
                            }
                        } else {
                            console.error(res);
                        }
                    }
                    xhr.send(null);                        
                }
            });
        }
    }
}

if (url === "advantages-more") {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/advantages-more/'+id);

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            document.getElementById("content-title").innerText = xhr.response.title;

            document.getElementById("content-title").innerText = 'Նկարագրություն';

            document.getElementsByClassName("card-body")[0].innerHTML += `
                
                ${xhr.response.description}

                <a href="advantages-edit?id=${xhr.response.id}" class="btn btn-secondary">Փոխել</a>
            `;

            document.getElementById("advantages-loader").style.display = "none";
        };
}

if (url === "advantages-edit") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/advantages-more/'+id);

    xhr.responseType = 'json';
    
    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;
        
        CKEDITOR.replace( 'editor' );

        document.getElementsByClassName("more_see_container")[0].innerHTML += `<a href="advantages-more?id=${res.id}" class="btn btn-info">Դիտել ավելին</a>`;

        document.querySelector('#editor').innerHTML = res.description;

        document.getElementById("editing-advantages-loader").remove();
        document.getElementById("editing-form").style.display = "block";
    };

    function update () {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementsByClassName("btn-success")[0].style.display = "none";

        var data = {};
        data.description = CKEDITOR.instances.editor.getData();

        var json = JSON.stringify(data);            
        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/advantages/'+id, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = function () {
            var res = JSON.parse(xhr.responseText);

            if (xhr.readyState == 4 && xhr.status == "200") {

                document.getElementById("wait_loader").style.display = "none";
                document.getElementsByClassName("btn-success")[0].style.display = "block";
                
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;

                if (res.status === "Success") {
                    document.getElementById("advantages-success-alert").style.display = "block";
                    document.getElementById("advantages-danger-alert").style.display = "none";
                        
                    document.getElementById("advantages-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        document.getElementById("advantages-success-alert").style.display = "none";
                    }, 2000);
                    
                } else {
                    document.getElementById("advantages-danger-alert").innerHTML = '';

                    document.getElementById("advantages-danger-alert").style.display = "block";
                    document.getElementById("advantages-danger-alert").innerHTML += `<ul>
                            ${res.description   !== undefined   ? '<li>'+res.description+'</li>' : ''}
                        </ul>`;
                }
            } else {
                console.error(res);
            }
        }

        xhr.send(json);
    }
}