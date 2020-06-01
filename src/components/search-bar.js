// Import the LitElement base class and html helper function
import { LitElement, html, css } from 'lit-element';
import searchcss from '../css/search-bar.css';
import { debounce } from "debounce";
import Utils from '../utils';


class SearchBar extends LitElement {

    constructor() {
        super();
        this.searchterm = '';
    }

    static get properties() {
        return {
            searchterm: {
                type: String
            }
        };
    }

    search(e) {
        let event = new CustomEvent('search-term', {
            detail: {
                value: this.shadowRoot.getElementById('search-bar').value
            },
            bubbles: true, 
            composed: true
        });
        this.dispatchEvent(event);
        this.driver.getActions().setSearchTerm(this.shadowRoot.getElementById('search-bar').value);
    }

    render() {
        return html`    
            <style>
                ${searchcss}
            </style>
            <form style="width:100%" class="uk-search uk-search-default">
                <input  id="search-bar" class="uk-search-input" @keyup="${debounce(this.search,750)}" type="search" value="${this.searchterm}" placeholder="Search...">
            </form>
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
                //Handle state onload  
                this.handleState(searchDriver.getState()); 
            })
            .catch(((e) => {
                alert(e);
            }));
    }

    handleState(state) {
        this.searchterm = state.searchTerm;
        this.requestUpdate();
    }
}

customElements.define('search-bar', SearchBar);
