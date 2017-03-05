import wakeDecorator from '../../decorators/wake';

const getWake = (globals) => {
    const appWake = ()=>{}/* replace me */;

    const wake = wakeDecorator(globals, appWake);
    return wake;
};

export default getWake;
