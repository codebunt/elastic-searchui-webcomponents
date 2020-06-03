import { LitElement, html, css } from 'lit-element';
import searchpaginationcss from '../css/search-pagination.css';
import positioncss from '../css/uikit-position.css'
import simplegridcss from '../css/simple-grid.css'
import Utils from '../utils';

class SearchPagination extends LitElement {


    constructor() {
        super();
    }

    static get properties() {
        return {
            current: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            },
            pagecount: {
                type: Number,
                required: true
            }
        };
    }

    render() {
        var pages = [];
        this.current = parseInt(this.current);
        // First Page
        if (this.current - 3 > 1) {
            pages.push(this.getPageLink(1));
        }
        if (this.current - 3 > 2) {
            pages.push(html`<li class="uk-disabled"><span>...</span></li>`);
        }
        for (var i = this.current - 3; i < this.current + 3; i++) {
            if (i > 0 && i <= this.pagecount) {
                pages.push(this.getPageLink(i));
            }
        }
        if (this.current + 3 < this.pagecount) {
            pages.push(html`<li class="uk-disabled"><span>...</span></li>`);
        }
        // Last Page
        if (this.current + 3 <= this.pagecount) {
            pages.push(this.getPageLink(this.pagecount));
        }

        return html`
            <style>
                ${searchpaginationcss}
                ${positioncss}
                ${simplegridcss}
            </style>
            <div class="suiwc-pagination uk-position-right">
                <ul class="uk-pagination " uk-margin>
                    <li><a href="#"><span uk-pagination-previous></span></a></li>
                    ${pages}
                    <li><a href="#"><span uk-pagination-next></span></a></li>
                </ul>
            </div>
        `;
    }

    getPageLink(num) {
        if (num == this.current) {
            return html`<li>${num}</li>`;
        }
        return html`<li><a @click="${this.changePage}" page-num="${num}" href="javascript:;">${num}</a></li>`;
    }

    changePage(e) {
        let event = new CustomEvent('page-changed', {
            detail: {
                pagenum: parseInt(e.target.getAttribute('page-num'))
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
        this.driver.setCurrent(parseInt(e.target.getAttribute('page-num')));

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
        this.current = state.current;
        this.total = state.totalResults;
        this.pagecount = state.totalPages;
        this.requestUpdate();
    }
    
    
}

customElements.define('search-pagination', SearchPagination);
