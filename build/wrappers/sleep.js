import sleepDecorator from '../../decorators/sleep';

const getSleep = (globals) => {
    const appSleep = ()=>{}/* replace me */;

    const sleep = sleepDecorator(globals, appSleep);
    return sleep;
};

export default getSleep;