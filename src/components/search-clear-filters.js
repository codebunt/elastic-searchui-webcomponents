import { LitElement, html } from 'lit-element';
import simplegridcss from '../css/simple-grid.css'
import ccss from '../css/search-clear-filters.css'
import Utils from '../utils';

class SearchClearFilter extends LitElement {


    constructor() {
        super();
    }

    static get properties() {
        return {
            filters: {
                type: Object,
                required: true
            }
        };
    }

    render() {
        var facetRemoveTemplate = [];
        for (var key in this.filters) {
            var facet = this.filters[key];
            if (facet.length > 0) {
                facetRemoveTemplate.push(html`<div class="suiwc-facet-group suiwc-facet-divider">&nbsp;</div>`);
                facetRemoveTemplate.push(html`<div class="suiwc-facet-group">${key} : </div>`);
            }
            for (var idx in facet) {
                facetRemoveTemplate.push(html`
                    <a class="suiwc-label" @click="${this.removeFacet}" suiwc-facet="${key}" suiwc-facet-value="${facet[idx]}" href="javascript:;">
                        <div>${facet[idx]} 
                            <span>
                                <suiwc-icon>
                                    <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <title>times</title>
                                        <path class="" d="M19.41,18l8.29-8.29a1,1,0,0,0-1.41-1.41L18,16.59,9.71,8.29A1,1,0,0,0,8.29,9.71L16.59,18,8.29,26.29a1,1,0,1,0,1.41,1.41L18,19.41l8.29,8.29a1,1,0,0,0,1.41-1.41Z"></path>
                                    </svg>
                                </suiwc-icon>
                            </span>
                        </div>
                    </a>`
                );
            }

        }
        var clearAll = [];
        if (this.hasFacetFilter()) {
            clearAll.push(html`
            <a class="suiwc-label suiwc-label-danger" @click="${this.clearAll}" href="javascript:;">
                <div>Clear All
                    <span>
                        <suiwc-icon>
                            <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <title>times</title>
                                <path class="" d="M19.41,18l8.29-8.29a1,1,0,0,0-1.41-1.41L18,16.59,9.71,8.29A1,1,0,0,0,8.29,9.71L16.59,18,8.29,26.29a1,1,0,1,0,1.41,1.41L18,19.41l8.29,8.29a1,1,0,0,0,1.41-1.41Z"></path>
                            </svg>
                        </suiwc-icon>
                    </span>
                </div>
            </a>
            `);
        }
        return html`
            <style>
                ${simplegridcss}
                ${ccss}
            </style>
            ${clearAll}
            ${facetRemoveTemplate}
        `;
    }

    removeFacet(e) {
        e = e.target.closest('a');
        let event = new CustomEvent('facet-removed', {
            detail: {
                facet: e.getAttribute('suiwc-facet'),
                value: e.getAttribute('suiwc-facet-value'),
            },
            bubbles: true,
            composed: true

        });
        this.dispatchEvent(event);
        Utils.changeFacet(this.driver , e.getAttribute('suiwc-facet') , e.getAttribute('suiwc-facet-value'));
    }

    clearAll(e) {
        e = e.target.closest('a');
        let event = new CustomEvent('clear-all', {
            detail: {
            },
            bubbles: true,
            composed: true

        });
        this.dispatchEvent(event);
        this.driver.clearFilters();
    }


    hasFacetFilter() {
        var __this = this;
        for (var key in this.filters) {
            if (this.filters.hasOwnProperty(key)) {
                if (this.filters[key].length > 0) return true;
            }
        }
        return false;
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
        this.filters = {};
        state.filters.forEach(filter => {
            if (state.facets[filter.field] && state.facets[filter.field].length > 0 && state.facets[filter.field][0].type === "range") {
                this.filters[filter.field] = filter.values.map(value => value.name);
            } else {
                this.filters[filter.field] = filter.values;
            }
        });
        this.requestUpdate();
    }

}

customElements.define('search-clear-facets', SearchClearFilter);
