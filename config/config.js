'use strict';

const app = window.app;
const configDefaults = {
  service: `{
    name: 'xxxx',
    port: 8000,
    host: 'xxx.xxxx.com',
    path: '/xxxx',
  }`,
  route: `{
    paths: ['/xxxx'],
    hosts: ['api.xxxx.com'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  }`,
};

/*
 * $scope.configs, $scope.branch and $scope.pluginConfig, among others are available from the parent scope
 * */
app.controller('KongController', ['$scope', function ($scope) {
  $scope.saving = false;

  $scope.$watch('configs[branch.name].kong.config', function (value) {
    $scope.config = value || configDefaults;
  });

  $scope.save = function () {
    $scope.saving = true;
    $scope.pluginConfig('kong', $scope.config, function () {
      $scope.saving = false;
    });
  };
}]);
