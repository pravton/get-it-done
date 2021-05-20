var issuesContainerEl = document.querySelector("#issues-container");
var limitWarning = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function() {
    //grab the rep from url string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if (repoName) {
        //display the repo
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        //if no repo was given, redirect to home page
        document.location.replace("./index.html");
    }
    
};

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo +"/issues?direction=asc";

    fetch(apiUrl).then(function(response) {
        //request was successful
        if(response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

                //check if api has paginated issues
                if (response.headers.get("link")) {
                    displayWarning(repo);
                }
            })
        } else {
            //if not suucessful, redirect the user to homepage
            document.location.replace("./index.html");
            // alert("there was a problem with your request");
        }
    })
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issuesContainerEl.textContent = "This repo has no open issues!"
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        //create a link element to take users to the issue on the fithub
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        
        //append title to container
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issue is and actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)"
        }

        //append to container
        issueEl.appendChild(typeEl);


        issuesContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    limitWarning.textContent = "This repo has more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "Github to See More Issues";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to limitwarning
    limitWarning.appendChild(linkEl);
};


getRepoName();