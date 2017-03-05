import initDecorator from '../../decorators/init'

const getInit = (globals) => {

    /** Enter Init Code Here */
    const appInit = ()=>{}/* replace me */;

    const init = initDecorator(globals, appInit);
    return init;
};

export default getInit;