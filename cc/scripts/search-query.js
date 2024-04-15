function searchFiles(event) {
  event.preventDefault();
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm !== '') {
    let encodedSearchTerm = encodeURIComponent(searchTerm);
    let searchURL = '/cc/search.html?term=' + encodedSearchTerm;
    window.location.href = searchURL;
  }
}