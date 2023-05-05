import {h, render} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import cln from 'classnames';
import {createEmptyModuleMap, fireChangedEvent, getDefaultMap,} from '../../../api';
import {IModuleMap} from '../../../api/type';
import {ModuleDialog} from '../ModuleDialog';
import {PopupActions} from '../PopupActions';
import styles from './index.module.less';
import {IModuleMapInfo} from './type';
import {getDefaultModulesInfo, getDisabledOverridesInfo, getOverriddenModulesInfo, toDomain, toFileName} from './utils';
import {useUpdate} from 'src/utils';

export const ModuleMapList = () => {
    const [notOverriddenMap, setNotOverriddenMap] = useState<IModuleMap>(() => createEmptyModuleMap());
    const [searchName, setSearchName] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const forceUpdate = useUpdate();
    useEffect(() => {
        getDefaultMap().then((notOverriddenMap) => {
            setNotOverriddenMap(notOverriddenMap);
        });
        fireChangedEvent();
    }, []);

    useEffect(() => {
        const updateFn = () => {
            forceUpdate();
        }
        window.addEventListener("module-map-overrides:change", updateFn);
        return () => {
            window.removeEventListener("module-map-overrides:change", updateFn)
        };
    }, [])
    const defaultModules = getDefaultModulesInfo(notOverriddenMap, searchName);
    const overriddenModules = getOverriddenModulesInfo(notOverriddenMap, searchName);
    const disabledOverrides = getDisabledOverridesInfo(notOverriddenMap, searchName);
    const updateModuleInfo = (mod: IModuleMapInfo) => {
        const dialogContainer = document.createElement("div");
        document.body.appendChild(dialogContainer);
        render(
          <ModuleDialog
            module={mod}
            removeDialog={() => {
                dialogContainer.remove()
                render(null, dialogContainer);
            }}
            title={mod.moduleName}
          />,
          dialogContainer
        );
    }
    return (
        <div className={styles.imoListContainer}>
            <div className={styles.imoTableHeaderActions}>
                <input
                    className={styles.imoListSearch}
                    aria-label="Search modules"
                    placeholder="Search modules"
                    value={searchName}
                    onInput={(evt: any) => setSearchName(evt?.target?.value || '')}
                    ref={inputRef}
                />
                <PopupActions />
            </div>
            <table className={styles.imoOverridesTable}>
                <thead>
                    <tr>
                        <th>Module Status</th>
                        <th>Module Name</th>
                        <th>Domain</th>
                        <th>Filename</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        disabledOverrides.map((mod) => (
                            <tr
                                role="button"
                                tabIndex={0}
                                onClick={() => updateModuleInfo(mod)}
                                key={mod.moduleName}
                            >
                                <td>
                                    <div className={cln(styles.imoStatus, styles.imoDisabledOverride)} />
                                    <div>Override disabled</div>
                                </td>
                                <td>{mod.moduleName}</td>
                                <td>{toDomain(mod)}</td>
                                <td>{toFileName(mod)}</td>
                            </tr>
                        ))
                    }
                    {
                        overriddenModules.map((mod) => (
                            <tr
                                role="button"
                                tabIndex={0}
                                key={mod.moduleName}
                                onClick={() => updateModuleInfo(mod)}
                            >
                                <td>
                                    <div className={cln(styles.imoStatus, styles.imoCurrentOverride)} />
                                    <div>Inline Override</div>
                                </td>
                                <td>{mod.moduleName}</td>
                                <td>{toDomain(mod)}</td>
                                <td>{toFileName(mod)}</td>
                            </tr>
                        ))
                    }
                    {
                        defaultModules.map((mod) => (
                            <tr
                                role="button"
                                tabIndex={0}
                                key={mod.moduleName}
                                onClick={() => updateModuleInfo(mod)}
                            >
                                <td>
                                    <div className={cln(styles.imoStatus, styles.imoDefaultModule)} />
                                    <div>Default</div>
                                </td>
                                <td>{mod.moduleName}</td>
                                <td>{toDomain(mod)}</td>
                                <td>{toFileName(mod)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

