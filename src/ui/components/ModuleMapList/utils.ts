import {IModuleMapInfo} from "./type";
import {IModuleMap} from '../../../api/type';
import {includes} from '../../../utils';
import {getDisabledOverrides, getOverrideMap} from '../../../api';

// 获取module的url
export const toUrlStr = (mod: IModuleMapInfo) => {
    return mod.overrideUrl || mod.defaultUrl;
}

// 通过module的url构造出完整的地址
export const toURL = (urlStr: string) => {
    try {
        return new URL(urlStr, location.origin + "/");
    } catch {
        return null;
    }
}
  
// 获取module的url对应的host信息
export const toDomain = (mod: IModuleMapInfo) => {
    const urlStr = toUrlStr(mod);
    const url = toURL(urlStr);
    return url ? url.host : urlStr;
}

//按照module的名称进行排序
export const sorter = (first: IModuleMapInfo, second: IModuleMapInfo) => {
    if (first.moduleName > second.moduleName) {
        return 1;
    }
    if (first.moduleName < second.moduleName) {
        return -1;
    }
    return 0;
}

export const toFileName = (mod: IModuleMapInfo) => {
    const urlStr = toUrlStr(mod);
    const url = toURL(urlStr);
    return url ? url.pathname.slice(url.pathname.lastIndexOf("/") + 1) : urlStr;
}

// 根据searchName对module进行过滤
export const filterModuleNames = (moduleName: string, searchName: string) => {
    return searchName.trim().length > 0
        ? includes(moduleName, searchName)
        : true;
};

// 获取被覆盖的module信息
export const getOverriddenModulesInfo = (
    notOverriddenMap: IModuleMap,
    searchName: string
) => {
    const overrideMap = getOverrideMap(true).imports;
    const disabledModules = getDisabledOverrides();
    const notOverriddenKeys = Object.keys(notOverriddenMap.imports);
    const overriddenModules: IModuleMapInfo[] = [];
    notOverriddenKeys.filter(moduleName => filterModuleNames(moduleName, searchName))
        .forEach(moduleName => {
            const mod: IModuleMapInfo = {
                moduleName,
                defaultUrl: notOverriddenMap.imports[moduleName] || '',
                overrideUrl: overrideMap[moduleName] || '',
                disabled: includes(disabledModules, moduleName),
            };
            if (!mod.disabled && overrideMap[moduleName]) {
                overriddenModules.push(mod);
            }
        })
    Object.keys(overrideMap)
        .filter(moduleName => filterModuleNames(moduleName, searchName))
        .forEach(moduleName => {
            if (!includes(notOverriddenKeys, moduleName)) {
                const mod = {
                  moduleName,
                  defaultUrl: '',
                  overrideUrl: overrideMap[moduleName] || '',
                  disabled: includes(disabledModules, moduleName),
                };
                if (!mod.disabled) {
                    overriddenModules.push(mod);
                }
            }
        })
    overriddenModules.sort(sorter);
    return overriddenModules;
}

// 获取置为disabled的module信息
export const getDisabledOverridesInfo = (
    notOverriddenMap: IModuleMap,
    searchName: string
) => {
    const overrideMap = getOverrideMap(true).imports;
    const disabledModules = getDisabledOverrides();
    const notOverriddenKeys = Object.keys(notOverriddenMap.imports);
    const disabledOverrides: IModuleMapInfo[] = [];
    notOverriddenKeys.filter(moduleName => filterModuleNames(moduleName, searchName))
        .forEach(moduleName => {
            const mod: IModuleMapInfo = {
                moduleName,
                defaultUrl: notOverriddenMap.imports[moduleName] || '',
                overrideUrl: overrideMap[moduleName] || '',
                disabled: includes(disabledModules, moduleName),
            };
            if (mod.disabled) {
                disabledOverrides.push(mod)
            }
        })
    Object.keys(overrideMap)
        .filter(moduleName => filterModuleNames(moduleName, searchName))
        .forEach(moduleName => {
            if (!includes(notOverriddenKeys, moduleName)) {
                const mod = {
                  moduleName,
                  defaultUrl: '',
                  overrideUrl: overrideMap[moduleName] || '',
                  disabled: includes(disabledModules, moduleName),
                };
                if (mod.disabled) {
                    disabledOverrides.push(mod);
                }
            }
        })
    disabledOverrides.sort(sorter);
    return disabledOverrides;
}

// 获取默认的module信息
export const getDefaultModulesInfo = (
    notOverriddenMap: IModuleMap,
    searchName: string
) => {
    const overrideMap = getOverrideMap(true).imports;
    const disabledModules = getDisabledOverrides();
    const notOverriddenKeys = Object.keys(notOverriddenMap.imports);
    const defaultModules: IModuleMapInfo[] = [];
    notOverriddenKeys.filter(moduleName => filterModuleNames(moduleName, searchName))
        .forEach(moduleName => {
            const mod: IModuleMapInfo = {
                moduleName,
                defaultUrl: notOverriddenMap.imports[moduleName] || '',
                overrideUrl: overrideMap[moduleName] || '',
                disabled: includes(disabledModules, moduleName),
            };
            if (!mod.disabled && !overrideMap[moduleName]) {
                defaultModules.push(mod);
            }
        })
    defaultModules.sort(sorter)
    return defaultModules;
}