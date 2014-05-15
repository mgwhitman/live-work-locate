/*global define,dojo,require,console,alert */
/*jslint browser:true,sloppy:true,nomen:true,unparam:true,plusplus:true,indent:4 */
/*
 | Copyright 2013 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
//============================================================================================================================//
define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "widgets/mapSettings/mapSettings",
    "widgets/appHeader/appHeader",
    "widgets/splashScreen/splashScreen",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/DeferredList",
    "esri/request",
    "esri/arcgis/utils",
    "dojo/promise/all",
    "dojo/dom-class",
    "dojo/query",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/i18n!application/js/library/nls/localizedStrings",
    "dojo/domReady!"
], function (declare, _WidgetBase, Map, AppHeader, SplashScreen, array, lang, Deferred, DeferredList, esriRequest, esriUtils, all, domClass, query, topic, domStyle, sharedNls) {

    //========================================================================================================================//

    return declare([_WidgetBase], {
        sharedNls: sharedNls,

        /**
        * load widgets specified in Header Widget Settings of configuration file
        *
        * @class
        * @name coreLibrary/widgetLoader
        */
        startup: function () {
            var widgets, deferredArray, basemapDeferred, map, splashScreen, appUrl, workflow, mapInstance;
            widgets = {};
            deferredArray = [];
            basemapDeferred = new Deferred();
            this._fetchBasemapCollection(basemapDeferred);
            basemapDeferred.then(lang.hitch(this, function (baseMapLayers) {
                if (baseMapLayers.length === 0) {
                    alert(sharedNls.errorMessages.noBasemap);
                    return;
                }
                dojo.configData.BaseMapLayers = baseMapLayers;
                map = new Map();
                if (dojo.configData.SplashScreen) {
                    splashScreen = new SplashScreen();
                    appUrl = window.location.toString();
                    if (appUrl.search("app") > 0) {
                        if (appUrl.search("extent") > 0) {
                            dojo.share = true;
                            workflow = (appUrl.slice(appUrl.indexOf("=") + 1, appUrl.indexOf("$"))).toUpperCase();
                        } else {
                            workflow = (appUrl.slice(appUrl.indexOf("=") + 1)).toUpperCase();
                        }
                        splashScreen._hideSplashScreenDialog();
                        splashScreen.loadSelectedWorkflow(workflow, map);
                    } else {
                        splashScreen.showSplashScreenDialog(map);
                    }
                    topic.subscribe("showSplashScreen", function () {
                        splashScreen.showSplashScreenDialog(map);
                    });
                }
                mapInstance = this._initializeMap(map);
                /**
                * create an object with widgets specified in Header Widget Settings of configuration file
                * @param {array} dojo.configData.AppHeaderWidgets Widgets specified in configuration file
                */
                array.forEach(dojo.configData.AppHeaderWidgets, function (widgetConfig, index) {
                    var deferred = new Deferred();
                    widgets[widgetConfig.WidgetPath] = null;
                    require([widgetConfig.WidgetPath], function (Widget) {
                        widgets[widgetConfig.WidgetPath] = new Widget({ map: widgetConfig.MapInstanceRequired ? mapInstance : undefined, title: widgetConfig.Title });
                        deferred.resolve(widgetConfig.WidgetPath);
                    });
                    deferredArray.push(deferred.promise);
                });
                all(deferredArray).then(lang.hitch(this, function () {
                    try {
                        /**
                        * create application header
                        */
                        this._createApplicationHeader(widgets, map, splashScreen);
                        if (dojo.share) {
                            setTimeout(function () {
                                if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId === "") {
                                    topic.publish("locateAddressOnMap");
                                }
                            }, 2000);
                        }
                    } catch (ex) {
                        alert(sharedNls.errorMessages.widgetNotLoaded);
                    }

                }));
            }));
        },
        /**
        * create map object
        * @return {object} Current map instance
        * @memberOf coreLibrary/widgetLoader
        */
        _initializeMap: function (map) {
            var mapInstance = map.getMapInstance();
            return mapInstance;
        },

        /**
        * create application header
        * @param {object} widgets Contain widgets to be displayed in header panel
        * @memberOf coreLibrary/widgetLoader
        */
        _createApplicationHeader: function (widgets, map, workflows) {
            var applicationHeader = new AppHeader({ mapObject: map, workflows: workflows });
            applicationHeader.loadHeaderWidgets(widgets);
        },

        _fetchBasemapCollection: function (basemapDeferred) {
            var dListResult, groupUrl, searchUrl, webmapRequest, groupRequest, deferred, thumbnailSrc, baseMapArray = [], deferredArray = [];
            /**
            * If group owner & title are configured, create request to fetch the group id
            */
            if (dojo.configData.BasemapGroupTitle && dojo.configData.BasemapGroupOwner) {
                groupUrl = dojo.configData.PortalAPIURL + "community/groups?q=title:\"" + dojo.configData.BasemapGroupTitle + "\" AND owner:" + dojo.configData.BasemapGroupOwner + "&f=json";
                groupRequest = esriRequest({
                    url: groupUrl,
                    callbackParamName: "callback"
                });
                groupRequest.then(function (groupInfo) {
                    if (groupInfo.results.length === 0) {
                        alert(sharedNls.errorMessages.invalidBasemapQuery);
                        return;
                    }
                    /**
                    * Create request using group id to fetch all the items from that group
                    */
                    searchUrl = dojo.configData.PortalAPIURL + 'search?q=group:' + groupInfo.results[0].id + "&sortField=name&sortOrder=desc&num=50&f=json";
                    webmapRequest = esriRequest({
                        url: searchUrl,
                        callbackParamName: "callback"
                    });
                    webmapRequest.then(function (groupInfo) {
                        var pushWebmap = false;
                        /**
                        * Loop for each item in the group
                        */
                        array.forEach(groupInfo.results, lang.hitch(this, function (info, index) {
                            /*
                            * If type is "Map Service", create the object and push it into "baseMapArray"
                            */
                            if (info.type === "Map Service") {
                                thumbnailSrc = (groupInfo.results[index].thumbnail === null) ? dojo.configData.webmapThumbnail : dojo.configData.PortalAPIURL + "content/items/" + info.id + "/info/" + info.thumbnail;
                                baseMapArray.push({
                                    ThumbnailSource: thumbnailSrc,
                                    Name: info.title,
                                    MapURL: info.url
                                });
                                /*
                                * If type is "Web Map", create requests to fetch all the items of the webmap (asynchronous request)
                                */
                            } else if (info.type === "Web Map") {
                                var mapDeferred = esriUtils.getItem(info.id);
                                mapDeferred.then(lang.hitch(this, function () {
                                    deferred = new Deferred();
                                    deferred.resolve();
                                }));
                                deferredArray.push(mapDeferred);
                            }
                        }));
                        dListResult = new DeferredList(deferredArray);
                        dListResult.then(function (res) {
                            if (res[1].length === 0) {
                                basemapDeferred.resolve(baseMapArray);
                                return;
                            }
                            array.forEach(res, function (data, innerIdx) {
                                if (innerIdx === 0) {
                                    array.forEach(data[1].itemData.baseMap.baseMapLayers, function (baseMapLayer, idx) {
                                        if (baseMapLayer.url) {
                                            thumbnailSrc = (data[1].item.thumbnail === null) ? dojo.configData.NoThumbnail : dojo.configData.PortalAPIURL + "content/items/" + data[1].item.id + "/info/" + data[1].item.thumbnail;
                                            baseMapArray.push({
                                                ThumbnailSource: thumbnailSrc,
                                                Name: data[1].itemData.baseMap.title,
                                                MapURL: baseMapLayer.url
                                            });
                                        }
                                    });
                                } else {
                                    /**
                                    * If group owner & title are not configured, fetch the basemap collections from AGOL using BasemapGallery widget
                                    */
                                    array.forEach(data[1].itemData.baseMap.baseMapLayers, function (baseMapLayer, idx) {
                                        /**If basemap layer is already present in the "baseMapArray", skip it
                                        */
                                        array.forEach(baseMapArray, function (arrayBasemap) {
                                            if (baseMapLayer.url && arrayBasemap.MapURL === baseMapLayer.url) {
                                                pushWebmap = false;
                                            } else {
                                                pushWebmap = true;
                                            }
                                        });
                                        if (pushWebmap) {
                                            thumbnailSrc = (data[1].item.thumbnail === null) ? dojo.configData.NoThumbnail : dojo.configData.PortalAPIURL + "content/items/" + data[1].item.id + "/info/" + data[1].item.thumbnail;
                                            baseMapArray.push({
                                                ThumbnailSource: thumbnailSrc,
                                                Name: data[1].itemData.baseMap.title,
                                                MapURL: baseMapLayer.url
                                            });
                                        }
                                    });
                                }
                            });
                            basemapDeferred.resolve(baseMapArray);
                        });
                    }, function (err) {
                        console.log(err);
                    });
                }, function (err) {
                    console.log(err);
                });
            }
        }
    });
});
