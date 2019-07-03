angular.module('portainer.integrations.storidge')
.controller('StoridgeNodesDatatableController', ['$scope', '$controller', 'clipboard', 'Notifications', 'StoridgeNodeService', 'DatatableService',
function($scope, $controller, clipboard, Notifications, StoridgeNodeService, DatatableService) {
  angular.extend(this, $controller('GenericDatatableController', { $scope: $scope }));

  var ctrl = this;

  this.addNodeAction = function() {
    StoridgeNodeService.add()
      .then(function sucess(data) {
        ctrl.addInfo = data.content;
      })
      .catch(function error(err) {
        Notifications.error('Failure', err, 'Unable to retrieve the "add node" command');
      });
  };

  this.copyAddNodeCommand = function() {
    clipboard.copyText(ctrl.addInfo);
    $('#copyNotification').show();
    $('#copyNotification').fadeOut(2000);
  };

  this.$onInit = function() {
    this.setDefaults();
    this.prepareTableFromDataset();

    var storedOrder = DatatableService.getDataTableOrder(this.tableKey);
    if (storedOrder !== null) {
      this.state.reverseOrder = storedOrder.reverse;
      this.state.orderBy = storedOrder.orderBy;
    }

    var textFilter = DatatableService.getDataTableTextFilters(this.tableKey);
    if (textFilter !== null) {
      this.state.textFilter = textFilter;
      this.onTextFilterChange();
    }

    var storedFilters = DatatableService.getDataTableFilters(this.tableKey);
    if (storedFilters !== null) {
      this.filters = storedFilters;
    }
    if (this.filters && this.filters.state) {
      this.filters.state.open = false;
    }
  };
}]);
