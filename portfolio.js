const username = "sundas8124@gmail.com"; // replace with your GitHub username

fetch(https://api.github.com/users/${username}/repos)
  .then(res => res.json())
  .then(repos => {
    const projectsDiv = document.getElementById("projects");
    repos.forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description"}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
      `;
      projectsDiv.appendChild(card);
    });
  })
  .catch(err => console.log(err));