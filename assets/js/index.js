if (url === "" || url === "index") {
let xhr = new XMLHttpRequest();

xhr.open('GET', API_URL+'/index');

xhr.responseType = 'json';

xhr.send();

xhr.onload = function() {
  let responseObj = xhr.response;

  for (var i = 0; i < responseObj.sliderData.length; i++) {
    document.getElementById('index-slider-table').innerHTML += `
        <tr>
            <td>
                <img 
                class="default-image"
                style="cursor: pointer"
                width="70"
                src="http://localhost/petct-armenia/website/petct-front/img/slider-images/${responseObj.sliderData[i].image}" />
            </td>
            
            <td>${responseObj.sliderData[i].title}</td>
            
            <td>${setLang(responseObj.sliderData[i].lang_id)}</td>
            
            <td>
                <a href="index-slider?id=${responseObj.sliderData[i].id}" class="btn btn-info">Դիտել ավելին</a>
            </td>
            
            <td>
                <a href="index-slider-edit?id=${responseObj.sliderData[i].id}" class="btn btn-secondary">Փոխել</a>
            </td>

            <td>
                <button type="button" class="btn btn-danger deleteBtn" data-id="${responseObj.sliderData[i].id}">Ջնջել</a>
            </td>
        </tr>
    `;
  }

  //Delete Index Slider Data
  for (var del = 0; del < document.getElementsByClassName("deleteBtn").length; del++) {
    document.getElementsByClassName("deleteBtn")[del].addEventListener('click', function () {    
        var element = this;
         
        if (confirm("Համոզված եք որ ուզում եք ջնջել")) {
            var xhr = new XMLHttpRequest();

            xhr.open("DELETE", API_URL+'/index-slider-delete/'+this.getAttribute("data-id"), true);
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

  for (var i = 0; i < responseObj.services.length; i++) {
    document.getElementById('index-services-table').innerHTML += `
        <tr>
            <td>${responseObj.services[i].title}</td>

            <td>${responseObj.services[i].sub_title}</td>
            
            <td>${setLang(responseObj.services[i].lang_id)}</td>

            <td>
                <a href="index-services?id=${responseObj.services[i].id}" class="btn btn-info">Դիտել ավելին</a>
            </td>

            <td>
                <a href="index-services-edit?id=${responseObj.services[i].id}" class="btn btn-secondary">Փոխել</a>
            </td>
        </tr>
    `;
  }
  
  for (var i = 0; i < responseObj.about.length; i++) {
    document.getElementById('index-about-us-table').innerHTML += `
        <tr>
            <td>${responseObj.about[i].title}</td>

            <td>
                <img 
                class="default-image"
                style="cursor: pointer"
                width="70" 
                height="70" 
                src="http://localhost/petct-armenia/website/petct-front/img/about_us/${responseObj.about[i].img}" />
            </td>
            
            <td>${responseObj.about[i].key_word}</td>

            <td>${setLang(responseObj.about[i].lang_id)}</td>
            
            <td>
                <a href="index-about-us?id=${responseObj.services[i].id}" class="btn btn-info">Դիտել ավելին</a>
            </td>

            <td>
                <a href="index-edit-about-us?id=${responseObj.services[i].id}" class="btn btn-secondary">Փոխել</a>
            </td>
        </tr>
    `;
}

document.getElementsByClassName('loader-image-container')[1].remove();
document.getElementsByClassName('loader-image-container')[0].remove();
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

};
}

if (url === "add-index-slider") {
    var ckeditorText;
    ClassicEditor.create( document.querySelector( '#editor' ) )
    .then(editor => {
        ckeditorText = editor;
    }).catch( error => {
        console.error( error );
    });

    document.getElementById("image-inp").addEventListener('change', function() {
        var reader = new FileReader();

        reader.onload = e => { 
            document.getElementById("default-image").src = e.target.result; 
        }

        reader.readAsDataURL(this.files[0]); 
    });

    var uploadForm = document.getElementById('add-form');
    
    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("addBtnSubmit").style.display = "none";

        var formData = new FormData(this);
            formData.append('title', document.getElementById("title-inp").value);
            formData.append('description', ckeditorText.getData());
            formData.append('lang_id', document.getElementById('lang_inp').value);
            
        $.ajax({
                type:'POST',
                url: API_URL + '/add-index-slider',
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: (data) => {
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementById("addBtnSubmit").style.display = "block";
                    
                    if (data.status === "Success") {
                        document.getElementById("add-index-slider-success-alert").style.display = "block";
                        document.getElementById("add-index-slider-danger-alert").style.display = "none";
                        
                        document.getElementById("add-index-slider-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";
                        
                        document.getElementById("image-inp").value = "";
                        document.getElementById("title-inp").value = "";
                        document.getElementById("default-image").src = "";
                        ckeditorText.setData('<p></p>');
                                                    
                        setTimeout(function () {
                            document.getElementById("add-index-slider-success-alert").style.display = "none";
                        }, 2000);
                    } else {
                        document.getElementById("add-index-slider-danger-alert").innerHTML = '';

                        document.getElementById("add-index-slider-danger-alert").style.display = "block";
                        document.getElementById("add-index-slider-danger-alert").innerHTML += `<ul>
                                ${data.image         !== undefined ? '<li>'+data.image+'</li>' : ''}
                                ${data.title         !== undefined ? '<li>'+data.title+'</li>' : ''}
                                ${data.description   !== undefined ? '<li>'+data.description+'</li>' : ''}
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

    document.getElementById('default-image').addEventListener('click', function () {
        document.getElementById("image-modal").style.display = "block";
        document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
    });

    document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
        document.getElementById("image-modal").style.display = "none";
    });
}

if (url === "index-slider") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/index-slider/'+id);

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        var res = xhr.response;

        document.getElementById("content-title").innerText = res.title;

        document.getElementById("content-image").src = 'http://localhost/petct-armenia/website/petct-front/img/slider-images/'+res.image;
        
        document.getElementsByClassName("card-body")[0].innerHTML += `
        ${res.description}
        <a href="index-slider-edit?id=${res.id}" class="btn btn-secondary">Փոխել</a>`;

        document.getElementById('content-image').addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "block";
            document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
        });

        document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "none";
        });

        document.getElementById("editing-index-slide-loader").remove();
    };
}

if (url === "index-slider-edit") {
    var ckeditorText;

    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL+'/index-slider/'+id);

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
            <a href="index-slider?id=${res.id}" class="btn btn-info">Դիտել ավելին</a>
        `;

        document.getElementById("editor").innerHTML = res.description;

        document.getElementById("default-image").src = 'http://localhost/petct-armenia/website/petct-front/img/slider-images/'+res.image;
        
        document.getElementById("language_container").innerHTML += `
            <option value="1" ${res.lang_id === 1 ? "selected" : ""}>Am</option>
            <option value="2" ${res.lang_id === 2 ? "selected" : ""}>En</option>
            <option value="3" ${res.lang_id === 3 ? "selected" : ""}>Ru</option>
        `;

        document.getElementById("editing-index-slide-loader").remove();
        document.getElementById("editing-form").style.display = "block";
    };

    function upload () {
        //Uploading image
        var uploadForm = document.getElementById('editing-form');
        var fileData = '';

        document.getElementById('default-image').addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "block";
            document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
        });

        document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "none";
        });

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
            formData.append('id', id);
            formData.append('title', document.getElementById("title-inp").value);
            formData.append('description', ckeditorText.getData());
            formData.append("lang_id", document.getElementById("language_container").value);

            $.ajax({
                type:'POST',
                url: API_URL + "/index-slider/upload",
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: (data) => {
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-success")[0].style.display = "block";

                    if (data.status === "Success") {
                        document.getElementById("index-slider-edit-danger-alert").style.display = "none";
                        document.getElementById("index-slider-edit-success-alert").style.display = "block";
                        document.getElementById("index-slider-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                    
                        setTimeout(function () {
                            document.getElementById("index-slider-edit-success-alert").style.display = "none";
                        }, 2000);

                    } else {
                        document.getElementById("index-slider-edit-danger-alert").innerHTML = '';

                        document.getElementById("index-slider-edit-danger-alert").style.display = "block";
                        document.getElementById("index-slider-edit-danger-alert").innerHTML += `<ul>
                                ${data.title !== undefined ? '<li>'+data.title+'</li>' : ''}
                                ${data.description !== undefined ? '<li>'+data.description+'</li>' : ''}
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
    }

    window.onload = function () {
        upload();
    }
}

if (url === "index-about-us") {

        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/index-about-us/'+id);

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            document.getElementById("content-title").innerText = xhr.response.title;

            document.getElementsByClassName("card-body")[0].innerHTML += `
                <video width="350" src="http://localhost/petct-armenia/website/petct-front/img/about_us/${xhr.response.video}" controls />
            `;
            
            document.getElementsByClassName("card-body")[0].innerHTML += `
                <p class="mt-2">${xhr.response.description}</p>
                <a href="index-edit-about-us?id=${xhr.response.id}" class="btn btn-secondary">Փոխել</a>
            `;

            document.getElementById("editing-index-slide-loader").remove();
        };
}

if (url === "index-services-edit") {
        document.getElementById("more_see_container").innerHTML += '<a href="index-services?id='+id+'" class="btn btn-info">Դիտել ավելին</a>';
        
        var ckeditorText;

        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/index-services/'+id);

        xhr.responseType = 'json';

        xhr.send();
        
        xhr.onload = function() {
            var res = xhr.response;
            
            ClassicEditor.create( document.querySelector( '#editor' ) )
            .then(editor => {
                ckeditorText = editor;
            }).catch( error => {
                console.error( error );
            });

            document.getElementById("sub_title-inp").value = res.sub_title;
            document.getElementById("title-inp").value = res.title;
            document.getElementById("editor").innerHTML = res.description;
            
            document.getElementById("editing-index-slide-loader").remove();
            document.getElementById("editing-form").style.display = "block";
        };
        
        function change () {
            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-success")[0].style.display = "none";

            var data = {};
            data.sub_title      =   document.getElementById("sub_title-inp").value;
            data.title          =   document.getElementById("title-inp").value;
            data.description    =   ckeditorText.getData();

            var json = JSON.stringify(data);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", API_URL+'/index-services/'+id, true);
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

            xhr.onload = function () {
                var res = JSON.parse(xhr.responseText);

                if (xhr.readyState == 4 && xhr.status == "200") {

                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-success")[0].style.display = "block";

                    if (res.status === 'Success') {
                        document.getElementById("index-services-success-alert").style.display = "block";
                        document.getElementById("index-services-danger-alert").style.display = "none";
                        
                        document.getElementById("index-services-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                        setTimeout(function () {
                            document.getElementById("index-services-success-alert").style.display = "none";
                        }, 2000);

                    } else {
                        document.getElementById("index-services-danger-alert").innerHTML = '';

                        document.getElementById("index-services-danger-alert").style.display = "block";
                        document.getElementById("index-services-danger-alert").innerHTML += `<ul>
                                ${res.title !== undefined ? '<li>'+res.title+'</li>' : ''}
                                ${res.sub_title !== undefined ? '<li>'+res.sub_title+'</li>' : ''}
                                ${res.description !== undefined ? '<li>'+res.description+'</li>' : ''}
                            </ul>`;
                    }

                } else {
                    console.error(res);
                }
            }
            
            xhr.send(json);
        }
}

if (url === "index-edit-about-us") {
    var ckeditorText;
    
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/index-about-us/'+id);

    xhr.responseType = 'json';

    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;

        document.getElementById("see_more_container").innerHTML += `
            <a href="index-about-us?id=${res.id}" class="btn btn-info">Դիտել ավելին</a>
        `;

        ClassicEditor.create( document.querySelector( '#editor' ) )
        .then(editor => {
            ckeditorText = editor;
        }).catch( error => {
            console.error( error );
        });
        
        document.getElementById("title-inp").value = res.title;
        document.getElementById("editor").innerHTML = res.description;
        document.getElementById("key_word").value = res.key_word;
        document.getElementById("default-image").src = 'http://localhost/petct-armenia/website/petct-front/img/about_us/'+res.img;

        document.getElementById("default-video").src = 'http://localhost/petct-armenia/website/petct-front/img/about_us/'+res.video;

        document.getElementById("editing-index-slide-loader").remove();
        document.getElementById("editing-form").style.display = "block";

        document.getElementById('default-image').addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "block";
            document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
        });
        
        document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "none";
        });
        
        //Image Set
        document.getElementById("image-inp").addEventListener('change', function() {
            var reader = new FileReader();
            reader.onload = (e) => { 
                document.getElementById("default-image").src = e.target.result; 
            }
            reader.readAsDataURL(this.files[0]); 
        });

        document.getElementById("video-inp").addEventListener('change', function() {
            var reader = new FileReader();
            reader.onload = (e) => { 
                document.getElementById("default-video").src = e.target.result; 
            }
            reader.readAsDataURL(this.files[0]);
        });

        //Update function
        var uploadForm = document.getElementById('editing-form');

        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            document.getElementById("description-inp").value = ckeditorText.getData();

            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-success")[0].style.display = "none";

            var formData = new FormData(this);

            $.ajax({
                type: 'POST',
                url:  API_URL + "/index-about-us-update/"+res.id,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: (data) => {
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-success")[0].style.display = "block";

                    if (data.status === "Success") {
                        document.getElementById("index-slider-edit-danger-alert").style.display = "none";
                        document.getElementById("index-slider-edit-success-alert").style.display = "block";
                        document.getElementById("index-slider-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                        
                        $('html, body').animate({scrollTop: '0px'}, 500, function() {
                            setTimeout(function () {
                                document.getElementById("index-slider-edit-success-alert").style.display = "none";
                            }, 2000);
                        });
                    } else {
                        document.getElementById("index-slider-edit-danger-alert").innerHTML = '';

                        document.getElementById("index-slider-edit-danger-alert").style.display = "block";
                        document.getElementById("index-slider-edit-danger-alert").innerHTML += `<ul>
                                ${data.title        !== undefined ? '<li>'+data.title+'</li>' : ''}
                                ${data.description  !== undefined ? '<li>'+data.description+'</li>' : ''}
                            </ul>`;
                    
                        $('html, body').animate({scrollTop: '0px'}, 500, function() {
                            setTimeout(function () {
                                document.getElementById("index-slider-edit-success-alert").style.display = "none";
                            }, 2000);
                        });
                    }
                },
                error: function(err) {
                    console.error(err);
                }
            });

        });
    };
}

if (url === "index-services") {
    var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/index-services/'+id);

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            
            document.getElementById("content-title").innerText = setLang(xhr.response.lang_id);            
            document.getElementsByClassName("card-body")[0].innerHTML += `
            <strong>Վերնագիր</strong>
            <p>${xhr.response.title}</p>
            
            <strong>Ենթավերնագիր</strong>
            <p>${xhr.response.sub_title}</p>

            <strong>Նկարագրություն</strong>
            ${xhr.response.description}
            
            <a href="index-services-edit?id=${xhr.response.id}" class="btn btn-secondary">Փոխել</a>`;
            
            document.getElementById("editing-index-slide-loader").remove();
        };
}