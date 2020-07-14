# Elastic SearchUI Webcomponent demo
A Demo webcomponent Implementation of Elastic Search UI ( [App Search](https://www.elastic.co/app-search/) ) using [Lit-Element](https://lit-element.polymer-project.org/)

 ![](http://g.recordit.co/XzHDQ0gKu8.gif)

### Usage
* Add the script to your *head* or *body* tag: 
```
    <script src="https://cdn.jsdelivr.net/npm/es-searchui-wc@0.0.3/dist/es-searchui-wc.js"></script>
```

* Add the component tags inside the *body* tag  :
     ```html
      <search-provider
          config='{ "debug": true, "apiConnector": { "searchKey": "search-3493gera4z2iiew7gywtmfwy", "engineName": "huducu", "hostIdentifier": "host-x9sasu" }, "searchQuery": { "disjunctiveFacets": [ "actors", "genre", "director", "year" , "imdbrating" , "country" ], "facets": { "imdbrating": { "type": "range", "ranges": [ { "from": 0, "to": 2, "name": "0-2" }, { "from": 2, "to": 4, "name": "2-4" }, { "from": 4, "to": 6, "name": "4-6" }, { "from": 6, "to": 8, "name": "6-8" }, { "from": 8, "to": 10, "name": "8-10" } ] }, "actors": { "type": "value" }, "genre": { "type": "value" }, "director": { "type": "value" }, "year": { "type": "value" } } } }'>
          <search-layout>
              <template>
                  <div class="col-6">
                      <div class="suiwc-card suiwc-card-default">
                          <div class="suiwc-card-body">
                              <div class="row">
                                  <div class="col-4">
                                      <img style="height:150px;width:100px" src="{{poster.raw}}" />
                                  </div>
                                  <div class="col-8">
                                      <div class="row">
                                          <div class="col-12">
                                              <b>{{title.raw}}</b> ( {{year.raw}} )
                                          </div>
                                          <div class="col-12">
                                              <span class="suiwc-divider"> {{rated.raw}} </span>
                                              <span class="suiwc-divider"> {{language.raw}} </span>
                                              <span class="suiwc-divider"> {{imdbrating.raw}} </span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>     
              </template>       
          </search-layout>
      </search-provider>
    ```
 Thats it!!
### Configuration
The *config* attribute in *search-provider* will have the info about app-search.If you dont specify one it will use a default dataset.
For example:
 ```
    {
    "debug": true,
    "apiConnector": {
        "searchKey": "search-3493gera4z2iiew7gywtmfwy",
        "engineName": "huducu",
        "hostIdentifier": "host-x9sasu"
    },
    "searchQuery": {
        "disjunctiveFacets": [
            "actors",
            "genre",
            "director",
            "year",
            "imdbrating",
            "country"
        ],
        "facets": {
            "imdbrating": {
                "type": "range",
                "ranges": [
                    {
                        "from": 0,
                        "to": 2,
                        "name": "0-2"
                    },
                    {
                        "from": 2,
                        "to": 4,
                        "name": "2-4"
                    },
                    {
                        "from": 4,
                        "to": 6,
                        "name": "4-6"
                    },
                    {
                        "from": 6,
                        "to": 8,
                        "name": "6-8"
                    },
                    {
                        "from": 8,
                        "to": 10,
                        "name": "8-10"
                    }
                ]
            },
            "actors": {
                "type": "value"
            },
            "genre": {
                "type": "value"
            },
            "director": {
                "type": "value"
            },
            "year": {
                "type": "value"
            }
        }
    }
}
```

### Result Template
The template used to render each result can be specified inside the *search-layout* tag.It uses mustache templating engine.

## Running in Development setup
* Download dependencies
```
npm install
```
* Run in dev mode
```
npm run-script dev
```

* Build
```
npm run-script dist
```

### List of components
* **search-provider** : Initialises the SearchDriver. All the tags under it will use this to get the driver
* **search-layout** : Renders the whole layout using other components.Needs to be always as a child under search-provider.
* **search-facets** : Renders the facets. Uses *search-facet* internally
* **search-facet** : Renders a single facet.
* **search-results** : Renders the results.Uses the innerhtml as a template
* **search-clear-filters** : Renders clear filters
* **search-bar** 
* **search-pagination** 
