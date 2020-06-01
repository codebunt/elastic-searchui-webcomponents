// Import the LitElement base class and html helper function
import { LitElement, html, css } from 'lit-element';
import facetcss from '../css/search-facet.css';
import Utils from '../utils';


class SearchFacet extends LitElement {


    constructor() {
        super();
        this.facets = {};
        this.checked = [];
    }

    static get properties() {
        return {
            facet: {
                type: String,
                reflect: true,
                attribute : true
            },
            title: {
                type: String,
                reflect: true,
                attribute : true
            },
            facets: {
                type: Object
            },
            checked: {
                type: Array
            }
        };
    }

    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
    }


    isChecked(value) {
        return this.checked && this.checked.includes(value);
    }

    getValue(facetItem, type) {
        return type === "range" ? facetItem.value.name : facetItem.value;
    }

    changeHandler(e) {
        let event = new CustomEvent('facet-changed', {
            detail: {
                facet: this.facets.field,
                value: e.target.value,
                checked:e.target.checked
            },
            bubbles: true, 
            composed: true
        });
        this.dispatchEvent(event);
        // call the driver 
        const facetFromDriver = this.driver.getState().facets[this.facet][0];
        const valueforApi =
          facetFromDriver.type === "range"
            ? facetFromDriver.data.find(item => item.value.name === e.target.value).value
            : e.target.value;
        if (e.target.checked) {
          this.driver.addFilter(this.facet, valueforApi, "any");
        } else {
          this.driver.removeFilter(this.facet, valueforApi, "any");
        }    
    }

    render() {
        if(!this.facets.data) return html``;
        const facetTemplates = [];

        for (const facetItem of this.facets.data) {
            var checked = html``;
            if(this.isChecked(this.getValue(facetItem, this.facets.type))) {
                checked = html`
                    <input
                        class="suiwc-facets-list-checkbox"
                        type="checkbox"
                        value="${this.getValue(facetItem, this.facets.type)}"
                        checked 
                        @change="${this.changeHandler}"
                    />
                `;
            } else {
                checked = html`
                    <input
                        class="suiwc-facets-list-checkbox"
                        type="checkbox"
                        value="${this.getValue(facetItem, this.facets.type)}"
                        @change="${this.changeHandler}"
                    />
                `;

            }
            facetTemplates.push(html`
                <div class="suiwc-facets-list-item">
                    <div>
                        <label class="suiwc-facets-list-label"> 
                            ${checked}
                            ${this.getValue(facetItem, this.facets.type)} <span class="suiwc-facets-list-badge">${facetItem.count}</span> 
                        </label>
                    </div>
                </div>
            `);

        }

        const facets = html`
        <style>
            ${facetcss}
        </style>
        <div class="suiwc-facets">
            <div class="suiwc-facets-header">${this.title ? this.title : this.facets.field}</div>
            <hr>
            <div class="suiwc-facets-body">
                <div class="suiwc-facets-list">
                        ${facetTemplates}
                </div>
            </div>
        </div>
        `;


        return (this.facets.data.length == 0) ? html`` : facets;
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
        this.facets = {};
        this.checked = [];
        let facets = state.facets;
        state.filters.forEach(filter => {
            if(filter.field === this.facet){
                if (facets[filter.field] && facets[filter.field].length > 0 && facets[filter.field][0].type === "range") {
                    this.checked = filter.values.map(value => value.name);
                } else {
                    this.checked = filter.values;
                }      
            }
        });        
        if(state.facets[this.facet]){
            this.facets = state.facets[this.facet][0];
        }
        this.requestUpdate();
    }
}
customElements.define('search-facet', SearchFacet);
