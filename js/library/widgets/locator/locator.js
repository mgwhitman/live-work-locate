/*global define,dojo,dojoConfig,alert,console,esri */
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
    "dojo/dom-attr",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-geometry",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/_base/html",
    "dojo/string",
    "esri/tasks/locator",
    "dijit/form/HorizontalSlider",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "dojo/window",
    "esri/tasks/query",
    "esri/symbols/SimpleLineSymbol",
    "esri/geometry/Polyline",
    "dojo/query",
    "../scrollBar/scrollBar",
    "esri/geometry/Point",
    "dojo/Deferred",
    "dojo/DeferredList",
    "esri/tasks/QueryTask",
    "dojo/text!./templates/locatorTemplate.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/_base/Color",
    "esri/geometry/Extent",
    "esri/urlUtils",
    "esri/symbol",
    "dojo/topic",
    "dojo/mouse",
    "esri/tasks/FeatureSet",
    "esri/units",
    "esri/SpatialReference",
    "esri/tasks/RouteTask",
    "esri/tasks/RouteParameters",
    "dojo/i18n!application/js/library/nls/localizedStrings"
], function (declare, domConstruct, domStyle, domAttr, array, lang, on, domGeom, dom, domClass, html, string, Locator, HorizontalSlider, HorizontalRule, HorizontalRuleLabels, dojoWindow, Query, SimpleLineSymbol, Polyline, query, ScrollBar, Point, Deferred, DeferredList, QueryTask, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Color, GeometryExtent, urlUtils, Symbol, topic, mouse, FeatureSet, Units, SpatialReference, RouteTask, RouteParameters, sharedNls) {
    //========================================================================================================================//

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        sharedNls: sharedNls,
        lastSearchString: null,
        stagedSearch: null,
        locatorScrollbar: null,
        geometryArrayForPolyline: [],
        drive: true,
        logoContainer: null,
        selectedPolygon: null,
        /**
        * display locator widget
        *
        * @class
        * @name widgets/locator/locator
        */
        postCreate: function () {
            /**
            * close locator widget if any other widget is opened
            * @param {string} widget Key of the newly opened widget
            */
            urlUtils.addProxyRule({
                urlPrefix: dojo.configData.RouteTask,
                proxyUrl: dojo.configData.ProxyUrl
            });
            urlUtils.addProxyRule({
                urlPrefix: dojo.configData.GeometryService,
                proxyUrl: dojo.configData.ProxyUrl
            });
            this.logoContainer = (query(".map .logo-sm") && query(".map .logo-sm")[0]) || (query(".map .logo-med") && query(".map .logo-med")[0]);
            topic.subscribe("toggleWidget", lang.hitch(this, function (widget) {
                if (widget !== "locator") {
                    if (domGeom.getMarginBox(this.divAddressHolder).h > 0) {
                        domClass.replace(this.domNode, "esriCTTdHeaderSearch", "esriCTTdHeaderSearch-select");
                        if (query('.esriCTdivLegendbox')[0]) {
                            domStyle.set(query('.esriCTdivLegendbox')[0], "zIndex", "1000");
                        }
                        domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
                        topic.publish("setMaxLegendLength");
                        domClass.replace(this.divAddressHolder, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                    }
                } else {
                    if (domClass.contains(this.divAddressHolder, "esriCTHideContainerHeight")) {
                        this._setAddressHolderHeight();
                    }
                }
            }));


            topic.subscribe("_createList", lang.hitch(this, function (featureList) {
                this._createFeatureList(featureList);
            }));

            topic.subscribe("_resetAddressContainer", lang.hitch(this, function () {
                this._resetAddressContainer();

            }));

            topic.subscribe("_setInfoWindowLocation", lang.hitch(this, function () {
                this._setInfoWindowLocation();
            }));

            topic.subscribe("showInfoWindow", lang.hitch(this, function (mapPoint, featureArray, count, isInfoArrowClicked) {
                this._createInfoWindowContent(mapPoint, featureArray, count, isInfoArrowClicked);
            }));
            topic.subscribe("clearSelectedFeature", lang.hitch(this, function () {
                this.map.getLayer("esriGraphicsLayerMapSettings").remove(this.selectedPolygon);
            }));
            topic.subscribe("setMap", lang.hitch(this, function (map) {
                if (this.map) {
                    this.map = map;
                }
                this.resetShareParameters();
            }));
            topic.subscribe("locateAddressOnMap", lang.hitch(this, function () {
                if (window.location.toString().split("$driveType=").length > 1) {
                    if (window.location.toString().split("$driveType=")[1].split("$")[0] === "false") {
                        domClass.replace(this.esriCTimgDrive, "driveIcon", "driveIconSelected");
                        domClass.replace(this.esriCTimgWalk, "walkIconSelected", "walkIcon");
                        this.sliderMessage.innerHTML = this.sliderMessage.innerHTML.replace("drive", "walk");
                        dojo.driveTime = false;
                    }
                }
                this._shareAddress();
            }));
            window.onresize = lang.hitch(this, function () {
                if (domClass.contains(this.divAddressHolder, "esriCTShowContainerHeight")) {
                    if (domStyle.get(this.divSelectedFeature, "display") === "block") {
                        if (query('.esriCTdivLegendbox')[0]) {
                            domStyle.set(query('.esriCTdivLegendbox')[0], "zIndex", "998");
                        }
                        this._createFeatureList(this.selectedFeatureList);
                        domClass.replace(query(".toggleExpandCollapse")[0], "collapse", "expand");
                        domAttr.set(query(".toggleExpandCollapse")[0], "title", dojo.configData.ExpandResultTooltip);
                    }
                }
            });

            this.domNode = domConstruct.create("div", { "title": sharedNls.tooltips.search, "class": "esriCTTdHeaderSearch" }, null);
            domConstruct.place(this.divAddressContainer, dom.byId("esriCTParentDivContainer"));
            this.own(on(this.domNode, "click", lang.hitch(this, function () {
                domStyle.set(this.imgSearchLoader, "display", "none");
                domStyle.set(this.close, "display", "block");
                /**
                * minimize other open header panel widgets and show locator widget
                */
                topic.publish("toggleWidget", "locator");
                this._showLocateContainer();
            })));
            domStyle.set(this.divAddressContainer, "display", "block");
            domAttr.set(this.divAddressContainer, "title", "");
            domAttr.set(this.imgSearchLoader, "src", dojoConfig.baseURL + "/js/library/themes/images/blue-loader.gif");
            this._setDefaultTextboxValue();
            this._attachLocatorEvents();
            this._createHorizontalSlider();
            dojo.driveTime = true;
            on(this.esriCTDrive, "click", lang.hitch(this, function () {
                if (domClass.contains(this.esriCTimgDrive, "driveIcon")) {
                    domClass.replace(this.esriCTimgDrive, "driveIconSelected", "driveIcon");
                    domClass.replace(this.esriCTimgWalk, "walkIcon", "walkIconSelected");
                    this.sliderMessage.innerHTML = this.sliderMessage.innerHTML.replace("walk", "drive");
                    dojo.driveTime = true;
                    this._updateBufferArea();
                }
            }));
            on(this.esriCTWalk, "click", lang.hitch(this, function () {
                if (domClass.contains(this.esriCTimgWalk, "walkIcon")) {
                    domClass.replace(this.esriCTimgDrive, "driveIcon", "driveIconSelected");
                    domClass.replace(this.esriCTimgWalk, "walkIconSelected", "walkIcon");
                    this.sliderMessage.innerHTML = this.sliderMessage.innerHTML.replace("drive", "walk");
                    dojo.driveTime = false;
                    this._updateBufferArea();
                }
            }));
            on(query(".toggleExpandCollapse")[0], "click", lang.hitch(this, function (evt) {
                if (domClass.contains(evt.currentTarget, "collapse")) {
                    domClass.replace(evt.currentTarget, "expand", "collapse");
                    domAttr.set(evt.currentTarget, "title", dojo.configData.CollapseResultTooltip);
                    this._expandList();
                } else {
                    domClass.replace(evt.currentTarget, "collapse", "expand");
                    domAttr.set(evt.currentTarget, "title", dojo.configData.ExpandResultTooltip);
                    this._collapseList();
                }
                this.featureListScrollbar.resetScrollBar();
            }));
            domAttr.set(query(".toggleExpandCollapse")[0], "title", dojo.configData.ExpandResultTooltip);
            domAttr.set(this.sliderMessage, "innerHTML", string.substitute(sharedNls.titles.sliderDisplayText, { defaultMinute: dojo.configData.DriveTimeSliderSettings.defaultMinutes }));
            domAttr.set(this.esriCTimgDrive, "title", dojo.configData.DriveTimeButtonTooltip);
            domAttr.set(this.esriCTimgWalk, "title", dojo.configData.WalkTimeButtonTooltip);
            domAttr.set(query(".nearbyMessage")[0], "innerHTML", dojo.configData.ResultsPanelTitleText);
        },

        _setAddressHolderHeight: function () {
            if (domStyle.get(this.divSelectedFeature, "display") === "none") {
                domClass.remove(this.divAddressHolder, "esriCTFullHeight");
                var contHeight = domStyle.get(this.divAddressContent, "height");
                domStyle.set(this.divAddressHolder, "height", contHeight + 2 + "px");
            } else {
                domClass.add(this.divAddressHolder, "esriCTFullHeight");
            }
        },
        /**
        * set default value of locator textbox as specified in configuration file
        * @param {array} dojo.configData.LocatorSettings.Locators Locator settings specified in configuration file
        * @memberOf widgets/locator/locator
        */
        _setDefaultTextboxValue: function () {
            var locatorSettings;
            locatorSettings = dojo.configData.LocatorSettings;
            domAttr.set(this.txtAddress, "defaultAddress", locatorSettings.LocatorDefaultAddress);
            domClass.replace(this.close, "clearInput", "clearInputNotApear");
        },

        /**
        * attach locator events
        * @memberOf widgets/locator/locator
        */
        _attachLocatorEvents: function () {
            this.own(on(this.esriCTSearch, "click", lang.hitch(this, function (evt) {
                domStyle.set(this.imgSearchLoader, "display", "block");
                domStyle.set(this.close, "display", "none");

                /**
                 * replace the staged search
                 */
                clearTimeout(this.stagedSearch);
                this._locateAddress();
            })));
            this.own(on(this.txtAddress, "keyup", lang.hitch(this, function (evt) {
                domStyle.set(this.close, "display", "block");
                domAttr.set(this.close, "title", sharedNls.tooltips.clear);
                if (this.txtAddress.value === "") {
                    domClass.replace(this.close, "clearInputNotApear", "clearInput");
                    domAttr.set(this.close, "title", "");
                } else {
                    domClass.replace(this.close, "clearInput", "clearInputNotApear");
                }
                this._submitAddress(evt);
            })));
            this.own(on(this.txtAddress, "dblclick", lang.hitch(this, function (evt) {
                this._clearDefaultText(evt);
            })));
            this.own(on(this.txtAddress, "focus", lang.hitch(this, function () {
                domClass.add(this.txtAddress, "esriCTColorChange");
            })));
            this.own(on(this.close, "click", lang.hitch(this, function () {
                this._hideText();
            })));
        },

        _hideText: function () {
            this.txtAddress.value = "";
            domClass.replace(this.close, "clearInputNotApear", "clearInput");
            domConstruct.empty(this.divAddressResults);
            domAttr.set(this.txtAddress, "defaultAddress", this.txtAddress.value);
            domAttr.set(this.close, "title", "");
            domClass.remove(this.divAddressContent, "esriCTAddressResultHeight");
            if (this.locatorScrollbar) {
                domClass.add(this.locatorScrollbar._scrollBarContent, "esriCTZeroHeight");
                this.locatorScrollbar.removeScrollBar();
            }
            domStyle.set(this.divAddressScrollContainer, "display", "none");
            domStyle.set(this.noResultFound, "display", "none");
        },

        /**
        * show/hide locator widget and set default search text
        * @memberOf widgets/locator/locator
        */
        _showLocateContainer: function () {
            this.txtAddress.blur();
            if (domGeom.getMarginBox(this.divAddressHolder).h > 0) {

                /**
                * when user clicks on locator icon in header panel, close the search panel if it is open
                */
                domClass.replace(this.domNode, "esriCTTdHeaderSearch", "esriCTTdHeaderSearch-select");
                domClass.replace(this.divAddressHolder, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
                topic.publish("setMaxLegendLength");
                this.txtAddress.blur();
            } else {

                /**
                * when user clicks on locator icon in header panel, open the search panel if it is closed
                */
                domClass.replace(this.domNode, "esriCTTdHeaderSearch-select", "esriCTTdHeaderSearch");
                domClass.replace(this.txtAddress, "esriCTBlurColorChange", "esriCTColorChange");
                domClass.replace(this.divAddressHolder, "esriCTShowContainerHeight", "esriCTHideContainerHeight");
                if (query('.esriCTdivLegendbox')[0]) {
                    domStyle.set(query('.esriCTdivLegendbox')[0], "zIndex", "1000");
                }
                domStyle.set(this.txtAddress, "verticalAlign", "middle");
                if (domStyle.get(query(".divSelectedFeature")[0], "display") === "block") {
                    domClass.add(query(".esriControlsBR")[0], "esriLogoShiftRight");
                    topic.publish("setMinLegendLength");
                    if (query('.esriCTdivLegendbox')[0]) {
                        domStyle.set(query('.esriCTdivLegendbox')[0], "zIndex", "998");
                    }
                }
                this.txtAddress.value = domAttr.get(this.txtAddress, "defaultAddress");
                this.lastSearchString = lang.trim(this.txtAddress.value);
            }
        },

        /**
        * search address on every key press
        * @param {object} evt Keyup event
        * @memberOf widgets/locator/locator
        */
        _submitAddress: function (evt) {
            if (evt) {
                if (evt.keyCode === dojo.keys.ENTER) {
                    if (this.txtAddress.value !== '') {
                        domStyle.set(this.imgSearchLoader, "display", "block");
                        domStyle.set(this.close, "display", "none");

                        /**
                         * replace the staged search
                         */
                        clearTimeout(this.stagedSearch);
                        this._locateAddress();
                        return;
                    }
                }

                /**
                * do not perform auto complete search if alphabets,
                * numbers,numpad keys,comma,ctl+v,ctrl +x,delete or
                * backspace is pressed
                */
                if ((!((evt.keyCode >= 46 && evt.keyCode < 58) || (evt.keyCode > 64 && evt.keyCode < 91) || (evt.keyCode > 95 && evt.keyCode < 106) || evt.keyCode === 8 || evt.keyCode === 110 || evt.keyCode === 188)) || (evt.keyCode === 86 && evt.ctrlKey) || (evt.keyCode === 88 && evt.ctrlKey)) {
                    evt.cancelBubble = true;
                    evt.stopPropagation();
                    domStyle.set(this.imgSearchLoader, "display", "none");
                    domStyle.set(this.close, "display", "block");
                    domAttr.set(this.close, "title", sharedNls.tooltips.clear);
                    return;
                }

                /**
                * call locator service if search text is not empty
                */
                domStyle.set(this.imgSearchLoader, "display", "block");
                domStyle.set(this.close, "display", "none");
                if (domGeom.getMarginBox(this.divAddressContent).h > 0) {
                    if (lang.trim(this.txtAddress.value) !== '') {
                        if (this.lastSearchString !== lang.trim(this.txtAddress.value)) {
                            this.lastSearchString = lang.trim(this.txtAddress.value);
                            domConstruct.empty(this.divAddressResults);

                            /**
                            * clear any staged search
                            */
                            clearTimeout(this.stagedSearch);
                            if (lang.trim(this.txtAddress.value).length > 0) {

                                /**
                                * stage a new search, which will launch if no new searches show up
                                * before the timeout
                                */
                                this.stagedSearch = setTimeout(lang.hitch(this, function () {
                                    this.stagedSearch = this._locateAddress();
                                }), 500);
                            }
                        }
                    } else {
                        this.lastSearchString = lang.trim(this.txtAddress.value);
                        if (this.map.getLayer("esriGraphicsLayerMapSettings")) {
                            this.map.getLayer("esriGraphicsLayerMapSettings").clear();
                        }
                        topic.publish("setMaxLegendLength");
                        domStyle.set(this.divSelectedFeature, "display", "none");
                        domStyle.set(this.imgSearchLoader, "display", "none");
                        domStyle.set(this.close, "display", "block");
                        domAttr.set(this.close, "title", "");
                        domConstruct.empty(this.divAddressResults);
                        domStyle.set(this.divAddressScrollContainer, "display", "none");
                        this._setAddressHolderHeight();
                        this._locatorErrBack();
                    }
                }
            }
        },

        /**
        * perform search by addess if search type is address search
        * @memberOf widgets/locator/locator
        */
        _locateAddress: function () {
            domConstruct.empty(this.divAddressResults);
            this.resetShareParameters();
            if (lang.trim(this.txtAddress.value) === '') {
                topic.publish("clearFeatureList");
                domStyle.set(this.divSelectedFeature, "display", "none");
                domStyle.set(this.divAddressScrollContainer, "display", "none");
                if (this.map.getLayer("esriGraphicsLayerMapSettings")) {
                    this.map.getLayer("esriGraphicsLayerMapSettings").clear();
                }
                topic.publish("setMaxLegendLength");
                domStyle.set(this.imgSearchLoader, "display", "none");
                domStyle.set(this.close, "display", "block");
                this._locatorErrBack();
            } else {
                this._searchLocation();
            }
        },

        /**
        * call locator service and get search results
        * @memberOf widgets/locator/locator
        */
        _searchLocation: function () {
            var nameArray, locatorSettings, locator, searchFieldName, addressField, baseMapExtent, options, searchFields, addressFieldValues,
                addressFieldName, addressFieldIndex, defferedArray, index, locatorDef, resultLength, deferredListResult;
            nameArray = { Address: [] };
            domStyle.set(this.imgSearchLoader, "display", "block");
            domStyle.set(this.close, "display", "none");
            domAttr.set(this.txtAddress, "defaultAddress", this.txtAddress.value);
            this._setHeightAddressResults();
            domStyle.set(this.noResultFound, "display", "none");
            /**
            * call locator service specified in configuration file
            */
            locatorSettings = dojo.configData.LocatorSettings;
            locator = new Locator(locatorSettings.LocatorURL);
            searchFieldName = locatorSettings.LocatorParameters.SearchField;
            addressField = {};
            addressField[searchFieldName] = lang.trim(this.txtAddress.value);
            if (this.map.getLayer("defaultBasemap")) {
                baseMapExtent = this.map.getLayer("defaultBasemap").fullExtent;
            } else if (this.map.getLayer("defaultBasemap0")) {
                baseMapExtent = this.map.getLayer("defaultBasemap0").fullExtent;
            }
            options = {};
            options.address = addressField;
            options.outFields = locatorSettings.LocatorOutFields;
            options[locatorSettings.LocatorParameters.SearchBoundaryField] = baseMapExtent;
            locator.outSpatialReference = this.map.spatialReference;
            searchFields = [];
            addressFieldValues = locatorSettings.FilterFieldValues;
            addressFieldName = locatorSettings.FilterFieldName;
            for (addressFieldIndex in addressFieldValues) {
                if (addressFieldValues.hasOwnProperty(addressFieldIndex)) {
                    searchFields.push(addressFieldValues[addressFieldIndex]);
                }
            }

            /**
            * get results from locator service
            * @param {object} options Contains address, outFields and basemap extent for locator service
            * @param {object} candidates Contains results from locator service
            */
            defferedArray = [];
            for (index = 0; index < dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings.length; index++) {
                this._locateLayersearchResult(defferedArray, index);
            }
            locatorDef = locator.addressToLocations(options);
            locator.on("address-to-locations-complete", lang.hitch(this, function (candidates) {
                var deferred = new Deferred();
                deferred.resolve(candidates);
                return deferred.promise;
            }), function () {
                domStyle.set(this.imgSearchLoader, "display", "none");
                domStyle.set(this.close, "display", "block");
                this._locatorErrBack();
            });
            defferedArray.push(locatorDef);
            deferredListResult = new DeferredList(defferedArray);
            deferredListResult.then(lang.hitch(this, function (result) {
                var num, key, order, i;
                dojo.lastSearchAddress = this.lastSearchString;
                if (result) {
                    if (result.length > 0) {
                        for (num = 0; num < result.length; num++) {
                            if (dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[num]) {
                                key = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[num].SearchDisplayTitle;
                                if (dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[num].UnifiedSearch.toLowerCase() === "true") {
                                    nameArray[key] = [];
                                    if (result[num][1].features) {
                                        for (order = 0; order < result[num][1].features.length; order++) {
                                            for (i in result[num][1].features[order].attributes) {
                                                if (result[num][1].features[order].attributes.hasOwnProperty(i)) {
                                                    if (!result[num][1].features[order].attributes[i]) {
                                                        result[num][1].features[order].attributes[i] = sharedNls.showNullValue;
                                                    }
                                                }
                                            }
                                            if (nameArray[key].length < dojo.configData.LocatorSettings.MaxResults) {
                                                nameArray[key].push({
                                                    name: string.substitute(dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[num].SearchDisplayFields, result[num][1].features[order].attributes),
                                                    attributes: result[num][1].features[order].attributes,
                                                    layer: dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[num],
                                                    geometry: result[num][1].features[order].geometry
                                                });
                                            }
                                        }
                                    }
                                }
                            } else {
                                this._addressResult(result[num][1], nameArray, searchFields, addressFieldName);
                            }
                            resultLength = result[num][1].length;
                        }
                        this._showLocatedAddress(nameArray, resultLength);
                    }
                } else {
                    domStyle.set(this.imgSearchLoader, "display", "none");
                    domStyle.set(this.close, "display", "block");
                    this.mapPoint = null;
                    this._locatorErrBack();
                }
            }));
        },

        /**
        * push results into nameArray
        * @memberOf widgets/locator/locator
        */
        _addressResult: function (candidates, nameArray, searchFields, addressFieldName) {
            var order, j;
            if (candidates.length > 0) {
                domStyle.set(this.noResultFound, "display", "none");
                domStyle.set(this.divAddressScrollContainer, "display", "block");
                domClass.add(this.divAddressScrollContent, "esriCTdivAddressScrollContent");
                for (order = 0; order < candidates.length; order++) {
                    if (candidates[order].attributes[dojo.configData.LocatorSettings.AddressMatchScore.Field] > dojo.configData.LocatorSettings.AddressMatchScore.Value) {
                        for (j in searchFields) {
                            if (searchFields.hasOwnProperty(j)) {
                                if (candidates[order].attributes[addressFieldName] === searchFields[j]) {
                                    if (nameArray.Address.length < dojo.configData.LocatorSettings.MaxResults) {
                                        nameArray.Address.push({
                                            name: string.substitute(dojo.configData.LocatorSettings.DisplayField, candidates[order].attributes),
                                            attributes: candidates[order]
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                if (nameArray.Address.length === 0) {
                    setTimeout(lang.hitch(this, function () {
                        this._locatorErrBack();
                    }), 100);
                }
            } else {
                this.resetShareParameters();
                this._locatorErrBack();
                if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId && lang.trim(dojo.configData.Workflows[dojo.workFlowIndex].WebMapId).length !== 0) {
                    topic.publish("updateLegends", this.map.extent);
                } else {
                    topic.publish("updateLegends", null);
                }
                domClass.remove(this.divAddressResultContainer, "borderbottom");
                domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
                domStyle.set(this.divAddressScrollContainer, "display", "none");
            }
        },

        /**
        * query layer for searched result
        * @memberOf widgets/locator/locator
        */
        _locateLayersearchResult: function (defferedArray, index) {
            var layerobject, queryTask, esriQuery, currentTime, queryTaskResult, deferred;
            layerobject = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[index];
            domStyle.set(this.imgSearchLoader, "display", "block");
            domStyle.set(this.close, "display", "none");
            if (layerobject.QueryURL) {
                queryTask = new QueryTask(layerobject.QueryURL);
                esriQuery = new Query();
                currentTime = new Date();
                esriQuery.where = string.substitute(layerobject.SearchExpression, [lang.trim(this.txtAddress.value).toUpperCase()]) + " AND " + currentTime.getTime() + index.toString() + "=" + currentTime.getTime() + index.toString();
                esriQuery.outSpatialReference = this.map.spatialReference;
                esriQuery.returnGeometry = true;
                esriQuery.outFields = ["*"];
                queryTaskResult = queryTask.execute(esriQuery, lang.hitch(this, function (featureSet) {
                    deferred = new Deferred();
                    deferred.resolve(featureSet);
                    return deferred.promise;
                }), function (err) {
                    console.log(err);
                });
                defferedArray.push(queryTaskResult);
            }
        },

        /**
        * filter valid results from results returned by locator service
        * @param {object} candidates Contains results from locator service
        * @memberOf widgets/locator/locator
        */
        _showLocatedAddress: function (candidates, resultLength) {
            var addrListCount, addrList, divAddressSearchCell, candidateArray, divAddressCounty, candiate, listContainer, i;
            addrListCount = 0;
            addrList = [];
            domStyle.set(query(".esriCTAddressScrollContent")[0], "display", "block");
            domStyle.set(this.divSelectedFeature, "display", "none");
            if (query('.esriCTdivLegendbox')[0]) {
                domStyle.set(query('.esriCTdivLegendbox')[0], "zIndex", "1000");
            }
            if (query('.legenboxInner')[0]) {
                domClass.remove(query('.legenboxInner')[0], "rightBorderNone");
            }
            topic.publish("clearFeatureList");
            if (this.map.getLayer("esriGraphicsLayerMapSettings")) {
                this.map.getLayer("esriGraphicsLayerMapSettings").clear();
            }
            domConstruct.empty(this.divAddressResults);
            if (lang.trim(this.txtAddress.value) === "") {
                this.txtAddress.focus();
                domStyle.set(this.divSelectedFeature, "display", "none");
                domConstruct.empty(this.divAddressResults);
                this.locatorScrollbar = new ScrollBar({ domNode: this.divAddressScrollContent });
                this.locatorScrollbar.setContent(this.divAddressResults);
                this.locatorScrollbar.createScrollBar();
                domStyle.set(this.imgSearchLoader, "display", "none");
                domStyle.set(this.close, "display", "block");
                return;
            }

            /**
            * display all the located address in the address container
            * 'this.divAddressResults' div dom element contains located addresses, created in widget template
            */

            if (this.locatorScrollbar) {
                domClass.add(this.locatorScrollbar._scrollBarContent, "esriCTZeroHeight");
                this.locatorScrollbar.removeScrollBar();
            }
            this.locatorScrollbar = new ScrollBar({ domNode: this.divAddressScrollContent });
            this.locatorScrollbar.setContent(this.divAddressResults);
            domStyle.set(this.divAddressScrollContent, "height", "200px");
            this.locatorScrollbar.createScrollBar();
            if (resultLength > 0) {
                domClass.add(this.divAddressHolder, "esriCTAddressContentHeight");
                for (candidateArray in candidates) {
                    if (candidates.hasOwnProperty(candidateArray)) {
                        if (candidates[candidateArray].length > 0) {
                            divAddressCounty = domConstruct.create("div", { "class": "esriCTSearchGroupRow esriCTBottomBorder esriCTResultColor esriCTCursorPointer esriAddressCounty" }, this.divAddressResults);
                            divAddressSearchCell = domConstruct.create("div", { "class": "esriCTSearchGroupCell" }, divAddressCounty);
                            if (candidateArray === "Address") {
                                candiate = dojo.configData.LocatorSettings.DisplayText + " (" + candidates[candidateArray].length + ")";
                            } else {
                                candiate = candidateArray + " (" + candidates[candidateArray].length + ")";
                            }
                            domConstruct.create("div", { "innerHTML": "+", "class": "plus-minus" }, divAddressSearchCell);
                            domConstruct.create("div", { "innerHTML": candiate, "class": "esriCTGroupList" }, divAddressSearchCell);
                            domStyle.set(this.imgSearchLoader, "display", "none");
                            domStyle.set(this.close, "display", "block");
                            addrList.push(divAddressSearchCell);
                            this._toggleAddressList(addrList, addrListCount);
                            addrListCount++;
                            listContainer = domConstruct.create("div", { "class": "listContainer hideAddressList" }, this.divAddressResults);
                            for (i = 0; i < candidates[candidateArray].length; i++) {
                                this._displayValidLocations(candidates[candidateArray][i], i, candidates[candidateArray], listContainer);
                            }
                        }
                    }
                }
            } else {
                domStyle.set(this.imgSearchLoader, "display", "none");
                domStyle.set(this.close, "display", "block");
                this.mapPoint = null;
                this._locatorErrBack();
            }
        },

        _toggleAddressList: function (addressList, idx) {
            on(addressList[idx], "click", lang.hitch(this, function () {
                if (domClass.contains(query(".listContainer")[idx], "showAddressList")) {
                    domClass.toggle(query(".listContainer")[idx], "showAddressList");
                    var listStatusSymbol = (domAttr.get(query(".plus-minus")[idx], "innerHTML") === "+") ? "-" : "+";
                    domAttr.set(query(".plus-minus")[idx], "innerHTML", listStatusSymbol);
                    this.locatorScrollbar.resetScrollBar();
                } else {
                    domClass.add(query(".listContainer")[idx], "showAddressList");
                    domAttr.set(query(".plus-minus")[idx], "innerHTML", "-");
                }
                this.locatorScrollbar.resetScrollBar();
            }));
        },

        /**
        * display valid result in search panel
        * @param {object} candidate Contains valid result to be displayed in search panel
        * @return {Boolean} true if result is displayed successfully
        * @memberOf widgets/locator/locator
        */
        _displayValidLocations: function (candidate, index, candidateArray, listContainer) {
            var esriCTrowResult, candidateDate, _this, rendererColor, symbol, lineColor, fillColor;
            _this = this;
            domClass.remove(this.divAddressScrollContent, "esriCTdivAddressScrollContent");
            domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
            domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
            topic.publish("setMaxLegendLength");
            esriCTrowResult = domConstruct.create("div", { "class": "esriCTrowTable esriCTContentBottomBorder" }, listContainer);
            candidateDate = domConstruct.create("div", { "class": "esriCTrowTableSerchClm  esriCTCursorPointer" }, esriCTrowResult);
            domAttr.set(candidateDate, "index", index);
            try {
                if (candidate.name) {
                    domAttr.set(candidateDate, "innerHTML", candidate.name);
                } else {
                    domAttr.set(candidateDate, "innerHTML", candidate);
                }
                if (candidate.attributes.location) {
                    domAttr.set(candidateDate, "x", candidate.attributes.location.x);
                    domAttr.set(candidateDate, "y", candidate.attributes.location.y);
                    domAttr.set(candidateDate, "address", string.substitute(dojo.configData.LocatorSettings.DisplayField, candidate.attributes.attributes));
                }
            } catch (err) {
                alert(sharedNls.errorMessages.falseConfigParams);
            }
            rendererColor = dojo.configData.Workflows[dojo.workFlowIndex].FeatureHighlightColor;
            candidateDate.onclick = function () {
                topic.publish("showProgressIndicator");
                if (_this.map.infoWindow) {
                    _this.map.infoWindow.hide();
                }
                _this.txtAddress.value = this.innerHTML;
                domAttr.set(_this.txtAddress, "defaultAddress", _this.txtAddress.value);
                if (candidate.geometry) {
                    if (candidate.geometry.type) {
                        if (candidate.geometry.type === "point") {
                            var geoLocationPushpin, locatorMarkupSymbol;
                            _this.map.centerAt(candidate.geometry);
                            geoLocationPushpin = dojoConfig.baseURL + dojo.configData.LocatorSettings.DefaultLocatorSymbol;
                            locatorMarkupSymbol = new esri.symbol.PictureMarkerSymbol(geoLocationPushpin, dojo.configData.LocatorSettings.MarkupSymbolSize.width, dojo.configData.LocatorSettings.MarkupSymbolSize.height);
                            _this._graphicLayerOnMap(candidate.geometry, locatorMarkupSymbol);
                        } else {
                            _this.map.centerAt(candidate.geometry);
                            lineColor = new Color();
                            lineColor.setColor(rendererColor);
                            fillColor = new Color();
                            fillColor.setColor(rendererColor);
                            fillColor.a = 0.25;
                            symbol = new Symbol.SimpleFillSymbol(Symbol.SimpleFillSymbol.STYLE_SOLID, new Symbol.SimpleLineSymbol(Symbol.SimpleLineSymbol.STYLE_SOLID, lineColor, 3), fillColor);
                            _this._graphicLayerOnMap(candidate.geometry, symbol);
                        }
                    }
                } else if (candidate.attributes.location) {
                    _this.mapPoint = new Point(domAttr.get(this, "x"), domAttr.get(this, "y"), _this.map.spatialReference);
                    _this._locateAddressOnMap(_this.mapPoint);
                }
            };
        },

        /**
        * add graphic on graphic layer of map
        * @memberOf widgets/locator/locator
        */
        _graphicLayerOnMap: function (geometry, symbol) {
            dojo.addressLocation = geometry;
            if (window.location.toString().split("$sliderValue=").length > 1) {
                dojo.sliderValue = Number(window.location.toString().split("$sliderValue=")[1].split("$")[0]);
            }
            var graphic = new esri.Graphic(geometry, symbol, {}, null);
            if (this.map.getLayer("esriGraphicsLayerMapSettings")) {
                this.map.getLayer("esriGraphicsLayerMapSettings").clear();
                this.map.getLayer("esriGraphicsLayerMapSettings").add(graphic);
            }
            topic.publish("hideProgressIndicator");
            dojo.addressLocation = graphic;
            topic.publish("SliderChange");
        },

        /**
        * locate address on map
        * @memberOf widgets/locator/locator
        */
        _locateAddressOnMap: function (mapPoint) {
            var geoLocationPushpin, locatorMarkupSymbol;
            this.map.centerAt(mapPoint);
            geoLocationPushpin = dojoConfig.baseURL + dojo.configData.LocatorSettings.DefaultLocatorSymbol;
            locatorMarkupSymbol = new esri.symbol.PictureMarkerSymbol(geoLocationPushpin, dojo.configData.LocatorSettings.MarkupSymbolSize.width, dojo.configData.LocatorSettings.MarkupSymbolSize.height);
            this._graphicLayerOnMap(mapPoint, locatorMarkupSymbol);
        },

        /**
        * hide search panel
        * @memberOf widgets/locator/locator
        */
        _hideAddressContainer: function () {
            domClass.replace(this.domNode, "esriCTTdHeaderSearch", "esriCTTdHeaderSearch-select");
            domClass.replace(this.divAddressHolder, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
            topic.publish("setMaxLegendLength");
            domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
        },

        /**
        * set height of the search panel
        * @memberOf widgets/locator/locator
        */
        _setHeightAddressResults: function () {

            /**
            * divAddressContent Container for search results
            * @member {div} divAddressContent
            * @private
            * @memberOf widgets/locator/locator
            */
            var contentHeight, addressContentHeight = domGeom.getMarginBox(this.divAddressContent).h;
            if (addressContentHeight > 0) {

                /**
                * divAddressScrollContent Scrollbar container for search results
                * @member {div} divAddressScrollContent
                * @private
                * @memberOf widgets/locator/locator
                */
                contentHeight = { height: addressContentHeight - 120 + 'px' };
                domStyle.set(this.divAddressScrollContent, "style", contentHeight + "px");

            }
        },

        /**
        * display search by address tab
        * @memberOf widgets/locator/locator
        */
        _showAddressSearchView: function () {
            if (domStyle.get(this.imgSearchLoader, "display") === "block") {
                return;
            }
            this.txtAddress.value = domAttr.get(this.txtAddress, "defaultAddress");
            this.lastSearchString = lang.trim(this.txtAddress.value);
            domConstruct.empty(this.divAddressResults);
        },

        /**
        * display error message if locator service fails or does not return any results
        * @memberOf widgets/locator/locator
        */
        _locatorErrBack: function () {
            if (this.locatorScrollbar) {
                this.locatorScrollbar.removeScrollBar();
            }
            domConstruct.empty(this.divAddressResults);
            domStyle.set(this.imgSearchLoader, "display", "none");
            domStyle.set(this.divAddressScrollContainer, "display", "none");
            domStyle.set(this.close, "display", "block");
            domClass.add(this.divAddressContent, "esriCTAddressResultHeight");
            domStyle.set(this.noResultFound, "display", "block");
            domClass.remove(this.divAddressScrollContent, "esriCTdivAddressScrollContent");
            domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
            domClass.remove(this.divAddressHolder, "esriCTAddressContentHeight");
            domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
            domAttr.set(this.close, "title", "");
            this._setAddressHolderHeight();
            if (query('.esriCTdivLegendbox')[0]) {
                domStyle.set(query('.esriCTdivLegendbox')[0], "zIndex", "1000");
            }
        },

        /**
        * clear default value from search textbox
        * @param {object} evt Dblclick event
        * @memberOf widgets/locator/locator
        */
        _clearDefaultText: function (evt) {
            var target = window.event ? window.event.srcElement : evt ? evt.target : null;
            if (!target) {
                return;
            }
            target.value = '';
            this.txtAddress.value = "";
            domAttr.set(this.txtAddress, "defaultAddress", this.txtAddress.value);
            domClass.replace(this.close, "clearInputNotApear", "clearInput");
        },

        /**
        * set default value to search textbox
        * @param {object} evt Blur event
        * @memberOf widgets/locator/locator
        */
        _replaceDefaultText: function (evt) {
            var target = window.event ? window.event.srcElement : evt ? evt.target : null;
            if (!target) {
                return;
            }
            this._resetTargetValue(target, "defaultAddress");
        },

        /**
        * set default value to search textbox
        * @param {object} target Textbox dom element
        * @param {string} title Default value
        * @param {string} color Background color of search textbox
        * @memberOf widgets/locator/locator
        */
        _resetTargetValue: function (target, title) {
            if (target.value === '' && domAttr.get(target, title)) {
                target.value = target.title;
                if (target.title === "") {
                    target.value = domAttr.get(target, title);
                }
            }
            if (domClass.contains(target, "esriCTColorChange")) {
                domClass.remove(target, "esriCTColorChange");
            }
            domClass.add(target, "esriCTBlurColorChange");
            this.lastSearchString = lang.trim(this.txtAddress.value);
        },
        /*Start of  slider*/
        _createHorizontalSlider: function () {
            var horizontalRule, horizontalSlider;
            if (window.location.toString().split("$sliderValue=").length > 1) {
                dojo.sliderValue = Number(window.location.toString().split("$sliderValue=")[1].split("$")[0]);
                setTimeout(lang.hitch(this, function () {
                    this._setSliderValueLabel();
                }), 100);
            } else {
                dojo.sliderValue = dojo.configData.DriveTimeSliderSettings.defaultMinutes;
            }
            horizontalRule = new HorizontalRule({
                SliderRulerContainer: "topDecoration",
                count: dojo.configData.DriveTimeSliderSettings.discreteValues,
                "class": "horizontalRule"
            }, this.horizontalRuleContainer);
            horizontalRule.domNode.firstChild.innerHTML = dojo.configData.DriveTimeSliderSettings.minMinutes;
            horizontalRule.domNode.firstChild.style.border = "none";
            horizontalRule.domNode.lastChild.innerHTML = dojo.configData.DriveTimeSliderSettings.maxMinutes;
            horizontalRule.domNode.lastChild.style.border = "none";
            domClass.add(horizontalRule.domNode.lastChild, "esriCTLastChild");
            horizontalSlider = new HorizontalSlider({
                value: dojo.sliderValue,
                discreteValues: dojo.configData.DriveTimeSliderSettings.discreteValues,
                minimum: dojo.configData.DriveTimeSliderSettings.minMinutes,
                maximum: dojo.configData.DriveTimeSliderSettings.maxMinutes,
                showButtons: false,
                "class": "horizontalSlider"
            }, this.horizontalSliderContainer);
            on(horizontalSlider, "change", lang.hitch(this, function (defaultMinutes) {
                if (dojo.sliderValue !== defaultMinutes) {
                    dojo.sliderValue = defaultMinutes;
                    this._setSliderValueLabel();
                    if (dojo.addressLocation) {
                        topic.publish("SliderChange");
                    }
                }
            }));
            domClass.add(query(".dijitRuleMark")[0], "moveLeft");
        },

        /**
        * set slider value and label
        * @memberOf widgets/locator/locator
        */
        _setSliderValueLabel: function () {
            var sliderMessage, message;
            sliderMessage = this.sliderMessage.innerHTML.split(/\d+/g);
            message = sliderMessage[0] + " " + Math.floor(dojo.sliderValue) + " " + sliderMessage[1];
            this.sliderMessage.innerHTML = message;
        },

        /**
        * update buffer area
        * @memberOf widgets/locator/locator
        */
        _updateBufferArea: function () {
            if (dojo.addressLocation) {
                topic.publish("SliderChange");
            }
        },

        _resetFeatureList: function () {
            domStyle.set(this.divSelectedFeature, "display", "none");
            domStyle.set(query('.divAddressScrollContainer')[0], "display", "none");
            domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
            domClass.remove(this.divAddressHolder, "esriCTFullHeight");

        },
        /**
        * create feature list of near by addresses
        * @memberOf widgets/locator/locator
        */
        _createFeatureList: function (featureList) {
            var featureListArray, scrollContentHeight, layerTitleCell, totalHeight;
            if (featureList.length > 0) {
                topic.subscribe("resetLocatorContainer", lang.hitch(this, function () {
                    this._resetLocateContainer();
                }));
                this.expandedListItem = 0;
                domClass.remove(this.divAddressResultContainer, "borderbottom");
                topic.publish("setMinLegendLength");
                domStyle.set(this.noResultFound, "display", "none");
                domClass.add(this.divAddressContent, "esriCTAddressHolderHeight");
                featureListArray = [];
                domStyle.set(this.divSelectedFeature, "display", "block");
                if (query('.esriCTdivLegendbox')[0]) {
                    domStyle.set(query('.esriCTdivLegendbox')[0], "zIndex", "998");
                    domClass.add(query('.legenboxInner')[0], "rightBorderNone");
                }
                domStyle.set(query(".esriCTAddressScrollContent")[0], "display", "none");
                if (this.featureListScrollbar) {
                    domClass.add(this.featureListScrollbar._scrollBarContent, "esriCTZeroHeight");
                    this.featureListScrollbar.removeScrollBar();
                }
                if (featureList.length) {
                    domStyle.set(this.headerContainer, "display", "block");
                    this.selectedFeatureList = featureList;
                    domClass.add(query(".esriControlsBR")[0], "esriLogoShiftRight");
                } else {
                    domStyle.set(this.headerContainer, "display", "none");
                }
                totalHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                scrollContentHeight = totalHeight - (domGeom.getMarginBox(this.divAddressResultContainer).h + domGeom.getMarginBox(this.SliderContainer).h + 100);
                domStyle.set(this.divSelectedFeatureContent, "height", scrollContentHeight + "px");
                this.featureListScrollbar = new ScrollBar({ domNode: this.divSelectedFeatureContent });
                this.featureListScrollbar.setContent(this.divSelectedFeatureList);
                this.featureListScrollbar.createScrollBar();
                domConstruct.empty(this.divSelectedFeatureList);
                array.forEach(featureList, lang.hitch(this, function (featureGroup, idx) {
                    var layerTitle, divAddressListGroup;
                    layerTitle = domConstruct.create("div", { "class": "esriCTSearchGroupRow esriCTBottomBorder esriCTResultColor esriCTCursorPointer esriAddressCounty" }, this.divSelectedFeatureList);
                    layerTitleCell = domConstruct.create("div", { "class": "esriCTSearchGroupCell" }, layerTitle);
                    domConstruct.create("div", { "innerHTML": "+", "class": "plusMinusFeatureTitle" }, layerTitleCell);
                    domConstruct.create("div", { "innerHTML": featureGroup[0].name + " (" + featureGroup.length + ")", "class": "esriCTGroupList" }, layerTitleCell);
                    featureListArray.push(layerTitle);
                    this._toggleFeatureList(featureListArray, idx);
                    divAddressListGroup = domConstruct.create("div", { "class": "divAddressListGroup listCollapse" }, this.divSelectedFeatureList);
                    featureGroup.sort(function (a, b) {
                        return (a.routelength - b.routelength);
                    });
                    array.forEach(featureGroup, lang.hitch(this, function (feature, featureId) {
                        var featueNamediv, featueName, spanRouteLength;
                        featueNamediv = domConstruct.create("div", { "class": "esriCTContentBottomBorder divAddressListGrouprow esriCTCursorPointer" }, divAddressListGroup);
                        featueName = domConstruct.create("div", { "innerHTML": feature.featureName, "class": "featureName" }, featueNamediv);
                        if (feature.geometry.type === "point") {
                            spanRouteLength = domConstruct.create("div", { "innerHTML": "Show distance", "class": "spanRouteLength" }, featueNamediv);
                            on.once(spanRouteLength, "click", lang.hitch(this, function () {
                                domClass.add(spanRouteLength, "routeDistanceLoading");
                                domAttr.set(spanRouteLength, "innerHTML", "");
                                domStyle.set(spanRouteLength, "cursor", "default");
                                this._calculateRouteDistance(feature, spanRouteLength);
                            }));
                        }

                        /**
                        * display infowindow on clicking of nearby address
                        */
                        on(featueName, "click", lang.hitch(this, function () {
                            topic.publish("hideInfoWindow");
                            setTimeout(lang.hitch(this, function () {
                                if (feature.geometry.type === "point") {
                                    this._removeHighlightingFeature(feature);
                                    this._createInfoWindowContent(feature.geometry, featureGroup, featureId, false, true);
                                    this.map.centerAndZoom(feature.geometry, dojo.configData.ZoomLevel);
                                } else if (feature.geometry.type === "polygon") {
                                    this._createInfoWindowContent(feature.geometry.getCentroid(), featureGroup, featureId, false, true);
                                    this.map.centerAndZoom(feature.geometry.getCentroid(), dojo.configData.ZoomLevel);
                                    this._highlightFeature(feature);
                                }
                            }), 0);
                        }));
                    }));
                }));


                topic.publish("hideLoadingIndicatorHandler");
            } else {
                topic.publish("clearFeatureList");
                this._resetFeatureList();
                topic.publish("hideLoadingIndicatorHandler");
            }
        },

        /**
        * handle toggling of expanding and collapsing nearby address list
        * @memberOf widgets/locator/locator
        */
        _toggleFeatureList: function (layerTitle, idx) {
            var sign;
            on(layerTitle[idx], "click", lang.hitch(this, function () {
                this.featureListScrollbar.resetScrollBar();
                sign = (query(".plusMinusFeatureTitle")[idx].innerHTML === "+") ? "-" : "+";
                query(".plusMinusFeatureTitle")[idx].innerHTML = sign;
                if (domClass.contains(query(".divAddressListGroup")[idx], "listExpand")) {
                    this.expandedListItem--;
                    domClass.remove(query(".divAddressListGroup")[idx], "listExpand");
                } else {
                    this.expandedListItem++;
                    domClass.add(query(".divAddressListGroup")[idx], "listExpand");
                }
                if (this.expandedListItem === 0) {
                    domClass.replace(query(".toggleExpandCollapse")[0], "collapse", "expand");
                    domAttr.set(query(".toggleExpandCollapse")[0], "title", dojo.configData.ExpandResultTooltip);
                } else if (query(".plusMinusFeatureTitle").length === this.expandedListItem) {
                    domClass.replace(query(".toggleExpandCollapse")[0], "expand", "collapse");
                    domAttr.set(query(".toggleExpandCollapse")[0], "title", dojo.configData.CollapseResultTooltip);
                }
            }));
        },

        /**
        * expand address from nearby address list
        * @memberOf widgets/locator/locator
        */
        _expandList: function () {
            array.forEach(query(".plusMinusFeatureTitle"), function (featureNode, idx) {
                domClass.replace(featureNode, "esriCTExpand", "esriCTCollapse");
                domClass.add(query(".divAddressListGroup")[idx], "listExpand");
                query(".plusMinusFeatureTitle")[idx].innerHTML = "-";
            });
            this.expandedListItem = query(".plusMinusFeatureTitle").length;
        },

        /**
        * collapse address from nearby address list
        * @memberOf widgets/locator/locator
        */
        _collapseList: function () {
            array.forEach(query(".plusMinusFeatureTitle"), function (featureNode, idx) {
                domClass.replace(featureNode, "esriCTCollapse", "esriCTExpand");
                domClass.remove(query(".divAddressListGroup")[idx], "listExpand");
                query(".plusMinusFeatureTitle")[idx].innerHTML = "+";
            });
            this.expandedListItem = 0;
        },

        /**
        * calculate route distance
        * @memberOf widgets/locator/locator
        */
        _calculateRouteDistance: function (pointFeature, distanceHolder) {
            var routeTask, routeParams, stopPushpin, locatorMarkupSymbol, pointGraphic, milesDistance;
            routeTask = new RouteTask(dojo.configData.RouteTask);
            routeParams = new RouteParameters();
            routeParams.stops = new FeatureSet();
            routeParams.returnRoutes = false;
            routeParams.returnDirections = true;
            routeParams.directionsLengthUnits = Units.MILES;
            routeParams.outSpatialReference = new SpatialReference({ wkid: 102100 });
            stopPushpin = dojoConfig.baseURL + dojo.configData.LocatorSettings.DefaultLocatorSymbol;
            locatorMarkupSymbol = new esri.symbol.PictureMarkerSymbol(stopPushpin, dojo.configData.LocatorSettings.MarkupSymbolSize.width, dojo.configData.LocatorSettings.MarkupSymbolSize.height);
            pointGraphic = new esri.Graphic(pointFeature.geometry, locatorMarkupSymbol, {}, null);
            routeParams.stops.features.push(dojo.addressLocation);
            routeParams.stops.features.push(pointGraphic);
            routeTask.solve(routeParams, lang.hitch(this, function (route) {
                milesDistance = route.routeResults[0].directions.totalLength.toFixed(1) + " miles";
                domAttr.set(distanceHolder, "innerHTML", milesDistance);
                domClass.add(distanceHolder, "totalDistance");
                domClass.remove(distanceHolder, "routeDistanceLoading");
            }));
        },

        /**
        * open link in a window on clicking of it
        * @memberOf widgets/locator/locator
        */
        _makeWindowOpenHandler: function (link) {
            return function () {
                window.open(link);
            };
        },

        /**
        * create infowindow coontent for selected address
        * @memberOf widgets/locator/locator
        */
        _createInfoWindowContent: function (mapPoint, featureArray, count, isInfoArrowClicked, isFeatureListClicked) {
            var layerSettings, infoPopupFieldsCollection, infoPopupHeight, infoPopupWidth, divInfoDetailsTab, key, screenPoint,
                divInfoRow, i, j, fieldNames, link, divLink, infoTitle, attributes, infoIndex, spanWebsiteLink;
            if (featureArray[count].attr && featureArray[count].attr.attributes) {
                attributes = featureArray[count].attr.attributes;
            } else if (featureArray[count].attribute) {
                attributes = featureArray[count].attribute;
            } else {
                attributes = featureArray[count].attributes;
            }
            infoIndex = featureArray[count].layerIndex;
            if (!dojo.configData.Workflows[dojo.workFlowIndex].InfowindowSettings[infoIndex]) {
                return;
            }
            if (featureArray.length > 1 && (!isFeatureListClicked)) {

                if (featureArray.length > 1 && count !== featureArray.length - 1) {
                    domClass.add(query(".esriCTdivInfoRightArrow")[0], "esriCTShowInfoRightArrow");
                    domAttr.set(query(".esriCTdivInfoFeatureCount")[0], "innerHTML", count);
                } else {
                    domClass.remove(query(".esriCTdivInfoRightArrow")[0], "esriCTShowInfoRightArrow");
                    domAttr.set(query(".esriCTdivInfoFeatureCount")[0], "innerHTML", "");
                }
                if (count > 0 && count < featureArray.length) {
                    domClass.add(query(".esriCTdivInfoLeftArrow")[0], "esriCTShowInfoLeftArrow");
                    domAttr.set(query(".esriCTdivInfoFeatureCount")[0], "innerHTML", count + 1);
                } else {
                    domClass.remove(query(".esriCTdivInfoLeftArrow")[0], "esriCTShowInfoLeftArrow");
                    domAttr.set(query(".esriCTdivInfoFeatureCount")[0], "innerHTML", count + 1);
                }
            } else {
                domClass.remove(query(".esriCTdivInfoRightArrow")[0], "esriCTShowInfoRightArrow");
                domClass.remove(query(".esriCTdivInfoLeftArrow")[0], "esriCTShowInfoLeftArrow");
                domAttr.set(query(".esriCTdivInfoFeatureCount")[0], "innerHTML", "");
                domAttr.set(query(".esriCTdivInfoTotalFeatureCount")[0], "innerHTML", "");
            }
            topic.publish("hideLoadingIndicatorHandler");
            dojo.featureID = attributes.OBJECTID;
            layerSettings = dojo.configData.Workflows[dojo.workFlowIndex];
            dojo.layerID = layerSettings.SearchSettings[infoIndex].QueryLayerId;
            infoPopupFieldsCollection = layerSettings.InfowindowSettings[infoIndex].InfoWindowData;
            infoPopupHeight = dojo.configData.InfoPopupHeight;
            infoPopupWidth = dojo.configData.InfoPopupWidth;
            divInfoDetailsTab = domConstruct.create("div", { "class": "esriCTInfoDetailsTab" }, null);
            this.divInfoDetailsContainer = domConstruct.create("div", { "class": "divInfoDetailsContainer" }, divInfoDetailsTab);
            for (key = 0; key < infoPopupFieldsCollection.length; key++) {
                divInfoRow = domConstruct.create("div", { "className": "esriCTDisplayRow" }, this.divInfoDetailsContainer);
                // Create the row's label
                this.divInfoDisplayField = domConstruct.create("div", { "className": "esriCTDisplayField", "innerHTML": infoPopupFieldsCollection[key].DisplayText }, divInfoRow);
                this.divInfoFieldValue = domConstruct.create("div", { "className": "esriCTValueField" }, divInfoRow);
                for (i in attributes) {
                    if (attributes.hasOwnProperty(i)) {
                        if (!attributes[i]) {
                            attributes[i] = sharedNls.showNullValue;
                        }
                    }
                }
                try {
                    fieldNames = string.substitute(infoPopupFieldsCollection[key].FieldName, attributes);
                } catch (ex) {
                    fieldNames = sharedNls.showNullValue;
                }
                if (fieldNames.match("http:") || fieldNames.match("https:")) {
                    link = fieldNames;
                    divLink = domConstruct.create("div", {}, this.divInfoFieldValue);
                    spanWebsiteLink = domConstruct.create("span", { "class": "esriCTLink", innerHTML: sharedNls.titles.moreInfo }, divLink);
                    on(spanWebsiteLink, "click", lang.hitch(this, this._makeWindowOpenHandler(link)));
                } else {
                    this.divInfoFieldValue.innerHTML = fieldNames;
                }

            }
            for (j in attributes) {
                if (attributes.hasOwnProperty(j)) {
                    if (!attributes[j]) {
                        attributes[j] = sharedNls.showNullValue;
                    }
                }
            }
            try {
                infoTitle = string.substitute(layerSettings.InfowindowSettings[infoIndex].InfoWindowHeaderField, attributes);
            } catch (e) {
                infoTitle = sharedNls.showNullValue;
            }

            dojo.selectedMapPoint = mapPoint;
            if (!isInfoArrowClicked && !dojo.extentShared) {
                this._removeHighlightingFeature(this.selectedPolygon);
                domClass.remove(query(".esriCTdivInfoRightArrow")[0], "disableArrow");
                domClass.remove(query(".esriCTdivInfoLeftArrow")[0], "disableArrow");
                this._centralizeInfowindowOnMap(infoTitle, divInfoDetailsTab, infoPopupWidth, infoPopupHeight);

            } else {
                if (dojo.extentShared > 0) {
                    dojo.extentShared--;
                }
                screenPoint = this.map.toScreen(dojo.selectedMapPoint);
                screenPoint.y = this.map.height - screenPoint.y;
                domClass.remove(query(".esriCTdivInfoRightArrow")[0], "disableArrow");
                domClass.remove(query(".esriCTdivInfoLeftArrow")[0], "disableArrow");
                topic.publish("hideProgressIndicator");
                topic.publish("setInfoWindowOnMap", infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight);
            }
        },

        _centralizeInfowindowOnMap: function (infoTitle, divInfoDetailsTab, infoPopupWidth, infoPopupHeight) {
            var extentChanged, screenPoint;
            extentChanged = this.map.setExtent(this._calculateCustomMapExtent(dojo.selectedMapPoint));
            extentChanged.then(lang.hitch(this, function () {
                topic.publish("hideProgressIndicator");
                screenPoint = this.map.toScreen(dojo.selectedMapPoint);
                screenPoint.y = this.map.height - screenPoint.y;
                topic.publish("setInfoWindowOnMap", infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight);
            }));

        },

        /**
        * set infoWindow location on map
        * @memberOf widgets/locator/locator
        */
        _setInfoWindowLocation: function () {
            if (dojo.infoWindowIsShowing) {
                setTimeout(lang.hitch(this, function () {
                    this.map.setExtent(this._calculateCustomMapExtent(dojo.selectedMapPoint));
                    topic.publish("setMapTipPosition");
                }), 1000);
            }
        },

        /**
        * calculate extent of map
        * @memberOf widgets/locator/locator
        */
        _calculateCustomMapExtent: function (mapPoint) {
            var width, height, diff, ratioHeight, ratioWidth, totalYPoint, xmin, ymin, xmax, ymax;
            width = this.map.extent.getWidth();
            height = this.map.extent.getHeight();
            diff = 0;
            ratioHeight = height / this.map.height;
            ratioWidth = width / this.map.width;
            totalYPoint = dojo.configData.InfoPopupHeight + 30 + 61;
            xmin = mapPoint.x - (width / 2);
            if (dojo.window.getBox().w >= 680) {
                ymin = mapPoint.y - height + (ratioHeight * totalYPoint);
                xmax = xmin + width + diff * ratioWidth;
            } else {
                ymin = mapPoint.y - (height / 2);
                xmax = xmin + width;
            }
            ymax = ymin + height;
            return new esri.geometry.Extent(xmin, ymin, xmax, ymax, this.map.spatialReference);
        },

        /**
        * reset locate container
        * @memberOf widgets/locator/locator
        */
        _resetLocateContainer: function () {
            domConstruct.empty(this.divAddressResults);
            domConstruct.empty(this.divSelectedFeatureList);
            domStyle.set(this.divSelectedFeature, "display", "none");
            if (query('.esriCTdivLegendbox')[0]) {
                domStyle.set(query('.esriCTdivLegendbox')[0], "zIndex", "1000");
                domClass.remove(query('.legenboxInner')[0], "rightBorderNone");
            }
            domStyle.set(query(".esriCTAddressScrollContent")[0], "display", "none");
            domClass.replace(this.domNode, "esriCTTdHeaderSearch", "esriCTTdHeaderSearch-select");
            domClass.replace(this.divAddressHolder, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
            if (query(".esriControlsBR")[0]) {
                domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
            }
            domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
            topic.publish("setMaxLegendLength");
            this.txtAddress.blur();
        },

        /**
        * remove highlighting from earlier selected feature
        * @memberOf widgets/locator/locator
        */
        _removeHighlightingFeature: function (feature) {
            var gLayer = this.map.getLayer("esriGraphicsLayerMapSettings");
            if (this.selectedPolygon) {
                gLayer.remove(this.selectedPolygon);
            }
        },

        /**
        * highlight selected feature
        * @memberOf widgets/locator/locator
        */
        _highlightFeature: function (feature) {
            var gLayer, symbolColor, outlineColor, customPolygon;
            gLayer = this.map.getLayer("esriGraphicsLayerMapSettings");
            this._removeHighlightingFeature(this.selectedPolygon);
            symbolColor = outlineColor = new dojo.Color(dojo.configData.Workflows[dojo.workFlowIndex].FeatureHighlightColor);
            symbolColor.a = 0.6;
            customPolygon = {
                "geometry": feature.geometry,
                "symbol": {
                    "color": symbolColor,
                    "outline": {
                        "color": outlineColor,
                        "width": 1,
                        "type": "esriSLS",
                        "style": "esriSLSSolid"
                    },
                    "type": "esriSFS",
                    "style": "esriSFSSolid"
                }
            };
            this.selectedPolygon = new esri.Graphic(customPolygon);
            gLayer.add(this.selectedPolygon);
        },

        /**
        * set address for sharing
        * @memberOf widgets/locator/locator
        */
        _shareAddress: function () {
            var sharedLocation, mapPoint, point, currentExtSplit, currentExt, currentExtent, sharedLayer, queryTask, queryFeature, featureObjId, currentTime;
            if (window.location.toString().split("$locationPoint=").length > 1) {
                dojo.extentShared++;
                this._showLocateContainer();
                sharedLocation = window.location.toString().split("$locationPoint=")[1].split("$")[0];
                var pointDecode = decodeURIComponent(sharedLocation).split(",")
                mapPoint = new Point(parseFloat(pointDecode[0]), parseFloat(pointDecode[1]), this.map.spatialReference);
                this._locateAddressOnMap(mapPoint);
            }
            if (window.location.toString().split("$extent=").length > 1) {
                currentExtent = window.location.toString().split("$extent=")[1].split("$")[0];
                if (currentExtent) {
                    currentExtSplit = decodeURIComponent(currentExtent).split(',');
                    currentExt = new esri.geometry.Extent(parseFloat(currentExtSplit[0]), parseFloat(currentExtSplit[1]), parseFloat(currentExtSplit[2]), parseFloat(currentExtSplit[3]), this.map.spatialReference);
                    this.map.setExtent(currentExt);
                }
            }
            if (window.location.toString().split("$mapClickPoint=").length > 1) {
                dojo.extentShared++;
                dojo.sharedInfowindow = true;
                mapPoint = window.location.toString().split("$mapClickPoint=")[1].split("$")[0];
                decodeMapPoint = decodeURIComponent(mapPoint).split(",");
                point = new Point([decodeMapPoint[0], decodeMapPoint[1]], this.map.spatialReference);
                setTimeout(lang.hitch(this, function () {
                    topic.publish("showInfoWindowOnMap", point);
                }), 2000);
            }
            if (window.location.toString().split("$layerID=").length > 1) {
                sharedLayer = parseFloat(window.location.toString().split("$layerID=")[1]);
                currentTime = new Date();
                dojo.sharedInfowindow = true;
                array.some(dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings, lang.hitch(this, function (layer, infoIndex) {
                    if (Number(layer.QueryLayerId) === sharedLayer) {
                        dojo.extentShared++;
                        queryTask = new QueryTask(layer.QueryURL);
                        queryFeature = new Query();
                        featureObjId = window.location.toString().split("$featureID=")[1].split("$")[0];
                        queryFeature.where = "OBJECTID=" + parseInt(featureObjId, 10) + " AND " + currentTime.getTime() + infoIndex.toString() + "=" + currentTime.getTime() + infoIndex.toString();
                        queryFeature.outSpatialReference = this.map.spatialReference;
                        queryFeature.returnGeometry = true;
                        queryFeature.outFields = ["*"];
                        queryTask.execute(queryFeature, lang.hitch(this, function (featureSet) {
                            featureSet.features[0].layerIndex = infoIndex;
                            if (featureSet.features[0].geometry.type === "point") {
                                this._createInfoWindowContent(featureSet.features[0].geometry, featureSet.features, 0, false, true);
                            } else {
                                this._createInfoWindowContent(featureSet.features[0].geometry.getCentroid(), featureSet.features, 0, false, true);
                                this._highlightFeature(featureSet.features[0]);
                            }
                        }), function (error) {
                            console.log(error);
                        });
                        return false;
                    }
                }));
            }
        },

        _resetAddressContainer: function () {
            this.resetShareParameters();
            domStyle.set(this.divAddressScrollContainer, "display", "none");
            domStyle.set(this.noResultFound, "display", "none");
            this._setDefaultTextboxValue();
            this._resetLocateContainer();

        },
        /**
        * reset shared parameters
        * @memberOf widgets/locator/locator
        */
        resetShareParameters: function () {
            dojo.addressLocation = dojo.infoWindowIsShowing = dojo.mapClickedPoint = null;
        }
    });
});
