if (url === "press") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/press');

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        var res = xhr.response;
        
        for (var i = 0; i < res.length; i++) {
            document.getElementById("press-table").innerHTML += `
                <tr>
                    <td>${res[i].title}</td>

                    <td>
                        <img
                            class="default-image"
                            style="width: 100px; cursor: pointer"
                            src="http://localhost/petct-armenia/website/petct-front/img/press/${res[i].img}" 
                        />
                    </td>
                    
                    <td>${setLang(res[i].lang_id)}</td>
                    
                    <td>
                        <a href="press-more?id=${res[i].id}" class="btn btn-info">Դիտել ավելին</a>
                    </td>

                    <td>
                        <a href="press-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                    </td>

                    <td>
                        <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջել</button>
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

                    xhr.open("DELETE", API_URL + '/press-delete/'+this.getAttribute("data-id"), true);
                    xhr.onload = function () {
                        var res = JSON.parse(xhr.responseText);

                        if (xhr.readyState == 4 && xhr.status == "200") {
                            if (res.status === "Success") {
                                element.parentElement.parentElement.remove();

                                document.getElementById("press_deleted_message").style.display = "block";

                                document.body.scrollTop = 0;
                                document.documentElement.scrollTop = 0;
                                                        
                                setTimeout(function () {
                                    document.getElementById("press_deleted_message").style.display = "none";
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

        document.getElementsByClassName('loader-press')[0].remove();
    }
}

if (url === "press-add") {
    var ckeditorText;
    var ckeditor2Text;

    ClassicEditor.create( document.querySelector( '#editor' ) )
    .then(editor => {
        ckeditorText = editor;
    }).catch( error => {
        console.error( error );
    });

    ClassicEditor.create( document.querySelector( '#editor-2' ) )
    .then(editor => {
        ckeditor2Text = editor;
    }).catch( error => {
        console.error( error );
    });

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

    var uploadForm = document.getElementById('add-form');
    
    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("addBtn").style.display = "none";

        var formData = new FormData(this);
            formData.append('video', document.getElementById("youtube").value);
            formData.append('title', document.getElementById("title-inp").value);
            formData.append('short_description', ckeditorText.getData());
            formData.append('description', ckeditor2Text.getData());
            formData.append('lang_id', document.getElementById('lang_id-inp').value);
        
            $.ajax({
                type:'POST',
                url: API_URL + '/press-add',
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: (data) => {

                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementById("addBtn").style.display = "block";

                    if (data.status === "Success") {
                        document.getElementById("press-edit-danger-alert").style.display = "none";
                        document.getElementById("press-edit-success-alert").style.display = "block";
                        document.getElementById("press-edit-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";
                       
                        setTimeout(function () {
                            document.getElementById("press-edit-success-alert").style.display = "none";
                        }, 2000);

                        document.getElementById("youtube").value = "";
                        document.getElementById("title-inp").value = "";
                        document.getElementById("default-image").src = "";
                        document.getElementById("image-inp").src = "";

                        ckeditorText.setData("");
                        ckeditor2Text.setData("");
                    } else {
                        document.getElementById("press-edit-danger-alert").innerHTML = '';

                        document.getElementById("press-edit-danger-alert").style.display = "block";
                        document.getElementById("press-edit-danger-alert").innerHTML += `<ul>
                            ${data.title                !== undefined ? '<li>'+data.title+'</li>' : ''}
                            ${data.short_description    !== undefined ? '<li>'+data.short_description+'</li>' : ''}
                            ${data.description          !== undefined ? '<li>'+data.description+'</li>' : ''}
                            ${data.img                  !== undefined ? '<li>'+data.img+'</li>' : ''}
                            ${data.lang_id              !== undefined ? '<li>'+data.lang_id+'</li>' : ''}
                        </ul>`;
                    }

                    $("html, body").animate({ scrollTop: 0 }, 600);
                },
                error: function(data){
                    console.log(data);
                }
            });
    });
}

if (url === "press-edit") {
    $(".more_see_container").append('<a href="press-more?id='+id+'" class="btn btn-info">Դիտել ավելին</a>');
    
    var ckeditorText;
    var ckeditor2Text;

    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/press-more/'+id);

    xhr.responseType = 'json';

    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;

        $("#select_language_inp").append(`
            <option ${res.lang_id === 1 ? 'selected' : ''} value="1">Am</option>
            <option ${res.lang_id === 3 ? 'selected' : ''} value="3">Ru</option>
            <option ${res.lang_id === 2 ? 'selected' : ''} value="2">En</option>
        `);
        
        ClassicEditor.create( document.querySelector( '#editor' ) )
        .then(editor => {
            ckeditorText = editor;
        }).catch( error => {
            console.error( error );
        });

        ClassicEditor.create( document.querySelector( '#editor-2' ) )
        .then(editor => {
            ckeditor2Text = editor;
        }).catch( error => {
            console.error( error );
        });

        document.getElementById("title-inp").value = res.title;
        document.getElementById("editor").innerHTML = res.short_description;
        document.getElementById("editor-2").innerHTML = res.description;
        document.getElementById("youtube-inp").value = res.video;

        document.getElementById("default-image").src = "http://localhost/petct-armenia/website/petct-front/img/press/"+res.img;

        document.getElementById("press-loader").remove();
        document.getElementById("editing-form").style.display = "block";

        document.getElementById('default-image').addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "block";
            document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
        });

        document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "none";
        });

        //Update
        function upload () {
            var uploadForm = document.getElementById('editing-form');

            document.getElementById("image-inp").addEventListener('change', function() {
                var reader = new FileReader();

                reader.onload = (e) => { 
                    document.getElementById("default-image").src = e.target.result; 
                }

                reader.readAsDataURL(this.files[0]);
            });

            uploadForm.addEventListener('submit', function (e) {
                e.preventDefault();
                
                document.getElementById("wait_loader").style.display = "block";
                document.getElementsByClassName("btn-success")[0].style.display = "none";
                
                var formData = new FormData(this);

                formData.append('id', res.id);
                formData.append('title', document.getElementById("title-inp").value);
                formData.append('short_description', ckeditorText.getData());
                formData.append('description', ckeditor2Text.getData());
                formData.append('lang_id', $("#select_language_inp").val());
                formData.append('video', document.getElementById("youtube-inp").value);

                $.ajax({
                    type:'POST',
                    url: API_URL + "/press-edit/upload/"+res.id,
                    data: formData,
                    cache:false,
                    contentType: false,
                    processData: false,
                    success: (data) => {

                        document.getElementById("wait_loader").style.display = "none";
                        document.getElementsByClassName("btn-success")[0].style.display = "block";
                        
                        if (data.status === "Success") {
                            document.getElementById("press-edit-danger-alert").style.display = "none";
                            document.getElementById("press-edit-success-alert").style.display = "block";
                            document.getElementById("press-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                       
                            setTimeout(function () {
                                document.getElementById("press-edit-success-alert").style.display = "none";
                            }, 2000);

                        } else {
                            document.getElementById("press-edit-danger-alert").innerHTML = '';

                            document.getElementById("press-edit-danger-alert").style.display = "block";
                            document.getElementById("press-edit-danger-alert").innerHTML += `<ul>
                                    ${data.title                !== undefined ? '<li>'+data.title+'</li>' : ''}
                                    ${data.short_description    !== undefined ? '<li>'+data.short_description+'</li>' : ''}
                                    ${data.description          !== undefined ? '<li>'+data.description+'</li>' : ''}
                                </ul>`;
                        }

                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    },
                    error: function(err){
                        console.log(err);
                    }
                });

            });
        }

        upload();
    };
}

if (url === "press-more") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/press-more/'+id);

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        document.getElementById("content-title").innerText = xhr.response.title;

        document.getElementsByClassName("card-body")[0].innerHTML += `
            <img 
            src="http://localhost/petct-armenia/website/petct-front/img/press/${xhr.response.img}"
            id="default-image" 
            style="width: 200px;cursor: pointer;">
            
            <div class='mt-4'>
                <strong>Հակիրճ նկարագրություն</strong>
                ${xhr.response.short_description}
            </div>

            <div class='mt-4'>
                <strong>Ամբողջական նկարագրություն</strong>
                ${xhr.response.description}
            </div>

            ${xhr.response.video === null ? '' : `
                <div class='mt-4'>
                    <div><strong>Տեսանյութ</strong></div>
                    <iframe width="420" height="345" src="${xhr.response.video}"></iframe>

                </div>
            `}

            <a href="press-edit?id=${xhr.response.id}" class="btn btn-secondary">Փոխել</a>
        `;
        
        document.getElementById("press-loader").remove();

        document.getElementById('default-image').addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "block";
            document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
        });

        document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "none";
        });
    };
}