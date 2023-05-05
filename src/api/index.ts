import {includes} from "../utils/includes";
import {ICustomEventType, IModuleMap, IScriptModuleInfo} from "./type";

export const moduleMapType = 'overridable-modulemap';
export const localStoragePrefix = "module-federation-override:";
export const portRegex = /^\d+$/g;
export const disabledOverridesLocalStorageKey = "module-federation-overrides-disabled";
export const overrideAttribute = "data-is-modulemap-override";
// 最后一个module import script标签
let referenceNode: HTMLScriptElement | undefined;

// 创建一个空的module map
export const createEmptyModuleMap = (): IModuleMap => {
    return { imports: {}, scopes: {} };
}

export const fireChangedEvent = () => {
    fireEvent("change");
}

// 判断当前module是否是disabled状态
export const getModuleIsDisabled = (moduleName: string) => {
    return includes(getDisabledOverrides(), moduleName);
}

// 根据port和moduleName生成一个新的url
export const getUrlFromPort = (moduleName: string, port: string) => {
    const fileName = moduleName.replace(/@/g, "").replace(/\//g, "-");
    return `//localhost:${port}/${fileName}.js`;
}

// 获取所有disabled的module
export const getDisabledOverrides = (): string[] => {
    const disabledOverrides = localStorage.getItem(
        disabledOverridesLocalStorageKey
    );
    return disabledOverrides ? JSON.parse(disabledOverrides) : [];
}

export const getIsCanFireCustomEvents = () => {
    let canFireCustomEvents = true;
    try {
        if (CustomEvent) {
            new CustomEvent("a");
        } else {
            canFireCustomEvents = false;
        }
    } catch (err) {
        canFireCustomEvents = false;
    }
    return canFireCustomEvents;
}

export const fireEvent = (type: ICustomEventType) => {
    // Set timeout so that event fires after the change has totally finished
    const canFireCustomEvents = getIsCanFireCustomEvents();
    setTimeout(() => {
        const eventType = `module-federation-overrides:${type}`;
        const event = canFireCustomEvents
            ? new CustomEvent(eventType)
            : document.createEvent(eventType);
        window.dispatchEvent(event);
    });
}

export const mergeModuleMap = (
    originalMap: IModuleMap,
    newMap: IModuleMap
) => {
    const outMap = createEmptyModuleMap();
    for (let i in originalMap.imports) {
        outMap.imports[i] = originalMap.imports[i] as string;
    }
    for (let i in newMap.imports) {
        outMap.imports[i] = newMap.imports[i] as string;
    }
    for (let i in originalMap.scopes) {
        outMap.scopes[i] = originalMap.scopes[i] as string;
    }
    for (let i in newMap.scopes) {
        outMap.scopes[i] = newMap.scopes[i] as string;
    }
    return outMap;
}

// 获取默认的module map
export const getDefaultMap = () => {
    const selectorElements = document.querySelectorAll(`script[type="${moduleMapType}"]`) as unknown as Element[];
    return Array.from(selectorElements).reduce((promise: Promise<IModuleMap>, scriptEl: Element) => {
        const textContent: IScriptModuleInfo[] = JSON.parse(scriptEl.textContent || '[]');
        const imports = textContent.reduce((imports: Record<string, string>, scriptInfo) => {
            imports[scriptInfo.name] = scriptInfo.url;
            return imports;
        }, {});
        const nextPromise = Promise.resolve({imports, scopes: {}});
        return Promise.all([
            promise,
            nextPromise,
          ]).then(([originalMap, newMap]) =>
            mergeModuleMap(originalMap, newMap)
          );
    }, Promise.resolve(createEmptyModuleMap()))
}

// 获取被覆盖的module
export const getOverrideMap = (includeDisabled: boolean = false) => {
    const overrides = createEmptyModuleMap();
    const disabledOverrides = getDisabledOverrides();
    const setOverride = (moduleName: string, path: string) => {
        if (includeDisabled || !(disabledOverrides.indexOf(moduleName) >= 0)) {
            overrides.imports[moduleName] = path;
        }
    };
    // get from localstorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.indexOf(localStoragePrefix) === 0) {
            setOverride(
                key.slice(localStoragePrefix.length),
                localStorage.getItem(key)!
            );
        }
    }
    return overrides;
}

