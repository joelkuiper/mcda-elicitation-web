define([], function() {
  var self = this;
  this.tasks = {
    'available' : [
      { id: "overview",
        title: "Overview",
        controller: "OverviewController",
        templateUrl: "overview.html",
        requires: [],
        resets: [] },
      { id: "scale-range",
        title: "Define Scale Range",
        controller: 'ScaleRangeController',
        templateUrl: "scaleRange.html",
        requires: [],
        resets: ['scale-ranges', 'partial-value-functions', 'criteria-trade-offs'] },
      { id: "partial-value-function",
        title: "Define Partial Value Functions",
        controller: 'PartialValueFunctionController',
        templateUrl: "partialValueFunction.html",
        requires: ['scale-ranges'],
        resets: ['partial-value-functions', 'criteria-trade-offs'] },
      { id: "ordinal-swing",
        title: "Ordinal Swing Elicitation",
        controller: 'OrdinalSwingController',
        templateUrl: 'ordinalSwing.html',
        requires: ['partial-value-functions'],
        resets: ['criteria-trade-offs']},
      { id: "interval-swing",
        title: "Interval Swing Elicitation",
        controller: 'IntervalSwingController',
        templateUrl: 'intervalSwing.html',
        requires: ['complete-criteria-ranking'],
        resets: ['non-ordinal-preferences']},
      { id: "exact-swing",
        title: "Exact Swing Elicitation",
        controller: 'ExactSwingController',
        templateUrl: 'exactSwing.html',
        requires: ['complete-criteria-ranking'],
        resets: ['non-ordinal-preferences']},
      { id: "results",
        title: "Results",
        controller: 'ResultsController',
        templateUrl: 'results.html',
        requires: ['scale-ranges'],
        resets: []}
    ]};

  this.defaultView = "overview";

  this.createPath = function(workspaceId, scenarioId, taskId) {
    taskId = taskId ? taskId : self.defaultView;
    return "#/workspaces/" + workspaceId + "/scenarios/" + scenarioId + "/" + taskId;
  };


  return this;
});
