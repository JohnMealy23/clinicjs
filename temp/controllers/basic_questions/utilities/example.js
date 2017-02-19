const getUtilities = function(globalSettings, state, controllers, globalUtilities) {
    const appUtility = (function () {
   console.log('At your disposal:', {
       globalSettings, state, controllers, globalUtilities, this: this
   })
});;
    const scopedUtility = appUtility.bind(this);
    return scopedUtility;
};

export default getUtilities;