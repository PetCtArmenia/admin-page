if (url === "email") {
    var xhr = new XMLHttpRequest();

        xhr.open('GET', API_URL + '/email');

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            var res = xhr.response;
           
            for (var i = 0; i < res.length; i++) {
                document.getElementById("email-table").innerHTML += `
                    <tr>
                        <td>${res[i].name}</td>
                        
                        <td>${res[i].email}</td>
                        
                        <td>
                            <a href="email-more?id=${res[i].id}" class="btn btn-info">Դիտել ավելին</a>
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
                        xhr.open("DELETE", API_URL + '/email/'+element.getAttribute("data-id"), true);
            
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

if (url === "email-more") {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', API_URL + '/email/'+id);

    xhr.responseType = 'json';

    xhr.send();

    xhr.onload = function() {            
        document.getElementsByClassName("card-body")[0].innerHTML += `
            <strong>Անուն</strong>
            <p>${xhr.response.name}</p>

            <strong>Ազգանուն</strong>
            <p>${xhr.response.surname}</p>

            <strong>Էլ հասցե</strong>
            <p>${xhr.response.email}</p>

            <strong>Նկարագրություն</strong>
            <p>${xhr.response.text}</p>
        `;

        document.getElementById("email-loader").remove();
    };

}