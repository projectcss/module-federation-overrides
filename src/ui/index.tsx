import {h, render} from 'preact';
import FullUi from './components/FullUiComponent';

if (window.customElements) {
    window.customElements.define(
        "module-map-overrides-full",
        preactCustomElement(FullUi, ["show-when-local-storage"])
    );
}

function preactCustomElement(Comp: () => h.JSX.Element, observedAttributes: string[] = []) {
    return class PreactCustomElement extends HTMLElement {
        connectedCallback() {
            this.renderWithPreact();
        }
        disconnectedCallback() {
            render(null, this);
            (this as any).renderedEl = null;
        }
        static get observedAttributes() {
            return observedAttributes;
        }
        attributeChangedCallback() {
            this.renderWithPreact();
        }
        renderWithPreact() {
            (this as any).renderedEl = render(
                h(Comp, {customElement: this}),
                this,
                (this as any).renderedEl
            );
        }
    };
}