if (url === "price") {
var xhr = new XMLHttpRequest();

xhr.open('GET', API_URL + '/price');

xhr.responseType = 'json';

xhr.send();

xhr.onload = function() {
    var res = xhr.response;
    console.log();
    
    for (var i = 0; i < res.length; i++) {
        document.getElementById("price-table").innerHTML += `
            <tr>
                <td>${res[i].price}</td>
                
                <td>${res[i].text}</td>

                <td>${res[i].category}</td>

                <td>${res[i].discount === null ? "չկա" : res[i].discount}</td>

                <td>${setLang(res[i].lang_id)}</td>

                <td>
                    <a href="price-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                </td>

                <td>
                    <button class="btn btn-danger deleteBtn" data-id="${res[i].id}">Ջնջել</a>
                </td>
            </tr>
        `;
    }

    document.getElementsByClassName('loader-image-container')[0].remove();
    
    //Delete Price Data
    for (var del = 0; del < document.getElementsByClassName("deleteBtn").length; del++) {
        document.getElementsByClassName("deleteBtn")[del].addEventListener('click', function () {
            var element = this;

            if (confirm("Համոզված եք որ ուզում եք ջնջել")) {
                var xhr = new XMLHttpRequest();
                var element = this;

                xhr.open("DELETE", API_URL + '/price-delete/'+this.getAttribute("data-id"), true);
                xhr.onload = function () {
                    var res = JSON.parse(xhr.responseText);

                    if (xhr.readyState == 4 && xhr.status == "200") {
                        if (res.status === "Success") {
                            element.parentElement.parentElement.remove();

                            document.getElementById("price-edit-success-alert").style.display = "block";
                            document.getElementById("price-edit-danger-alert").style.display = "none";
                                
                            document.getElementById("price-edit-success-alert").innerText = "Տվյալնները ջնջնվել են հաջողությամբ";

                            setTimeout(function () {
                                document.querySelector('html').scrollTop = 0;
                                
                                setTimeout(function () {
                                    document.getElementById("price-edit-success-alert").style.display = "none";
                                }, 2000);
                            }, 500);
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

if (url === "add-price") {
    document.getElementById("add_btn").addEventListener("click", function () {

        document.getElementById("wait_loader").style.display = "block";
        document.getElementById("add_btn").style.display = "none";

        var elmnt = document.querySelector('html');
        
        var data = {};
        data.price = document.getElementById("price").value;
        data.text = document.getElementById("text").value;
        data.category = document.getElementById("category_inp").value;
        data.lang_id = document.getElementById("lang_id").value;
        data.discount = document.getElementById("discount-inp").value;
        
        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL + '/price-store', true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

        xhr.onload = function () {
            var res = JSON.parse(xhr.responseText);
            
            if (xhr.readyState == 4 && xhr.status == "200") {

                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("add_btn").style.display = "block";

                if (res.status === "Success") {
                    document.getElementById("price-edit-success-alert").style.display = "block";
                    document.getElementById("price-edit-danger-alert").style.display = "none";
                        
                    document.getElementById("price-edit-success-alert").innerText = "Ավելացումը կատարվել է հաջողությամբ";

                    setTimeout(function () {
                        elmnt.scrollTop = 0;
                    
                        setTimeout(function () {
                            document.getElementById("price-edit-success-alert").style.display = "none";
                        }, 2000);
                    }, 500);
                    
                    document.getElementById("price").value = "";
                    document.getElementById("text").value = "";
                    
                } else {
                    document.getElementById("price-edit-danger-alert").innerHTML = '';

                    document.getElementById("price-edit-danger-alert").style.display = "block";
                    document.getElementById("price-edit-danger-alert").innerHTML += `<ul>
                            ${res.price             !== undefined   ? '<li>'+res.price+'</li>' : ''}
                            ${res.text              !== undefined   ? '<li>'+res.text+'</li>' : ''}
                            ${res.lang_id           !== undefined   ? '<li>'+res.lang_id+'</li>' : ''}
                        </ul>`;
                }
            } else {
                console.error(res);
            }
        }

        xhr.send(json);
    });
}

//Pirce Edit Code
if (url === "price-edit") {
    
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/price/'+id);

    xhr.responseType = 'json';
    
    xhr.send();
    
    xhr.onload = function() {
        var res = xhr.response;

        document.getElementById("all-content").innerHTML += `
                <div class="col-md-12">
                    <div class="alert alert-success"    id="price-edit-success-alert" role="alert"></div>
                    <div class="alert alert-danger"     id="price-edit-danger-alert" role="alert"></div>

                    <div class="card">
                        <div class="card-header">
                            <strong class="card-title">Մատուցվող ծառայությունների գնացուցակ</strong>
                        </div>

                        <div class="card-body">
                            <div class="form-group">
                                <label>Գին <span class="mandatory_star">*</span></label>
                                <input value="${res.price}" id="price-inp" class="form-control">
                                <small>Առավելագույն սիմվոլների քանակը${"`"} 11</small>
                            </div>

                            <div class="form-group">
                                <label>Տեքս <span class="mandatory_star">*</span></label>
                                <textarea id="text-inp" class="form-control">${res.text}</textarea>
                            </div>

                            <div class="form-group">
                                <label>Զեղչ</label>
                                <input class="form-control" value="${res.discount === null ? "" : res.discount}" id="discount-inp">
                            </div>

                            <div class="form-group">
                                <label>Կատեգոիրա</label>
                                <select class="form-control" id="category_inp">
                                    <option value="pet"     ${res.category === 'pet'        ? 'selected' : ''}>PET/CT</option>
                                    <option value="spect"    ${res.category === 'spect'      ? 'selected' : ''}>SPECT/CT</option>
                                    <option value="ct"      ${res.category === 'ct'         ? 'selected' : ''}>CT</option>
                                </select>
                            </div>

                            <div class="form-group" id="lang_container">
                                <label>Տեքս <span class="mandatory_star">*</span></label>
                                <select class="form-control" id="lang_id">
                                    <option value="1" ${res.lang_id === 1 ? "selected" : ""}>Am</option>
                                    <option value="2" ${res.lang_id === 2 ? "selected" : ""}>En</option>
                                    <option value="3" ${res.lang_id === 3 ? "selected" : ""}>Ru</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <button type="button" id="update_btn" class="btn btn-success">Հաստատել</button>

                                <img src="../../images/loading.gif" id="wait_loader" style="width: 50px;display: none;">
                            </div>
                        </div>
                    </div>
                </div>
        `;

        document.getElementById("price-edit-slide-loader").remove();

        document.getElementById("update_btn").addEventListener("click", function () {

            document.getElementById("wait_loader").style.display = "block";
            document.getElementsByClassName("card-body")[0].querySelector("button").style.display = "none";

            var price       = document.getElementById("price-inp").value;
            var text        = document.getElementById("text-inp").value;
            var lang_id     = document.getElementById("lang_id").value;
            var category    = document.getElementById("category_inp").value;
            var discount    = document.getElementById("discount-inp").value;
                            
            var http = new XMLHttpRequest();
            var url = API_URL + '/price-edit/'+res.id;
            var params = 'price='+price+'&text='+text+'&lang_id='+lang_id+'&category='+category+'&discount='+discount;
            http.open('POST', url, true);
            http.responseType = 'json';
            
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            
            http.onreadystatechange = function() {
                if (http.readyState == 4 && http.status == 200) {
                    
                    document.getElementById("wait_loader").style.display = "none";
                    document.getElementsByClassName("card-body")[0].querySelector("button").style.display = "block";

                    if (http.response.status === "Success") {
                        document.getElementById("price-edit-success-alert").style.display = "block";
                        document.getElementById("price-edit-danger-alert").style.display = "none";
                        
                        document.getElementById("price-edit-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";
                        
                        setTimeout(function () {
                            document.getElementById("price-edit-success-alert").style.display = "none";
                        }, 2000);
                        
                    } else {
                        document.getElementById("price-edit-danger-alert").innerHTML = '';
                        
                        document.getElementById("price-edit-danger-alert").style.display = "block";
                        document.getElementById("price-edit-danger-alert").innerHTML += `<ul>
                                ${http.response.price   !== undefined   ? '<li>'+http.response.price+'</li>' : ''}
                                ${http.response.text    !== undefined   ? '<li>'+http.response.text+'</li>' : ''}
                            </ul>`;
                    }
                }
            }

            http.send(params);
        });
    };
}