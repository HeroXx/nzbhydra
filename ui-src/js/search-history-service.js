angular
    .module('nzbhydraApp')
    .factory('SearchHistoryService', SearchHistoryService);

function SearchHistoryService($filter, $http) {

    return {
        getSearchHistory: getSearchHistory,
        getSearchHistoryForSearching: getSearchHistoryForSearching,
        formatRequest: formatRequest,
        getStateParamsForRepeatedSearch: getStateParamsForRepeatedSearch
    };

    function getSearchHistoryForSearching() {
        return $http.post("internalapi/getsearchrequestsforsearching").success(function (response) {
            return {
                searchRequests: response.searchRequests,
                totalRequests: response.totalRequests
            }
        });
    }

    function getSearchHistory(pageNumber, limit, sortModel, filterModel, type, distinct, onlyCurrentUser) {
        if (angular.isUndefined(pageNumber)) {
            pageNumber = 1;
        }
        if (angular.isUndefined(limit)) {
            limit = 100;
        }
        if (!sortModel) {
            sortModel = [{colId: "time", sort: "desc"}];
        }
        if (!filterModel) {
            filterModel = {}
        }
        return $http.post("internalapi/getsearchrequests", {page: pageNumber, limit: limit, sortModel: sortModel, filterModel: filterModel, type: type, distinct: distinct, onlyCurrentUser: onlyCurrentUser}).success(function (response) {
            return {
                searchRequests: response.searchRequests,
                totalRequests: response.totalRequests
            }
        });
    }

    function formatRequest(request, includeIdLink, includequery, describeEmptySearch, includeTitle) {
        var result = [];
        //ID key: ID value
        //season
        //episode
        //author
        //title
        if (includequery && request.query) {
            result.push("Query: " + request.query);
        }
        if (request.title && includeTitle) {
            result.push('<span class="history-title">Title: </span>' + request.title);
        } else if (request.movietitle && includeTitle) {
            result.push('<span class="history-title">Title: </span>' + request.movietitle);
        } else if (request.tvtitle && includeTitle) {
            result.push('<span class="history-title">Title: </span>' + request.tvtitle);
        } else if (request.identifier_key) {
            var href;
            var key;
            if (request.identifier_key == "imdbid") {
                key = "IMDB ID";
                href = "https://www.imdb.com/title/tt"
            } else if (request.identifier_key == "tvdbid") {
                key = "TVDB ID";
                href = "https://thetvdb.com/?tab=series&id="
            } else if (request.identifier_key == "rid") {
                key = "TVRage ID";
                href = "internalapi/redirect_rid?rid="
            } else if (request.identifier_key == "tmdb") {
                key = "TMDV ID";
                href = "https://www.themoviedb.org/movie/"
            }
            href = href + request.identifier_value;
            href = $filter("dereferer")(href);
            if (includeIdLink) {
                result.push('<span class="history-title">' + key + ': </span><a target="_blank" href="' + href + '">' + request.identifier_value + "</a>");
            } else {
                result.push('<span class="history-title">' + key + ": </span>" + request.identifier_value);
            }
        }
        if (request.season) {
            result.push('<span class="history-title">Season: </span>' + request.season);
        }
        if (request.episode) {
            result.push('<span class="history-title">Episode: </span>' + request.episode);
        }
        if (request.author) {
            result.push('<span class="history-title">Author: </span>' + request.author);
        }
        if (result.length == 0 && describeEmptySearch) {
            result = ['<span class="history-title">Empty search</span>'];
        }

        return result.join(", ");

    }

    function getStateParamsForRepeatedSearch(request) {
        var stateParams = {};
        stateParams.mode = "search"
        if (request.identifier_key == "imdbid") {
            stateParams.mode = "movie"
            stateParams.imdbid = request.identifier_value;
        } else if (request.identifier_key == "tvdbid" || request.identifier_key == "rid") {
            stateParams.mode = "tvsearch";
            if (request.identifier_key == "rid") {
                stateParams.rid = request.identifier_value;
            } else {
                stateParams.tvdbid = request.identifier_value;
            }

            if (request.season != "") {
                stateParams.season = request.season;
            }
            if (request.episode != "") {
                stateParams.episode = request.episode;
            }
        }
        if (request.query != "") {
            stateParams.query = request.query;
        }


        if (request.movietitle != null) {
            stateParams.title = request.movietitle;
        }
        if (request.tvtitle != null) {
            stateParams.title = request.tvtitle;
        }

        if (request.category) {
            stateParams.category = request.category;
        }

        stateParams.category = request.category;

        return stateParams;
    }



}