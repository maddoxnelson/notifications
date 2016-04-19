/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

// Version 0.1

'use strict';


self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);

    var message = event.data.headline;
    var link = event.data.link;

    var messageforthcoming = function() {
      return self.registration.showNotification(message,{
          body: message,
          data: event.data
        });
    };

    messageforthcoming();

});


self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var url = event.notification.data.link;
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
        .then(function(windowClients) {
            return clients.openWindow(url);
        })
    );
});