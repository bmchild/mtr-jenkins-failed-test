var JENKINS_URL = "http://ci.crengland.com";
var PROJECT_NAME = "cre_service_tier";

/** Parses Jenkins API results.data and returns list of failures */
var parseFailures = function(data) {
  var failures = [];

  data.childReports.forEach(function(childReport) {
    childReport.result.suites.forEach(function(suite){
      suite.cases.forEach(function(test){
        if(test.status === "FAILED") {
          failures.push( {"className": test.className, "testName": test.name, "status": test.status} );
        }
      });
    });
  });
  return failures;
};

if (Meteor.isClient) {

  Session.setDefault("failedTests", []);

  var updateTemplates = function() {
    Meteor.call("getFailingTests", function(error, results) {
      if (!error) {
        Session.set("failedTests", parseFailures(results.data));
      }
     });
  };
  updateTemplates();
  Meteor.setInterval(updateTemplates, 120000); // update every 2 minutes

  Template.body.helpers({
    failedTests: function() {return Session.get("failedTests");},
    projectName: PROJECT_NAME
  });

}

if (Meteor.isServer) {
  var SERVICE_URL = JENKINS_URL + "/job/" + PROJECT_NAME + "/lastBuild/testReport/api/json?tree=failCount,childReports[result[suites[cases[className,name,status]]]]";

  Meteor.startup(function () {
    
  });

  Meteor.methods({
    getFailingTests: function() {
      this.unblock();
      console.log("getting " + SERVICE_URL);
      return Meteor.http.get(SERVICE_URL);
    },
    getProjectName: function() {
      return PROJECT_NAME;
    }
  });
}
