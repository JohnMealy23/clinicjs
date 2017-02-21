/**
 *  Client script config:
 */
const $appSettings = {};

$appSettings.appName = 'Clinic JS App';

// Manage app API:
$appSettings.api = {};
$appSettings.api.protocol = 'http';
$appSettings.api.domain = 'clinicjs.org';
$appSettings.api.version = 'v1';

$appSettings.api.endpoints = {};

// Elements:
$appSettings.elemIds = {};
$appSettings.elemIds.root = 'app-root';

// Universal CSS classes
$appSettings.cssClasses = {};
$appSettings.cssClasses.hidden = 'hidden';

export default $appSettings;