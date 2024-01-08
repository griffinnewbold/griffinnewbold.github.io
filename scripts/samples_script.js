document.addEventListener('DOMContentLoaded', function () {
    const githubRepoUrl = 'https://api.github.com/repos/griffinnewbold/Teaching/contents/COMSW%201004/Spring%202024/Sample%20Code?ref=main';
  
    const githubFilesList = document.getElementById('github-files-list');
    const codeDisplay = document.getElementById('code-display');
    const toggleCodeButton = document.getElementById('toggle-code-button');
  
    async function populateGitHubFiles() {
      try {
        const response = await fetch(githubRepoUrl);
        const data = await response.json();
  
        data.forEach(file => {
          if (file.type === 'file') {
            const listItem = document.createElement('li');
            const button = document.createElement('button');
            const downloadButton = document.createElement('a');

            button.textContent = file.name;
            button.className = 'button';
            button.addEventListener('click', () => toggleCodeDisplay(file.download_url));

            downloadButton.textContent = 'Download ' + file.name; 
            downloadButton.href = file.download_url; 
            downloadButton.download = file.name; 
            downloadButton.className = 'button';

            listItem.appendChild(button);
            listItem.appendChild(downloadButton);
            githubFilesList.appendChild(listItem);
          }
        });
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      }
    }
  
    function toggleCodeDisplay(downloadUrl) {
      if (codeDisplay.style.display === 'none') {
        fetchAndDisplayCode(downloadUrl);
      } else {
        codeDisplay.style.display = 'none';
        toggleCodeDisplay(downloadUrl)
      }
    }
  
    
    async function fetchAndDisplayCode(downloadUrl) {
      try {
        const response = await fetch(downloadUrl);
        const code = await response.text();
        codeDisplay.textContent = code;
        codeDisplay.style.display = 'block';
      } catch (error) {
        console.error('Error fetching code:', error);
      }
    }
  
    
    populateGitHubFiles();
  });