// 覆盖module信息
export const addOverride = (moduleName: string, url: string) => {
    if (portRegex.test(url)) {
        url = getUrlFromPort(moduleName, url);
    }
    const key = localStoragePrefix + moduleName;
    localStorage.setItem(key, url);
    fireChangedEvent();
    return getOverrideMap();
}

// 移除module的覆盖信息
export const removeOverride = (moduleName: string) => {
    const key = localStoragePrefix + moduleName;
    const hasItem = localStorage.getItem(key) !== null;
    localStorage.removeItem(key);
    enableOverride(moduleName);
    fireChangedEvent();
    return hasItem;
}

// 启动覆盖功能
export const enableOverride = (moduleName: string) => {
    const disabledOverrides = getDisabledOverrides();
    const index = disabledOverrides.indexOf(moduleName);
    if (index >= 0) {
        disabledOverrides.splice(index, 1);
        localStorage.setItem(
            disabledOverridesLocalStorageKey,
            JSON.stringify(disabledOverrides)
        );
        fireChangedEvent();
        return true;
    } else {
        return false;
    }
}

// 向页面中插入带module覆盖信息的script
export const insertOverrideMap = (map: string | IModuleMap, id: string, referenceNode?: Element) => {
    const overrideMapElement = document.createElement("script");
    overrideMapElement.type = moduleMapType;
    overrideMapElement.id = id; // for debugging and for UI to identify this module map as special
    overrideMapElement.setAttribute(overrideAttribute, "");
    if (typeof map === "string") {
        overrideMapElement.src = map;
    } else {
        const imports = map.imports;
        const textContent = Object.entries(imports).map(([key, value]) => {
            return {
                name: key,
                url: value
            }
        })
        overrideMapElement.textContent = JSON.stringify(textContent, null, 2);
    }
    if (referenceNode) {
        referenceNode.insertAdjacentElement("afterend", overrideMapElement);
    } else {
        document.head.appendChild(overrideMapElement);
    }
    return overrideMapElement;
}

// disable module的覆盖信息
export const disableOverride = (moduleName: string) => {
    const disabledOverrides = getDisabledOverrides();
    if (!includes(disabledOverrides, moduleName)) {
        localStorage.setItem(
            disabledOverridesLocalStorageKey,
            JSON.stringify(disabledOverrides.concat(moduleName))
        );
        fireChangedEvent();
        return true;
    } else {
        return false;
    }
}

// 重置所有信息
export const resetOverrides = () => {
    Object.keys(getOverrideMap(true).imports).forEach((moduleName) => {
        removeOverride(moduleName);
    });
    localStorage.removeItem(disabledOverridesLocalStorageKey);
    fireChangedEvent();
    return getOverrideMap();
}

const init = () => {
    const initialOverrideMap = getOverrideMap();
    const importMaps = Array.from(document.querySelectorAll(
        `script[type="${moduleMapType}"]`
    )) as unknown as HTMLScriptElement[];
    referenceNode = importMaps ? importMaps[importMaps.length - 1]! : undefined;

    if (referenceNode && referenceNode.src) {
        throw Error(
            `module-federation-overrides: external module maps with src are not supported`
        );
    }

    if (referenceNode) {
        try {
            JSON.parse(referenceNode.textContent || '[]');
        } catch (e) {
            throw Error(
                `Invalid <script type="overridable-modulemap"> - text content must be json`
            );
        }
    }
    if (Object.keys(initialOverrideMap.imports).length > 0) {
        referenceNode = insertOverrideMap(
            initialOverrideMap,
            `plugins`,
            referenceNode
        );
    }
}

init();