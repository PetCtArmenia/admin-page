if (url === "news") {
var xhr = new XMLHttpRequest();

xhr.open('GET', 'http://localhost/petct-armenia/website/petct-back/public/api/admin/news');

xhr.responseType = 'json';

xhr.send();

xhr.onload = function() {
    var res = xhr.response;

    for (var i = 0; i < res.length; i++) {
        document.getElementById("news-table").innerHTML += `
            <tr>
                <td>${res[i].title}</td>
                
                <td>
                    <img 
                        class="default-image"
                        style="width: 100px; cursor: pointer"
                        src="http://localhost/petct-armenia/website/petct-front/img/blog/${res[i].img}"
                    />
                </td>

                <td>${setLang(res[i].lang_id)}</td>
            
                <td>
                    <a href="news-more?id=${res[i].id}" class="btn btn-info">Դիտել ավելին</a>
                </td>

                <td>
                    <a href="news-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                </td>

                <td>
                    <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջնել</button>
                </td>
            </tr>
        `;
    }
    
    //Delete Pet text
    for (var del = 0; del < document.getElementsByClassName("deleteBtn").length; del++) {
        document.getElementsByClassName("deleteBtn")[del].addEventListener('click', function () {    
            var element = this;
            
            if (confirm("Համոզված եք որ ուզում եք ջնջել")) {
                var xhr = new XMLHttpRequest();

                xhr.open("DELETE", 'http://localhost/petct-armenia/website/petct-back/public/api/admin/news-delete/'+this.getAttribute("data-id"), true);
                xhr.onload = function () {
                    var res = JSON.parse(xhr.responseText);

                    if (xhr.readyState == 4 && xhr.status == "200") {
                        if (res.status === "Success") {
                            element.parentElement.parentElement.remove();

                            document.getElementById("news_deleted_message").style.display = "block";

                            document.body.scrollTop = 0;
                            document.documentElement.scrollTop = 0;
                            
                            setTimeout(function () {
                                document.getElementById("news_deleted_message").style.display = "none";
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

    for (var i = 0; i < document.getElementsByClassName('default-image').length; i++) {
        document.getElementsByClassName('default-image')[i].addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "block";
            document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
        });
    }

    document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
        document.getElementById("image-modal").style.display = "none";
    });

    document.getElementsByClassName('loader-image-container')[0].remove();
}

function getTags () {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost/petct-armenia/website/petct-back/public/api/admin/tags');

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        var res = xhr.response;

        for (var i = 0; i < res.length; i++) {
            document.getElementById("tags-table").innerHTML += `
                <tr>
                    <td>${res[i].name}</td>

                    <td>
                        <a href="tag-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                    </td>

                    <td>
                        <button class="btn btn-danger deleteTagsBtn" data-id="${res[i].id}">Ջնջնել</button>
                    </td>
                </tr>
            `;
        }

        for (var x = 0; x < document.querySelectorAll('.deleteTagsBtn').length; x++) {
            document.querySelectorAll('.deleteTagsBtn')[x].addEventListener("click", function () {
                if (confirm("Համոզված եք որ ուզում եք ջնջնել")) {
                    var element = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open("DELETE", 'http://localhost/petct-armenia/website/petct-back/public/api/admin/tags-delete/'+this.getAttribute("data-id"), true);
        
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

        document.getElementsByClassName('loader-image-container')[0].remove();
    }
}

getTags();
}

if (url === "add-news") {
    var ckeditorText;
        var ckeditorText2;

        ClassicEditor.create( document.querySelector( '#editor' ) )
        .then(editor => {
            ckeditorText = editor;
        }).catch( error => {
            console.error( error );
        });

        ClassicEditor.create( document.querySelector( '#editor-2' ) )
        .then(editor => {
            ckeditorText2 = editor;
        }).catch( error => {
            console.error( error );
        });

        //Image Set
        document.getElementById("image-inp").addEventListener('change', function() {
            var reader = new FileReader();
            reader.onload = (e) => { 
                document.getElementById("default-image").style.display = "block";
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

        var uploadForm = document.getElementById('add-form');

        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-primary")[0].style.display = "none";

            var tags = "";
            
            if ($("#tag_list_container li span.active-tag").length == 0) {
                tags = "empty";
            } else {
                tags = [];

                for (var t = 0; t < $("#tag_list_container li span.active-tag").length; t++) {
                    tags.push($("#tag_list_container li span.active-tag").eq(t).attr("data-id"));
                }
            }

            var formData = new FormData(this);
                formData.append('title', document.getElementById("title").value);
                formData.append('img', document.getElementById("image-inp").value);
                formData.append('short_description', ckeditorText.getData());
                formData.append('full_description', ckeditorText2.getData());
                formData.append('date', document.getElementById('date').value);
                formData.append('lang_id', document.getElementById('lang_id').value);
                formData.append('tags', tags);
                formData.append("key_word", document.getElementById("key_word").value);
                
                $.ajax({
                    type:'POST',
                    url: 'http://localhost/petct-armenia/website/petct-back/public/api/admin/news-store',
                    data: formData,
                    cache:false,
                    contentType: false,
                    processData: false,
                    success: (data) => {
                        document.getElementById("wait_loader").style.display = "none";
                        document.getElementsByClassName("btn-primary")[0].style.display = "block";
                        
                        if (data.status === "Success") {
                            document.getElementById("news-success-alert").style.display = "block";
                            document.getElementById("news-danger-alert").style.display = "none";
                            document.getElementById("news-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";

                            $('html, body').animate({scrollTop: '0px'}, 500, function() {
                                setTimeout(function () {
                                    document.getElementById("news-success-alert").style.display = "none";
                                }, 2000);
                            });

                            document.getElementById("title").value = "";
                            document.getElementById("image-inp").value = "";
                            document.getElementById('date').value = "";
                            document.getElementById('lang_id').value = "";
                            document.getElementById("default-image").style.display = "none";
                            document.getElementById("default-image").src = "";
                            document.getElementById("key_word").value = "";

                            ckeditorText.setData("");
                            ckeditorText2.setData("");

                            $("#tag_list_container li span").removeClass("active-tag");
                        } else {
                            document.getElementById("news-danger-alert").innerHTML = '';

                            $('html, body').animate({scrollTop: '0px'}, 500);

                            document.getElementById("news-danger-alert").style.display = "block";
                            document.getElementById("news-danger-alert").innerHTML += `<ul>
                                    ${data.title                         !== undefined   ? '<li>'+data.title+'</li>' : ''}
                                    ${data.img                           !== undefined   ? '<li>'+data.img+'</li>' : ''}
                                    ${data.short_description             !== undefined   ? '<li>'+data.short_description+'</li>' : ''}
                                    ${data.full_description              !== undefined   ? '<li>'+data.full_description+'</li>' : ''}
                                    ${data.date                          !== undefined   ? '<li>'+data.date+'</li>' : ''}
                                    ${data.lang_id                       !== undefined   ? '<li>'+data.lang_id+'</li>' : ''}
                                </ul>`;
                        }
                    },
                    error: function(data){
                        console.log(data);
                    }
            });
        });

        function getTags () {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', 'http://localhost/petct-armenia/website/petct-back/public/api/admin/tags');

            xhr.responseType = 'json';

            xhr.send();

            xhr.onload = function() {
                var res = xhr.response;

                for (var i = 0; i < res.length; i++) {
                    document.getElementById("tag_list_container").innerHTML += `
                        <li>
                            <span data-id="${res[i].id}">${res[i].name}</span>
                        </li>
                    `;
                }

                $("#tag_list_container li span").on("click", function () {
                    if ($(this).hasClass("active-tag")) {
                        $(this).removeClass("active-tag");
                    } else {
                        $(this).addClass("active-tag");
                    }
                });
            }
        }

        getTags();
}

if (url === "news-more") {

        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost/petct-armenia/website/petct-back/public/api/admin/news-more/'+id);

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            var res = xhr.response;
            
            document.getElementById("content-title").innerText = res.news.title;

            document.getElementsByClassName("card-body")[0].innerHTML += `
                <img 
                src="http://localhost/petct-armenia/website/petct-front/img/blog/${res.news.img}"
                id="default-image" 
                style="width: 200px;cursor: pointer;">

                <div class="mt-4">
                    <strong> Հակիրճ Նկարագրություն </strong>
                    ${res.news.short_description}
                </div>

                <div class="mt-4">
                    <strong> Ամողջական Նկարագրություն </strong>
                    ${res.news.full_description}
                </div>

                <div class="mt-4">
                    <strong> Ամսաթիվ </strong>
                    <p>${res.news.date}</p>
                </div>

                <div class="mt-4">
                    <strong> Դիտումներ </strong>
                    <p>${res.news.views}</p>
                </div>

                <div class="mt-4">
                    <strong> Թեգեր </strong>
                    <div id="tags-cont"></div>
                </div>

                <div class="mt-2">
                    <a href="news-edit?id=${res.news.id}" class="btn btn-secondary">Փոխել</a>
                </div>
            `;

            for (var x = 0; x < res.newsTag.length; x++) {
                document.getElementById("tags-cont").innerHTML += `<span>${res.newsTag[x].name}</span>`;
            }

            document.getElementById("news-loader").style.display = "none";

            document.getElementById('default-image').addEventListener('click', function () {
                document.getElementById("image-modal").style.display = "block";
                document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
            });

            document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
                document.getElementById("image-modal").style.display = "none";
            });
        };
}

if (url === "add-tag") {
    document.getElementById("add_btn").addEventListener("click", function () {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("adding-form").querySelector("button").style.display = "none";

        var elmnt = document.querySelector('html');
        
        var data = {};
        data.name = document.getElementById("name-inp").value;
       
        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost/petct-armenia/website/petct-back/public/api/admin/tags-store', true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = function () {
            var res = JSON.parse(xhr.responseText);
            
            document.getElementById("wait_loader").style.display = "none";
            document.getElementById("adding-form").querySelector("button").style.display = "block";

            if (xhr.readyState == 4 && xhr.status == "200") {

                if (res.status === "Success") {
                    document.getElementById("tags-success-alert").style.display = "block";
                    document.getElementById("tags-danger-alert").style.display = "none";
                        
                    document.getElementById("tags-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        elmnt.scrollTop = 0;
                    
                        setTimeout(function () {
                            document.getElementById("tags-success-alert").style.display = "none";
                        }, 2000);
                    }, 500);
                    
                    document.getElementById("name-inp").value = "";
                } else {
                    document.getElementById("tags-danger-alert").innerHTML = '';

                    document.getElementById("tags-danger-alert").style.display = "block";
                    document.getElementById("tags-danger-alert").innerHTML += `<ul>
                            ${res.name             !== undefined   ? '<li>'+res.name+'</li>' : ''}
                        </ul>`;
                }
            } else {
                console.error(res);
            }
        }

        xhr.send(json);
    });
}

if (url === "tag-edit") {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost/petct-armenia/website/petct-back/public/api/admin/tag/'+id);

    xhr.responseType = 'json';

    xhr.send();
    
    xhr.onload = function() {
        document.getElementById("name-inp").value = xhr.response.name;
    }

    function change () {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("editing-form").querySelector("button").style.display = "none";

        var data = {};
        data.name      =   document.getElementById("name-inp").value;

        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost/petct-armenia/website/petct-back/public/api/admin/tag-update/'+id, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = function () {
            var res = JSON.parse(xhr.responseText);

            if (xhr.readyState == 4 && xhr.status == "200") {

                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("editing-form").querySelector("button").style.display = "block";

                if (res.status === 'Success') {
                    document.getElementById("tags-success-alert").style.display = "block";
                    document.getElementById("tags-danger-alert").style.display = "none";
                    
                    document.getElementById("tags-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        document.getElementById("tags-success-alert").style.display = "none";
                    }, 2000);

                } else {
                    document.getElementById("tags-danger-alert").innerHTML = '';

                    document.getElementById("tags-danger-alert").style.display = "block";
                    document.getElementById("tags-danger-alert").innerHTML += `<ul>
                            ${res.name !== undefined ? '<li>'+res.name+'</li>' : ''}
                        </ul>`;
                }

            } else {
                console.error(res);
            }
        }

        xhr.send(json);
    }
}