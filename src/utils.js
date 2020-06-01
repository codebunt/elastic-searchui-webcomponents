export default class {
    static getSearchController(base = this) {
        let selector = 'search-provider';
        function __closestFrom(el) {
            if (!el || el === document || el === window) return null;
            let found = el.closest(selector);
            return found ? found : __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }

    static getDriver(base) {
        var el = this.getSearchController(base);
        let promise = new Promise((resolve, reject) => {
            if (!el) {
                alert("Missing Search Provider");
                reject("Missing Search Provider!");
            }
            else {
                if(el.ready) {
                    resolve(el.driver);
                } else {
                    el.addEventListener('driver-ready', (e) => {
                        resolve(e.target.driver);
                    });    
                }
            }
        });
        return promise;
    }

    static changeFacet(driver, facet, value, checked) {
        const facetFromDriver = driver.getState().facets[facet][0];
        const valueforApi =
            facetFromDriver.type === "range"
                ? facetFromDriver.data.find(item => item.value.name === value).value
                : value;
        if (checked) {
            driver.addFilter(facet, valueforApi, "any");
        } else {
            driver.removeFilter(facet, valueforApi, "any");
        }
    }
}
