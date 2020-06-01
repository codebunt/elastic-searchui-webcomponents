import { LitElement, html, css } from 'lit-element';
import { SearchDriver } from "@elastic/search-ui";
import simplegridcss from '../css/simple-grid.css'

import { SearchFacet } from "./search-facet";
import Utils from '../utils';



class SearchFacets extends LitElement {


  constructor() {
    super();
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
    this.facets = Object.keys(state.facets);
    this.requestUpdate();
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
    return html`
        <style>
            ${simplegridcss}
        </style>
        ${facets}
    `;
  }
}

customElements.define('search-facets', SearchFacets);
