/*
  This is kind of a catch all file. I copied sw.js when I had everything there, now I'm cleaning up that file.
*/

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

console.log('i am a firing service worker');

var notificationInfo;

console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});
self.addEventListener('push', function(event) {
  console.log('Push message', event);
  var funk = function() {
    fetch("https://www.washingtonpost.com/graphics/politics/2016-election/primaries/schedule/data.json").then(function(response){
      return response.json().then(function(data){
        var title = "hi";
        console.log(data);
        return self.registration.showNotification(title, {  
          body: 'hello!'
        });  
      });
    }).catch(function(err){
      console.log(err);
    });
  };

  event.waitUntil(funk());


});

self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);

    var message = event.data.headline;
    var link = event.data.link;

    notificationInfo.message = message;
    notificationInfo.link = link;

    console.log(event.data)

    console.log('event',event)

    var messageforthcoming = function() {
      return self.registration.showNotification(message, {  
          body: message
          data: event.data
        });  
    };

    messageforthcoming();

});



var clickEvent = function(event) {
  console.log('Notification click: tag ', event.notification.tag);

    event.notification.close();

    console.log(event.notification.data)

    var url = event.notification.data.link;

    if (notificationInfo.link) {
      url = notificationInfo.link;
    }
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
        .then(function(windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        }).then(function(){
          //self.removeEventListener('notificationclick', clickEvent);
        })
    );
};


self.addEventListener('notificationclick', clickEvent);