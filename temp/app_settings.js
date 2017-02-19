/**
 *  Client script config:
 */
const $appSettings = {};

$appSettings.appName = 'Clinic Finder';

// If the URL entered doesn't match any of the defined routes:
$appSettings.defaultController = 'basicQuestions';

// Manage app API:
$appSettings.api = {};
$appSettings.api.protocol = 'http';
$appSettings.api.domain = 'findaclinic.org';
$appSettings.api.version = 'v1';

$appSettings.api.endpoints = {};
$appSettings.api.endpoints.clinicOptions = 'clinic';

// Elements:
$appSettings.elemIds = {};
$appSettings.elemIds.root = 'app-root';

// Universal CSS clsses
$appSettings.cssClasses = {};
$appSettings.cssClasses.hidden = 'hidden';

// Google maps creds:
$appSettings.maps = {};
$appSettings.maps.key = 'AIzaSyDzwNXXahZJee-P6VzqwUlQ_ILOOkqDOsw';
$appSettings.maps.api = {};
$appSettings.maps.api.search = 'https://maps.googleapis.com/maps/api/js';
$appSettings.maps.api.directions = 'https://www.google.com/maps/embed/v1/directions';

export default $appSettings;