import {h} from 'preact';
import cln from 'classnames';
import styles from './index.module.less';
import {IModuleMapInfo} from '../ModuleMapList/type';
import {useState} from 'preact/hooks';
import {getInitialOverrideUrl} from './utils';
import {addOverride, disableOverride, enableOverride, getModuleIsDisabled, getUrlFromPort, removeOverride} from '../../../api';

const portRegex = /^\d+$/;

interface IProps {
    module?: IModuleMapInfo;
    removeDialog: () => void;
    isNew?: boolean,
    title: string;
}
export const ModuleDialog = (props: IProps) => {
    const {module, removeDialog, isNew = false, title} = props;
    const [overrideUrl, setOverrideUrl] = useState<string>(() => getInitialOverrideUrl(module));
    const [moduleName, setModuleName] = useState<string>('');
    const clearOverrideUrlInput = () => {
        setOverrideUrl('');
    }

    const clearModuleName = () => {
        setModuleName('')
    };

    const getDerivedUrl = () => {
        const newModuleName = isNew ? '' : module!.moduleName;
        return portRegex.test(overrideUrl)
          ? getUrlFromPort(newModuleName, overrideUrl)
          : overrideUrl;
    };

    const updateModuleUrl = (url: string) => {
        const newUrl = url || null;
        if (newUrl === null) {
            removeOverride(module!.moduleName);
        } else {
            addOverride(module!.moduleName, newUrl);
        }
    };

    const addNewModule = (name: string, url: string) => {
        if (name && url) {
            addOverride(name, url);
        }
    };
    
    const handleSubmit = (evt: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
        evt.preventDefault();
        if (module && module.moduleName && getModuleIsDisabled(module.moduleName)) {
            enableOverride(module.moduleName);
        }
        if (isNew) {
            addNewModule(moduleName, overrideUrl);
        } else {
            updateModuleUrl(overrideUrl)
        }
        removeDialog();
    }
    const isCanDisableOverride = module && module.overrideUrl && !module.disabled;
    const isCanEnableOverride = module && module.overrideUrl && module.disabled;
    return (
        <div className={styles.imoModalContainer}>
            <div className={styles.imoModal} />
            <dialog
                className={cln(styles.imoModuleDialog, {
                    [styles.imoOverridden]: overrideUrl.length > 0,
                    [styles.imoDefault]: overrideUrl.length <= 0
                })}
                open
            >
                <form method="dialog" onSubmit={handleSubmit}>
                    <h3 style={{marginTop: 0}}>{title}</h3>
                    <table>
                        <tbody>
                            {
                                !isNew && (
                                    <tr>
                                        <td>Default URL:</td>
                                        <td>{module!.defaultUrl}</td>
                                    </tr>
                                )
                            }
                            {isNew && (
                                <tr>
                                    <td>
                                        <span id="module-name-label">Module Name:</span>
                                    </td>
                                    <td style={{position: "relative"}}>
                                        <input
                                            type="text"
                                            tabIndex={1}
                                            value={moduleName}
                                            aria-labelledby="module-name-label"
                                            onInput={(evt: any) => setModuleName(evt.target.value)}
                                            required
                                        />
                                        <div
                                            role="button"
                                            tabIndex={3}
                                            className={styles.imoClearInput}
                                            onClick={clearModuleName}
                                        >
                                            <div
                                                className={cln(styles.clearIcon, {
                                                    [styles.hideIcon]: moduleName.length <= 0
                                                })}
                                            >
                                                {"\u24E7"}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td>
                                    <span id="override-url-label">Override URL:</span>
                                </td>
                                <td style={{position: "relative"}}>
                                    <input
                                        type="text"
                                        value={overrideUrl}
                                        aria-labelledby="override-url-label"
                                        tabIndex={2}
                                        onInput={(evt: any) => setOverrideUrl(evt.target.value)}
                                    />
                                    <div
                                        role="button"
                                        tabIndex={4}
                                        className={styles.imoClearInput}
                                        onClick={clearOverrideUrlInput}
                                    >
                                        <div
                                            className={cln(styles.clearIcon, {
                                                [styles.hideIcon]: overrideUrl.length <= 0
                                            })}
                                        >
                                            {"\u24E7"}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            {
                                portRegex.test(overrideUrl) && (
                                    <tr>
                                        <td>Derived url:</td>
                                        <td>{getDerivedUrl()}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <div className={styles.imoDialogActions}>
                        <button
                            type="button"
                            tabIndex={5}
                            onClick={removeDialog}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                        {isCanDisableOverride && (
                            <button
                                type="button"
                                onClick={() => {
                                    disableOverride(module.moduleName);
                                    removeDialog();
                                }}
                                tabIndex={6}
                                className={styles.disableOverrideButton}
                            >
                                Disable Override
                            </button>
                        )}
                        {isCanEnableOverride && (
                            <button
                                type="button"
                                onClick={() => {
                                    enableOverride(module.moduleName);
                                    removeDialog();
                                }}
                                tabIndex={6}
                                className={styles.enableOverrideButton}
                            >
                                Enable Override
                            </button>
                        )}
                        <button
                            type="submit"
                            tabIndex={7}
                            className={cln({
                                [styles.imoOverridden]: overrideUrl.length > 0,
                                [styles.imoDefault]: overrideUrl.length <= 0
                            })}
                        >
                            {overrideUrl ? "Apply override" : "Reset to default"}
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
}