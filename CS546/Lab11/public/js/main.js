/* 
All of the functionality will be done in this client-side JS file.  
You will make client - side AJAX requests to the API and use jQuery to target and create elements on the page.

1. Page load: When the page loads, you will query the Marvel to get the list of 100 characters 
(Look up using the limit url parameter, by default, the character list returns 20 characters, 
you would include a limit URL parameter to return 100 characters from the end point and not the default of 20) using an AJAX request.  
Once the AJAX request returns the data, you will then create list items of links for each character that is returned using jQuery or the DOM API. 
The link text will be the name of the Character, and the href attribute will be set to the url for that Character from the Marvel API.  
For example, Spider-man's ID is 1011054, So the URL, the value would be: https://gateway.marvel.com:443/v1/public/characters/1011054 Links to an external site.  
For the link, you will need to call a function on the click event of the link (do not forget to preventDefault() for the default behavior for the link as the default behavior of a link is that it wants to load something (similar to how the default behavior of a form submission is to send that form data somewhere)

You will then append each list item to the characterList UL element and then show the characterList element (make sure you hide the characterDetails element).  

Endpoint to be used: https://gateway.marvel.com/v1/public/characters Links to an external site. (Remember, you need to use the limit URL parameter to return 100 characters from the API by default)

2. Search Form Submission: If there is no value for the search_term input when the form is submitted, you should not continue and instead should inform them of an error somehow. (don't forget to take into account if they just submit the form with a bunch of spaces as the value!)  If there is a value, you will first empty the list item elements in the characterList element (because there will be elements from the initial characterList still there, they are just hidden),  then query the API for that search_term using an AJAX request. Once the AJAX request returns the data, you will then create list items of links for each Character that is returned for the search term using jQuery or the DOM API.  The link text will be the name of the Character, and the href attribute will be set to the url for that Character from the Marvel API.  For example, Spider-man's ID is 1011054, So the URL, the value would be: https://gateway.marvel.com:443/v1/public/characters/1011054 Links to an external site.  For the link, you will need to call a function on the click event of the link (do not forget to preventDefault() for the default behavior for the link as the default behavior of a link is that it wants to load something (similar to how the default behavior of a form submission is to send that form data somewhere)

You will then append each list item to the characterList UL element and then show the characterList element (make sure you hide the characterDetails element).  

Endpoint to be used: https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=SEARCH_TERM_HERE Links to an external site. 

3.  Link Clicked: For the link, you will need to call a function on the click event of the link and not the default link behavior (do not forget to use preventDefault()).    When the link to a character is clicked, it will hide the characterList element, it will then empty the characterDetails  element (just in case there was Character data previously loaded into the characterDetails element). It will then make an AJAX request to the URL and fetch the data for that Character (that was the href in your link).  You will parse through the Character data returned from the AJAX request. You will create the following elements using jQuery or the DOM API:  An h1 with the character name,  an img which the src is set to the value read from thumbnail.path in the data which is a URL to an image for the character.  NOTE: The path in the data is NOT the full image path. You will need to concatenate "/portrait_uncanny.jpg" to the end of the image path in the data (see HTML example below). Please see the documentation on images.  You will have a p element that contains the character  description, a h2 that's content says "Comics"  and a ul  for the list of comics. You only need to display the comic name  as the list items: li  You will then show the characterDetails  element.  

NOTE: Not all Characters have ALL data displayed on the characterDetails  element, which will cause your application to not work correctly when a character link is clicked if it doesn't have all the needed data needed for the characterDetails element.  You will be required to check each field needed for the characaterDetails element.  If there is no value for a field, you will show "N/A" instead of that field's value on the characterDetails element.  

Endpoint to be used: https://gateway.marvel.com:443/v1/public/characters/:id Links to an external site.  (this is read from the href attribute of the link)


*/


