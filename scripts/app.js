// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container')
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/


  document.getElementById('butAdd').addEventListener('click', function() {
    // Open/show the add new city dialog
    app.toggleAddDialog(true);
  });

  document.getElementById('butAddCity').addEventListener('click', function() {
    // Add the newly selected city
    var selectInput = document.getElementById('searchName');
    var key = selectInput.value;
    var selectedColleague  = app.colleagueList.find(function(e)
    {
      return e.name == key;
    });

    if (!app.selectedColleagues) {
      app.selectedColleagues = [];
    }
    app.updateColleagueCard(selectedColleague);
    app.selectedColleagues.push(selectedColleague);
    app.saveSelectedColleagues();
    app.toggleAddDialog(false);
  });

  document.getElementById('butAddCancel').addEventListener('click', function() {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    document.getElementById('searchName').value = "";
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateColleagueCard = function(data) {

    var card = app.visibleCards[data.id];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.name').textContent = data.name;
      card.querySelector('.birthday').textContent = data.birthday;
      card.querySelector('.skypeId').textContent = data.skypeId;
      card.querySelector('.ext').textContent = data.extn;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.id] = card;
    }

    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/





  // TODO add saveSelectedCities function here
  // Save list of cities to localStorage.
  app.saveSelectedColleagues = function() {
    var selectedColleagues = JSON.stringify(app.selectedColleagues);
    localStorage.selectedColleagues = selectedColleagues;
  };


  app.getColleaguesList = function()
  {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.data;
          app.colleagueList = results;
          var list = [];
          for(var i=0;i<results.length;i++)
          {
            list.push(results[i].name);
          }
          var input = document.getElementById("searchName");
          app.nameList = new Awesomplete(input, {list:list});
        }
      }
    };
    request.open('GET', '../json/colleagues.json');
    request.send();
  };


  /*
   * Fake weather data that is presented when the user first uses the app,
   */
  var initialColleague = {
     "name": "Atul",
      "extn": "201",
      "skypeId": "atulk",
      "id":"1",
      "birthday":"Oct 23"
  };


  // TODO add startup code here
  app.selectedColleagues = localStorage.selectedColleagues;
  if (app.selectedColleagues) {
    app.selectedColleagues = JSON.parse(app.selectedColleagues);
    app.selectedColleagues.forEach(function(obj) {
      app.updateColleagueCard(obj);
    });
  } else {
    /* The user is using the app for the first time*/
    app.updateColleagueCard(initialColleague);
    app.selectedColleagues = [initialColleague];
    app.saveSelectedColleagues();
  }
  app.getColleaguesList();





  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
