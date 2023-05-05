import {getUrlFromPort} from "../../../api";
import {IModuleMapInfo} from "../ModuleMapList/type";

export const getInitialOverrideUrl = (module?: IModuleMapInfo) => {
    if (!module) {
        return '';
    }
    const regex = new RegExp(`//localhost:([0-9]+)/`);
    const match = regex.exec(module.overrideUrl);
    if (match && module.overrideUrl === getUrlFromPort(module.moduleName, match[1] || '')) {
        return match[1] || '';
    } else if (module.overrideUrl) {
        return module.overrideUrl;
    }
    return '';
};