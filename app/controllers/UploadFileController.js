'use strict';
app.controller('UploadFileController',
    ['$scope', 'FileUploader', 'AnexosFactory', 
    function($scope, FileUploader, AnexosFactory) {
        
        var uploader = $scope.uploader = new FileUploader({
            url: apiUrl + '/upload'
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 100;
            }
        });

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            // console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            // console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            // console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            // console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            // console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            // console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            // console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            // console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            // console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            // console.info('onCompleteItem', fileItem, response, status, headers);
            // Agregamos la ruta temporal del archivo en el servidor.
            fileItem.file.path = response.path;
        };
        uploader.onCompleteAll = function() {
            // console.info('onCompleteAll');
            uploader.sendItems();
        };

        /*** custom ***/

        // Envia los items a anexosFactory
        uploader.sendItems = function () {
            AnexosFactory.setItems(uploader);
        }

        /* watch */
        $scope.$watch('uploader.queue.length', function (newQueue, oldQueue) {
            uploader.sendItems();
        });
        /* end-watch */

        // console.info('uploader', uploader);
}]);
