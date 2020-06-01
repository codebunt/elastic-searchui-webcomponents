import { LitElement, html } from 'lit-element';
import { SearchDriver } from "@elastic/search-ui";
import defaultconfig from "./search-config";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";



class SearchProvider extends LitElement {
  constructor() {
    super();
    this.ready = false;
  }

  fireOnDriverReady() {
    if (this.ready) return;
    let event = new CustomEvent('driver-ready', {
      detail: {
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
    this.ready = true;
  }

  static get properties() {
    return {
      config: {
        type: Object,
        required: true
      },
      template: {
        type : String,
      }
    };
  }



  render() {
    return html`   
    <div>
      <slot></slot>
    </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    let __this = this;
    let config = defaultconfig;
    if (this.getAttribute('config')) {
      try {
        config = JSON.parse(this.getAttribute('config'));
        config.apiConnector = new AppSearchAPIConnector(config.apiConnector);
      } catch (e) {
        alert("Bad Config Passed. Using default.");
      }
    }
    if (!this.config) {
      this.config = defaultconfig;
    }
    this.driver = new SearchDriver(defaultconfig);
    this.driver.subscribeToStateChanges(state => {
      this.fireOnDriverReady();
    });
    //HACK : for an empty url
    setTimeout(function () {
      if (!__this.driver.getState().wasSearched)
        __this.driver.getActions().setSearchTerm("")
    }, 750);
  }

}

customElements.define('search-provider', SearchProvider);
