const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  heroes = document.getElementById("heroes"),
  resultHeading = document.getElementById("result-heading"),
  comicSection = document.getElementById("comicSection");
  loading = document.getElementById("loading");
  comic_Count = document.getElementById("comic_Count");

let linkList;

//Display of loading screen was defined 'none'
loading.style.display = "none";

$(document).ready(function () {
  /*There are several functions inside of this section. All functions are created by same way. The data comes from Marvep API. And the request function on sever side (index.js) for data privacy.*/

  //You can search a character or characters with this function.
  $("#submit").submit(function (event) {
    event.preventDefault();

    //The contents of the divs are deleted with each click.
    comicSection.innerHTML = '';
    heroes.innerHTML = '';
    resultHeading.innerHTML = '';
    comic_Count.innerHTML = ''
    
    const $this = $(this);

    //Settimeout for loading spinner
    function loader() {
      setTimeout(function () {
        loading.style.display = "block";
      }, 10);
      setTimeout(function () {
        loading.style.display = "none";

        let data = { term: $("#search").val(), method: "regular" };
        
        //The data comes form Marvel API. And I'm requesting the data in server-side (index.js).
        $.ajax({
          url: $this.attr("action"),
          type: $this.attr("method"),
          data: data,
          success: function (message) {

            search.value = "";
            
            if (message.name == 'Error') {
              alert("Please enter a search term");
            } else {
          
              let commingData = message.data.results;
          
              if (commingData.length === 0) {
                $("#results").html(`<h4 class="mt-2 mb-0" style="color: white;">There is no character starting with "${data.term}"</h4>`);
              }
              else {
                for (hero of commingData) {
                  if (hero.description == "") {
                    resultHeading.innerHTML = `<h4 class="mt-2 mb-0" style="color: white;">Found ${commingData.length} characters starting with "${data.term}":</h4>`
                    heroes.innerHTML += `
                            <div class="card m-2" style="width:18rem;">
                              <img class="card-img-top" src="${hero.thumbnail.path + '.' + hero.thumbnail.extension}"  style="height:17rem;">
                              <div class="card-body">
                                <h5 class="card-title">${hero.name}</h5>
                                <p class="card-text" style="font-size:10px">There is no information about the hero. If you want to get some information about the hero, please search on Google or Wikipedia.</p>
              
                              </div>
                              <div class="card-footer w-100" style="bottom:0;" data-heroID="${hero.id}" formmethod="post" formaction="/btnGroup" id="off">
                                <a href="#" class="btn btn-primary" formmethod="post" formaction="/btnGroup2"  id="btn_Group">See Profile</a>
                              </div>
                            </div>
                            `
                  } else {
                    resultHeading.innerHTML = `<h4 class="mt-2 mb-0" style="color: white;">Found ${commingData.length} characters starting with "${data.term}":</h4>`
                    heroes.innerHTML += `
              <div class="card m-2 overflow-hidden" style="width:18rem;">
                <img class="card-img-top" src="${hero.thumbnail.path + '.' + hero.thumbnail.extension}"  style="height:17rem;">
                <div class="card-body">
                  <h5 class="card-title">${hero.name}</h5>
                  <p class="card-text " style="font-size:10px">${hero.description}</p>
                </div>
                <div class="card-footer w-100" style="bottom:0;" data-heroID="${hero.id}" formmethod="post" formaction="/btnGroup" id="off">
                  <a href="#" class="btn btn-primary" formmethod="post" formaction="/btnGroup2" id="btn_Group">See Profile</a>
                </div>
              </div>
              `
                  }
                }
              }
              
              //I defined eventlistener for every item. It will help connect to character details in future.
              linkList = document.getElementsByClassName('btn-primary')
              for (item of linkList) {
                item.addEventListener('click', bridgeToSingleElement)
                item.addEventListener('click', bridgeToSingleElement2)
              }
            }
          },
          error: function (error) {
            console.log(error);
          },
        });

      }, 2000);
    }
    loader()
  });

  
  //Random button: It brings random character from API to client.
  $("#random").click(function (event) {
    event.preventDefault();
    let data = { term: "", method: "random" };
    // console.log(data);
    $.ajax({
      url: $("#submit").attr("action"),
      type: $("#submit").attr("method"),
      data: data,
      success: function (message) {
        console.log(message)
        //Clear sections
        comicSection.innerHTML = '';
        heroes.innerHTML = '';
        resultHeading.innerHTML = '';
        search.value = "";
        comic_Count.innerHTML = ''
        let hero = message.data.results[0];

        if (hero.description == "") {
          heroes.innerHTML = `
          <div class="card text-center" style="width: 100rem; ">
                  <div class="row no-gutters">
                      <div class="col-auto">
                          <img src="${
            hero.thumbnail.path +
            "." +
            hero.thumbnail.extension
            }" class="img-fluid" alt="" style="width: 23rem; height:19rem">
                      </div>
                      <div class="col text-left">
                          <div class="card-block px-2">
                              <h3 class="card-title mt-3 ml-5">${hero.name}</h3>
                              <p class="card-text mt-3 ml-3">There is no information about "${hero.name}" in our database. If you want to get some information about the hero, you can visit  website of <a href="https://www.marvel.com/" target="_blank">MARVEL</a>.</p>
                              <p class="card-text ml-3" data-heroID="${hero.id}">If you want to see all comics about ${hero.name}, please <a href="#" id="randomComics" formmethod="POST" formaction="/randomComics"> click here! </a> </p>
                          </div>
                          <div class="card-footer w-100 text-muted text-right d-none d-md-block" style="bottom:0; position:absolute;">
                              Data provided by Marvel. © 2020 Marvel
                          </div>
                      </div>
                  </div>
            </div>`;
        } else {
          heroes.innerHTML = `
          <div class="card text-center" style="width: 100rem; ">
                  <div class="row no-gutters">
                      <div class="col-auto">
                          <img src="${
            hero.thumbnail.path +
            "." +
            hero.thumbnail.extension
            }" class="img-fluid" alt="" style="width: 23rem; height:19rem">
                      </div>
                      <div class="col text-left">
                          <div class="card-block px-2">
                              <h3 class="card-title mt-3">${hero.name}</h3>
                              <p class="card-text">${hero.description}</p>
                              <p class="card-text" data-heroID="${hero.id}">If you want to see all comics about ${hero.name}, please <a href="#" id="randomComics" formmethod="POST" formaction="/randomComics"> click here! </a> </p>
                          </div>
                          <div class="card-footer w-100 text-muted text-right d-none d-md-block" style="bottom:0; position:absolute;">
                              Data provided by Marvel. © 2020 Marvel
                          </div>
                      </div>
                  </div>
            </div>`;
        }

        document.getElementById('randomComics').addEventListener('click', randomComicsListener)

      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  //With the help of this function, you can see all the comic books about the random character.
  function randomComicsListener(event) {
    event.preventDefault();
    let data = { heroid: event.path[1].getAttribute("data-heroID"), method: "" };

    $.ajax({
      url: $("#randomComics").attr("formaction"),
      type: $("#randomComics").attr("formmethod"),
      data: data,
      success: function (message) {
        console.log(message)
        //Clear sections
        comicSection.innerHTML = '';
        resultHeading.innerHTML = '';
        search.value = "";
        comic_Count.innerHTML = ''

        const comics = message.data.results;

        if (comics.length === 0) {
          comic_Count.innerHTML = `<h4 class="mt-2 mb-0" style="color: white;">There are no comics about this character in Marvel database.</h4>`
        }

        else {
          for (item of comics) {
            let charList = [];
            let creatorList = [];
            for (element of item.characters.items) {
              charList.push(element.name);
            }
            for (element of item.creators.items) {
              creatorList.push(element.name);
            }
            comic_Count.innerHTML = `<h4 class="mt-2 mb-0" style="color: white;">Found ${comics.length} comics about this character:</h4>`
            comicSection.innerHTML += `
        <div class="card-fluid col-lg-4 col-md-3 col-12 h-100 mt-3" id="comicCards">
          <a id="comic_card" href="#"><img src="${
              item.thumbnail.path + "." + item.thumbnail.extension
              }" class="card-img-top" alt="" style="height:34rem"></a>
          <div class="card-body" style="height:28rem;">
            <h5 class="card-title">${item.title}</h5>
            <p style="font-size: 12px;" class="card-text mb-0">${
              item.description
              }</p>
            <p style="font-size: 12px;" class="card-text text-muted mt-1 ">Characters: ${charList} </p>
            <p style="font-size: 12px;" class="card-text text-muted">Creators: ${creatorList} </p>
            <div class="card-footer text-center" style="bottom:0; position:absolute;">
              <small style="line-height: 1;" class="text-muted"> Data provided by Marvel. © 2020 Marvel </small>
            </div>
          </div>
        </div>`;
            charlist = [];
            creatorList = [];
          }
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
  };

  //You remember that we assign a specific 'id' to each character above. Thanks to these 'id's, we can reach the content of the characters right here: 

  function bridgeToSingleElement(e) {
    e.preventDefault();
    let data = { heroid: e.path[1].getAttribute("data-heroID"), method: "" };
    $.ajax({
      url: $("#off").attr("formaction"),
      type: $("#off").attr("formmethod"),
      data: data,
      dataType: "json",
      success: function (message) {

        //Clear sections
        comicSection.innerHTML = '';
        heroes.innerHTML = '';
        resultHeading.innerHTML = '';
        search.value = "";
        comic_Count.innerHTML = ''

        const hero = message.data.results[0];
        heroes.innerHTML = `
            <div class="card text-center" style="width: 100rem; ">
                    <div class="row no-gutters">
                        <div class="col-auto">
                            <img src="${
          hero.thumbnail.path +
          "." +
          hero.thumbnail.extension
          }" class="img-fluid" alt="" style="width: 20rem; height:19rem">
                        </div>
                        <div class="col text-left">
                            <div class="card-block px-2">
                                <h3 class="card-title mt-3">${hero.name}</h3>
                                <p class="card-text">There is no information about "${
          hero.name
          }" in our database. If you want to get some information about the hero, you can visit website of <a href="https://www.marvel.com/" target="_blank">MARVEL</a>.</p>
                            </div>
                            <div class="card-footer w-100 text-muted text-right d-none d-md-block" style="bottom:0; position:absolute;">
                                Data provided by Marvel. © 2020 Marvel
                            </div>
                        </div>
                    </div>
              </div>`;
      }
    });
  }

  function bridgeToSingleElement2(e) {
    e.preventDefault();
    let data = { heroid: e.path[1].getAttribute("data-heroID"), method: "" };
    $.ajax({
      url: $("#btn_Group").attr("formaction"),
      type: $("#btn_Group").attr("formmethod"),
      data: data,
      dataType: "json",
      success: function (message) {

        //Clear sections
        comicSection.innerHTML = '';
        resultHeading.innerHTML = '';
        search.value = "";
        comic_Count.innerHTML = ''

        const comics = message.data.results;

        for (item of comics) {
          let charList = [];
          let creatorList = [];
          for (element of item.characters.items) {
            charList.push(element.name);
          }
          for (element of item.creators.items) {
            creatorList.push(element.name);
          }
          comic_Count.innerHTML = `<h4 class="mt-2 mb-0" style="color: white;">Found ${comics.length} comics about this character:</h4>`
          comicSection.innerHTML += `
          <div class="card-fluid col-lg-4 col-md-3 col-12 h-100 mt-3" id="comicCards">
            <a id="comic_card" href="#"><img src="${
            item.thumbnail.path + "." + item.thumbnail.extension
            }" class="card-img-top" alt="" style="height:34rem"></a>
            <div class="card-body" style="height:28rem;">
              <h5 class="card-title">${item.title}</h5>
              <p style="font-size: 12px;" class="card-text mb-0">${
            item.description
            }</p>
              <p style="font-size: 12px;" class="card-text text-muted mt-1 ">Characters: ${charList} </p>
              <p style="font-size: 12px;" class="card-text text-muted">Creators: ${creatorList} </p>
              <div class="card-footer text-center" style="bottom:0; position:absolute;">
                <small style="line-height: 1;" class="text-muted"> Data provided by Marvel. © 2020 Marvel </small>
              </div>
            </div>
          </div>`;
          charlist = [];
          creatorList = [];
        }
      }
    });
  }
});
