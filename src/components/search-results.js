// Import the LitElement base class and html helper function
import { LitElement, html, css } from 'lit-element';
import searchcss from '../css/search-results.css';
import simplegridcss from '../css/simple-grid.css'
import Mustache from 'mustache';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import Utils from '../utils';

class SearchResults extends LitElement {


    constructor() {
        super();
        this.results = [];
    }

    static get properties() {
        return {
            results: {
                type: Array,
                required: true
            },
            template_engine: {
                type: String
            }

        };
    }


    firstUpdated(props) {
        if (!this.cardtemplate) {
            this.cardtemplate = this.querySelector('template').innerHTML;
            this.updateTemplate();
        }
    }

    updateTemplate() {
        if (!this.cardtemplate) return;
        this.resultTemplates = [];
        for (const result of this.results) {
            var tmp = Mustache.render(this.cardtemplate, result);
            this.resultTemplates.push(html`${unsafeHTML(tmp)}`);
        }
        this.requestUpdate();
    }

    render() {
        this.updateTemplate();
        return html`
            <style>
                ${searchcss}
                ${simplegridcss}
            </style>
            <div class="suiwc-results">
                <div class="row">
                    ${this.resultTemplates}
                <div>
            </div>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        Utils.getDriver(this)
            .then((searchDriver) => {
                this.driver = searchDriver;
                this.driver.subscribeToStateChanges(state => {
                    this.handleState(state);
                });
                this.handleState(this.driver.getState());
            })
            .catch(((e) => {
                alert(e);
            }));
    }


    handleState(state) {
        this.results = state.results;
        this.requestUpdate();
    }

}

customElements.define('search-results', SearchResults);
