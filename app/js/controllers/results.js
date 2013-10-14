define(['angular', 'lib/patavi', 'underscore'], function(angular, patavi, _) {
  return function($scope, Workspaces) {
    var alternatives;
    var criteria;

    var run = function(state) {
      var data = _.extend(state.problem, { "preferences": state.prefs, "method": "smaa" });
      var task = patavi.submit('smaa', data);

      var successHandler = function(results) {
        $scope.$root.$safeApply($scope, function() {
          state.results = results.results;
        });
      };

      var errorHandler = function(code, error) {
        $scope.$root.$safeApply($scope, function() {
          var message = { code: (code && code.desc) ? code.desc : code,
                          cause: error };
          state.error = message;
        });
      };

      var updateHandler = function(update) {
        $scope.$root.$safeApply($scope, function() {
          var progress = parseFloat(update);
          if(progress > state.progress) {
            state.progress = progress;
          }
        });
      };

      state.progress = 0;
      task.results.then(successHandler, errorHandler, updateHandler);
      return state;
    };

    var alternativeTitle = function(id) {
      return alternatives[id].title;
    };

    var getCentralWeights = _.memoize(function(state) {
      var data = state.results.cw.data;
      var result = [];
      _.each(_.pairs(data), function(alternative) {
        var values = _.map(_.pairs(alternative[1]['w']), function(criterion, index) {
          return { x: index, label: criterion[0], y: criterion[1] };
        });
        var labels = _.map(_.pluck(values, 'label'), function(id) { return criteria[id].title; });
        result.push({ key: alternativeTitle(alternative[0]), labels: labels, values: values });
      });
      return result;
    });

    var getAlterativesByRank = _.memoize(function(state) {
      var data = state.results.ranks.data;
      var rank = parseInt(state.selectedRank);
      var values = _.map(_.pairs(data), function(alternative) {
        return {label: alternativeTitle(alternative[0]), value: alternative[1][rank] };
      });
      var name = "Alternatives for rank " + (rank + 1);
      return [{ key: name, values: values }];
    }, function(val) {
      return 31 * val.selectedRank.hashCode() + angular.toJson(val.results).hashCode();
    });

    var getRanksByAlternative = _.memoize(function(state) {
      var data = state.results.ranks.data;
      var alternative = state.selectedAlternative;
      var values = [];
      _.each(data[alternative], function(rank, index) {
        values.push({ label: "Rank " + (index + 1), value: [rank] });
      });
      return [{ key: alternativeTitle(alternative), values: values }];
    }, function(val) {
      return 31 * val.selectedAlternative.hashCode() + angular.toJson(val.results).hashCode();
    });

    var initialize = function(state) {
      alternatives = _.clone(state.problem.alternatives);
      criteria = _.clone(state.problem.criteria);
      var next = _.extend(state, {
        selectedAlternative: _.keys(alternatives)[0],
        selectedRank: "0",
        ranksByAlternative: getRanksByAlternative,
        alternativesByRank: getAlterativesByRank,
        centralWeights: getCentralWeights
      });
      return run(next);
    };

    Workspaces.current().then(function(workspace) {
      $scope.currentStep = initialize(workspace.state);
    });

    $scope.$apply();
  };
});
