import { LitElement, html, css } from 'lit-element';
import { SearchDriver } from "@elastic/search-ui";
import searchsectioncss from '../css//search-layout.css';
import simplegridcss from '../css/simple-grid.css'

import { SearchFacet } from "./search-facet";
import { SearchResults } from "./search-results";
import { SearchPagination } from "./search-pagination";
import { SearchBar } from "./search-bar";
import { SearchClearFilter } from "./search-clear-filters";
import Utils from '../utils';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';



class SearchLayout extends LitElement {


  constructor() {
    super();
    this.showFacetFilter = false;
    this.facets = [];
  }


  static get properties() {
    return {

    };
  }

  connectedCallback() {
    super.connectedCallback();
    Utils.getDriver(this)
      .then((searchDriver) => {
        this.driver = searchDriver;
        this.driver.subscribeToStateChanges(state => {
          this.handleState(state);
        });
        this.handleState(searchDriver.getState());
      })
      .catch(((e) => {
        alert(e);
      }));
  }

  handleState(state) {
    this.showFacetFilter = this.hasFacetFilter(state);
    this.facets = Object.keys(state.facets);
    this.requestUpdate();
  }


  hasFacetFilter(state) {
    return state.filters.length > 0;
  }

  render() {
    var facets = [];
    for(let idx in this.facets){
      facets.push(html`
        <div class="row">
          <div class="col-12">
            <search-facet .facet="${this.facets[idx]}"></search-facet>
          </div>
        </div>
        <hr>
      `);
    }
    var ret = html`
    <style>
    ${searchsectioncss}
    ${simplegridcss}
    </style>
    <div>
      <div class="row">
        <div class="col-3  kontainer" style="margin:0px">
          ${facets}
        </div>
        <div class="col-9 results-container  kontainer" style="margin:0px">
          <div class="row" style="height:50px;">
            <div class="col-4">
              <search-bar></search-bar>
            </div>
            <div class="col-8">
              <search-pagination></search-pagination>
            </div>
          </div>
          <hr>
          <div class="row" style="height:50px;display:${this.showFacetFilter ? html`block` : `none`}">
            <div class="col-12">
              <search-clear-facets></search-clear-facets>
            </div>
          </div>
          <hr style="display:${this.showFacetFilter ? html`block` : `none`}">
          <search-results template_engine="mustache">
            <template>
              ${unsafeHTML(this.querySelector('template').innerHTML)}
            </template>
          </search-results>
        </div>
      </div>
    </div>
    `;
    return ret;
  }
}

customElements.define('search-layout', SearchLayout);
