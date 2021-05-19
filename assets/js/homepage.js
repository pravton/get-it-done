var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    event.preventDefault();

    var userName = nameInputEl.value.trim();

    if(userName) {
        getUserRepos(userName);
        nameInputEl.value = "";
    } else {
        alert("Please enter a Github username")
    }
};



var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl)
        .then(function(response) {
        //if the connection is successful
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found!");
        }        
    })
    .catch(function(error) {
    // .catch getting chained to .then()
    alert("Unable to connect to Gitub");
    });
};

var displayRepos = function(repos, searchTerm) {
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found!";
        return;
    } 
  
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        console.log(repos[i].name);

        //create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align center";

        //create a span element to hold the repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append Container
        repoEl.appendChild(titleEl);

        //create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to containers
        repoEl.appendChild(statusEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }

    
};

userFormEl.addEventListener("submit", formSubmitHandler);
