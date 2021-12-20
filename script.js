//Definição do usuário padrão do site, no caso o do autor 
const defaultUser = 'brunobgf';

document.getElementById('search-input').value = defaultUser;


carregaPerfil(defaultUser);

// ------------------------------------------------------------------------------------------------------------------ //

let xhr, xhrRep,
    searchButton = document.getElementById('search-button'),
    searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', searchUser);

//Função para carregar o perfil

function carregaPerfil(user) {
    let xhr = new XMLHttpRequest();
    let xhrRep = new XMLHttpRequest();

    xhr.onload = function() {
            //alert('Retorno da requisição: \n' + this.responseText);

            let data = JSON.parse(this.responseText);

            //Criação do perfil utilizando a API do github

            let perfilAuthor = ` 
        <div class="card">
            <div class="card-block author-responsive">
                <div class="row">
                    <div class="col-md-4 avatar-flex">
                        <p><img src="${data.avatar_url}" class="avatar-responsive" alt=""></p>
                    </div>
                    <div class="col-sm-12 col-md-8  author-name">
                        <h2>${data.name}</h2> 
                        <span id="profile_user"  class="profile_user text-center text-lg-start"><i class="fas fa-user"></i> Profile: ${data.login}</span>
                        <span id="profile_followers" class="profile_follower text-center text-lg-start"><i class="fas fa-users"></i> Seguidores: ${data.followers} Seguindo: ${data.following}  </span>
                        

                        <p><strong>Github Bio: </strong> ${data.bio}</p>
                        <br>
            
                        <h4>Siga meus projetos no GitHub:</h4>
                    
                        <a href="${data.html_url}" target="_blank" class="btn btn-dark">GitHub Profile</a>
            
                    </div>
                </div>
            </div>
        </div>
        `;
            document.getElementById('about-me').innerHTML = perfilAuthor;
        }
        //Requisição do usuário do autor através do metodo Get
    xhr.open(`GET`, "https://api.github.com/users/brunobgf");


    //Função para fazer a requisição dos repositórios e criar os cards com os repositórios

    xhrRep.onload = function showUserRepos() {

            if (xhrRep.status == 404) return false;

            let text = '';
            let elem_change;
            let data = JSON.parse(this.responseText);
            let plural = 's';

            elem_change = document.getElementById('rep_rows');

            if (data.length == 0) elem_change.innerHTML = `<span class="col-12"><i>Não foi encontrado um respositório.</i></span>`;

            for (x = 0; x < data.length; x++) {
                let desc = '';
                let rep = data[x];
                let dateCreated = new Date(rep.created_at);
                let dateUpdated = new Date(rep.updated_at);

                if (rep.description == null) desc = "<i>No description provided.</i>";
                else desc = rep.description;

                text += `<span class="rep_card col-12 col-lg-6 d-flex justify-content-center">
                <div class="card bg-light mb-3">
                    <div class="card-header rep_title">
                        <i class="rep_iconRep far fa-folder"></i><b>${rep.name}</b>`;

                if (rep.language != null) text += `<span class="rep_lang">${rep.language}</span>`;

                text += `</div>
                    <div class="card-body">
                        <p class="card-text">${desc}</p>
                        <p class="card-text"><small class="text-muted">Criado em: ${dateCreated.toLocaleString()}
                        </br>Atualizado em: ${dateUpdated.toLocaleString()}</small></p>
                        <span class="rep_link"><button class="btn"><a href="https://github.com/${rep.owner.login}/${rep.name}" target="_blank"><i class="fab fa-github"></i>Ver repositório</a></button></span>`

                if (rep.has_pages == true) text += ` <span class="rep_link"><button class="btn"><a href="https://${rep.owner.login}.github.io/${rep.name}/" target="_blank"><i class="fas fa-tv"></i>Ver website</a></button></span>`;

                text += `</div></div></span>`;

                elem_change.innerHTML = text;
            }
        }
        //Método get onde users receberá o perfil buscado 
    xhrRep.open('GET', `https://api.github.com/users/${user}/repos`);
    xhrRep.send();

    xhr.onerror = function() {
        alert(`Erro na requisição \nCódigo ${this.status} -  ${this.statusText}`);
    }
    xhr.send();

}

//Função de busca de usuário 
function searchUser() {
    let inputValue = searchInput.value;

    carregaPerfil(inputValue);
}