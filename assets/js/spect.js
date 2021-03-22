if (url === "spect") {
    var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/spect');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            var res = xhr.response;

            for (var i = 0; i < res.length; i++) {
                document.getElementById("spect-text-table").innerHTML += `
                    <tr>
                        <td>${res[i].title}</td>
                        
                        <td>${setLang(res[i].lang_id)}</td>

                        <td>
                            <a href="spect-text?id=${res[i].id}" class="btn btn-info">Դիտել ավելին</a>
                        </td>

                        <td>
                            <a href="spect-text-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                        </td>

                        <td>
                            <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջնել</button>
                        </td>
                    </tr>
                `;
            }

            document.getElementsByClassName('loader-image-container')[0].remove();

            //Delete Spet text
            for (var del = 0; del < document.getElementsByClassName("deleteBtn").length; del++) {
                document.getElementsByClassName("deleteBtn")[del].addEventListener('click', function () {    
                    var element = this;
                    
                    if (confirm("Համոզված եք որ ուզում եք ջնջել")) {
                        var xhr = new XMLHttpRequest();

                        xhr.open("DELETE", API_URL + '/spect-text/'+this.getAttribute("data-id"), true);
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

        function spectExamples () {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', API_URL + '/spect-examples');

            xhr.responseType = 'json';

            xhr.send();

            xhr.onload = function() {
                var res = xhr.response;
                
                for (var i = 0; i < res.length; i++) {
                    document.getElementById("spect-examples-table").innerHTML += `
                        <tr>                            
                            <td>${res[i].name}</td>

                            <td>${setLang(res[i].lang_id)}</td>

                            <td>
                                <a href="spect-example-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                            </td>
                        </tr>
                    `;
                }

                document.getElementsByClassName('loader-image-container')[0].remove();

                for (var i = 0; i < document.getElementsByClassName('default-image').length; i++) {
                    document.getElementsByClassName('default-image')[i].addEventListener('click', function () {
                        document.getElementById("image-modal").style.display = "block";
                        document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
                    });
                }

                document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
                    document.getElementById("image-modal").style.display = "none";
                });
            }
        }

        spectExamples();

        function spectExamplesImages () {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', API_URL + '/spect-examples-images');

            xhr.responseType = 'json';

            xhr.send();

            xhr.onload = function() {
                var res = xhr.response;
                                
                for (var i = 0; i < res.length; i++) {
                    document.getElementById("spect-examples-images-table").innerHTML += `
                        <tr>
                            <td>
                                <img
                                    class="default-image"
                                    width="80"
                                    src="http://localhost/petct-armenia/website/petct-front/img/spect_page/${res[i].img_name}"
                                />
                            </td>

                            <td>${res[i].key_word === null ? "Չկա" : res[i].key_word}</td>
                            
                            <td>
                                <a href="spect-examples-images-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                            </td>

                            <td>
                                <button type="button" class="btn btn-danger deleteBtnExampleImages" data-id="${res[i].id}">Ջնջել</button>
                            </td>
                        </tr>
                    `;
                }

                //Delete Spet text
                for (var del = 0; del < document.getElementsByClassName("deleteBtnExampleImages").length; del++) {
                    document.getElementsByClassName("deleteBtnExampleImages")[del].addEventListener('click', function () {    
                        var element = this;
                        
                        if (confirm("Համոզված եք որ ուզում եք ջնջել")) {
                            var xhr = new XMLHttpRequest();

                            xhr.open("DELETE", API_URL + '/spect-examples-images-delete/'+this.getAttribute("data-id"), true);
                            xhr.onload = function () {
                                console.log(xhr.responseText);
                                // var res = JSON.parse(xhr.responseText);

                                // if (xhr.readyState == 4 && xhr.status == "200") {
                                //     if (res.status === "Success") {
                                //         element.parentElement.parentElement.remove();
                                //     }
                                // } else {
                                //     console.error(res);
                                // }
                            }
                            xhr.send(null);
                        }
                    });
                }

                document.getElementsByClassName('loader-image-container')[0].remove();

                for (var i = 0; i < document.getElementsByClassName('default-image').length; i++) {
                    document.getElementsByClassName('default-image')[i].addEventListener('click', function () {
                        document.getElementById("image-modal").style.display = "block";
                        document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
                    });
                }

                document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
                    document.getElementById("image-modal").style.display = "none";
                });
            }
        }

        spectExamplesImages();
}

