/*global define,dojo,dojoConfig,esri,alert,console */
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
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/_base/lang",
    "esri/arcgis/utils",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/query",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/dom-class",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!application/js/library/nls/localizedStrings",
    "dojo/string",
    "esri/map",
    "esri/layers/ImageParameters",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/tasks/ProjectParameters",
    "esri/graphic",
    "esri/domUtils",
    "dojo/_base/Color",
    "widgets/baseMapGallery/baseMapGallery",
    "widgets/legends/legends",
    "esri/geometry/Extent",
    "esri/dijit/HomeButton",
    "dojo/topic",
    "esri/urlUtils",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/tasks/servicearea",
    "esri/tasks/NATypes",
    "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/_base/array",
    "dojo/DeferredList",
    "dojo/_base/Deferred",
    "dojo/promise/all",
    "widgets/infoWindow/infoWindow",
    "dojo/domReady!"
], function (declare, domConstruct, domStyle, lang, esriUtils, on, dom, domAttr, query, Query, QueryTask, domClass, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, sharedNls, string, esriMap, ImageParameters, FeatureLayer, GraphicsLayer, ProjectParameters, Graphic, domUtils, Color, BaseMapGallery, Legends, GeometryExtent, HomeButton, topic, urlUtils, ArcGISDynamicMapServiceLayer, servicearea, NATypes, GeometryService, BufferParameters, SimpleFillSymbol, SimpleMarkerSymbol, array, DeferredList, Deferred, all, InfoWindow) {
    //========================================================================================================================//
    return declare([_WidgetBase], {
        map: null,
        tempGraphicsLayerId: "esriGraphicsLayerMapSettings",
        sharedNls: sharedNls,
        stagedSearch: null,
        newLeft: 0,
        logoContainer: null,
        firstStop: null,
        infoWindowPanel: null,
        operationalLayers: null,
        /**
        * initialize map object
        *
        * @class
        * @name widgets/mapSettings/mapSettings
        */
        postCreate: function () {
            /**
            * set map extent to default extent specified in configuration file
            * @param {string} dojo.configData.DefaultExtent Default extent of map specified in configuration file
            */
            urlUtils.addProxyRule({
                urlPrefix: dojo.configData.ServiceAreaTask,
                proxyUrl: dojoConfig.baseURL + dojo.configData.ProxyUrl
            });
            var graphicsLayer;
            this.logoContainer = (query(".map .logo-sm") && query(".map .logo-sm")[0]) || (query(".map .logo-med") && query(".map .logo-med")[0]);
            graphicsLayer = new GraphicsLayer();
            graphicsLayer.id = this.tempGraphicsLayerId;
            this.infoWindowPanel = new InfoWindow({ infoWindowWidth: dojo.configData.InfoPopupWidth, infoWindowHeight: dojo.configData.InfoPopupHeight });
            topic.subscribe("removeOperationalLayer", this._removeOperationalLayer);
            topic.subscribe("clearFeatureList", lang.hitch(this, function () {
                this._clearSelectedFeature();
            }));
            this._updateMapOnSwitchWorkflow();
            topic.subscribe("SliderChange", lang.hitch(this, function (defaultMinutes, addressLocation, drive) {
                topic.publish("loadingIndicatorHandler");
                this._createServiceArea(defaultMinutes, addressLocation, drive);
            }));
            topic.subscribe("setInfoWindowOnMap", lang.hitch(this, function (infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight) {
                this._onSetInfoWindowPosition(infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight);
            }));
            topic.subscribe("initializeWebmap", lang.hitch(this, function () {
                this._initializeWebmap(graphicsLayer);
            }));
            topic.subscribe("loadBasemapToggleWidget", lang.hitch(this, function () {
                this._updateMapOnSwitchWorkflow();
            }));
            topic.subscribe("showInfoWindowOnMap", lang.hitch(this, function (point, map) {
                this._showInfoWindowOnMap(point, map);
            }));
        },

        /**
        * update workflow on switching
        * @memberOf widgets/mapSettings/mapSettings
        */
        _updateMapOnSwitchWorkflow: function () {
            var extentPoints, graphicsLayer, home, layer;
            extentPoints = dojo.configData && dojo.configData.DefaultExtent && dojo.configData.DefaultExtent.split(",");
            graphicsLayer = new GraphicsLayer();
            graphicsLayer.id = this.tempGraphicsLayerId;
            if (this.map) {
                this.map.destroy();
                this.map = null;
            }
            this.map = esriMap("esriCTParentDivContainer", {});
            layer = new esri.layers.ArcGISTiledMapServiceLayer(dojo.configData.BaseMapLayers[0].MapURL, { id: "defaultBasemap", visible: true });
            this.map.addLayer(layer, 0);
            dojo.selectedBasemapIndex = 0;
            /**
            * load esri 'Home Button' widget
            */
            home = this._addHomeButton();
            this.map.on("load", lang.hitch(this, function () {
                var mapDefaultExtent, extent;
                extent = this._getQueryString('extent');
                if (extent === "") {
                    mapDefaultExtent = new GeometryExtent({ "xmin": parseFloat(extentPoints[0]), "ymin": parseFloat(extentPoints[1]), "xmax": parseFloat(extentPoints[2]), "ymax": parseFloat(extentPoints[3]), "spatialReference": { "wkid": this.map.spatialReference.wkid} });
                    this.map.setExtent(mapDefaultExtent);
                } else {
                    mapDefaultExtent = extent.split(',');
                    mapDefaultExtent = new GeometryExtent({ "xmin": parseFloat(mapDefaultExtent[0]), "ymin": parseFloat(mapDefaultExtent[1]), "xmax": parseFloat(mapDefaultExtent[2]), "ymax": parseFloat(mapDefaultExtent[3]), "spatialReference": { "wkid": this.map.spatialReference.wkid} });
                    this.map.setExtent(mapDefaultExtent);
                }
                this.map.addLayer(graphicsLayer);
                domConstruct.place(home.domNode, query(".esriSimpleSliderIncrementButton")[0], "after");
                home.extent = mapDefaultExtent;
                home.startup();
                this._showBasMapGallery();
                topic.publish("setMap", this.map);
                this._activateMapEvents();
                if (dojo.workFlowIndex) {
                    this._addLogoUrl();
                    this._addOperationalLayer();
                    if (dojo.share && dojo.configData.Workflows[dojo.workFlowIndex].WebMapId) {
                        this.shareDeferred = new Deferred();
                        this.shareDeferred.then(lang.hitch(this, function () {
                            this._addLayerLegend();
                        }));
                    } else {
                        this._addLayerLegend();
                    }
                }
            }), function (err) {
                domStyle.set(dom.byId("esriCTParentDivContainer"), "display", "none");
                alert(err.message);
            });
        },

        /**
        * activate events on map
        * @memberOf widgets/mapSettings/mapSettings
        */
        _activateMapEvents: function () {
            var updateLegend;
            this.map.on("click", lang.hitch(this, function (evt) {
                dojo.showInfo = false;
                dojo.setMapTipPosition = false;
                dojo.openInfowindow = false;
                dojo.mapClickedPoint = evt.mapPoint;
                if (evt.graphic) {
                    topic.publish("loadingIndicatorHandler");
                    this._showInfoWindowOnMap(evt.mapPoint, this.map);
                }
            }));
            this.map.on("extent-change", lang.hitch(this, function (evt) {
                topic.publish("setMapTipPosition", dojo.selectedMapPoint, this.map, this.infoWindowPanel);
                clearTimeout(updateLegend);
                updateLegend = setTimeout(lang.hitch(this, function () {
                    if (dojo.workFlowIndex && dojo.configData.Workflows[dojo.workFlowIndex].WebMapId) {
                        topic.publish("updateLegends", evt.extent);
                    }
                }), 2000);
            }));
        },

        /**
        * create service area on map
        * @memberOf widgets/mapSettings/mapSettings
        */
        _createServiceArea: function (defaultMinutes, addressLocation, drive) {
            var _self, params, features, facilities, serviceAreaTask;
            this.firstStop = addressLocation;
            _self = this;
            params = new esri.tasks.ServiceAreaParameters();
            if (drive) {
                params.defaultBreaks = [defaultMinutes];
            } else {
                params.defaultBreaks = [defaultMinutes / 10];
            }
            params.outSpatialReference = this.map.spatialReference;
            params.returnFacilities = false;
            params.outputPolygons = NATypes.OutputPolygon.SIMPLIFIED;
            params.impedanceAttribute = "TravelTime";
            params.trimOuterPolygon = true;
            params.trimPolygonDistance = 200;
            params.trimPolygonDistanceUnits = "esriNAUMeters";
            features = [];
            if (addressLocation.geometry.type === "polygon") {

                features.push(new Graphic(addressLocation.geometry.getCentroid()));
            } else {
                features.push(addressLocation);
            }
            facilities = new esri.tasks.FeatureSet();
            facilities.features = features;
            params.facilities = facilities;
            serviceAreaTask = new esri.tasks.ServiceAreaTask(dojo.configData.ServiceAreaTask);
            serviceAreaTask.solve(params, function (solveResult) {
                var polygonSymbol;
                polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                    new dojo.Color([parseInt(dojo.configData.DriveTimePolygonSymbology.LineSymbolColor.split(",")[0], 10),
                                         parseInt(dojo.configData.DriveTimePolygonSymbology.LineSymbolColor.split(",")[1], 10),
                                         parseInt(dojo.configData.DriveTimePolygonSymbology.LineSymbolColor.split(",")[2], 10),
                                         parseFloat(dojo.configData.DriveTimePolygonSymbology.LineSymbolTransparency.split(",")[0], 10)]), 1), new dojo.Color([parseInt(dojo.configData.DriveTimePolygonSymbology.FillSymbolColor.split(",")[0], 10), parseInt(dojo.configData.DriveTimePolygonSymbology.FillSymbolColor.split(",")[1], 10), parseInt(dojo.configData.DriveTimePolygonSymbology.FillSymbolColor.split(",")[2], 10), parseFloat(dojo.configData.DriveTimePolygonSymbology.FillSymbolTransparency.split(",")[0], 10)]));
                dojo.forEach(solveResult.serviceAreaPolygons, function (serviceArea) {
                    if (_self.legendObject) {
                        _self.legendObject.queryGeometry = serviceArea;
                    }
                    _self.serviceAreaGraphic = serviceArea;
                    serviceArea.geometry.spatialReference = _self.map.spatialReference;
                    serviceArea.setSymbol(polygonSymbol);
                    _self._updateBufferGeometry(serviceArea, _self);
                    _self._selectFeatures(serviceArea);
                    dojo.bufferArea = true;
                });
            }, function (err) {
                console.log(err);
                topic.publish("hideLoadingIndicatorHandler");
            });
        },

        /**
        * update service/buffer area geometry
        * @memberOf widgets/mapSettings/mapSettings
        */
        _updateBufferGeometry: function (serviceArea, _self) {
            var i, graphicsArray = _self.map.getLayer("esriGraphicsLayerMapSettings").graphics;
            for (i = 0; i < graphicsArray.length; i++) {
                if (graphicsArray[i].geometry.type !== "point") {
                    _self.map.getLayer("esriGraphicsLayerMapSettings").remove(graphicsArray[i]);
                    i--;
                }
            }
            _self.map.getLayer("esriGraphicsLayerMapSettings").add(serviceArea);
        },

        /**
        * find feautures on selection
        * @memberOf widgets/mapSettings/mapSettings
        */
        _selectFeatures: function (bufferGeometry) {
            var deferredArray, selectedFeaturesGroup, selectedFeatures, deferredListFeatureResult;
            this.map.setExtent(bufferGeometry.geometry.getExtent().expand(2));
            deferredArray = [];
            selectedFeaturesGroup = [];
            selectedFeatures = [];
            this._clearSelectedFeature();
            this.map.reorderLayer(this.map.getLayer("esriGraphicsLayerMapSettings"), this.map.graphicsLayerIds.length - 1);
            array.forEach(this.operationalLayers, lang.hitch(this, function (featureResult, arrayIndex) {
                var queryFeature, featureLayer, featureLayerResult;
                queryFeature = new Query();
                featureLayer = featureResult;
                queryFeature.geometry = bufferGeometry.geometry;
                queryFeature.maxAllowableOffset = 500;
                queryFeature.outSpatialReference = this.map.spatialReference;
                if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId) {
                    featureLayer = featureLayer.layerObject;
                }
                featureLayerResult = featureLayer.selectFeatures(queryFeature, FeatureLayer.SELECTION_NEW, lang.hitch(this, function (result) {
                    var deferred, cloneArray, displayField, settingsIndex, res;
                    deferred = new Deferred();
                    deferred.resolve(result);
                    try {
                        for (settingsIndex = 0; settingsIndex < dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings.length; settingsIndex++) {
                            if (featureLayer.url === dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[settingsIndex].QueryURL) {
                                displayField = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[settingsIndex].SearchDisplayFields;
                                break;
                            }
                        }
                        if (result.length) {
                            for (res = 0; res < result.length; res++) {
                                selectedFeatures.push({
                                    attribute: result[res].attributes,
                                    name: dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[settingsIndex].SearchDisplayTitle,
                                    geometry: result[res].geometry,
                                    layerId: result[res].getLayer().layerId,
                                    layerIndex: arrayIndex,
                                    fields: result[0].getLayer().fields,
                                    featureName: displayField ? string.substitute(displayField, result[res].attributes) : dojo.configData.ShowNullValueAs
                                });
                            }
                            cloneArray = dojo.clone(selectedFeatures);
                            selectedFeaturesGroup.push(cloneArray);
                            selectedFeatures.length = 0;
                        }
                    } catch (ex) {
                        console.log(ex);
                    }
                    /*if feature is point*/
                    if (featureLayer.geometryType === "esriGeometryPoint") {
                        this.map.reorderLayer(featureLayer, this.map.graphicsLayerIds.length - 1);
                    }
                    return deferred.promise;
                }), lang.hitch(this, function (err) {
                    console.log(err);
                }));
                deferredArray.push(featureLayerResult);
            }));
            deferredListFeatureResult = new DeferredList(deferredArray);
            deferredListFeatureResult.then(lang.hitch(this, function () {
                topic.publish("hideLoadingIndicatorHandler");
                if (selectedFeaturesGroup.length === 0) {
                    return;
                }
                topic.publish("_createList", selectedFeaturesGroup);
                topic.publish("updateLegends", this.serviceAreaGraphic.geometry);
            }));
        },

        /**
        * clear features from map
        * @memberOf widgets/mapSettings/mapSettings
        */
        _clearSelectedFeature: function () {
            if (dojo.workFlowIndex && lang.trim(dojo.configData.Workflows[dojo.workFlowIndex].WebMapId) === "") {
                array.forEach(this.operationalLayers, lang.hitch(this, function (featureLayer) {
                    if (!featureLayer.layerObject) {
                        featureLayer.clearSelection();
                    }
                }));
            }
            if (this.infoWindowPanel.isShowing) {
                domUtils.hide(query(".esriCTinfoWindow")[0]);
                domStyle.set(query(".esriCTinfoWindow")[0], "visibility", "hidden");
                this.infoWindowPanel.isShowing = false;
            }
        },

        /**
        * add operational layers on map from config file
        * @memberOf widgets/mapSettings/mapSettings
        */
        _addOperationalLayer: function () {
            var featureLayer, i, layerUrl, infowindowSettings = [], mapSearchSettings = [], configOperationalLayers = [];
            this._clearSelectedFeature();
            if (this.map.getLayer("esriGraphicsLayerMapSettings")) {
                this.map.getLayer("esriGraphicsLayerMapSettings").clear();
            }
            i = 0;
            while (i < this.map.graphicsLayerIds.length) {
                if (this.map.graphicsLayerIds[i] && (this.map.graphicsLayerIds[i].match(/feature/g) || this.map.graphicsLayerIds[i].match(/EconomicDevelopment/g))) {
                    this.map.removeLayer(this.map.getLayer(this.map.graphicsLayerIds[i]));
                } else {
                    i++;
                }
            }
            this.operationalLayers = [];
            if (dojo.workFlowIndex && dojo.configData.Workflows[dojo.workFlowIndex].WebMapId === "") {
                configOperationalLayers = dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers;
                for (i = 0; i < configOperationalLayers.length; i++) {
                    featureLayer = new FeatureLayer(configOperationalLayers[i].ServiceURL, {
                        id: "feature" + i,
                        mode: FeatureLayer.MODE_SELECTION,
                        outFields: ["*"],
                        maxAllowableOffset: 250,
                        displayOnPan: true
                    });
                    layerUrl = configOperationalLayers[i].ServiceURL.split('/');
                    layerUrl = layerUrl[layerUrl.length - 1];
                    this.map.addLayer(featureLayer);
                    mapSearchSettings[i] = this._getConfigSearchSetting(layerUrl);
                    mapSearchSettings[i].QueryURL = configOperationalLayers[i].ServiceURL;
                    if (!mapSearchSettings[i]) {
                        alert(sharedNls.errormessage.noSearchSettingAvailable);
                    }
                    infowindowSettings[i] = this._getConfigInfoData(layerUrl);
                    this.operationalLayers.push(featureLayer);
                }
                dojo.configData.Workflows[dojo.workFlowIndex].InfowindowSettings = infowindowSettings;
                dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings = mapSearchSettings;
            }
        },

        /**
        * update infowindow content when it's position is set on map
        * @memberOf widgets/mapSettings/mapSettings
        */
        _onSetInfoWindowPosition: function (infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight) {
            this.infoWindowPanel.resize(infoPopupWidth, infoPopupHeight);
            this.infoWindowPanel.hide();
            this.infoWindowPanel.setTitle(infoTitle);
            domStyle.set(query(".esriCTinfoWindow")[0], "visibility", "visible");
            this.infoWindowPanel.show(divInfoDetailsTab, screenPoint);
            dojo.infoWindowIsShowing = true;
        },

        /**
        * generate query urls for operational layers
        * @memberOf widgets/mapSettings/mapSettings
        */
        _generateLayerURL: function () {
            var str, layerId, i, searchSettings, index;
            if (!dojo.configData.Workflows[dojo.workFlowIndex].WebMapId && lang.trim(dojo.configData.Workflows[dojo.workFlowIndex].WebMapId).length === 0) {
                for (i = 0; i < dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers.length; i++) {
                    if (dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers[i].ServiceURL) {
                        str = dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers[i].ServiceURL.split('/');
                        layerId = str[str.length - 1];
                        searchSettings = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings;
                        for (index = 0; index < dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings.length; index++) {
                            if (searchSettings[index].Title && searchSettings[index].QueryLayerId) {
                                if (layerId === searchSettings[index].QueryLayerId) {
                                    searchSettings[index].QueryURL = str.join("/");
                                }
                            }
                        }
                    }
                }
            }
        },

        /**
        * add logo on map
        * @memberOf widgets/mapSettings/mapSettings
        */
        _addLogoUrl: function () {
            var CustomLogoUrl = dojo.configData.LogoURL, imgSource;
            if (CustomLogoUrl && lang.trim(CustomLogoUrl).length !== 0) {
                if (CustomLogoUrl.match("http:") || CustomLogoUrl.match("https:")) {
                    imgSource = CustomLogoUrl;
                } else {
                    imgSource = dojoConfig.baseURL + CustomLogoUrl;
                }
                if (!query('.esriCTMapLogo')[0]) {
                    domConstruct.create("img", { "src": imgSource, "class": "esriCTMapLogo" }, dom.byId("esriCTParentDivContainer"));
                }
            }
        },

        /**
        * load esri 'Home Button' widget which sets map extent to default extent
        * @return {object} Home button widget
        * @memberOf widgets/mapSettings/mapSettings
        */
        _addHomeButton: function () {
            var home = new HomeButton({
                map: this.map
            }, domConstruct.create("div", {}, null));
            return home;
        },

        /**
        * initialize basemap gallery
        * @memberOf widgets/mapSettings/mapSettings
        */
        _showBasMapGallery: function () {
            if (this.basMapGallery) {
                this.basMapGallery.destroy();
            }
            this.basMapGallery = new BaseMapGallery({
                map: this.map
            }, domConstruct.create("div", {}, null));
            return this.basMapGallery;
        },

        /**
        * remove operational layers from map
        * @memberOf widgets/mapSettings/mapSettings
        */
        _removeOperationalLayer: function (map) {
            var i;
            for (i = 0; i < dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers.length; i++) {
                if (map.getLayer(i)) {
                    map.removeLayer(map.getLayer(i));
                }
            }
        },

        /**
        * intialize legend
        * @memberOf widgets/mapSettings/mapSettings
        */
        _addLegendBox: function () {
            if (this.legendObject) {
                this.legendObject.destroy();
            }
            this.legendObject = new Legends({
                map: this.map,
                isExtentBasedLegend: true
            }, domConstruct.create("div", {}, null));
            return this.legendObject;
        },

        /**
        * add operational layers to legend
        * @memberOf widgets/mapSettings/mapSettings
        */
        _addLayerLegend: function () {
            var mapServerArray, legendObject, i;
            domClass.add(query(".esriControlsBR")[0], "esriLogoLegend");
            mapServerArray = [];
            for (i = 0; i < this.operationalLayers.length; i++) {
                if (this.operationalLayers[i].url) {
                    mapServerArray.push(this.operationalLayers[i].url);
                }
            }
            legendObject = this._addLegendBox();
            legendObject.startup(mapServerArray);
            topic.publish("setMaxLegendLength");
        },

        /**
        * clear grapphics from map
        * @memberOf widgets/mapSettings/mapSettings
        */
        _clearMapGraphics: function () {
            this.map.getLayer("esriGraphicsLayerMapSettings").clear();
            this._clearSelectedFeature();
            this.infoWindowPanel.hide();
            topic.publish("resetLocatorContainer");
        },

        /**
        * get map instance
        * @memberOf widgets/mapSettings/mapSettings
        */
        getMapInstance: function () {
            return this.map;
        },

        /**
        * get query string
        * @memberOf widgets/mapSettings/mapSettings
        */
        _getQueryString: function (key) {
            var _default, regex, qs;
            if (!_default) {
                _default = "";
            }
            key = key.replace(/[\[]/, "\\").replace(/[\]]/, "\\");
            regex = new RegExp("[\\$&]" + key + "=([^&#]*)");
            qs = regex.exec(window.location.href);
            if (!qs) {
                return _default;
            }
            return qs[1];
        },

        /**
        * initialize webamp
        * @memberOf widgets/mapSettings/mapSettings
        */
        _initializeWebmap: function (graphicsLayer) {
            if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId && lang.trim(dojo.configData.Workflows[dojo.workFlowIndex].WebMapId).length !== 0) {
                var mapDeferred = esriUtils.createMap(dojo.configData.Workflows[dojo.workFlowIndex].WebMapId, "esriCTParentDivContainer", {
                    mapOptions: {
                        slider: true
                    },
                    ignorePopups: true
                });
                mapDeferred.then(lang.hitch(this, function (response) {
                    var extent, mapDefaultExtent, home;
                    this.map.destroy();
                    this.map = null;
                    this.map = response.map;
                    dojo.selectedBasemapIndex = null;
                    if (response.itemInfo.itemData.baseMap.baseMapLayers && response.itemInfo.itemData.baseMap.baseMapLayers[0].id) {
                        if (response.itemInfo.itemData.baseMap.baseMapLayers[0].id !== "defaultBasemap") {
                            this.map.getLayer(response.itemInfo.itemData.baseMap.baseMapLayers[0].id).id = "defaultBasemap";
                            this.map._layers.defaultBasemap = this.map.getLayer(response.itemInfo.itemData.baseMap.baseMapLayers[0].id);
                            delete this.map._layers[response.itemInfo.itemData.baseMap.baseMapLayers[0].id];
                            this.map.layerIds[0] = "defaultBasemap";
                        }
                    }
                    this.map.onUpdateEnd = lang.hitch(this, function () {
                        topic.publish("hideLoadingIndicatorHandler");
                    });
                    this.map.addLayer(graphicsLayer);
                    this.operationalLayers = response.itemInfo.itemData.operationalLayers;
                    if (this.shareDeferred) {
                        this.shareDeferred.resolve();
                    }
                    extent = this._getQueryString('extent');
                    if (extent !== "") {
                        mapDefaultExtent = extent.split(',');
                        mapDefaultExtent = new GeometryExtent({ "xmin": parseFloat(mapDefaultExtent[0]), "ymin": parseFloat(mapDefaultExtent[1]), "xmax": parseFloat(mapDefaultExtent[2]), "ymax": parseFloat(mapDefaultExtent[3]), "spatialReference": { "wkid": this.map.spatialReference.wkid} });
                        this.map.setExtent(mapDefaultExtent);
                    }
                    this._addLogoUrl();
                    home = this._addHomeButton();
                    topic.publish("setMap", this.map);
                    domConstruct.place(home.domNode, query(".esriSimpleSliderIncrementButton")[0], "after");
                    domClass.add(query(".esriControlsBR")[0], "esriLogoLegend");
                    home.extent = mapDefaultExtent;
                    home.startup();
                    this._activateMapEvents();
                    this._fetchWebMapData(response);
                    this._showBasMapGallery();

                    setTimeout(lang.hitch(this, function () {
                        this._addLayerLegend();
                    }), 5000);

                    topic.publish("locateAddressOnMap");
                }), function (err) {
                    domStyle.set(dom.byId("esriCTParentDivContainer"), "display", "none");
                    alert(err.message);
                });
            }
        },

        /**
        * fetch webmap operational layers and generate settings
        * @memberOf widgets/mapSettings/mapSettings
        */
        _fetchWebMapData: function (response) {
            var str, webMapDetails, serviceTitle, operationalLayerId, lastIndex,
                infowindowCurrentSettings = [], i, lastSlashIndex, idx, popupField, webmapSearchSettings = [];
            webMapDetails = response.itemInfo.itemData;
            serviceTitle = [];
            for (i = 0; i < webMapDetails.operationalLayers.length; i++) {
                operationalLayerId = lang.trim(webMapDetails.operationalLayers[i].title);
                str = webMapDetails.operationalLayers[i].url.split('/');
                lastIndex = str[str.length - 1];
                if (isNaN(lastIndex) || lastIndex === "") {
                    if (lastIndex === "") {
                        serviceTitle[operationalLayerId] = webMapDetails.operationalLayers[i].url;
                    } else {
                        serviceTitle[operationalLayerId] = webMapDetails.operationalLayers[i].url + "/";
                    }
                } else {
                    lastSlashIndex = webMapDetails.operationalLayers[i].url.lastIndexOf("/");
                    serviceTitle[operationalLayerId] = webMapDetails.operationalLayers[i].url.substring(0, lastSlashIndex + 1);
                }
            }

            for (i = 0; i < webMapDetails.operationalLayers.length; i++) {
                str = webMapDetails.operationalLayers[i].url.split('/');
                lastIndex = str[str.length - 1];
                webmapSearchSettings[i] = this._getConfigSearchSetting(lastIndex);
                if (!webmapSearchSettings[i]) {
                    delete this.operationalLayers[i];
                } else {
                    webmapSearchSettings[i].QueryURL = webMapDetails.operationalLayers[i].url;
                    if (webMapDetails.operationalLayers[i].popupInfo) {
                        infowindowCurrentSettings[i] = this._getConfigInfoData(webmapSearchSettings[i].QueryLayerId);
                        if (!infowindowCurrentSettings[i]) {
                            infowindowCurrentSettings[i] = {};
                            infowindowCurrentSettings[i].QueryLayerId = webmapSearchSettings[i].QueryLayerId;
                        }
                        infowindowCurrentSettings[i].InfoQueryURL = webMapDetails.operationalLayers[i].url;
                        if (webMapDetails.operationalLayers[i].popupInfo.title.split("{").length > 1) {
                            infowindowCurrentSettings[i].InfoWindowHeaderField = dojo.string.trim(webMapDetails.operationalLayers[i].popupInfo.title.split("{")[0]);
                            for (idx = 1; idx < webMapDetails.operationalLayers[i].popupInfo.title.split("{").length; idx++) {
                                infowindowCurrentSettings[i].InfoWindowHeaderField += " ${" + dojo.string.trim(webMapDetails.operationalLayers[i].popupInfo.title.split("{")[idx]);
                            }
                        } else {
                            if (dojo.string.trim(webMapDetails.operationalLayers[i].popupInfo.title) !== "") {
                                infowindowCurrentSettings[i].InfoWindowHeaderField = dojo.string.trim(webMapDetails.operationalLayers[i].popupInfo.title);
                            } else {
                                infowindowCurrentSettings[i].InfoWindowHeaderField = dojo.configData.ShowNullValueAs;
                            }
                        }
                        infowindowCurrentSettings[i].InfoWindowData = [];
                        for (popupField in webMapDetails.operationalLayers[i].popupInfo.fieldInfos) {
                            if (webMapDetails.operationalLayers[i].popupInfo.fieldInfos.hasOwnProperty(popupField)) {
                                if (webMapDetails.operationalLayers[i].popupInfo.fieldInfos[popupField].visible) {
                                    infowindowCurrentSettings[i].InfoWindowData.push({
                                        "DisplayText": webMapDetails.operationalLayers[i].popupInfo.fieldInfos[popupField].label + ":",
                                        "FieldName": "${" + webMapDetails.operationalLayers[i].popupInfo.fieldInfos[popupField].fieldName + "}"
                                    });
                                }
                            }
                        }
                    }
                }
            }

            dojo.configData.Workflows[dojo.workFlowIndex].InfowindowSettings = infowindowCurrentSettings;
            dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings = webmapSearchSettings;

        },

        /**
        * get infowindow setting from config
        * @param{string} searchKey is layer id to find infowindow setting in config
        * @memberOf widgets/mapSettings/mapSettings
        */
        _getConfigInfoData: function (searchKey) {
            var i, infoWindowSettings = dojo.configData.Workflows[dojo.workFlowIndex].InfowindowSettings;
            if (infoWindowSettings) {
                for (i = 0; i < infoWindowSettings.length; i++) {
                    if (infoWindowSettings[i].QueryLayerId === searchKey) {
                        return infoWindowSettings[i];
                    }
                }
            } else {
                return 0;
            }
        },

        /**
        * get search setting from config
        * @param{string} searchKey is layer id to find search setting in config
        * @memberOf widgets/mapSettings/mapSettings
        */
        _getConfigSearchSetting: function (searchKey) {
            var i, configSearchSettings = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings;
            for (i = 0; i < configSearchSettings.length; i++) {
                if (configSearchSettings[i].QueryLayerId === searchKey) {
                    return configSearchSettings[i];
                }
            }
        },

        /**
        * show infowwindow on map
        * @param{object} mapPoint is location on map to show infowindow
        * @memberOf widgets/mapSettings/mapSettings
        */
        _showInfoWindowOnMap: function (mapPoint, map) {
            this.counter = 0;
            var onMapFeaturArray, index, deferredListResult, featureArray, j, i;
            onMapFeaturArray = [];
            for (index = 0; index < dojo.configData.Workflows[dojo.workFlowIndex].InfowindowSettings.length; index++) {
                this._executeQueryTask(index, mapPoint, onMapFeaturArray);
            }
            deferredListResult = new DeferredList(onMapFeaturArray);
            featureArray = [];
            deferredListResult.then(lang.hitch(this, function (result) {
                if (result) {
                    for (j = 0; j < result.length; j++) {
                        if (result[j][1]) {
                            if (result[j][1].features.length > 0) {
                                for (i = 0; i < result[j][1].features.length; i++) {
                                    featureArray.push({
                                        attr: result[j][1].features[i],
                                        layerId: j,
                                        fields: result[j][1].fields
                                    });
                                }
                            }
                        }
                    }
                    this._fetchQueryResults(featureArray, map, mapPoint);
                }
            }), function (err) {
                alert(err.message);
            });
        },

        /**
        * execute query task to find infowindow data
        * @param{string} index is layer index in operational layer array
        * @memberOf widgets/mapSettings/mapSettings
        */
        _executeQueryTask: function (index, mapPoint, onMapFeaturArray) {
            var esriQuery, queryTask, queryOnRouteTask;
            queryTask = new esri.tasks.QueryTask(dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[index].QueryURL);
            esriQuery = new esri.tasks.Query();
            esriQuery.outSpatialReference = this.map.spatialReference;
            esriQuery.returnGeometry = true;
            esriQuery.geometry = this._extentFromPoint(mapPoint);
            esriQuery.outFields = ["*"];
            queryOnRouteTask = queryTask.execute(esriQuery, lang.hitch(this, function (results) {
                var deferred = new Deferred();
                deferred.resolve(results);
                return deferred.promise;
            }), function (err) {
                alert(err.message);
            });
            onMapFeaturArray.push(queryOnRouteTask);
        },

        /**
        * get extent from mappoint
        * @memberOf widgets/mapSettings/mapSettings
        */
        _extentFromPoint: function (point) {
            var screenPoint, sourcePoint, destinationPoint, sourceMapPoint, destinationMapPoint, tolerance = 3;
            screenPoint = this.map.toScreen(point);
            sourcePoint = new esri.geometry.Point(screenPoint.x - tolerance, screenPoint.y + tolerance);
            destinationPoint = new esri.geometry.Point(screenPoint.x + tolerance, screenPoint.y - tolerance);
            sourceMapPoint = this.map.toMap(sourcePoint);
            destinationMapPoint = this.map.toMap(destinationPoint);
            return new GeometryExtent(sourceMapPoint.x, sourceMapPoint.y, destinationMapPoint.x, destinationMapPoint.y, this.map.spatialReference);
        },

        /**
        * featch infowindow data from query task result
        * @memberOf widgets/mapSettings/mapSettings
        */
        _fetchQueryResults: function (featureArray, map, mapPoint) {
            var point, _this, featurePoint;
            if (featureArray.length > 0) {
                if (featureArray.length === 1) {
                    domClass.remove(query(".esriCTdivInfoRightArrow")[0], "esriCTShowInfoRightArrow");
                    if (featureArray[0].attr.geometry.type === "polygon") {
                        featurePoint = featureArray[0].attr.geometry.getCentroid();
                    } else {
                        featurePoint = featureArray[0].attr.geometry;
                    }
                    topic.publish("showInfoWindow", featurePoint, featureArray[0].attr.attributes, featureArray[0].fields, featureArray[0].layerId, null, null, map);
                } else {
                    this.count = 0;
                    dojo.setMapTipPosition = false;
                    domAttr.set(query(".esriCTdivInfoTotalFeatureCount")[0], "innerHTML", '/' + featureArray.length);
                    if (featureArray[this.count].attr.geometry.type === "polyline") {
                        point = featureArray[this.count].attr.geometry.getPoint(0, 0);
                        topic.publish("showInfoWindow", point, featureArray[0].attr.attributes, featureArray[0].fields, featureArray[0].layerId, featureArray, this.count, map);
                    } else {
                        if (featureArray[0].attr.geometry.type === "polygon") {
                            point = mapPoint;
                        } else {
                            point = featureArray[0].attr.geometry;
                        }
                        topic.publish("showInfoWindow", point, featureArray[0].attr.attributes, featureArray[0].fields, featureArray[0].layerId, featureArray, this.count, map);
                    }
                    topic.publish("hideLoadingIndicatorHandler");
                    _this = this;
                    query(".esriCTdivInfoRightArrow")[0].onclick = function () {
                        dojo.showInfo = true;
                        _this._nextInfoContent(featureArray, map, point);
                    };
                    query(".esriCTdivInfoLeftArrow")[0].onclick = function () {
                        dojo.showInfo = true;
                        _this._previousInfoContent(featureArray, map, point);
                    };
                }
            } else {
                topic.publish("hideLoadingIndicatorHandler");
            }
        },

        /**
        * display next page of infowindow on clicking of next arrow
        * @memberOf widgets/mapSettings/mapSettings
        */
        _nextInfoContent: function (featureArray, map, point) {
            if (!domClass.contains(query(".esriCTdivInfoRightArrow")[0], "disableArrow")) {
                if (this.count < featureArray.length) {
                    this.count++;
                }
                if (featureArray[this.count]) {
                    domClass.add(query(".esriCTdivInfoRightArrow")[0], "disableArrow");
                    topic.publish("showInfoWindow", point, featureArray[this.count].attr.attributes, featureArray[this.count].fields, featureArray[this.count].layerId, featureArray, this.count, map);
                }
            }
        },

        /**
        * display previous page of infowindow on clicking of previous arrow
        * @memberOf widgets/mapSettings/mapSettings
        */
        _previousInfoContent: function (featureArray, map, point) {
            if (!domClass.contains(query(".esriCTdivInfoLeftArrow")[0], "disableArrow")) {
                if (this.count !== 0 && this.count < featureArray.length) {
                    this.count--;
                }
                if (featureArray[this.count]) {
                    domClass.add(query(".esriCTdivInfoLeftArrow")[0], "disableArrow");
                    topic.publish("showInfoWindow", point, featureArray[this.count].attr.attributes, featureArray[this.count].fields, featureArray[this.count].layerId, featureArray, this.count, map);
                }
            }
        }
    });
});
