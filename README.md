# mtr-jenkins-failed-test
A very simple meteor app that will monitor a Jenkins project build for any failing tests. 

Replace first two line of failed_unit_tests.js with your jenkins url and the project name you want to monitor.  
<code>
var JENKINS_URL = "<PUBLIC JENKINS URL HERE>";
var PROJECT_NAME = "<Project Name Here>";
</code>