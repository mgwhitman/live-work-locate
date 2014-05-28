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
    "dojo/_base/array",
    "dojo/query",
    "dojo/dom-attr",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/text!./templates/legendsTemplate.html",
    "dojo/topic",
    "dojo/Deferred",
    "dojo/DeferredList",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!application/js/library/nls/localizedStrings",
    "esri/request",
    "esri/tasks/query",
    "esri/tasks/QueryTask"
], function (declare, domConstruct, domStyle, lang, array, query, domAttr, on, dom, domClass, template, topic, Deferred, DeferredList, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, sharedNls, esriRequest, Query, QueryTask) {
    //========================================================================================================================//

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        sharedNls: sharedNls,
        divLegendList: null,
        layerObject: null,
        logoContainer: null,
        _layerCollection: {},
        _rendererArray: [],
        newLeft: 0,
        total: 0,
        legendListWidth: [],
        /**
        * create legends widget
        * @class
        * @name widgets/legends/legends
        */
        postCreate: function () {
            this._createLegendContainerUI();
            this.logoContainer = (query(".map .logo-sm") && query(".map .logo-sm")[0])
                || (query(".map .logo-med") && query(".map .logo-med")[0]);
            topic.subscribe("setMaxLegendLength", lang.hitch(this, function () {
                this._setMaxLegendLengthResult();
            }));

            topic.subscribe("setMinLegendLength", lang.hitch(this, function () {
                this._setMinLegendLengthResult();
            }));
            topic.subscribe("setMap", lang.hitch(this, function (map) {
                this.map = map;
            }));
            topic.subscribe("updateLegends", lang.hitch(this, function (geometry) {
                this._UpdatedLegend(geometry);
            }));
        },

        /**
        * update legend data
        * @memberOf widgets/legends/legends
        */
        _UpdatedLegend: function (geometry) {
            var defQueryArray = [], queryResult, layer, layerObject, rendererObject, index, resultListArray = [],
                queryDefList, i, currentTime;
            currentTime = new Date();
            //esriQuery.where = currentTime.getTime().toString() + "=" + currentTime.getTime().toString();

            this._resetLegendContainer();
            this._rendererArray.length = 0;
            if (!geometry) {
                domConstruct.empty(this.divlegendContainer);
                domConstruct.create("span", { innerHTML: sharedNls.errorMessages.noLegend, "class": "divNoLegendContainer" }, this.divlegendContainer);
                domStyle.set(this.divRightArrow, "display", "none");
                return;
            }
            for (layer in this._layerCollection) {
                if (this._layerCollection.hasOwnProperty(layer)) {
                    layerObject = this._layerCollection[layer];
                    rendererObject = this._layerCollection[layer].legend;
                    if (rendererObject.length) {
                        for (index = 0; index < rendererObject.length; index++) {
                            rendererObject[index].layerUrl = layer;
                            this._rendererArray.push(rendererObject[index]);
                            queryResult = this._fireQueryOnExtentChange(geometry);
                            if (layerObject.rendererType === "uniqueValue") {
                                if (rendererObject[index].values) {
                                    queryResult.where = layerObject.fieldName + " = " + "'" + rendererObject[index].values[0] + "'" + " AND " + currentTime.getTime().toString() + "=" + currentTime.getTime().toString();
                                } else {
                                    queryResult.where = currentTime.getTime().toString() + "=" + currentTime.getTime().toString();
                                }
                            } else if (layerObject.rendererType === "classBreaks") {
                                queryResult.where = rendererObject[index - 1] ? layerObject.fieldName + ">" + rendererObject[index - 1].values[0] + " AND " + layerObject.fieldName + "<=" + rendererObject[index].values[0] : layerObject.fieldName + "=" + rendererObject[index].values[0] + " AND " + currentTime.getTime().toString() + "=" + currentTime.getTime().toString();
                            } else {
                                queryResult.where = currentTime.getTime().toString() + "=" + currentTime.getTime().toString();
                            }
                            this._executeQueryTask(layer, defQueryArray, queryResult);
                        }
                    }
                }
            }
            resultListArray = [];
            this.legendListWidth = [];
            if (defQueryArray.length > 0) {
                domConstruct.empty(this.divlegendContainer);
                domStyle.set(this.divRightArrow, "display", "none");
                domStyle.set(query(".esriCTLeftArrow")[0], "display", "none");
                domConstruct.create("span", { innerHTML: sharedNls.tooltips.loadingText, "class": "divlegendLoadingContainer" }, this.divlegendContainer);
                queryDefList = new DeferredList(defQueryArray);
                queryDefList.then(lang.hitch(this, function (result) {
                    domConstruct.empty(this.divlegendContainer);
                    for (i = 0; i < result.length; i++) {
                        if (result[i][0] && result[i][1] > 0) {
                            resultListArray.push(result[i][1]);
                            this._addLegendSymbol(this._rendererArray[i], this._layerCollection[this._rendererArray[i].layerUrl].layerName);
                            this.legendListWidth.push(this.divLegendlist.offsetWidth);
                        }
                    }
                    this._addlegendListWidth(this.legendListWidth);
                    if (resultListArray.length === 0) {
                        domConstruct.create("span", { innerHTML: sharedNls.errorMessages.noLegend, "class": "divNoLegendContainer" }, this.divlegendContainer);
                    }
                }), function (err) {
                    console.log(err);
                }, function (err2) {
                    console.log(err2);
                });
            }
        },

        /**
        * set legend container width to maximum
        * @memberOf widgets/legends/legends
        */
        _setMaxLegendLengthResult: function () {
            this._resetLegendContainer();
            domClass.add(this.logoContainer, "mapLogoUrl");
            if (this.legendrightbox) {
                if (query('.legenboxInner')[0]) {
                    domClass.remove(query('.legenboxInner')[0], "rightBorderNone");
                }
                domClass.add(this.legendrightbox, "esriCTLegendRightBoxShift");
            }
            if (this.divRightArrow) {
                domClass.add(this.divRightArrow, "esriCTRightArrowShift");
            }
            this._addlegendListWidth(this.legendListWidth);
        },

        /**
        * set legend container width to minimum
        * @memberOf widgets/legends/legends
        */
        _setMinLegendLengthResult: function () {
            this._resetLegendContainer();
            domClass.remove(this.logoContainer, "mapLogoUrl");
            if (this.legendrightbox) {
                if (query('.legenboxInner')[0]) {
                    domClass.add(query('.legenboxInner')[0], "rightBorderNone");
                }
                domClass.replace(this.legendrightbox, "esriCTLegendRightBox", "esriCTLegendRightBoxShift");
            }
            if (this.divRightArrow) {
                domClass.replace(this.divRightArrow, "esriCTRightArrow", "esriCTRightArrowShift");
            }
            this._addlegendListWidth(this.legendListWidth);
        },

        /**
        * reset legend container
        * @memberOf widgets/legends/legends
        */
        _resetLegendContainer: function () {
            this.newLeft = 0;
            domStyle.set(query(".divlegendContent")[0], "left", (this.newLeft) + "px");
            this._resetSlideControls();
        },

        /**
        * create legendcontainer UI
        * @memberOf widgets/legends/legends
        */
        _createLegendContainerUI: function () {
            var divlegendContainer, divLeftArrow, legendOuterContainer;
            legendOuterContainer = query('.esriCTdivLegendbox', dom.byId("esriCTParentDivContainer"));

            if (query('.legendbox')[0]) {
                domConstruct.empty(query('.legendbox')[0]);
            }
            if (legendOuterContainer[0]) {
                domConstruct.destroy(legendOuterContainer[0].parentElement);
            }
            this.esriCTLegendContainer = domConstruct.create("div", {}, dom.byId("esriCTParentDivContainer"));
            this.esriCTLegendContainer.appendChild(this.esriCTdivLegendbox);
            divlegendContainer = domConstruct.create("div", { "class": "divlegendContainer" }, this.divlegendList);
            this.divlegendContainer = domConstruct.create("div", { "class": "divlegendContent" }, divlegendContainer);
            divLeftArrow = domConstruct.create("div", { "class": "esriCTLeftArrow" }, this.legendbox);
            domStyle.set(divLeftArrow, "display", "none");
            on(divLeftArrow, "click", lang.hitch(this, function () {
                this._slideLeft();
            }));
            this.divRightArrow = domConstruct.create("div", { "class": "esriCTRightArrow" }, this.legendbox);
            on(this.divRightArrow, "click", lang.hitch(this, function () {
                this._slideRight();
            }));
        },

        /**
        * slide legend data to right
        * @memberOf widgets/legends/legends
        */
        _slideRight: function () {
            var difference = query(".divlegendContainer")[0].offsetWidth - query(".divlegendContent")[0].offsetWidth;
            if (this.newLeft > difference) {
                domStyle.set(query(".esriCTLeftArrow")[0], "display", "block");
                domStyle.set(query(".esriCTLeftArrow")[0], "cursor", "pointer");
                this.newLeft = this.newLeft - (200 + 9);
                domStyle.set(query(".divlegendContent")[0], "left", (this.newLeft) + "px");
                this._resetSlideControls();
            }
        },

        /**
        * slide legend data to left
        * @memberOf widgets/legends/legends
        */
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
                domStyle.set(this.divlegendContainer, "left", (this.newLeft) + "px");
                this._resetSlideControls();
            }
        },

        /**
        * reset slider controls
        * @memberOf widgets/legends/legends
        */
        _resetSlideControls: function () {
            if (this.newLeft > query(".divlegendContainer")[0].offsetWidth - query(".divlegendContent")[0].offsetWidth) {
                domStyle.set(this.divRightArrow, "display", "block");
                domStyle.set(this.divRightArrow, "cursor", "pointer");
            } else {
                domStyle.set(this.divRightArrow, "display", "none");
                domStyle.set(this.divRightArrow, "cursor", "default");
            }
            if (this.newLeft === 0) {
                domStyle.set(query(".esriCTLeftArrow")[0], "display", "none");
                domStyle.set(query(".esriCTLeftArrow")[0], "cursor", "default");
            } else {
                domStyle.set(query(".esriCTLeftArrow")[0], "display", "block");
                domStyle.set(query(".esriCTLeftArrow")[0], "cursor", "pointer");
            }
        },

        /**
        * fires query for the renderer present in the current extent
        * @memberOf widgets/legends/legends
        */
        _fireQueryOnExtentChange: function (currentExtent) {
            var queryParams = new Query();
            queryParams.outFields = ["*"];
            queryParams.geometry = currentExtent.getExtent();
            queryParams.spatialRelationship = Query.SPATIAL_REL_CONTAINS;
            queryParams.returnGeometry = false;
            return queryParams;
        },

        /**
        * performs query task for the no of features present in the current extent
        * @memberOf widgets/legends/legends
        */
        _executeQueryTask: function (layer, defQueryArray, queryParams) {
            var queryTask, queryRequest, queryDeferred;
            queryTask = new QueryTask(layer);
            queryRequest = queryTask.executeForCount(queryParams, function (count) {
                queryDeferred = new Deferred();
                queryDeferred.resolve(count);
                return queryDeferred.promise;
            }, function (error) {
                console.log(error);
            });
            defQueryArray.push(queryRequest);
        },

        /**
        * initiates the creation of legend
        * @memberOf widgets/legends/legends
        */
        startup: function (layerArray) {
            var mapServerArray = [], mapServerURL, index, defArray = [], params, layersRequest, deferredList;
            for (index = 0; index < layerArray.length; index++) {
                mapServerURL = layerArray[index].split("/");
                mapServerURL.pop();
                mapServerURL = mapServerURL.join("/");
                mapServerArray.push(mapServerURL);
            }

            mapServerArray = this._removeDuplicate(mapServerArray);
            for (index = 0; index < mapServerArray.length; index++) {
                params = {
                    url: mapServerArray[index] + "/legend",
                    content: { f: "json" },
                    handleAs: "json",
                    callbackParamName: "callback"
                };
                layersRequest = esriRequest(params);
                defArray.push(layersRequest.then(this._getLayerDetail, this._displayError));
            }
            deferredList = new DeferredList(defArray);
            deferredList.then(lang.hitch(this, function (result) {
                domConstruct.empty(this.divlegendContainer);
                for (index = 0; index < result.length; index++) {
                    this._createLegendList(result[index][1], mapServerArray[index]);
                }
            }));
        },

        /**
        * get layer details
        * @memberOf widgets/legends/legends
        */
        _getLayerDetail: function (response) {
            var deferred = new Deferred();
            deferred.resolve(response);
            return deferred.promise;
        },

        /**
        * log error message in console
        * @memberOf widgets/legends/legends
        */
        _displayError: function (error) {
            console.log("Error: ", error.message);
        },

        /**
        * add layer field values
        * @memberOf widgets/legends/legends
        */
        _addFieldValue: function () {
            var defArray = [], layerTempArray = [], params, layer, layersRequest, deferredList, layerObject, i;
            for (layer in this._layerCollection) {
                if (this._layerCollection.hasOwnProperty(layer)) {
                    if (this._layerCollection[layer].legend && this._layerCollection[layer].legend.length > 1) {
                        layerTempArray.push(layer);
                        params = {
                            url: layer,
                            content: { f: "json" },
                            handleAs: "json",
                            callbackParamName: "callback"
                        };
                        layersRequest = esriRequest(params);
                        defArray.push(layersRequest.then(this._getLayerDetail, this._displayError));
                    }
                }
            }
            deferredList = new DeferredList(defArray);
            deferredList.then(lang.hitch(this, function (result) {
                for (i = 0; i < result.length; i++) {
                    if (result[i][0]) {
                        layerObject = result[i][1];
                        if (layerObject.drawingInfo && layerObject.drawingInfo.renderer && layerObject.drawingInfo.renderer.type === "uniqueValue") {
                            this._layerCollection[layerTempArray[i]].rendererType = "uniqueValue";
                            this._layerCollection[layerTempArray[i]].fieldName = layerObject.drawingInfo.renderer.field1 || layerObject.drawingInfo.renderer.field2 || layerObject.drawingInfo.renderer.field3;
                        } else if (layerObject.drawingInfo && layerObject.drawingInfo.renderer && layerObject.drawingInfo.renderer.type === "classBreaks") {
                            this._layerCollection[layerTempArray[i]].rendererType = "classBreaks";
                            this._layerCollection[layerTempArray[i]].fieldName = layerObject.drawingInfo.renderer.field;
                        }
                    }
                }
            }));
        },

        /**
        * remove redundant data
        * @memberOf widgets/legends/legends
        */
        _removeDuplicate: function (mapServerArray) {
            var filterArray = [];
            array.filter(mapServerArray, function (item) {
                if (array.indexOf(filterArray, item) === -1) {
                    filterArray.push(item);
                }
            });
            return filterArray;
        },

        /**
        * create legend list
        * @memberOf widgets/legends/legends
        */
        _createLegendList: function (layerList, mapServerUrl) {
            var workFlowUrls = [], layerURL, i, j;
            this.legendListWidth = [];
            for (i = 0; i < dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings.length; i++) {
                if (dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[i].QueryURL) {
                    workFlowUrls.push(dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[i].QueryURL);
                }
            }
            if (layerList) {
                for (i = 0; i < layerList.layers.length; i++) {
                    layerURL = mapServerUrl + '/' + layerList.layers[i].layerId;
                    if (array.indexOf(workFlowUrls, layerURL) !== -1) {
                        this._layerCollection[layerURL] = layerList.layers[i];
                        for (j = 0; j < layerList.layers[i].legend.length; j++) {
                            this._addLegendSymbol(layerList.layers[i].legend[j], layerList.layers[i].layerName);
                            this.legendListWidth.push(this.divLegendlist.offsetWidth);
                        }
                    }
                }
            }
            this._addlegendListWidth(this.legendListWidth);
            this._addFieldValue();
            if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId) {
                this._UpdatedLegend(this.map.extent);
            } else {
                this._UpdatedLegend(null);
            }
        },

        /**
        * set legend container width
        * @memberOf widgets/legends/legends
        */
        _addlegendListWidth: function (legendListWidth) {
            var listWidth = legendListWidth, total = 0, j, boxWidth;
            for (j = 0; j < listWidth.length; j++) {
                total += listWidth[j];
            }

            domStyle.set(this.divlegendContainer, "width", (total + 5) + "px");
            if (this.legendbox) {
                if (domClass.contains(query(".esriCTAddressHolder")[0], "esriCTShowContainerHeight")) {
                    boxWidth = this.legendbox.offsetWidth - query(".esriCTAddressHolder")[0].offsetWidth;
                } else {
                    boxWidth = this.legendbox.offsetWidth;
                }
            } else {
                boxWidth = 0;
            }

            if (total <= 0 || this.divlegendContainer.offsetWidth < boxWidth) {
                domStyle.set(this.divRightArrow, "display", "none");
            } else {
                domStyle.set(this.divRightArrow, "display", "block");
            }
        },

        /**
        * add legend symbol in legend list
        * @memberOf widgets/legends/legends
        */
        _addLegendSymbol: function (legend, layerName) {
            var divLegendImage, image, divLegendLabel;
            this.divLegendlist = domConstruct.create("div", { "class": "divLegendlist" }, this.divlegendContainer);
            divLegendImage = domConstruct.create("div", { "class": "legend" }, null);
            image = this._createImage("data:image/gif;base64," + legend.imageData, "", false, legend.width, legend.height);
            domConstruct.place(image, divLegendImage);
            this.divLegendlist.appendChild(divLegendImage);
            if (legend.label) {
                divLegendLabel = domConstruct.create("div", { "class": "legendlbl", "innerHTML": legend.label }, null);
            } else {
                divLegendLabel = domConstruct.create("div", { "class": "legendlbl", "innerHTML": layerName }, null);
            }
            this.divLegendlist.appendChild(divLegendLabel);
        },

        /*
        * displays the picture marker symbol
        * @memberOf widgets/legends/legends
        */
        _createImage: function (imageSrc, title, isCursorPointer, imageWidth, imageHeight) {
            var imgLocate, imageHeightWidth;
            imgLocate = domConstruct.create("img");
            imageHeightWidth = { width: imageWidth + 'px', height: imageHeight + 'px' };
            domAttr.set(imgLocate, "style", imageHeightWidth);
            if (isCursorPointer) {
                domStyle.set(imgLocate, "cursor", "pointer");
            }
            domAttr.set(imgLocate, "src", imageSrc);
            domAttr.set(imgLocate, "title", title);
            return imgLocate;
        }
    });
});
