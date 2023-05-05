import {h} from "preact";
import {useEffect, useState} from 'preact/hooks';
import cln from 'classnames';
import styles from './index.module.less';
import {useUpdate} from "../../../utils";
import {PopupComponent} from "../PopupComponent";
import {getOverrideMap} from "../../../api";

const FullUi = () => {
    const [showingPopup, setShowingPopup] = useState(false);
    // 强制组件刷新
    const forceUpdate = useUpdate();
    // 获取被覆盖的module信息
    const overrideMap = getOverrideMap().imports

    useEffect(() => {
        const updateFn = () => {
            forceUpdate();
        }
        window.addEventListener("module-federation-overrides:change", updateFn);
        return () => {
            window.removeEventListener("module-federation-overrides:change", updateFn)
        };
    }, [])
    return (
        <div>
            <button
                onClick={() => setShowingPopup(!showingPopup)}
                className={cln(styles.imoUnstyled, styles.imoTrigger, {
                    [styles.imoCurrentOverride]: Object.keys(overrideMap).length > 0
                })}
            >
                {"{\u00B7\u00B7\u00B7}"}
            </button>
            {
                showingPopup && (
                    <PopupComponent
                        close={() => setShowingPopup(!showingPopup)}
                    />
                )
            }
        </div>
    );
}


export default FullUi;
