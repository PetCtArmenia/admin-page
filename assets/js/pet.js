//Pet Index Code
if (url === "pet") {
    function setLang (name) {
        if (name === 1) {
            return "Հայ";
        } else if (name === 2) {
            return "En";
        } else {
            return "Ру";
        }
    }

    let xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/pet');

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        let res = xhr.response;

        for (var i = 0; i < res.length; i++) {
            document.getElementById("pet-text-table").innerHTML += `
                <tr>
                    <td>${res[i].title}</td>
                    
                    <td>${setLang(res[i].lang_id)}</td>
                    
                    <td>
                        <a href="pet-text?id=${res[i].id}" class="btn btn-info">Դիտել ավելին</a>
                    </td>

                    <td>
                        <a href="pet-text-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                    </td>

                    <td>
                        <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջել</button>
                    </td>
                </tr>
            `;
        }

        document.getElementsByClassName('loader-image-container')[0].remove();

        //Delete Pet text
        for (var del = 0; del < document.getElementsByClassName("deleteBtn").length; del++) {
            document.getElementsByClassName("deleteBtn")[del].addEventListener('click', function () {    
                var element = this;
                
                if (confirm("Համոզված եք որ ուզում եք ջնջել")) {
                    var xhr = new XMLHttpRequest();

                    xhr.open("DELETE", API_URL + '/pet-text-delete/'+this.getAttribute("data-id"), true);
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

    function petVideo () {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/pet-video');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            let res = xhr.response;

            for (var i = 0; i < res.length; i++) {
                document.getElementById("pet-video-table").innerHTML += `
                    <tr>
                        <td>
                            <video 
                            width="200"
                            height="200"
                            poster="http://localhost/petct-armenia/website/petct-front/img/video/${res[i].poster_name}"
                            src="http://localhost/petct-armenia/website/petct-front/img/video/${res[i].video_name}" 
                            controls>    
                        </td>
                        
                        <td>
                            <img 
                            id="default-image"
                            style="width: 200px; cursor: pointer"
                            src="http://localhost/petct-armenia/website/petct-front/img/video/${res[i].poster_name}" />
                        </td>

                        <td>
                            <a href="pet-video?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                        </td>
                    </tr>
                `;
            }

            document.getElementsByClassName('loader-image-container')[0].remove();

            document.getElementById('default-image').addEventListener('click', function () {
                document.getElementById("image-modal").style.display = "block";
                document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
            });

            document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
                document.getElementById("image-modal").style.display = "none";
            });
        }
    }

    petVideo();

    function fourExamples () {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/four-exaples-names');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            let res = xhr.response;
            
            for (var i = 0; i < res.length; i++) {
                document.getElementById("pet-four-examples-table").innerHTML += `
                    <tr>
                        <td>${res[i].name}</td>
                        
                        <td>${setLang(res[i].lang_id)}</td>

                        <td>
                            <a href="pet-edit-four-example?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                        </td>
                    </tr>
                `;
            }

            document.getElementsByClassName('loader-image-container')[0].remove();
        }
    }

    fourExamples();

    function fourExampleImages () {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/four-example-images');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            let res = xhr.response;

            for (var i = 0; i < res.length; i++) {
                document.getElementById("pet-four-examples-images-table").innerHTML += `
                    <tr>
                        <td>${res[i].category.name}</td>
                        
                        <td>
                            <img class="default-image" 
                            style="width: 80px; cursor: pointer" 
                            src="http://localhost/petct-armenia/website/petct-front/img/four_examples/${res[i].img_name}">
                        </td>

                        <td>
                            <a href="pet-edit-four-example-image?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                        </td>

                        <td>
                            <button class="btn btn-danger deleteExampleImage" data-id="${res[i].id}">Ջնջել</button>
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

            //Delete function
            $(".deleteExampleImage").on("click", function () {
                var element = this;
                var conf = confirm("Համոզված եք որ ուզում եք ջնջնել");

                if (conf) {
                    $.ajax({
                        url: API_URL + '/four-example-image-delete/'+$(this).attr("data-id"),
                        type: 'DELETE',
                        success: function(result) {
                            if (result.status === "Success") {
                                element.parentElement.parentElement.remove();
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
    }

    fourExampleImages();

    function petCoreVideo () {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/pet-core-video');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            for (var i = 0; i < xhr.response.length; i++) {
                document.getElementById("pet-core-video-images-table").innerHTML += `
                    <tr>
                        <td>
                            <video controls="" style="width: 250px">
                                <source src="http://localhost/petct-armenia/website/petct-front/img/pet-video/${xhr.response[i].video_name}" type="video/mp4">
                            </video>
                        </td>

                        <td>${setLang(xhr.response[i].lang_id)}</td>
                        
                        <td>
                            <a href="core-video-edit?id=${xhr.response[i].id}" class="btn btn-secondary">Փոխել</a>
                        </td>

                        <td>
                            <button type="button" data-id="${xhr.response[i].id}" 
                            class="btn btn-${xhr.response[i].is_disabled ? "success" : "danger"} disabledButton">
                                ${xhr.response[i].is_disabled ? "Թույլատրել տեսանյութի ցուցադրումը" : "Չեղարկել տեսանյութի ցուցադրումը"} 
                            </button>

                            <img src="../../images/loading.gif" style="width: 50px; display: none" />
                        </td>
                    </tr>
                `;
            }
            
            $(".disabledButton").on("click", function () {
                var that = $(this);

                that.next().css("display", "block");
                that.css("display", "none");

                $.post(API_URL + "/pet-core-video-disable", {videoId: $(this).attr("data-id")},
                function(data, status){
                    that.next().css("display", "none");
                    that.css("display", "block");
                    
                    if (data.message === "Success") {
                        if (data.status) {
                            that.removeClass("btn btn-danger");
                            that.addClass("btn btn-success");
                            that.text("Թույլատրել տեսանյութի ցուցադրումը");
                        } else {
                            that.removeClass("btn btn-success");
                            that.addClass("btn btn-danger");
                            that.text("Չեղարկել տեսանյութի ցուցադրումը");
                        }
                    } else {
                        console.log(data.message);
                    }
                });
            });

            document.getElementsByClassName('loader-image-container')[0].remove();
        }
    }

    petCoreVideo();
}

if (url === "core-video-edit") {
        $("#video-inp").on('change', function() {
            var reader = new FileReader();

            reader.onload = (e) => { 
                $("#video").attr("src", e.target.result); 
            }

            reader.readAsDataURL(this.files[0]); 
        });

        $.ajax({
            url: API_URL + '/pet-core-video-edit/'+id,
            type: 'GET',
            success: function(result) {
                $("#video").attr("src", "http://localhost/petct-armenia/website/petct-front/img/pet-video/"+result.video_name);

                $("#editing-index-slide-loader").css("display", "none");
                $("#editing-form").css("display", "block");
            },
            error: function (err) {
                console.log(err);
            }
        });

        $("#editing-form").on("submit", function (e) {
            e.preventDefault();

            $("#wait_loader").css("display", "block");
            $(".btn-success").css("display", "none");

            var formData = new FormData(this);

            $.ajax({
                type: 'POST',
                url:  API_URL + "/pet-core-video/"+id,
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: (data) => {
                    $("#wait_loader").css("display", "none");
                    $(".btn-success").css("display", "block");

                    if (data.status === "Success") {
                        $("#doctors-edit-success-alert").css("display", "block");
                        $("#doctors-edit-success-alert").text("Փոփոխությունը կատարվել է հաջողությամբ");

                        setTimeout(function () {
                            $("#doctors-edit-success-alert").css("display", "none");
                        }, 2000);
                    }
                },
                error: function(err){
                    console.error(err);
                }
            });
        });
}

if (url === "pet-text-add") {
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
        var text = ckeditorText.getData();
        var lang_id = document.getElementById("lang_inp").value;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/pet-text-add', true);

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var res = JSON.parse(this.responseText);

                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("addBtn").style.display = "block";

                if (res.status === "Success") {
                    document.getElementById("pet-txt-edit-success-alert").style.display = "block";
                    document.getElementById("pet-txt-edit-danger-alert").style.display = "none";
                      
                    document.getElementById("pet-txt-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    document.getElementById("title-inp").value = '';

                    setTimeout(function () {
                        document.getElementById("pet-txt-edit-success-alert").style.display = "none";
                    }, 2000);

                    ckeditorText.setData("");
                
                } else {
                    document.getElementById("pet-txt-edit-danger-alert").innerHTML = '';

                    document.getElementById("pet-txt-edit-danger-alert").style.display = "block";
                    document.getElementById("pet-txt-edit-danger-alert").innerHTML += `<ul>
                            ${res.title     !== undefined   ? '<li>'+res.title+'</li>' : ''}
                            ${res.text      !== undefined   ? '<li>'+res.text+'</li>' : ''}
                            ${res.lang_id   !== undefined   ? '<li>'+res.lang_id+'</li>' : ''}
                        </ul>`;
                }

                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
        xhr.send("title="+title+"&text="+text+"&lang_id="+lang_id);
    });

}

if (url === "pet-text") {

        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/pet-text/'+id);

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            var res = xhr.response;
            
            document.getElementById("content-title").innerText = res.title;
            document.getElementsByClassName("card-body")[0].innerHTML += `${res.text} <a href="pet-text-edit?id=${res.id}" class="btn btn-secondary">Փոխել</a>`;

            document.getElementsByClassName('loader-image-container')[0].remove();
        };
}

if (url === "pet-text-edit") {
    var ckeditorText;

    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/pet-text/'+id);

    xhr.responseType = 'json';

    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;
        
        document.getElementById("see_more_container").innerHTML = `
            <a href="pet-text?id=${res.id}" class="btn btn-info">Դիտել ավելին</a>
        `;

        document.getElementById("title-inp").value = res.title;
        
        ClassicEditor.create( document.querySelector( '#editor' ) )
        .then(editor => {
            ckeditorText = editor;
        }).catch( error => {
            console.error( error );
        });

        document.getElementById("editor").innerHTML = res.text;

        document.getElementById("pet-editing-slide-loader").remove();
        document.getElementById("editing-form").style.display = "block";
    };

    function update () {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("adding_btn").style.display = "none";
        
        var data = {};
        data.title = document.getElementById("title-inp").value;
        data.text = ckeditorText.getData();

        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/pet-text-update/'+id, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = function () {
            var res = JSON.parse(xhr.responseText);

            if (xhr.readyState == 4 && xhr.status == "200") {

                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("adding_btn").style.display = "block";

                if (res.status === "Success") {
                    document.getElementById("pet-txt-edit-success-alert").style.display = "block";
                    document.getElementById("pet-txt-edit-danger-alert").style.display = "none";
                        
                    document.getElementById("pet-txt-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        document.getElementById("pet-txt-edit-success-alert").style.display = "none";
                    }, 2000);
                    
                } else {
                    document.getElementById("pet-txt-edit-danger-alert").innerHTML = '';

                    document.getElementById("pet-txt-edit-danger-alert").style.display = "block";
                    document.getElementById("pet-txt-edit-danger-alert").innerHTML += `<ul>
                            ${res.title !== undefined ? '<li>'+res.title+'</li>' : ''}
                            ${res.text !== undefined  ? '<li>'+res.text+'</li>' : ''}
                        </ul>`;
                }
            } else {
                console.error(res);
            }
        }

        xhr.send(json);
    }
}

if (url === "pet-video") {
    document.getElementById('default-image').addEventListener('click', function () {
        document.getElementById("image-modal").style.display = "block";
        document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
    });

    document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
        document.getElementById("image-modal").style.display = "none";
    });

    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/pet-video/'+id);

    xhr.responseType = 'json';

    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;
        
        document.getElementById("video-tag").src = "http://localhost/petct-armenia/website/petct-front/img/video/"+res.video_name;
        document.getElementById("default-image").src = "http://localhost/petct-armenia/website/petct-front/img/video/"+res.poster_name;
        
        document.getElementById("video-inp").addEventListener('change', function() {
            var reader = new FileReader();

            reader.onload = (e) => { 
                document.getElementById("video-tag").src = e.target.result; 
            }

            reader.readAsDataURL(this.files[0]); 
        });

        document.getElementById("img-inp").addEventListener('change', function() {
            var reader = new FileReader();

            reader.onload = (e) => { 
                document.getElementById("default-image").src = e.target.result; 
            }

            reader.readAsDataURL(this.files[0]); 
        });

        document.getElementById("pet-editing-slide-loader").remove();
        document.getElementById("editing-form").style.display = "block";
        
        var uploadForm = document.getElementById('editing-form');

        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-success")[0].style.display = "none";
            
            var formData = new FormData(this);
            
            $.ajax({
                type: 'POST',
                url:  API_URL + "/pet-video-edit/"+res.id,
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: (data) => {
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-success")[0].style.display = "block";

                    if (data.status === "Success") {
                        document.getElementById("pet-txt-edit-danger-alert").style.display = "none";
                        document.getElementById("pet-txt-edit-success-alert").style.display = "block";
                        document.getElementById("pet-txt-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                        
                        $('html, body').animate({scrollTop: '0px'}, 500, function() {
                            setTimeout(function () {
                                document.getElementById("pet-txt-edit-success-alert").style.display = "none";
                            }, 2000);
                        });
                    }
                },
                error: function(data){
                    console.error(data);
                }
            });
        });
    };
}

if (url === "pet-edit-four-example") {
        var ckeditorText;

        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/four-exaple/'+id);

        xhr.responseType = 'json';

        xhr.send();
        
        xhr.onload = function() {
            var res = xhr.response;
            
            document.getElementById("editing-form").innerHTML += `
                <div class="form-group">
                    <label>Անվանում <span class="mandatory_star">*</span></label>
                    <input class="form-control" name="name" value="${res.type.name}" id="title-inp">
                </div>
            `;

            document.getElementById("editing-form").innerHTML += ` <div class="form-group">
                                    <button class="btn btn-success">Հաստատել</button>
                                    <img src="../../images/loading.gif" id="wait_loader" style="width: 50px;display: none;">
                                </div>`;
            
            document.getElementById("pet-editing-slide-loader").remove();
            document.getElementById("editing-form").style.display = "block";
            
            for (var i = 0; i < document.getElementsByClassName('default-image').length; i++) {
                document.getElementsByClassName('default-image')[i].addEventListener('click', function () {
                    document.getElementById("image-modal").style.display = "block";
                    document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
                });
            }

            document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
                document.getElementById("image-modal").style.display = "none";
            });

            var uploadForm = document.getElementById("editing-form");

            uploadForm.addEventListener('submit', function (e) {
                e.preventDefault();

                document.getElementById("wait_loader").style.display = "block";
                document.getElementsByClassName("btn-success")[0].style.display = "none";

                var formData = new FormData(this);

                $.ajax({
                    type:'POST',
                    url: API_URL + "/four-example-edit/"+id,
                    data: formData,
                    cache:false,
                    contentType: false,
                    processData: false,
                    success: (data) => {
                        document.getElementById("wait_loader").style.display = "none";
                        document.getElementsByClassName("btn-success")[0].style.display = "block";

                        if (data.status === "Success") {
                            document.getElementById("pet-txt-edit-danger-alert").style.display = "none";
                            document.getElementById("pet-txt-edit-success-alert").style.display = "block";
                            document.getElementById("pet-txt-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                        
                            setTimeout(function () {
                                document.getElementById("pet-txt-edit-success-alert").style.display = "none";
                            }, 2000);

                        } else {                            
                            document.getElementById("pet-txt-edit-danger-alert").innerHTML = '';

                            document.getElementById("pet-txt-edit-danger-alert").style.display = "block";
                            document.getElementById("pet-txt-edit-danger-alert").innerHTML += `<ul>
                                    ${data.name !== undefined ? '<li>'+data.name+'</li>' : ''}
                                </ul>`;
                        }
                        
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

if (url === "pet-add-four-example-image") {
    function fourExamplesTitleIds () {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/four-exaples-names');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            for (var i = 0; i < xhr.response.length; i++) {
                document.getElementById("title_id").innerHTML += `<option value="${xhr.response[i].id}">
                    ${xhr.response[i].name}    
                </option>`;
            }
        }
    }

    fourExamplesTitleIds();

    //Set Image
    document.getElementById("image-inp").addEventListener('change', function() {
        var reader = new FileReader();

        reader.onload = e => {
            document.getElementById("default-image").src = e.target.result;
            document.getElementById("default-image").style.display = "block";
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
            formData.append("key_word", document.getElementById("key_word").value);
            formData.append("title_id", document.getElementById("title_id").value);
        
        $.ajax({
            type:'POST',
            url: API_URL + "/four-example-image-store",
            data: formData,
            cache:false,
            contentType: false,
            processData: false,
            success: (data) => {
                document.getElementById("wait_loader").style.display = "none";
                document.getElementsByClassName("btn-success")[0].style.display = "block";
                    
                if (data.status === "Success") {
                    document.getElementById("pet-txt-edit-danger-alert").style.display = "none";
                    document.getElementById("pet-txt-edit-success-alert").style.display = "block";
                    document.getElementById("pet-txt-edit-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";
                    
                    document.getElementById("key_word").value = "";
                    document.getElementById("default-image").style.display = "none";
                    document.getElementById("default-image").src = "";
                    document.getElementById("image-inp").src = "";

                    setTimeout(function () {
                        document.getElementById("pet-txt-edit-success-alert").style.display = "none";
                    }, 2000);
                } else {
                    document.getElementById("pet-txt-edit-danger-alert").innerHTML = '';

                    document.getElementById("pet-txt-edit-danger-alert").style.display = "block";
                    document.getElementById("pet-txt-edit-danger-alert").innerHTML += `<ul>
                            ${data.img !== undefined ? '<li>'+data.img+'</li>' : ''}
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

if (url === "pet-edit-four-example-image") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/four-example-image/'+id);

    xhr.responseType = 'json';

    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;
                    
        document.getElementById("editing-form").innerHTML += `
            <div class="form-group">
                <label for="image-in">Նկար</label>
                
                <input type="file" name="img" accept="image/gif, image/jpeg, image/png" class="form-control-file" id="image-inp">
                
                <div>
                    <small>Ընդունված ֆայլի ձևաչափեր gif, png, jpeg</small>
                </div>
                
                <img id="default-image" src="http://localhost/petct-armenia/website/petct-front/img/four_examples/${res.img_name}" style="width: 150px; height: 150px; margin-top: 20px;cursor: pointer;">
            
                <div class="form-group mt-4">
                    <label>Բանալի Բառ</label>
                    <input class="form-control" value="${res.key_word}" id="key_word" />
                </div>

                <div class="form-group mt-4">
                    <button class="btn btn-success">Հաստատել</button>

                    <img src="../../images/loading.gif" id="wait_loader" style="width: 50px;display: none;">
                </div>
            </div>
        `;

        document.getElementById("pet-editing-slide-loader").remove();
        document.getElementById("editing-form").style.display = "block";

        document.getElementById("image-inp").addEventListener('change', function() {
            var reader = new FileReader();

            reader.onload = e => {
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

        var uploadForm = document.getElementById("editing-form");

        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-success")[0].style.display = "none";

            var formData = new FormData(this);
                formData.append("key_word", document.getElementById("key_word").value)

            $.ajax({
                type:'POST',
                url: API_URL + "/four-example-image-update/"+id,
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: (data) => {
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-success")[0].style.display = "block";
                    
                    if (data.status === "Success") {
                        document.getElementById("pet-txt-edit-danger-alert").style.display = "none";
                        document.getElementById("pet-txt-edit-success-alert").style.display = "block";
                        document.getElementById("pet-txt-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                    
                        setTimeout(function () {
                            document.getElementById("pet-txt-edit-success-alert").style.display = "none";
                        }, 2000);

                    } else {
                        document.getElementById("pet-txt-edit-danger-alert").innerHTML = '';

                        document.getElementById("pet-txt-edit-danger-alert").style.display = "block";
                        document.getElementById("pet-txt-edit-danger-alert").innerHTML += `<ul>
                                ${data.title !== undefined ? '<li>'+data.title+'</li>' : ''}
                                ${data.description !== undefined ? '<li>'+data.description+'</li>' : ''}
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
}