if (url === "spect-text-add") {
    var ckeditorText;

    ClassicEditor.create( document.querySelector( '#editor' ) )
    .then(editor => {
        ckeditorText = editor;
    }).catch( error => {
        console.error( error );
    });

    document.getElementById("add_btn").addEventListener("click", function () {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("add_btn").style.display = "none";

        var http = new XMLHttpRequest();
        var url = API_URL + '/spect-text-add';
        var params = 'title='+document.getElementById("title-inp").value+'&text='+ckeditorText.getData()+'&lang_id='+document.getElementById("lang_id").value;
        http.open('POST', url, true);
        http.responseType = 'json';
        
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("add_btn").style.display = "block";

                if (http.response.status === "Success") {
                    document.getElementById("spect-text-success-alert").style.display = "block";
                    document.getElementById("spect-text-danger-alert").style.display = "none";
                      
                    document.getElementById("spect-text-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        document.getElementById("spect-text-success-alert").style.display = "none";
                    }, 2000);

                    document.getElementById("title-inp").value = "";
                    ckeditorText.setData("");
                    
                } else {
                    document.getElementById("spect-text-danger-alert").innerHTML = '';

                    document.getElementById("spect-text-danger-alert").style.display = "block";
                    document.getElementById("spect-text-danger-alert").innerHTML += `<ul>
                            ${http.response.title !== undefined ? '<li>'+http.response.title+'</li>' : ''}
                            ${http.response.text !== undefined  ? '<li>'+http.response.text+'</li>' : ''}
                        </ul>`;
                }

                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }

        http.send(params);
    });
}

if (url === "spect-text") {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/spect-text/'+id);

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            var res = xhr.response;
            
            document.getElementById("content-title").innerText = res.title;

            document.getElementsByClassName("card-body")[0].innerHTML += `
                ${res.text}
                <a href="spect-text-edit?id=${id}" class="btn btn-secondary">Փոխել</a>
            `;

            document.getElementsByClassName('loader-image-container')[0].remove();
        };
}

if (url === "spect-text-edit") {
    var ckeditorText;
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/spect-text/'+id);

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

        document.querySelector('#editor').innerHTML = res.text;

        document.getElementById("editing-index-slide-loader").remove();
        document.getElementById("editing-form").style.display = "block";
    };

    document.getElementById('update_btn').addEventListener('click', function () {

        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("update_btn").style.display = "none";

        var desc = ckeditorText.getData();
        var title = document.getElementById("title-inp").value;

        var http = new XMLHttpRequest();
        var url = API_URL + '/spect-text-edit/'+id;
        var params = 'title='+title+'&text='+desc;
        http.open('POST', url, true);
        http.responseType = 'json';
        
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("update_btn").style.display = "block";

                if (http.response.status === "Success") {
                    document.getElementById("spect-text-success-alert").style.display = "block";
                    document.getElementById("spect-text-danger-alert").style.display = "none";
                      
                    document.getElementById("spect-text-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        document.getElementById("spect-text-success-alert").style.display = "none";
                    }, 2000);
                    
                } else {
                    document.getElementById("spect-text-danger-alert").innerHTML = '';

                    document.getElementById("spect-text-danger-alert").style.display = "block";
                    document.getElementById("spect-text-danger-alert").innerHTML += `<ul>
                            ${http.response.title !== undefined ? '<li>'+http.response.title+'</li>' : ''}
                            ${http.response.text !== undefined  ? '<li>'+http.response.text+'</li>' : ''}
                        </ul>`;
                }
            }
        }

        http.send(params);
    });
}

if (url === "spect-example-add") {
    document.getElementsByClassName("btn-success")[0].addEventListener("click", function () {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementsByClassName("btn-success")[0].style.display = "none";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/spect-example-store', true);

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);

                if (res.status === "Success") {
                    document.getElementById("spect-text-success-alert").style.display = "block";
                    document.getElementById("spect-text-danger-alert").style.display = "none";
                      
                    document.getElementById("spect-text-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        document.getElementById("spect-text-success-alert").style.display = "none";
                    }, 2000);
                    
                    document.getElementById("name-inp").value = "";

                } else {
                    document.getElementById("spect-text-danger-alert").innerHTML = '';

                    document.getElementById("spect-text-danger-alert").style.display = "block";
                    document.getElementById("spect-text-danger-alert").innerHTML += `<ul>
                            ${res.name !== undefined ? '<li>'+res.name+'</li>' : ''}
                        </ul>`;
                }

                document.getElementById("wait_loader").style.display = "none";
                document.getElementsByClassName("btn-success")[0].style.display = "block";
            }
        }
        xhr.send("name="+document.getElementById("name-inp").value+"&lang_id="+document.getElementById("lang_id").value);
    });
}

if (url === "spect-example-edit") {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/spect-example/'+id);

        xhr.responseType = 'json';
        
        xhr.send();
        
        xhr.onload = function() {
            var res = xhr.response;
            
            document.getElementById("name-inp").value = res.example.name;
            
            document.getElementById("editing-index-slide-loader").remove();
            document.getElementById("editing-form").style.display = "block";
        };

        function update () {
            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-success")[0].style.display = "none";

            var xhr = new XMLHttpRequest();
            xhr.open("POST", API_URL + '/spect-example-update/'+id, true);

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var res = JSON.parse(xhr.responseText);

                    if (res.status === "Success") {
                        document.getElementById("spect-text-success-alert").style.display = "block";
                        document.getElementById("spect-text-danger-alert").style.display = "none";
                          
                        document.getElementById("spect-text-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                        setTimeout(function () {
                            document.getElementById("spect-text-success-alert").style.display = "none";
                        }, 2000);
                        
                    } else {
                        document.getElementById("spect-text-danger-alert").innerHTML = '';

                        document.getElementById("spect-text-danger-alert").style.display = "block";
                        document.getElementById("spect-text-danger-alert").innerHTML += `<ul>
                                ${res.name !== undefined ? '<li>'+res.name+'</li>' : ''}
                            </ul>`;
                    }

                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-success")[0].style.display = "block";
                }
            }
            xhr.send("name="+document.getElementById("name-inp").value);
        }
}

