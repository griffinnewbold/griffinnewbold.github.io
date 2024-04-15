function getUrlParameter(name) {
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function displaySearchResults() {
  let searchTerm = getUrlParameter('term');
  let searchResultsDiv = document.getElementById('searchResults');

  if (searchTerm) {
    searchTerm = decodeURIComponent(searchTerm).replace(/\s/g, "");

    let files = {
      '/cc/works/works-by-ambedkar.html': 'Annihilation of Caste',
      '/cc/works/works-by-arendt.html': 'Crises of the Republic',
      '/cc/works/works-by-dubois.html': 'The Souls of Black Folk',
      '/cc/works/works-by-fanon.html': 'The Wretched of the Earth',
      '/cc/works/works-by-foucault.html': 'Discipline & Punish',
      '/cc/works/works-by-kant.html': 'Groundwork of the Metaphysics of Morals',
      '/cc/works/works-by-marx.html': 'The Marx-Engels Reader',
      '/cc/works/works-by-mill.html': 'On Liberty, Utilitarianism & Other Essays',
      '/cc/works/works-by-nietzsche.html': 'On the Genealogy of Morals & Ecce Homo',
      '/cc/works/works-by-smith.html': 'The Wealth of Nations',
      '/cc/works/works-by-tocqueville.html': 'Democracy in America',
      '/cc/works/works-by-wollstonecraft.html':'A Vindication of the Rights of Woman',
      '/cc/authors/ambedkar.html': 'B. R. Ambedkar',
      '/cc/authors/arendt.html': 'Hannah Arendt',
      '/cc/authors/dubois.html': 'W. E. B. Du Bois',
      '/cc/authors/fanon.html': 'Frantz Fanon',
      '/cc/authors/foucault.html': 'Michel Foucault',
      '/cc/authors/kant.html': 'Immanuel Kant',
      '/cc/authors/marx.html': 'Karl Marx',
      '/cc/authors/mill.html': 'John Stuart Mill',
      '/cc/authors/nietzsche.html': 'Friedrich Nietzsche',
      '/cc/authors/smith.html': 'Adam Smith',
      '/cc/authors/tocqueville.html': 'Alexis De Tocqueville',
      '/cc/authors/wollstonecraft.html': 'Mary Wollstonecraft',
      '/cc/opinions/defenseofmill.html': 'Defense of Mill',
      '/cc/opinions/onthemanwhokilledgod.html': 'On the Man Who Killed God',
      '/cc/opinions/thecycleofcolonialism.html': 'The Cycle of Colonialism',
      '/cc/debates/smithvmarx.html': "Smith v. Marx",
      '/cc/debates/womenofideals.html': "Women of Ideals",
      '/cc/debates/tbd.html': "TBD"
    };

    let matchedFiles = [];
    for (let fileName in files) {
      if (fileName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        matchedFiles.push({ fileName: fileName, title: files[fileName] });
      }
    }

    if (matchedFiles.length > 0) {
      let resultsList = document.createElement('ol');
      matchedFiles.forEach(function(file) {
        let listItem = document.createElement('li');
        let link = document.createElement('a');
        link.href = file.fileName;
        link.textContent = file.title;
        listItem.appendChild(link);
        resultsList.appendChild(listItem);
      });
      searchResultsDiv.appendChild(resultsList);
    } else {
      console.log("nope");
      let noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'No matching files found';
      searchResultsDiv.appendChild(noResultsMessage);
    }
  }
}

window.onload = displaySearchResults;

