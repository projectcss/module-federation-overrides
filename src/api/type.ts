export interface IModuleMap {
    imports: Record<string, string>,
    scopes: Record<string, string>
}

export interface IScriptModuleInfo {
    name: string;
    url: string;
}

export type ICustomEventType = 'init' | 'change';