
const utilityInits = {};

const utilitiesInit = function(appSettings, state, controllers, routes) {
    return Object.keys(utilityInits).reduce((utilities, utilityName) => {
          utilities[utilityName] = utilityInits[utilityName].call(this, appSettings, state, controllers, routes);
          return utilities;
    }, {});
};


export default utilitiesInit