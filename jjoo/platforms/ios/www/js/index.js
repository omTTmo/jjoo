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
        document.getElementById('browse').addEventListener("click",app.browseFolder);
    },
    browseFolder: function() {
         var path = cordova.file.externalRootDirectory;
        function listPath(myPath){
          window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
               var directoryReader = dirEntry.createReader();
               directoryReader.readEntries(onSuccessCallback,onFailCallback);
          });

          function onSuccessCallback(entries){
            var el = document.getElementById("select-demo");
            el.style.display = 'block';
                var html = '';
                for (i=0; i<entries.length; i++) {
                   var row = entries[i];
                   if(row.isDirectory && row.name.indexOf('.')){
                        // We will draw the content of the clicked folder
                        html += '<li class="folder" id="'+row.name+'">'+row.name+'</li>';
                        // document.getElementById("select-demo").innerHTML += html;

                   }
                } //end for
                el.innerHTML = html;
                var lists = document.getElementsByClassName('folder');
                for (var i = 0; i < lists.length; i++) {
                    var children = lists[i].addEventListener('click', function(){
                        var getSave = localStorage.getItem("saveFolder");
                        if ( getSave == undefined || getSave == null) {
                            localStorage.setItem( "saveFolder",this.getAttribute('id') );
                            alert("Saving in: " + localStorage.getItem("saveFolder") );
                            el.style.display = 'none';
                        }else{
                            navigator.notification.confirm(getSave, app.onConfirm, "Currently saving in:", ['Select new folder', 'Cancel']);
                            // el.innerHTML = '<p class="select">Currently saving in:<br><span>"' + getSave + '"</span><br> Change?</p><br><div class="content"><button id="yes" class="button choose">Yes</button></div>';
                        }
                    })
                } //end for
          }

          function onFailCallback(e){
            alert(e);
          }
        }

        function getFilepath(thefilepath){
                alert(thefilepath);
        }
        listPath(path);
    },
    onConfirm: function(button) {
        if(button == 1) {
            localStorage.removeItem('saveFolder');
        }else{
            document.getElementById("select-demo").style.display = 'none';
        }
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

        var folderName = localStorage.getItem("saveFolder");
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