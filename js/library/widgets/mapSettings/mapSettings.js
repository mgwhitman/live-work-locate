/*global dojo, define, document */
/*jslint sloppy:true */
/** @license
| Version 10.2
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
    "dojo/i18n!nls/localizedStrings",
    "dojo/string",
    "esri/map",
    "esri/layers/ImageParameters",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/tasks/ProjectParameters",
    "esri/graphic",
    "dojo/_base/Color",
    "widgets/baseMapGallery/baseMapGallery",
    "widgets/legends/legends",
    "dojo/text!../legends/templates/legendsTemplate.html",
    "esri/geometry/Extent",
    "esri/dijit/HomeButton",
    "dojo/topic",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/tasks/servicearea",
    "esri/tasks/NATypes",
    "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/graphic",
    "dojo/topic",
    "dojo/_base/array",
    "dojo/DeferredList",
    "dojo/_base/Deferred",
    "dojo/promise/all",
    "esri/tasks/RouteTask",
    "esri/tasks/RouteParameters",
    "esri/tasks/FeatureSet",
    "esri/SpatialReference",
    "esri/units",
    "dojo/aspect",
    "dojo/domReady!"
],
     function (declare, domConstruct, domStyle, lang, esriUtils, on, dom, domAttr, query, Query, QueryTask, domClass, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, string, esriMap, ImageParameters, FeatureLayer, GraphicsLayer, ProjectParameters, Graphic, Color, baseMapGallery, legends, template, geometryExtent, HomeButton, topic, arcGISDynamicMapServiceLayer, servicearea, NATypes, GeometryService, BufferParameters, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, topic, array, DeferredList, Deferred, all, RouteTask, RouteParameters, FeatureSet, SpatialReference, Units, aspect) {

         //========================================================================================================================//

         return declare([_WidgetBase], {

             map: null,
             tempGraphicsLayerId: "esriGraphicsLayerMapSettings",
             nls: nls,
             stagedSearch: null,
             newLeft: 0,
             logoContainer: null,
             firstStop: null,
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
                 this.logoContainer = query(".map .logo-sm") && query(".map .logo-sm")[0] || query(".map .logo-med") && query(".map .logo-med")[0];
                 var extentPoints = dojo.configData && dojo.configData.DefaultExtent && dojo.configData.DefaultExtent.split(",");
                 var graphicsLayer = new GraphicsLayer();
                 graphicsLayer.id = this.tempGraphicsLayerId;
                 topic.subscribe("_addOperationalLayer", lang.hitch(this, function () {
                     this._addOperationalLayer();

                 }));
                 topic.subscribe("removeOperationalLayer", this._removeOperationalLayer);
                 topic.subscribe("clearFeatureList", lang.hitch(this, function () {
                     this._clearSelectedFeature();
                 }));

                 /**
                 * load map
                 * @param {string} dojo.configData.BaseMapLayers Basemap settings specified in configuration file
                 */

                 if (dojo.configData.WebMapId && lang.trim(dojo.configData.WebMapId).length != 0) {
                     var mapDeferred = esriUtils.createMap(dojo.configData.WebMapId, "esriCTParentDivContainer", {
                         mapOptions: {
                             slider: true
                         },
                         ignorePopups: true
                     });
                     mapDeferred.then(lang.hitch(this, function (response) {
                         this.map = response.map;
                         this.map.addLayer(graphicsLayer);
                         var webMapDetails = response.itemInfo.itemData;
                         this._addLogoUrl();
                         var home = this._addHomeButton();
                         domConstruct.place(home.domNode, query(".esriSimpleSliderIncrementButton")[0], "after");
                         home.startup();
                     }));
                 }
                 else {
                     this.map = esriMap("esriCTParentDivContainer", {
                         basemap: dojo.configData.BaseMapLayers[0].Key
                     });

                     /**
                     * load esri 'Home Button' widget
                     */
                     var home = this._addHomeButton();

                     /* set position of home button widget after map is successfuly loaded
                     * @param {array} dojo.configData.OperationalLayers List of operational Layers specified in configuration file
                     */
                     this.map.on("load", lang.hitch(this, function () {
                         var mapDefaultExtent = new geometryExtent({ "xmin": parseFloat(extentPoints[0]), "ymin": parseFloat(extentPoints[1]), "xmax": parseFloat(extentPoints[2]), "ymax": parseFloat(extentPoints[3]), "spatialReference": { "wkid": this.map.spatialReference.wkid } });
                         this.map.setExtent(mapDefaultExtent);
                         this.map.addLayer(graphicsLayer);
                         domConstruct.place(home.domNode, query(".esriSimpleSliderIncrementButton")[0], "after");
                         home.extent = mapDefaultExtent;
                         home.startup();
                         if (dojo.configData.BaseMapLayers.length > 1) {

                             this._showBasMapGallery();
                             this.map.addLayer(graphicsLayer);

                             topic.subscribe("SliderChange", lang.hitch(this, function (defaultMinutes, addressLocation, drive) {
                                 this._createServiceArea(defaultMinutes, addressLocation, drive);
                             }));
                         }
                         this.map.addLayer(graphicsLayer);
                         var _self = this;
                         this.map.on("extent-change", function () {
                             topic.publish("setMapTipPosition", dojo.selectedMapPoint, _self.map, _self.infoWindowPanel);
                         });
                     }));
                     topic.subscribe("setInfoWindowOnMap", lang.hitch(this, function (infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight) {
                         this._onSetInfoWindowPosition(infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight);
                     }));
                 }
             },

             _createServiceArea: function (defaultMinutes, addressLocation, drive) {
                 this.firstStop = addressLocation;
                 esriConfig.defaults.io.alwaysUseProxy = true;
                 var _self, params, features, result, serviceAreaSymbol, polygonSymbol;
                 _self = this;
                 params = new esri.tasks.ServiceAreaParameters();
                 if (drive) {
                     params.defaultBreaks = [defaultMinutes / dojo.configData.DriveTimeSliderSettings.defaultMinutes];
                 } else {
                     params.defaultBreaks = [defaultMinutes / (dojo.configData.DriveTimeSliderSettings.defaultMinutes * 10)];
                 }
                 params.outSpatialReference = this.map.spatialReference;
                 params.returnFacilities = false;
                 params.outputPolygons = NATypes.OutputPolygon.DETAILED;

                 features = [];
                 if (addressLocation.geometry.type == "polygon") {

                     features.push(new Graphic(addressLocation.geometry.getCentroid()));
                 } else {
                     features.push(addressLocation);
                 }

                 facilities = new esri.tasks.FeatureSet();
                 facilities.features = features;
                 params.facilities = facilities;
                 serviceAreaTask = new esri.tasks.ServiceAreaTask(dojo.configData.serviceAreaTask);
                 serviceAreaTask.solve(params, function (solveResult) {
                     result = solveResult;
                     serviceAreaSymbol = new esri.symbol.SimpleFillSymbol(
                       esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                       new esri.symbol.SimpleLineSymbol(
                         esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                         new dojo.Color([255, 255, 102, .4])
                         ),
                       new dojo.Color([255, 255, 102, .4])
                     );
                     polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                 new dojo.Color([255, 255, 102]), .4), new dojo.Color([255, 255, 102, .4]));
                     dojo.forEach(solveResult.serviceAreaPolygons, function (serviceArea) {
                         if (_self.legendObject) {
                             _self.legendObject.queryGeometry = serviceArea;
                         }
                         _self.serviceAreaGraphic = serviceArea;
                         serviceArea.geometry.spatialReference = _self.map.spatialReference;
                         serviceArea.setSymbol(polygonSymbol);
                         _self._updateBufferGeometry(serviceArea, _self);
                         _self._selectFeatures(serviceArea);
                     });
                 }, function (err) {
                 });
             },

             _updateBufferGeometry: function (serviceArea, _self) {
                 var bufferGraphics = _self.map.getLayer("esriGraphicsLayerMapSettings").graphics;
                 var graphicsIndex = bufferGraphics.length;
                 while (graphicsIndex > 0) {
                     _self.map.getLayer("esriGraphicsLayerMapSettings").remove(bufferGraphics[graphicsIndex]);
                     graphicsIndex--;
                 }
                 _self.map.getLayer("esriGraphicsLayerMapSettings").add(serviceArea);
             },

             _selectFeatures: function (bufferGeometry) {
                 var _this = this;
                 var deferredArray = [];
                 var selectedFeaturesGroup = [];
                 var selectedFeatures = [];
                 var _extentResult;
                 this._clearSelectedFeature();
                 array.forEach(this.operationalLayers, lang.hitch(this, function (featureResult, arrayIndex) {
                     var query = new Query();
                     var featureLayer = featureResult;
                     query.geometry = bufferGeometry.geometry;
                     query.outSpatialReference = this.map.spatialReference;
                     var featureLayerResult = featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, lang.hitch(this, function (result) {
                         var deferred = new Deferred();
                         deferred.resolve(result);
                         var displayField;
                         for (var i = 0; i < dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings.length; i++) {
                             if (featureLayer.url == dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[i].QueryURL) {
                                 displayField = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[i].SearchDisplayFields;
                                 break;
                             }
                         }
                         if (result.length) {
                             for (var res = 0; res < result.length; res++) {

                                 selectedFeatures.push({
                                     attribute: result[res].attributes,
                                     name: result[res].getLayer().name,
                                     geometry: result[res].geometry,
                                     layerId: result[res].getLayer().layerId,
                                     featureName: displayField ? string.substitute(displayField, result[res].attributes) : dojo.configData.ShowNullValueAs
                                 });
                             }
                             cloneArray = dojo.clone(selectedFeatures);
                             selectedFeaturesGroup.push(cloneArray);
                             selectedFeatures.length = 0;
                         }

                         return deferred.promise;
                     }), lang.hitch(this, function (err) {
                     }));
                     deferredArray.push(featureLayerResult);
                 }));
                 var deferredListFeatureResult = new DeferredList(deferredArray);
                 deferredListFeatureResult.then(lang.hitch(this, function (result) {
                     this.map.setExtent(bufferGeometry.geometry.getExtent().expand(2));
                     this.map.reorderLayer(this.map.getLayer("esriGraphicsLayerMapSettings"), this.map.graphicsLayerIds.length - 1);
                     this._findRoute(selectedFeaturesGroup);
                 }));
             },
             _clearSelectedFeature: function () {
                 array.forEach(this.operationalLayers, lang.hitch(this, function (featureLayer) {
                     featureLayer.clearSelection();
                 }));
             },

             _findRoute: function (selectedFeaturesGroup) {
                 var defferedArray = [];
                 var routeTask = new RouteTask(dojo.configData.routeTask);
                 var routeParams = new RouteParameters();
                 routeParams.stops = new FeatureSet();
                 routeParams.returnRoutes = false;
                 routeParams.returnDirections = true;
                 routeParams.directionsLengthUnits = Units.MILES;
                 routeParams.outSpatialReference = new SpatialReference({ wkid: 102100 });
                 routeParams.stops.features.push(this.firstStop);
                 array.forEach(selectedFeaturesGroup, lang.hitch(this, function (featureGroup, outerIndex) {
                     array.forEach(featureGroup, lang.hitch(this, function (feature, innerIndex) {
                         var stopPushpin = dojoConfig.baseURL + dojo.configData.LocatorSettings.DefaultLocatorSymbol;
                         locatorMarkupSymbol = new esri.symbol.PictureMarkerSymbol(stopPushpin, dojo.configData.LocatorSettings.MarkupSymbolSize.width, dojo.configData.LocatorSettings.MarkupSymbolSize.height);
                         var stopGraphic = new esri.Graphic(feature.geometry, locatorMarkupSymbol, {}, null);
                         if (feature.geometry.type == "point") {
                             if (routeParams.stops.features.length == 2) {
                                 routeParams.stops.features.pop();
                             }
                             routeParams.stops.features.push(stopGraphic);
                             var routeTaskResult = routeTask.solve(routeParams, lang.hitch(this, function (route) {
                                 selectedFeaturesGroup[outerIndex][innerIndex].routelength = route.routeResults[0].directions.summary.totalLength;
                                 var deferred = new Deferred();
                                 deferred.resolve(route);
                                 return deferred.promise;
                             }), lang.hitch(this, function (err) {
                             }));
                             defferedArray.push(routeTaskResult);
                         }
                     }));
                 }));
                 var deferredListResult = new DeferredList(defferedArray);
                 deferredListResult.then(lang.hitch(this, function (result) {
                     topic.publish("_createList", selectedFeaturesGroup);
                 }));
             },

             _addOperationalLayer: function () {
                 this.operationalLayers = [];
                 for (var k = 0 ; k < dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers.length; k++) {
                     var featureLayer = new FeatureLayer(dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers[k].ServiceURL, {
                         id: k,
                         mode: FeatureLayer.MODE_SELECTION,
                         outFields: ["*"],
                         displayOnPan: false
                     });

                     this.map.addLayer(featureLayer);
                     this.operationalLayers.push(featureLayer);
                 }
                 this._addLayerLegend();
             },


             _onSetInfoWindowPosition: function (infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight) {
                 this.infoWindowPanel.resize(infoPopupWidth, infoPopupHeight);
                 this.infoWindowPanel.hide();
                 this.infoWindowPanel.setTitle(infoTitle);
                 this.infoWindowPanel.show(divInfoDetailsTab, screenPoint);
             },

             _slideRight: function () {
                 var difference = query(".divlegendContainer")[0].offsetWidth - query(".divlegendContent")[0].offsetWidth;
                 if (this.newLeft > difference) {
                     domStyle.set(query(".divLeftArrow")[0], "display", "block");
                     domStyle.set(query(".divLeftArrow")[0], "cursor", "pointer");
                     this.newLeft = this.newLeft - (200 + 9);
                     domStyle.set(query(".divlegendContent")[0], "left", (this.newLeft) + "px");
                     this._resetSlideControls();
                 }
             },

             _slideLeft: function () {
                 if (this.newLeft < 0) {
                     if (this.newLeft > -(200 + 9)) {
                         this.newLeft = 0;
                     } else {
                         this.newLeft = this.newLeft + (200 + 9);
                     }
                     if (this.newLeft >= -10) {
                         this.newLeft = 0;
                     }
                     domStyle.set(query(".divlegendContent")[0], "left", (this.newLeft) + "px");
                     this._resetSlideControls();
                 }
             },

             _resetSlideControls: function () {
                 if (this.newLeft > query(".divlegendContainer")[0].offsetWidth - query(".divlegendContent")[0].offsetWidth) {
                     domStyle.set(query(".divRightArrow")[0], "display", "block");
                     domStyle.set(query(".divRightArrow")[0], "cursor", "pointer");
                 } else {
                     domStyle.set(query(".divRightArrow")[0], "display", "none");
                     domStyle.set(query(".divRightArrow")[0], "cursor", "default");
                 }
                 if (this.newLeft == 0) {
                     domStyle.set(query(".divLeftArrow")[0], "display", "none");
                     domStyle.set(query(".divLeftArrow")[0], "cursor", "default");
                 } else {
                     domStyle.set(query(".divLeftArrow")[0], "display", "block");
                     domStyle.set(query(".divLeftArrow")[0], "cursor", "pointer");
                 }
             },

             _generateLayerURL: function () {
                 var str, layerTitle, layerId;
                 for (var i = 0; i < dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers.length; i++) {
                     if (dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers[i].ServiceURL) {
                         str = dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers[i].ServiceURL.split('/');
                         layerTitle = str[str.length - 3];
                         layerId = str[str.length - 1];
                         searchSettings = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings;
                         for (var index = 0; index < dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings.length; index++) {
                             if (searchSettings[index].Title && searchSettings[index].QueryLayerId) {
                                 if (layerTitle == searchSettings[index].Title && layerId == searchSettings[index].QueryLayerId) {
                                     searchSettings[index].QueryURL = str.join("/");
                                 }
                             }
                         }
                     }
                 }
             },

             _addLogoUrl: function () {
                 if (dojo.configData.LogoUrl && lang.trim(dojo.configData.LogoUrl).length != 0) {
                     domStyle.set(this.logoContainer, "display", "none");
                     var esriCTLogoUrl = domConstruct.create("img", { "class": "esriCTLogoUrl", "src": dojo.configData.LogoUrl });
                     domConstruct.place(esriCTLogoUrl, query(".esriControlsBR")[0]);
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

             _showBasMapGallery: function () {
                 var basMapGallery = new baseMapGallery({
                     map: this.map
                 }, domConstruct.create("div", {}, null));
                 return basMapGallery;
             },

             /**
             * load and add operational layers depending on their LoadAsServiceType specified in configuration file
             * @param {int} index Layer order specified in configuration file
             * @param {object} layerInfo Layer settings specified in configuration file
             * @memberOf widgets/mapSettings/mapSettings
             */
             _addOperationalLayerToMap: function (index, layerInfo) {
                 if (layerInfo.LoadAsServiceType.toLowerCase() == "feature") {
                     var layerMode = null;
                     switch (layerInfo.layermode && layerInfo.layermode.toLowerCase()) {
                         case "ondemand":
                             layerMode = FeatureLayer.MODE_ONDEMAND;
                             break;
                         case "selection":
                             layerMode = FeatureLayer.MODE_SELECTION;
                             break;
                         default:
                             layerMode = FeatureLayer.MODE_SNAPSHOT;
                             break;
                     }
                     var featureLayer = new FeatureLayer(layerInfo.ServiceURL, {
                         id: index,
                         mode: layerMode,
                         outFields: ["*"],
                         displayOnPan: false
                     });
                     this.map.addLayer(featureLayer);

                 } else if (layerInfo.LoadAsServiceType.toLowerCase() == "dynamic") {

                     this._addServiceLayers(index, layerInfo.ServiceURL);
                 }
             },

             _removeOperationalLayer: function (map) {

                 for (var i = 0; i < dojo.configData.Workflows[dojo.workFlowIndex].OperationalLayers.length; i++) {
                     if (map.getLayer(i)) {
                         map.removeLayer(map.getLayer(i));
                     }
                 }
             },

             _addDynamicLayerService: function (layerInfo) {
                 clearTimeout(this.stagedSearch);
                 var str, lastIndex, layerTitle;
                 str = layerInfo.ServiceURL.split('/');
                 lastIndex = str[str.length - 1];
                 if (isNaN(lastIndex) || lastIndex == "") {
                     if (lastIndex == "") {
                         layerTitle = str[str.length - 3];
                     } else {
                         layerTitle = str[str.length - 2];
                     }
                 } else {
                     layerTitle = str[str.length - 3];
                 }
                 this._addServiceLayers(layerTitle, layerInfo.ServiceURL);
             },

             _addServiceLayers: function (layerId, layerURL) {
                 var dynamicLayer, layertype, imageParams, lastIndex;
                 layertype;
                 imageParams = new ImageParameters();
                 lastIndex = layerURL.lastIndexOf('/');
                 dynamicLayerId = layerURL.substr(lastIndex + 1);
                 if (isNaN(dynamicLayerId) || dynamicLayerId == "") {
                     if (isNaN(dynamicLayerId)) {
                         dynamicLayer = layerURL + "/";
                     } else if (dynamicLayerId == "") {
                         dynamicLayer = layerURL;
                     }
                     layertype = dynamicLayer.substring(((dynamicLayer.lastIndexOf("/")) + 1), (dynamicLayer.length));
                     this._createDynamicServiceLayer(dynamicLayer, imageParams, layerId);
                 } else {
                     imageParams.layerIds = [dynamicLayerId];
                     dynamicLayer = layerURL.substring(0, lastIndex);
                     layertype = dynamicLayer.substring(((dynamicLayer.lastIndexOf("/")) + 1), (dynamicLayer.length));
                     this._createDynamicServiceLayer(dynamicLayer, imageParams, layerId);
                 }
             },

             _createDynamicServiceLayer: function (dynamicLayer, imageParams, layerId) {
                 var dynamicMapService = new arcGISDynamicMapServiceLayer(dynamicLayer, {
                     id: layerId,
                     visible: true
                 });
                 this.map.addLayer(dynamicMapService);
             },

             _addLegendBox: function () {
                 this.legendObject = new legends({
                     map: this.map,
                     isExtentBasedLegend: true,
                 }, domConstruct.create("div", {}, null));
                 return this.legendObject;
             },

             _addLayerLegend: function () {

                 domClass.add(query(".logo-med")[0], "mapLogoLegend");

                 var mapServerArray, legendObject
                 mapServerArray = [];
                 for (var i = 0 ; i < dojo.configData.Workflows[i].OperationalLayers.length; i++) {
                     if (dojo.configData.Workflows[i].OperationalLayers[i].ServiceURL) {
                         mapServerArray.push(dojo.configData.Workflows[i].OperationalLayers[i].ServiceURL);
                     }
                 }
                 legendObject = this._addLegendBox();
                 legendObject.startup(mapServerArray);
                 topic.publish("setMaxLegendLength");
             },
             getMapInstance: function () {
                 return this.map;
             }
         });
     });