/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        document.getElementById('takePicture').addEventListener("click",app.takeImage);
        /**
         * This function will draw the given path.
         */
        function listPath(myPath){
          window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
               var directoryReader = dirEntry.createReader();
               directoryReader.readEntries(onSuccessCallback,onFailCallback);
          });

          function onSuccessCallback(entries){
            // alert(JSON.stringify(entries,null,4));
               for (i=0; i<entries.length; i++) {
                   var row = entries[i];
                   var html = '';
                   if(row.isDirectory){
                         // We will draw the content of the clicked folder
                         html = '<li onclick="listPath('+"'"+row.nativeURL+"'"+');">'+row.name+'</li>';
                   }else{
                         // alert the path of file
                         html = '<li onclick="getFilepath('+"'"+row.nativeURL+"'"+');">'+row.name+'</li>';
                   }

               }

                document.getElementById("select-demo").innerHTML = html;
          }

          function onFailCallback(e){
            alert(e);
          }
        }

        function getFilepath(thefilepath){
                alert(thefilepath);
        }
        listPath('file:///storage/emulated/0');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    },
    takeImage: function(){
        navigator.camera.getPicture(app.onSuccess, app.onFail, { quality: 100,
            destinationType: Camera.DestinationType.FILE_URI
        });
    },
    onSuccess: function(imageData) {
        //imageData = file:///storage/emulated/0/Android/data/com.adobe.phonegap.app/cache/123xxxxx.jpg
        window.resolveLocalFileSystemURL(imageData, app.resolveOnSuccess, app.resolveOnError);
    },

    onFail: function(message) {
        alert('Failed because: ' + message);
    },
    resolveOnSuccess: function(entry){
        //entry = {file: true, isDirectory:false, name:123xx.jpg, fullPath:/123xxx.jpg, filesyste: cache-external}
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + "jjoo.jpg";

        var folderName = "jjoo";
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
            fileSys.root.getDirectory(folderName, {create:true, exclusive: false},
            function(directory) {
                entry.moveTo(directory, newFileName,  app.successMove, app.resolveOnError);
            },
            app.resolveOnError);
        }, app.resolveOnError);

    },

    successMove: function(imageData){
    ///Do what you want with imageData.nativeURL
    alert(imageData.nativeURL);
    },

    resolveOnError: function(error){
        alert("Error" + error);
    }
};

app.initialize();