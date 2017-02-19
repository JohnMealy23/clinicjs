
const utilityInits = {};

const utilitiesInit = function(appSettings, state, controllers, routes) {
    return Object.keys(utilityInits).reduce((utilities, utilityName) => {
          utilities[utilityName] = utilityInits[utilityName].call(this, appSettings, state, controllers, routes);
          return utilities;
    }, {});
};

import collapse from './collapse.js';
utilityInits.collapse = collapse;
                                
import populateMap from './populate_map.js';
utilityInits.populateMap = populateMap;
                                

export default utilitiesInit