$(document).ready(() => {
    var publicKey = 'f8834ef4848f460e57dacb7bd7a6612e';
    var privateKey = '0434c04c41e1af6741afff99d9555f919e9558ec'
    // const Marvelpublickey = 'c2c3b39e80f1c965087e4cb549dea409';
    // const Marvelprivatekey = '5a73addced65729d993a24ef8392ae138f47db5c';
    const ts = new Date().getTime();
    const stringToHash = ts + privateKey + publicKey;
    const hash = md5(stringToHash);
	//Page Load 

        $.ajax({
            url: 'https://gateway.marvel.com/v1/public/characters',
            type: 'GET',
            dataType: 'json',
            data: {
              ts:ts,
              apikey: publicKey,
              hash: hash,
              limit: 100  // Request 100 characters
            },
            success: function(response) {
              // Clear loading message
              $('#error').empty();
              $('#error').remove();
              $('#characterList').empty();
              $("#characterDetails").empty();
              $("#characterDetails").hide();

              const characters = response.data.results;

              characters.map((character)=>{
                let listItem = $('<li>');
                let link = $('<a>', {
                  text: character.name,
                  href: `https://gateway.marvel.com/v1/public/characters/${character.id}`,
                  'character-id': character.id,
                  click: function(event) {
                    event.preventDefault();
                    loadCharacterDetails(character.id);
                  }
                });
                listItem.append(link);
                $('#characterList').append(listItem);
              });
              
              $('#characterList').show();
              $('#characterDetails').hide();
              $('#homeLink').hide();
            },
            error: function(xhr, status, error) {
              console.error('Error fetching Marvel characters:', error);
            }
          });
          function loadCharacterDetails(characterId) {
            const ts = new Date().getTime();
            const stringToHash = ts + privateKey + publicKey;
            const hash = md5(stringToHash);
            $.ajax({
              url: "https://gateway.marvel.com:443/v1/public/characters",
              type: 'GET',
              dataType: 'json',
              data: {
                ts:ts,
                apikey: publicKey,
                hash: hash,
                id : characterId
              },
              success: function(response) {

                $('#error').empty();
                $('#error').remove();
                $('#characterDetails').empty();
                $('#characterList').hide();

                const character = response.data.results[0];

                //detail content
                let h1 = character.name?$('<h1>').text(character.name):$('<h1>').text('N/A');
                if(character.thumbnail){
                var img = $('<img>', {
                  src: `${character.thumbnail.path}/portrait_uncanny.jpg`,
                  alt: character.name,
                });}
                else{
                  var img = $('<img>', {
                    src: 'N/A',
                    alt: 'N/A',
                  });
                }
                let description = $('<p>').text(character.description==''? 'N/A':character.description);
                let h2 = $('<h2>').text('Comics');
                let comicsList = $('<ul>');
                
                // Check if comics N/A
                if (character.comics.items.length > 0) {
                  character.comics.items.forEach(comic => {
                    let comicItem = $('<li>').text(comic.name);
                    comicsList.append(comicItem);
                  });
                } else {
                  comicsList.append($('<li>').text('N/A'));
                }

                $('#characterDetails').append(h1, img, description, h2, comicsList);
                $('#characterDetails').show();
                $('#homeLink').show();
                
              },
              error: function(xhr, status, error) {
                console.error('Error fetching character details:', error);
              }
            });
          };
          function checkString(strVal, varName) {
            if (!strVal) throw `Error: You must supply a ${varName}!`;
            if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
            strVal = strVal.trim();
            if (strVal.length === 0)
                throw `Error: ${varName} cannot be an empty string or string with just spaces`;
            if (!isNaN(strVal))
                throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
            return strVal;
        }
        $('#searchForm').submit((event) => {
            event.preventDefault();
            $('#error').remove();
            
            var searchInput = $('#search_term').val().trim();
            try {
            searchInput = checkString(searchInput,"Character name");}
            catch(e){
                const error = $('<p>', { id: 'error' }).text(e);
              $('#searchForm').append(error);
            }
            if(searchInput){
              const ts = new Date().getTime();
              const stringToHash = ts + privateKey + publicKey;
              const hash = md5(stringToHash);
            $.ajax({
              url: 'https://gateway.marvel.com:443/v1/public/characters',
              type: 'GET',
              dataType: 'json',
              data: {
                ts:ts,
                apikey: publicKey,
                hash: hash,
                nameStartsWith: searchInput, 
              },
              success: function(response) {
                $('#characterList').empty();
                const characters = response.data.results;
                console.log(characters);
                
                if (characters.length === 0) {
                  $('#characterList').append('<li>No characters found.</li>');
                } else {
                  characters.map((character)=>{
                    const listItem = $('<li>');
                    const link = $('<a>', {
                      text: character.name,
                      href: `https://gateway.marvel.com:443/v1/public/characters/${character.id}`,
                      'character-id': character.id,
                      click: function(event) {
                        event.preventDefault();
                        loadCharacterDetails(character.id);
                      }
                    });
                    listItem.append(link);
                    $('#characterList').append(listItem);
                  })
                }
                
                $('#characterList').show();
                $('#characterDetails').hide();
                $('#homeLink').show();
              },
              error: function(xhr, status, error) {
                console.error('Error searching Marvel characters:', error);
              }
            });
            }
          }
        )
        
}
);