if (url === "spect-examples-images-edit") {

        function allSpectExamples (nid) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', API_URL + '/spect-examples');

            xhr.responseType = 'json';
            
            xhr.send();
            
            xhr.onload = function() {
                for (var i = 0; i < xhr.response.length; i++) {
                    document.getElementById("example_names").innerHTML += `
                        <option ${xhr.response[i].id === nid ? 'selected' : ''} 
                        value="${xhr.response[i].id}">${xhr.response[i].name}</option>
                    `;
                }
            }
        }

        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/spect-examples-image/'+id);

        xhr.responseType = 'json';
        
        xhr.send();
        
        xhr.onload = function() {
            var res = xhr.response;

            allSpectExamples(res.nid);
            
            document.getElementById("default-image").src = "http://localhost/petct-armenia/website/petct-front/img/spect_page/"+res.img_name;
            document.getElementById("key_word").value = res.key_word;

            document.getElementById("image-inp").addEventListener('change', function() {
                var reader = new FileReader();

                reader.onload = (e) => { 
                    document.getElementById("default-image").src = e.target.result; 
                }

                reader.readAsDataURL(this.files[0]); 
            });

            document.getElementById('default-image').addEventListener('click', function () {
                document.getElementById("image-modal").style.display = "block";
                document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
            });

            document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
                document.getElementById("image-modal").style.display = "none";
            });

            document.getElementById("editing-index-slide-loader").remove();
            document.getElementById("editing-form").style.display = "block";
        };
        
        var uploadForm = document.getElementById("editing-form");

        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-success")[0].style.display = "none";

                var formData = new FormData(this);

                $.ajax({
                    type:'POST',
                    url: API_URL + "/spect-examples-image-update/"+id,
                    data: formData,
                    cache:false,
                    contentType: false,
                    processData: false,
                    success: (data) => {
                        if (data.status === "Success") {
                            document.getElementById("spect-text-danger-alert").style.display = "none";
                            document.getElementById("spect-text-success-alert").style.display = "block";
                            document.getElementById("spect-text-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                        
                            setTimeout(function () {
                                document.getElementById("spect-text-success-alert").style.display = "none";
                            }, 2000);

                        } else {
                            document.getElementById("spect-text-danger-alert").innerHTML = '';

                            document.getElementById("spect-text-danger-alert").style.display = "block";
                            document.getElementById("spect-text-danger-alert").innerHTML += `<ul>
                                    ${data.image !== undefined ? '<li>'+data.image+'</li>' : ''}
                                </ul>`;
                        }

                        document.getElementById("wait_loader").style.display = "none";
                        document.getElementsByClassName("btn-success")[0].style.display = "block";

                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    },
                    error: function(data){
                        console.log(data);
                    }
                });
        });
}

if (url === "spect-example-image-add") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/spect-examples');

    xhr.responseType = 'json';
    
    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;
        
        for (var i = 0; i < res.length; i++) {
            document.getElementById("example_names").innerHTML += `<option value="${res[i].id}">${res[i].name}</option>`;
        }

        document.getElementById("image-inp").addEventListener('change', function() {
            var reader = new FileReader();

            reader.onload = (e) => { 
                document.getElementById("default-image").src = e.target.result; 
            }

            reader.readAsDataURL(this.files[0]); 
        });

        document.getElementById('default-image').addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "block";
            document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
        });

        document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "none";
        });

        var uploadForm = document.getElementById("adding-form");

        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();
        
            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-success")[0].style.display = "none";

            var formData = new FormData(this);

            $.ajax({
                type:'POST',
                url: API_URL + "/spect-examples-image-add",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: (data) => {
                    if (data.status === "Success") {
                        document.getElementById("spect-text-danger-alert").style.display = "none";
                        document.getElementById("spect-text-success-alert").style.display = "block";
                        document.getElementById("spect-text-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";
                    
                        setTimeout(function () {
                            document.getElementById("spect-text-success-alert").style.display = "none";
                        }, 2000);

                        document.getElementById("image-inp").value = "";
                        document.getElementById("key_word").value = "";
                        document.getElementById("default-image").src = "";
                        document.getElementById("default-image").style.display = "none";

                    } else {
                        document.getElementById("spect-text-danger-alert").innerHTML = '';

                        document.getElementById("spect-text-danger-alert").style.display = "block";
                        document.getElementById("spect-text-danger-alert").innerHTML += `<ul>
                                ${data.img_name !== undefined ? '<li>'+data.img_name+'</li>' : ''}
                            </ul>`;
                    }
                    
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-success")[0].style.display = "block";

                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                },
                error: function(data){
                    console.log(data);
                }
            });
        });
    };
}