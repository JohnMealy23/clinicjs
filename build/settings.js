const $globalSettings = {};

/**
 *  Server script config:
 */

$globalSettings.distFileName = 'script';
$globalSettings.controllersDirName = `controllers`;
$globalSettings.modelDirName = `models`;
$globalSettings.utilitiesDirName = `utilities`;
$globalSettings.appSettingsFilename= `app_settings.js`;
$globalSettings.replaceToken = '()=>{}/* replace me */';
$globalSettings.appSrc = './app';
$globalSettings.tempBuildDest = './temp';
$globalSettings.distPath = './public/js';
$globalSettings.protoSrc = './build/protos';
$globalSettings.wrapperSrc = './build/wrappers';
$globalSettings.decoratorDirName = 'decorators';
$globalSettings.decoratorSrc = `./build/${$globalSettings.decoratorDirName}`;
$globalSettings.controllersSrc = `${$globalSettings.appSrc}/${$globalSettings.controllersDirName}`;
$globalSettings.modelSrc = `${$globalSettings.appSrc}/${$globalSettings.modelDirName}`;
$globalSettings.utilitiesSrc = `${$globalSettings.appSrc}/${$globalSettings.utilitiesDirName }`;
$globalSettings.controllersTemp = `${$globalSettings.tempBuildDest}/${$globalSettings.controllersDirName}`;

module.exports = $globalSettings;