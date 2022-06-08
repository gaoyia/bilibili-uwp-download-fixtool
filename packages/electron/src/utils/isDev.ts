import electron from "electron";
if (typeof electron === 'string') {
	throw new TypeError('Not running in an Electron environment!');
}
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV as string, 10) === 1;
export default isEnvSet ? getFromEnv : !electron.app.isPackaged;
