if (url === "contacts") {
    var xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost/petct-armenia/website/petct-back/public/api/admin/contacts');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            var res = xhr.response;
            
            for (var i = 0; i < res.length; i++) {
                document.getElementById("faq-table").innerHTML += `
                    <tr>
                        <td>${res[i].home_title}</td>

                        <td>${res[i].home_sub_title}</td>

                        <td>${res[i].phone_title}</td>

                        <td>${res[i].phone_sub_title}</td>

                        <td>${res[i].email_title}</td>

                        <td>${res[i].email_sub_title}</td>
                        
                        <td>${setLang(res[i].lang_id)}</td>
                        
                        <td>
                            <a href="contact-edit?id=${res[i].id}" class="btn btn-secondary">Փոխել</a>
                        </td>
                    </tr>
                `;
            }

            document.getElementsByClassName('loader-image-container')[0].remove();
        }
}

if (url === "contact-edit") {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost/petct-armenia/website/petct-back/public/api/admin/contact/'+id);

        xhr.responseType = 'json';
        
        xhr.send();
        
        xhr.onload = function() {
            var res = xhr.response;
            
            document.getElementById("home_title").value = res.home_title;
            document.getElementById("home_sub_title").value = res.home_sub_title;
            document.getElementById("phone_title").value = res.phone_title;
            document.getElementById("phone_sub_title").value = res.phone_sub_title;
            document.getElementById("email_title").value = res.email_title;
            document.getElementById("email_sub_title").value = res.email_sub_title;
            
            document.getElementById("editing-index-slide-loader").remove();
            document.getElementById("editing-form").style.display = "block";
        };

        function update () {
            document.getElementById("wait_loader").style.display = "block";
            document.getElementById("editing-form").querySelector("button").style.display = "none";

            var data = {};
            data.home_title      =   document.getElementById("home_title").value;
            data.home_sub_title =   document.getElementById("home_sub_title").value;
            data.phone_title    =   document.getElementById("phone_title").value;
            data.phone_sub_title    =   document.getElementById("phone_sub_title").value;
            data.email_title    =   document.getElementById("email_title").value;
            data.email_sub_title    =   document.getElementById("email_sub_title").value;

            var json = JSON.stringify(data);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", 'http://localhost/petct-armenia/website/petct-back/public/api/admin/update-contact/'+id, true);
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

            xhr.onload = function () {
                var res = JSON.parse(xhr.responseText);

                document.getElementById("wait_loader").style.display = "none";
                document.getElementById("editing-form").querySelector("button").style.display = "block";

                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;

                if (xhr.readyState == 4 && xhr.status == "200") {
                    if (res.status === 'Success') {
                        document.getElementById("contact-success-alert").style.display = "block";
                        document.getElementById("contact-danger-alert").style.display = "none";
                        
                        document.getElementById("contact-success-alert").innerText = "Փոփոխությունը կատարվել է հաջողությամբ";

                        setTimeout(function () {
                            document.getElementById("contact-success-alert").style.display = "none";
                        }, 2000);
                    } else {
                        document.getElementById("contact-danger-alert").innerHTML = '';

                        document.getElementById("contact-danger-alert").style.display = "block";
                        document.getElementById("contact-danger-alert").innerHTML += `<ul>
                                ${res.home_title !== undefined      ? '<li>'+res.home_title+'</li>' : ''}
                                ${res.home_sub_title !== undefined  ? '<li>'+res.home_sub_title+'</li>' : ''}
                                ${res.phone_title !== undefined     ? '<li>'+res.phone_title+'</li>' : ''}
                                ${res.phone_sub_title !== undefined ? '<li>'+res.phone_sub_title+'</li>' : ''}
                                ${res.email_title !== undefined     ? '<li>'+res.email_title+'</li>' : ''}
                                ${res.email_sub_title !== undefined ? '<li>'+res.email_sub_title+'</li>' : ''}
                            </ul>`;
                    }

                } else {
                    console.error(res);
                }
            }

            xhr.send(json);
        }
}