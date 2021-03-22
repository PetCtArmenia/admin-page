if (url === "gallery") {
var xhr = new XMLHttpRequest();
xhr.open('GET', API_URL + '/gallery-category');
xhr.responseType = 'json';
xhr.send();

xhr.onload = function() {
    var res = xhr.response;

    for (var i = 0; i < res.length; i++) {
        document.getElementById("gallery-filter-table").innerHTML += `
                    <tr>
                        <td>${res[i].name}</td>
                        
                        <td>${setLang(res[i].lang_id)}</td>
                        
                        <td>
                            <a href="gallery-category-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                        </td>

                        <td>
                            <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջել</a>
                        </td>
                    </tr>
                `;
    }

    document.getElementsByClassName('loader-gallery')[0].remove();

    //Delete Price Data
    for (var del = 0; del < document.getElementsByClassName("deleteBtn").length; del++) {
        document.getElementsByClassName("deleteBtn")[del].addEventListener('click', function() {
            var element = this;

            if (confirm("Համոզված եք որ ուզում եք ջնջել")) {
                var xhr = new XMLHttpRequest();
                var element = this;

                xhr.open("DELETE", API_URL + '/gallery-category-delete/' + this.getAttribute("data-id"), true);
                xhr.onload = function() {
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

function getImages() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/gallery');

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {
        var res = xhr.response;

        for (var i = 0; i < res.length; i++) {
            document.getElementById("gallery-table").innerHTML += `
                        <tr>
                            <td>
                                <img 
                                    class="default-image"
                                    width="100"
                                    src="http://localhost/petct-armenia/website/petct-front/img/gallery/${res[i].img_name}" 
                                />
                            </td>
                            
                            <td>${res[i].key_word}</td>

                            <td>${res[i].cat_name.name}</td>
                            
                            <td>
                                <a href="gallery-image-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                            </td>

                            <td>
                                <button class="btn btn-danger deleteImageBtn" data-id="${res[i].id}">Ջնջել</button>
                            </td>
                        </tr>
                    `;
        }

        //Delete Price Data
        for (var del = 0; del < document.getElementsByClassName("deleteImageBtn").length; del++) {
            document.getElementsByClassName("deleteImageBtn")[del].addEventListener('click', function() {
                var element = this;

                if (confirm("Համոզված եք որ ուզում եք ջնջել")) {
                    var xhr = new XMLHttpRequest();
                    var element = this;

                    xhr.open("DELETE", API_URL + '/gallery-category-image-delete/' + this.getAttribute("data-id"), true);
                    xhr.onload = function() {
                        var res = JSON.parse(xhr.responseText);

                        if (xhr.readyState == 4 && xhr.status == "200") {
                            element.parentElement.parentElement.remove();
                        } else {
                            console.error(res);
                        }
                    }
                    xhr.send(null);
                }
            });
        }

        document.getElementsByClassName('loader-gallery')[0].remove();

        for (var i = 0; i < document.getElementsByClassName('default-image').length; i++) {
            document.getElementsByClassName('default-image')[i].addEventListener('click', function() {
                document.getElementById("image-modal").style.display = "block";
                document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
            });
        }

        document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function() {
            document.getElementById("image-modal").style.display = "none";
        });
    }
}

getImages();
}

if (url === "gallery-category-add") {    
    function store () {
        document.getElementById("wait_loader").style.display = "block";
        document.getElementsByClassName("btn-success")[0].style.display = "none";

        var elmnt = document.querySelector('html');
        
        var data = {};
        data.name       = document.getElementById("name-inp").value;
        data.lang_id    = document.getElementById("lang-inp").value;

        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/gallery-category-add', true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = function () {
            var res = JSON.parse(xhr.responseText);

            if (xhr.readyState == 4 && xhr.status == "200") {

                document.getElementById("wait_loader").style.display = "none";
                document.getElementsByClassName("btn-success")[0].style.display = "block";

                if (res.status === "Success") {
                    document.getElementById("gallery-category-edit-success-alert").style.display = "block";
                    document.getElementById("gallery-category-edit-danger-alert").style.display = "none";
                       
                    document.getElementById("gallery-category-edit-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        elmnt.scrollTop = 0;
                    
                        setTimeout(function () {
                            document.getElementById("gallery-category-edit-success-alert").style.display = "none";
                        }, 2000);
                    }, 500);
                    
                    document.getElementById("name-inp").value = "";
                    
                } else {
                    document.getElementById("gallery-category-edit-danger-alert").innerHTML = '';

                    document.getElementById("gallery-category-edit-danger-alert").style.display = "block";
                    document.getElementById("gallery-category-edit-danger-alert").innerHTML += `<ul>
                            ${res.name !== undefined   ? '<li>'+res.name+'</li>' : ''}
                        </ul>`;
                }
            } else {
                console.error(res);
            }
        }

        xhr.send(json);
    }
}

if (url === "gallery-category-edit") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/gallery-edit/'+id);

    xhr.responseType = 'json';
    
    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;

        document.getElementById("lang-inp").innerHTML = `
            <option value="1" ${res.lang_id === 1 ? 'selected' : ''}>Am</option>
            <option value="2" ${res.lang_id === 2 ? 'selected' : ''}>En</option>
            <option value="3" ${res.lang_id === 3 ? 'selected' : ''}>Ru</option>
        `;

        document.getElementById("name-inp").value = res.name;
        
        document.getElementById("loader-gallery").remove();
        document.getElementById("editing-form").style.display = "block";
    };

    function update () {

        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("editing-form").querySelector("button").style.display = "none";

        var data = {};
        data.name = document.getElementById("name-inp").value;
        data.lang_id = document.getElementById("lang-inp").value;

        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/gallery-update/'+id, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = function () {
            var res = JSON.parse(xhr.responseText);
            
            if (xhr.readyState == 4 && xhr.status == "200") {

                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("editing-form").querySelector("button").style.display = "block";

                if (res.status === "Success") {
                    document.getElementById("gallery-category-edit-success-alert").style.display = "block";
                    document.getElementById("gallery-category-edit-danger-alert").style.display = "none";
                        
                    document.getElementById("gallery-category-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        document.getElementById("gallery-category-edit-success-alert").style.display = "none";
                    }, 2000);
                    
                } else {
                    document.getElementById("gallery-category-edit-danger-alert").innerHTML = '';

                    document.getElementById("gallery-category-edit-danger-alert").style.display = "block";
                    document.getElementById("gallery-category-edit-danger-alert").innerHTML += `<ul>
                            ${res.name          !== undefined   ? '<li>'+res.name+'</li>' : ''}
                        </ul>`;
                }
            } else {
                console.error(res);
            }
        }

        xhr.send(json)
    }

}

