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
        document.addEventListener("click",app.takeImage);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
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