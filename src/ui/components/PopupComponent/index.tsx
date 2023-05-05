import {h} from 'preact';
import {ModuleMapList} from '../ModuleMapList';
import styles from './index.module.less';

interface IProps {
    close: () => void;
}

export const PopupComponent = (props: IProps) => {
    const {close} = props;
    return (
        <div className={styles.imoPopup}>
            <div className={styles.imoHeader}>
                <div>
                    <h1>Module Map Overrides</h1>
                    <p>
                        This developer tool allows you to view and override your Module
                        maps. Start by clicking on a module that you'd like to override.{" "}
                        <a
                            target="_blank"
                            href="https://www.npmjs.com/package/module-map-overrides"
                        >
                            See documentation for more info
                        </a>
                        .
                    </p>
                </div>
                <button className={styles.imoUnstyled} onClick={close}>
                    {"\u24E7"}
                </button>
            </div>
            <ModuleMapList />
        </div>  
    );
}