if (url === "add-gallery") {
    function getCategories () {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/gallery-category');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            for (var i = 0; i < xhr.response.length; i++) {
                document.getElementById("category_inp").innerHTML += `<option value="${xhr.response[i].id}">${xhr.response[i].name}</option>`;
            }
        }
    }

    getCategories();

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

    var uploadForm = document.getElementById("adding-form");

    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        document.getElementById("wait_loader").style.display = "block";
        document.getElementsByClassName("btn-primary")[0].style.display = "none";

        var formData = new FormData(this);
            formData.append('categoryId', document.getElementById("category_inp").value);
            formData.append('key_word', document.getElementById("key_word").value);

            $.ajax({
                type:'POST',
                url: API_URL + "/add-gallery",
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: (data) => {
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-primary")[0].style.display = "block";

                    if (data.status === "Success") {
                        document.getElementById("gallery-category-edit-danger-alert").style.display = "none";
                        document.getElementById("gallery-category-edit-success-alert").style.display = "block";
                        document.getElementById("gallery-category-edit-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";
                    
                        setTimeout(function () {
                            document.getElementById("gallery-category-edit-success-alert").style.display = "none";
                        }, 2000);

                        document.getElementById("image-inp").value = "";
                        document.getElementById("key_word").value = "";
                        document.getElementById("default-image").style.display = "none";
                        document.getElementById("default-image").src = "";

                    } else {
                        document.getElementById("gallery-category-edit-danger-alert").innerHTML = '';

                        document.getElementById("gallery-category-edit-danger-alert").style.display = "block";
                        document.getElementById("gallery-category-edit-danger-alert").innerHTML += `<ul>
                                ${data.img          !== undefined   ? '<li>'+data.img+'</li>' : ''}
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

if (url === "gallery-image-edit") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/gallery-image-edit/'+id);

    xhr.responseType = 'json';
    
    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;

        for (var i = 0; i < res.categories.length; i++) {
            document.getElementById("category_inp").innerHTML += `
                <option value="${res.categories[i].id}" ${res.categories[i].id == res.data.title_id ? 'selected' : ''}>
                    ${res.categories[i].name}
                </option>
            `;
        }

        document.getElementById("image-inp").addEventListener('change', function() {
            var reader = new FileReader();

            reader.onload = (e) => { 
                document.getElementById("default-image").src = e.target.result; 
            }

            reader.readAsDataURL(this.files[0]); 
        });

        document.getElementById("default-image").src = "http://localhost/petct-armenia/website/petct-front/img/gallery/"+res.data.img_name;
        document.getElementById("default-image").style.display = "block";

        document.getElementById("key_word").value = res.data.key_word;

        document.getElementById("loader-gallery").remove();
        document.getElementById("editing-form").style.display = "block";

        document.getElementById('default-image').addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "block";
            document.getElementById("image-modal").getElementsByTagName("img")[0].src = this.src;
        });

        document.getElementById("image-modal").getElementsByClassName('close')[0].addEventListener('click', function () {
            document.getElementById("image-modal").style.display = "none";
        });

        document.getElementById("editing-form").addEventListener('submit', function (e) {
            e.preventDefault();

            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("btn-success")[0].style.display = "none";

            var formData = new FormData(this);
            formData.append("title_id", document.getElementById("category_inp").value);
            formData.append("key_word", document.getElementById("key_word").value);
            
            $.ajax({
                type:'POST',
                url: API_URL + "/gallery-image-update/"+id,
                data: formData,
                cache:false,
                contentType: false,
                processData: false,
                success: (data) => {
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("btn-success")[0].style.display = "block";

                    if (data.status === "Success") {
                        document.getElementById("gallery-category-edit-danger-alert").style.display = "none";
                        document.getElementById("gallery-category-edit-success-alert").style.display = "block";
                        document.getElementById("gallery-category-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                    
                        setTimeout(function () {
                            document.getElementById("gallery-category-edit-success-alert").style.display = "none";
                        }, 2000);
                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
        });
    };
}