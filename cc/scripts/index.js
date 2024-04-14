document.addEventListener("DOMContentLoaded", function() {

  const nameMap = new Map();
  nameMap.set("smith", {title: "The Wealth of Nations", name: "Adam Smith", surname: "Smith", image: "https://s3.ap-south-1.amazonaws.com/img.braingainmag.com/landingPage/th_4282.jpg"});
  nameMap.set("kant", {title: "Groundwork of the Metaphysics of Morals", name: "Immanuel Kant", surname: "Kant", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.albaeditorial.es%2Fwp-content%2Fuploads%2F2020%2F10%2FImmanuel-Kant-pepe-150x150.jpg&f=1&nofb=1&ipt=81cd06f9b03960fffff2c441e4c8303a729277a6fb3272dde617a29fa285a17f&ipo=images"});
  nameMap.set("wollstonecraft", {title: "A Vindication of the Rights of Woman", name: "Mary Wollstonecraft", surname: "Wollstonecraft", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.edizionispartaco.com%2Fwp-content%2Fuploads%2F2015%2F06%2FMary-Wollstonecraft-150x150.jpg&f=1&nofb=1&ipt=fcc74576ef92d207b76f59d473f350b9059c56a6ece8cecc0fa7f6a12939be50&ipo=images"});
  nameMap.set("tocqueville", {title: "Democracy in America ", name: "Alexis de Tocqueville", surname: "Tocqueville", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdl6pgk4f88hky.cloudfront.net%2F2023%2F04%2FAlexis_de_Tocqueville_Theodore_Chasseriau_-_Versailles-135x180.jpg&f=1&nofb=1&ipt=7355ce37ebe49e0ca30a9bd080822fad3211e408a91baccb21f822aeda8d52e5&ipo=images"});
  nameMap.set("mill", {title: "On Liberty, Utilitarianism & Other Essays", name: "John Stuart Mill", surname: "Mill", image: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.goodtherapy.org%2Fdbimages%2Fmill.jpg&f=1&nofb=1&ipt=14f62b4930aad7956d5f05b2a687e09d31fdb5ff92ab272420b8a41962da1f3e&ipo=images"});
  nameMap.set("marx", {title: "The Marx-Engels Reader", name: "Karl Marx", surname: "Marx", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F1.bp.blogspot.com%2F_eDwLxiF6h2I%2FTJp5QKiIm-I%2FAAAAAAAAAs4%2FSUJYrcpJ0uU%2Fs1600%2FMARX.jpg&f=1&nofb=1&ipt=b188cd41854dad598ab993991f31ae8c45923b806842949ad770dc76d3e03ec4&ipo=images"});
  nameMap.set("nietzche", {title: "On the Genealogy of Morals & Ecce Homo", name: "Friedrich Nietzsche", surname: "Nietzsche", image: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.onelittleangel.com%2Fcommon%2Fimages%2Fauteur%2FNietzsche-238.jpg&f=1&nofb=1&ipt=ac7cc7e45de7b66ac71f8c4ca8dd419edef869651ba00744ebfcb109db230e4e&ipo=images"});
  nameMap.set("dubois", {title: "The Souls of Black Folk", name: "W. E. B. Du Bois", surname: "Du Bois", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.theatlantic.com%2Fthumbor%2FmLrruD4MCXoWS_rYKjC7Q0QEFhk%3D%2F144x144%2Fmedia%2Fimg%2Fauthors%2F2022%2F07%2F6_WEB_Du_Bois_514697730_sq_crop-1%2Foriginal.jpg&f=1&nofb=1&ipt=3907acf08cd14d260eb0393447588369d9380613e9b7a0ca496bc26002db1f49&ipo=images"});
  nameMap.set("ambedkar", {title: "Annihilation of Caste", name: "B. R. Ambedkar", surname: "Ambedkar", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi0.wp.com%2Fhindi.gktoday.in%2Fwp-content%2Fuploads%2F2019%2F01%2Fambedkar.png%3Fssl%3D1&f=1&nofb=1&ipt=1cf687bf5bb448cc621eaa150e17da5f59a500067bb01fce1d698b86ce8bada9&ipo=images"});
  nameMap.set("fanon", {title: "The Wretched of the Earth", name: "Frantz Fanon", surname: "Fanon", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Frepeatingislands.files.wordpress.com%2F2021%2F01%2Ffanon.png%3Fw%3D137&f=1&nofb=1&ipt=3c9ef3ff8e4a7839c5afe9fcadc67b2ae0daf020a88b7164586ffca5ba1377b4&ipo=images"});
  nameMap.set("arendt", {title: "Crises of the Republic", name: "Hannah Arendt", surname: "Arendt", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thequotes.net%2Fwp-content%2Fuploads%2F2014%2F10%2Fhannah-arendt-150x150.jpg&f=1&nofb=1&ipt=96927fd7543e3687673d62381c470a6a739585cfaf2dcbf616abc458e6a5145f&ipo=images"});
  nameMap.set("foucault", {title: "Discipline & Punish", name: "Michel Foucault", surname: "Foucault", image: "https://www.sigloxxieditores.com/media/sigloxxi/images/thumbs/author-72766-130x175.jpg"});

  const opinionMap = new Map();
  opinionMap.set("defenseofmill", {title: "A Defense of Mill", author: "Griffin Newbold", date: "April 1, 2024"});
  opinionMap.set("onthemanwhokilledgod", {title: "On the Man Who Killed God", author: "Griffin Newbold", date: "April 23, 2024"});
  opinionMap.set("thecycleofcolonialism", {title: "The Cycle of Colonialism", author: "Griffin Newbold", date: "April 16, 2024"});

  const debateMap = new Map();
  debateMap.set("smithvmarx", {title: "Smith V. Marx", author: "Griffin Newbold", date: "April 18, 2024"});
  debateMap.set("womenofideals", {title: "Women of Ideals", author: "Griffin Newbold", date: "April 25, 2024"});
  debateMap.set("tbd", {title: "TBD", author: "Griffin Newbold", date: "May 2, 2024"});
  
  const authorURIs = [
    "/cc/authors/smith.html",
    "/cc/authors/kant.html",
    "/cc/authors/wollstonecraft.html",
    "/cc/authors/tocqueville.html",
    "/cc/authors/mill.html",
    "/cc/authors/marx.html",
    "/cc/authors/nietzche.html",
    "/cc/authors/dubois.html",
    "/cc/authors/ambedkar.html",
    "/cc/authors/fanon.html",
    "/cc/authors/arendt.html",
    "/cc/authors/foucault.html"
  ];
  
  const debateURIs = [
    "/cc/debates/smithvmarx.html",
    "/cc/debates/womenofideals.html",
    "/cc/debates/tbd.html"
  ];

  const opinionURIs = [
    "/cc/opinions/defenseofmill.html",
    "/cc/opinions/onthemanwhokilledgod.html",
    "/cc/opinions/thecycleofcolonialism.html"
  ];

  const textURIs = [
    "/cc/works/works-by-smith.html",
    "/cc/works/works-by-kant.html",
    "/cc/works/works-by-wollstonecraft.html",
    "/cc/works/works-by-tocqueville.html",
    "/cc/works/works-by-mill.html",
    "/cc/works/works-by-marx.html",
    "/cc/works/works-by-nietzche.html",
    "/cc/works/works-by-dubois.html",
    "/cc/works/works-by-ambedkar.html",
    "/cc/works/works-by-fanon.html",
    "/cc/works/works-by-arendt.html",
    "/cc/works/works-by-foucault.html"
  ];

  // Function to get a random URI from an array
  function getRandomURI(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function returnObjectFromURI(uri, author, text, opinion) {
    if (opinion === true) {
      let periodIdx = uri.indexOf(".");
      let slashIdx = uri.indexOf("/", 5);
      return opinionMap.get(uri.substring(slashIdx+1, periodIdx));
    } else if (author === true) {
      let periodIdx = uri.indexOf(".");
      let slashIdx = uri.indexOf("/", 5);
      return nameMap.get(uri.substring(slashIdx+1, periodIdx));
    } else if (text === true) {
      let periodIdx = uri.indexOf(".");
      let slashIdx = uri.indexOf("-", 18);
      return nameMap.get(uri.substring(slashIdx+1, periodIdx));
    } else {
      let periodIdx = uri.indexOf(".");
      let slashIdx = uri.indexOf("/", 5);
      return debateMap.get(uri.substring(slashIdx+1, periodIdx));
    }
  }

  // Function to populate the <p> tag with a random entry
  function populateTag(tagId, uri) {
    let tag = document.getElementById(tagId);
    if (tag && tagId === "h-text") {
      const obj = returnObjectFromURI(uri, false, true, false);
      console.log(obj)
      tag.innerHTML = `<div class="card">
                          <div class="card-body">
                            <h5 class="card-title">${obj.title}</h5>
                            <p class="card-text">Written By: ${obj.name}</p>
                          </div>
                          <a href="${uri}" class="ref-link btn btn-primary">Explore the Text!</a>
                        </div>`;
    } else if(tag && tagId === "h-author") {
      const obj = returnObjectFromURI(uri, true, false, false);
      tag.innerHTML = `<div class="card">
                          <div class="card-body">
                            <h5 class="card-title">${obj.name}</h5>
                            <img src="${obj.image}">
                          </div>
                          <a href="${uri}" class="ref-link btn btn-primary">Learn More About ${obj.surname}</a>
                        </div>`;
    } else if(tag && tagId === "h-opinion") {
      const obj = returnObjectFromURI(uri, false, false, true);
      tag.innerHTML = `<div class="card">
                          <div class="card-body">
                            <h5 class="card-title">${obj.title}</h5>
                            <p class="card-text">Written By: ${obj.author}</p>
                            <p class="card-text">Written On: ${obj.date}</p>
                          </div>
                          <a href="${uri}" class="ref-link btn btn-primary">View OpEd!</a>
                        </div>`;
    } else {
      const obj = returnObjectFromURI(uri, false, false, false);
      tag.innerHTML = `<div class="card">
                          <div class="card-body">
                            <h5 class="card-title">${obj.title}</h5>
                            <p class="card-text">Written By: ${obj.author}</p>
                            <p class="card-text">Written On: ${obj.date}</p>
                          </div>
                          <a href="${uri}" class="ref-link btn btn-primary">Dive into the Debate!</a>
                        </div>`;
    }
  }

  populateTag("h-author", getRandomURI(authorURIs));
  populateTag("h-debate", getRandomURI(debateURIs));
  populateTag("h-opinion", getRandomURI(opinionURIs));
  populateTag("h-text", getRandomURI(textURIs));
});
