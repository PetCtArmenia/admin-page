if (url === "faq") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/faq');

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        var res = xhr.response;
        
        for (var i = 0; i < res.length; i++) {
            document.getElementById("faq-table").innerHTML += `
                <tr>
                    <td>${res[i].title}</td>
                    
                    <td>${setLang(res[i].lang_id)}</td>
                    
                    <td>
                        <a href="faq-more?id=${res[i].id}" class="btn btn-info">Դիտել ավելին</a>
                    </td>

                    <td>
                        <a href="faq-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                    </td>

                    <td>
                        <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջել</button>
                    </td>
                </tr>
            `;
        }

        for (var x = 0; x < document.querySelectorAll('.deleteBtn').length; x++) {
            document.querySelectorAll('.deleteBtn')[x].addEventListener("click", function () {
                if (confirm("Համոզված եք որ ուզում եք ջնջնել")) {
                    var element = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open("DELETE", API_URL + '/faq-delete/'+this.getAttribute("data-id"), true);
            
                    xhr.onload = function () {
                        var res = JSON.parse(xhr.responseText);

                        if (xhr.readyState == 4 && xhr.status == "200") {
                            if (res.status === "Success") {
                                element.parentElement.parentElement.remove();

                                document.getElementById("faq_deleted_message").style.display = "block";

                                document.body.scrollTop = 0;
                                document.documentElement.scrollTop = 0;
                                            
                                setTimeout(function () {
                                    document.getElementById("faq_deleted_message").style.display = "none";
                                }, 2000);
                            }
                        } else {
                            console.error(res);
                        }
                    }
                    xhr.send(null);
                }
            });
        }

        document.getElementsByClassName('loader-image-container')[0].remove();
    }
}

if (url === "faq-add") {
    var ckeditorText;
    ClassicEditor.create( document.querySelector( '#editor' ) )
    .then(editor => {
        ckeditorText = editor;
    }).catch( error => {
        console.error( error );
    });

    document.getElementById("addBtn").addEventListener("click", function () {

        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("addBtn").style.display = "none";

        var title = document.getElementById("title-inp").value;
        var description = ckeditorText.getData();
        var lang_id = document.getElementById("lang_inp").value;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/faq-add', true);

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var res = JSON.parse(this.responseText);
                
                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("addBtn").style.display = "block";

                if (res.errors) {
                    document.getElementById("pet-txt-edit-danger-alert").innerHTML = '';

                    document.getElementById("pet-txt-edit-danger-alert").style.display = "block";
                    document.getElementById("pet-txt-edit-danger-alert").innerHTML += `<ul>
                            ${res.errors.title              !== undefined   ? '<li>'+res.errors.title+'</li>' : ''}
                            ${res.errors.description        !== undefined   ? '<li>'+res.errors.description+'</li>' : ''}
                        </ul>`;
                } else {
                    document.getElementById("pet-txt-edit-success-alert").style.display = "block";
                    document.getElementById("pet-txt-edit-danger-alert").style.display = "none";
                      
                    document.getElementById("pet-txt-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    document.getElementById("title-inp").value = '';
                    ckeditorText.setData("");

                    setTimeout(function () {
                        document.getElementById("pet-txt-edit-success-alert").style.display = "none";
                    }, 2000);
                }

                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
        xhr.send("title="+title+"&description="+description+"&lang_id="+lang_id);
    });
}

if (url === "faq-more") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/faq/'+id);

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        document.getElementById("content-title").innerText = xhr.response.title;
        document.getElementsByClassName("card-body")[0].innerHTML += `
            ${xhr.response.description}
            <div>
                <a href="faq-edit?id=${xhr.response.id}" class="btn btn-secondary">Փոխել</a>    
            </div>
        `;

        document.getElementById("faq-loader").remove();
    };
}

if (url === "faq-edit") {
        var ckeditorText;

        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/faq/'+id);

        xhr.responseType = 'json';

        xhr.send();
        
        xhr.onload = function() {
            var res = xhr.response;

            document.getElementById("title-inp").value = res.title;
            
            ClassicEditor.create( document.querySelector( '#editor' ) )
            .then(editor => {
                ckeditorText = editor;
            }).catch( error => {
                console.error( error );
            });

            document.getElementsByClassName("more_see_container")[0].innerHTML += `
                <a href="faq-more?id=${res.id}" class="btn btn-info">Դիտել ավելին</a>   
            `;

            document.getElementById("editor").innerHTML = res.description;

            document.getElementById("faq-editing-slide-loader").remove();
            document.getElementById("editing-form").style.display = "block";
        };

        function update () {
            document.getElementById("wait_loader").style.display = "block";
            document.getElementById("adding_btn").style.display = "none";

            var data = {};
            data.title = document.getElementById("title-inp").value;
            data.description = ckeditorText.getData();

            var json = JSON.stringify(data);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", API_URL + '/faq-update/'+id, true);
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

            xhr.onload = function () {
                var res = JSON.parse(xhr.responseText);
                
                if (xhr.readyState == 4 && xhr.status == "200") {

                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementById("adding_btn").style.display = "block";

                    if (res.status === "Success") {
                        document.getElementById("faq-edit-success-alert").style.display = "block";
                        document.getElementById("faq-edit-danger-alert").style.display = "none";
                            
                        document.getElementById("faq-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                        setTimeout(function () {
                            document.getElementById("faq-edit-success-alert").style.display = "none";
                        }, 2000);
                        
                    } else {
                        document.getElementById("faq-edit-danger-alert").innerHTML = '';

                        document.getElementById("faq-edit-danger-alert").style.display = "block";
                        document.getElementById("faq-edit-danger-alert").innerHTML += `<ul>
                                ${res.title         !== undefined   ? '<li>'+res.title+'</li>' : ''}
                                ${res.description   !== undefined   ? '<li>'+res.description+'</li>' : ''}
                            </ul>`;
                    }

                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                } else {
                    console.error(res);
                }
            }

            xhr.send(json);
        }
}