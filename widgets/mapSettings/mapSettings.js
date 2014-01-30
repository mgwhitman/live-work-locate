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
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/_base/array",
    "dijit/_WidgetBase",
    "dojo/i18n!nls/localizedStrings",
    "esri/map",
    "esri/layers/ImageParameters",
    "esri/dijit/Directions",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/dijit/Basemap",
    "dojo/_base/Color",
    "widgets/baseMapGallery/baseMapGallery",
    "esri/geometry/Extent",
    "esri/dijit/HomeButton",
    "esri/SpatialReference",
    "dojo/topic",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/request",
    "dojo/domReady!"
],
     function (declare, domConstruct, domStyle, lang, esriUtils, on, dom, domAttr, query, domClass, domGeom, array, _WidgetBase, nls, esriMap, ImageParameters, Directions, FeatureLayer, GraphicsLayer, SimpleLineSymbol, SimpleRenderer, basemap, Color, baseMapGallery, geometryExtent, HomeButton, spatialReference, topic, arcGISDynamicMapServiceLayer, esriRequest) {

         //========================================================================================================================//

         return declare([_WidgetBase], {

             map: null,
             tempGraphicsLayerId: "esriGraphicsLayerMapSettings",
             nls: nls,
             stagedSearch: null,
             newLeft: 0,
             logoContainer: null,


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

                 topic.subscribe("removeOperationalLayer", this._removeOperationalLayer);
                 /**
                 * load map
                 * @param {string} dojo.configData.BaseMapLayers Basemap settings specified in configuration file
                 */
                 this._generateLayerURL(dojo.configData.OperationalLayers);
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
                         domConstruct.place(home.domNode, query(".esriSimpleSliderIncrementButton")[0], "after");
                         home.extent = mapDefaultExtent;
                         home.startup();

                         if (dojo.configData.BaseMapLayers.length > 1) {

                             this._showBasMapGallery();
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
             _slideRight: function () {
                 var difference = query(".divlegendContainer")[0].offsetWidth - query(".divlegendContent")[0].offsetWidth;
                 if (this.newLeft > difference) {
                     domStyle.set(query(".divLeftArrow")[0], "display", "block");
                     domStyle.set(query(".divLeftArrow")[0], "cursor", "pointer");
                     this.newLeft = this.newLeft - (200 + 9);
                     domStyle.set(query(".divlegendContent")[0], "left", (this.newLeft) + "px");
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

                 }
             },
             _generateLayerURL: function (operationalLayers) {
                 for (var i = 0; i < operationalLayers.length; i++) {
                     if (operationalLayers[i].ServiceURL) {
                         var str = operationalLayers[i].ServiceURL.split('/');
                         var layerTitle = str[str.length - 3];
                         var layerId = str[str.length - 1];
                         var infoWindowSettings = dojo.configData.InfoWindowSettings;
                         var searchSettings = dojo.configData.SearchAnd511Settings;
                         for (var index = 0; index < searchSettings.length; index++) {
                             if (searchSettings[index].Title && searchSettings[index].QueryLayerId) {
                                 if (layerTitle == searchSettings[index].Title && layerId == searchSettings[index].QueryLayerId) {
                                     searchSettings[index].QueryURL = str.join("/");
                                 }
                             }
                         }
                         for (var infoIndex = 0; infoIndex < infoWindowSettings.length; infoIndex++) {
                             if (infoWindowSettings[infoIndex].Title && infoWindowSettings[infoIndex].QueryLayerId) {
                                 if (layerTitle == infoWindowSettings[infoIndex].Title && layerId == infoWindowSettings[infoIndex].QueryLayerId) {
                                     infoWindowSettings[infoIndex].InfoQueryURL = str.join("/");
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
                 var key = dojo.layerKey;
                 for (var i in dojo.configData.Workflows[key].OperationalLayers) {
                     if (map.getLayer(i)) {
                         map.removeLayer(map.getLayer(i));
                     }
                 }
             },

             _addDynamicLayerService: function (layerInfo) {
                 clearTimeout(this.stagedSearch);
                 var str = layerInfo.ServiceURL.split('/');
                 var lastIndex = str[str.length - 1];
                 if (isNaN(lastIndex) || lastIndex == "") {
                     if (lastIndex == "") {
                         var layerTitle = str[str.length - 3];
                     } else {
                         var layerTitle = str[str.length - 2];
                     }
                 } else {
                     var layerTitle = str[str.length - 3];
                 }
                 this._addServiceLayers(layerTitle, layerInfo.ServiceURL);
             },

             _addServiceLayers: function (layerId, layerURL) {
                 var dynamicLayer;
                 var layertype;
                 var imageParams = new ImageParameters();
                 var lastIndex = layerURL.lastIndexOf('/');
                 var dynamicLayerId = layerURL.substr(lastIndex + 1);
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

             getMapInstance: function () {
                 return this.map;
             }
         });
     });