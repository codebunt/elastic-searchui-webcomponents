import "regenerator-runtime/runtime";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey: "search-3493gera4z2iiew7gywtmfwy",
  engineName: "huducu",
  hostIdentifier: "host-x9sasu"
});

const config = {
  debug: true,
  apiConnector: connector,
  searchQuery: {
    disjunctiveFacets: ["actors", "genre", "director", "year" , "imdbrating" , "country"],
    facets: {
      imdbrating: {
        type: "range",
        ranges: [
          { from: 0, to: 2, name: "0-2" },
          { from: 2, to: 4, name: "2-4" },
          { from: 4, to: 6, name: "4-6" },
          { from: 6, to: 8, name: "6-8" },
          { from: 8, to: 10, name: "8-10" }
        ]
      },
      actors: {
        type: "value"
      },
      genre: {
        type: "value"
      },
      director: {
        type: "value"
      },
      year: {
        type: "value"
      }
    }
  }
};

export default config;
