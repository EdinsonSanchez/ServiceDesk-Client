app.directive('selectBox', function () {
    return {
        replace: true,
        restrict: 'E',
        scope: false,
        template: function (element, attrs) {
            if (!angular.isDefined(attrs.defaultLabel))
                attrs.defaultLabel = "";

            return '<div class="selectBox selector">'+
                        '<span class="help-block">{{ ngModel.name || "' + attrs.defaultLabel + '"}}</span>'+
                        '<select class="form-control select" name="' + attrs.name + '" ng-model="' + attrs.ngModel + '" ng-options="' + attrs.optexp + '"' + ((attrs.required) ? ' required' : '') + ((attrs.disabled) ? ' disabled' : '') + '></select>'+
                   '</div>';
        },
        link: function (scope, el, attrs) {
            scope.$watch(attrs.ngModel, function () {
                var model = scope.$eval(attrs.ngModel);
                //when value changes, update the selectBox text
                if (angular.isDefined(model) && angular.isDefined(model.name)) {
                    el[0].firstChild.innerText = model.name;
                }
            });
        }
    }
  });
