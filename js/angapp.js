console.log('Empieza angapp.js');
const aplic = angular.module('aplic',[])

aplic.controller('controller1',($scope,$http)=>{
    $scope.output = "titulo";
    $scope.ip = '';
    $scope.elements = '';

    $scope.passValues = (object)=>{
        document.getElementById('name').value = object.name;
        document.getElementById('quote').value = object.quote;
        document.getElementById('_id').value = object._id;
        $scope.idExist = false;
    };

    $scope.idExist = true;
    
    $scope.validateIdExist = ()=>{
        if(document.getElementById('_id').value != '')
            $scope.idExist = false;
        else
            $scope.idExist = true;
    }
    $scope.clear = ()=>{
        $scope.idExist = true;
        document.getElementById('_id').value = '';
        document.getElementById('quote').value = '';
        document.getElementById('name').value = '';
        document.getElementById('name').focus();
    }

        $http({
            method : "GET",
            url : "/getvar"
        }).then((response) => {
            $scope.elements = response.data;
        }, (response) => {
            console.log('Error!');
        });

        $http({
            method : "GET",
            url : "/getip"
        }).then( ( response ) => {
            $scope.ip = response.data.ip;
            console.log($scope.ip);
        }, ( response ) => {
            console.log('Error!');
        });


});
