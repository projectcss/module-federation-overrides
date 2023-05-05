import {h, render} from 'preact';
import {resetOverrides} from '../../../api';
import {ModuleDialog} from '../ModuleDialog';
import styles from './index.module.less';

export const PopupActions = () => {
    const addNewModule = () => {
        const dialogContainer = document.createElement("div");
        document.body.appendChild(dialogContainer);
        render(
          <ModuleDialog
            removeDialog={() => {
                dialogContainer.remove()
                render(null, dialogContainer);
            }}
            isNew
            title={'New module'}
          />,
          dialogContainer
        );
    }

    const resetAllOverrides = () => {
        resetOverrides();
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.imoAddNew}>
                <button onClick={addNewModule}>
                    Add new module
                </button>
            </div>
            <div className={styles.imoAddNew}>
                <button onClick={resetAllOverrides}>
                    Reset all overrides
                </button>
            </div>
        </div>
    );
}