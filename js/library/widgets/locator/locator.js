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
], function (declare, domConstruct, domStyle, domAttr, array, lang, on, domGeom, dom, domClass, html, string, Locator, HorizontalSlider, HorizontalRule, HorizontalRuleLabels, dojoWindow, Query, SimpleLineSymbol, Polyline, query, ScrollBar, Point, Deferred, DeferredList, QueryTask, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Color, urlUtils, Symbol, topic, mouse, FeatureSet, Units, SpatialReference, RouteTask, RouteParameters, sharedNls) {
     //========================================================================================================================//

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        sharedNls: sharedNls,
        lastSearchString: null,
        stagedSearch: null,
        locatorScrollbar: null,
        geometryArrayForPolyline: [],
        addressLocation: null,
        drive: true,
        sliderValue: null,
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
                proxyUrl: dojoConfig.baseURL + dojo.configData.ProxyUrl
            });
            urlUtils.addProxyRule({
                urlPrefix: dojo.configData.GeometryService,
                proxyUrl: dojoConfig.baseURL + dojo.configData.ProxyUrl
            });
            this.logoContainer = (query(".map .logo-sm") && query(".map .logo-sm")[0]) || (query(".map .logo-med") && query(".map .logo-med")[0]);
            topic.subscribe("toggleWidget", lang.hitch(this, function (widget) {
                if (widget !== "locator") {
                    if (domGeom.getMarginBox(this.divAddressHolder).h > 0) {
                        domClass.replace(this.domNode, "esriCTTdHeaderSearch", "esriCTTdHeaderSearch-select");
                        domClass.replace(this.divAddressHolder, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                        domClass.replace(this.divAddressHolder, "esriCTZeroHeight", "esriCTAddressContainerHeight");
                    }
                }
            }));
            topic.subscribe("_createList", lang.hitch(this, function (featureList) {
                this._createFeatureList(featureList);
            }));
            topic.subscribe("setMapTipPosition", lang.hitch(this, function (selectedPoint, map, infoWindow) {
                this._onSetMapTipPosition(selectedPoint, map, infoWindow);
            }));

            topic.subscribe("showInfoWindow", lang.hitch(this, function (mapPoint, attributes, fields, infoIndex, featureArray, count, map) {
                this._createInfoWindowContent(mapPoint, attributes, fields, infoIndex, featureArray, count, map);
            }));
            topic.subscribe("clearSelectedFeature", lang.hitch(this, function () {
                this.map.getLayer("esriGraphicsLayerMapSettings").remove(this.selectedPolygon);
            }));
            topic.subscribe("setMap", lang.hitch(this, function (map) {
                this.map = map;
                this.resetShareParameters();
            }));
            topic.subscribe("locateAddressOnMap", lang.hitch(this, function () {
                if (window.location.toString().split("$driveType=").length > 1) {
                    if (window.location.toString().split("$driveType=")[1] === "false") {
                        domClass.replace(this.esriCTDrive.firstElementChild, "driveIcon", "driveIconSelected");
                        domClass.replace(this.esriCTWalk.firstElementChild, "walkIconSelected", "walkIcon");
                        this.sliderMessage.innerHTML = this.sliderMessage.innerHTML.replace("drive", "walk");
                        this.drive = dojo.driveTime = false;
                    }
                }
                this._shareApplication();
            }));
            window.onresize = lang.hitch(this, function () {
                if (domStyle.get(this.divSelectedFeature, "display") === "block") {
                    this._createFeatureList(this.selectedFeatureList);
                    domClass.replace(query(".toggleExpandCollapse")[0], "collapse", "expand");
                    domAttr.set(query(".toggleExpandCollapse")[0], "title", dojo.configData.ExpandResult);
                }
            });
            topic.subscribe("resetListContainer", lang.hitch(this, function () {
            }));
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
                if (domClass.contains(this.esriCTDrive.firstElementChild, "driveIcon")) {
                    domClass.replace(this.esriCTDrive.firstElementChild, "driveIconSelected", "driveIcon");
                    domClass.replace(this.esriCTWalk.firstElementChild, "walkIcon", "walkIconSelected");
                    this.sliderMessage.innerHTML = this.sliderMessage.innerHTML.replace("walk", "drive");
                    this.drive = dojo.driveTime = true;
                    this._updateBufferArea();
                }
            }));
            on(this.esriCTWalk, "click", lang.hitch(this, function () {
                if (domClass.contains(this.esriCTWalk.firstElementChild, "walkIcon")) {
                    domClass.replace(this.esriCTDrive.firstElementChild, "driveIcon", "driveIconSelected");
                    domClass.replace(this.esriCTWalk.firstElementChild, "walkIconSelected", "walkIcon");
                    this.sliderMessage.innerHTML = this.sliderMessage.innerHTML.replace("drive", "walk");
                    this.drive = dojo.driveTime = false;
                    this._updateBufferArea();
                }
            }));
            on(query(".toggleExpandCollapse")[0], "click", lang.hitch(this, function (evt) {
                if (domClass.contains(evt.currentTarget, "collapse")) {
                    domClass.replace(evt.currentTarget, "expand", "collapse");
                    domAttr.set(evt.currentTarget, "title", dojo.configData.CollapseResult);
                    this._expandList();
                } else {
                    domClass.replace(evt.currentTarget, "collapse", "expand");
                    domAttr.set(evt.currentTarget, "title", dojo.configData.ExpandResult);
                    this._collapseList();
                }
                this.featureListScrollbar.resetScrollBar();
            }));
            domAttr.set(query(".toggleExpandCollapse")[0], "title", dojo.configData.ExpandResult);
            domAttr.set(this.sliderMessage, "innerHTML", string.substitute(sharedNls.titles.sliderDisplayText, { defaultMinute: dojo.configData.DriveTimeSliderSettings.defaultMinutes }));
            domAttr.set(this.esriCTimgDrive, "title", dojo.configData.DriveTime);
            domAttr.set(this.esriCTimgWalk, "title", dojo.configData.WalkTime);
            domAttr.set(query(".nearbyMessage")[0], "innerHTML", dojo.configData.NearbyText);
        },
        /**
        * set default value of locator textbox as specified in configuration file
        * @param {array} dojo.configData.LocatorSettings.Locators Locator settings specified in configuration file
        * @memberOf widgets/locator/locator
        */
        _setDefaultTextboxValue: function () {
            var locatorSettings;
            locatorSettings = dojo.configData.LocatorSettings;

            /**
            * txtAddress Textbox for search text
            * @member {textbox} txtAddress
            * @private
            * @memberOf widgets/locator/locator
            */
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
                this._locateAddress(evt);
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
            domConstruct.empty(this.divAddressResults, this.divAddressScrollContent);
            domAttr.set(this.txtAddress, "defaultAddress", this.txtAddress.value);
            domAttr.set(this.close, "title", "");
            domClass.remove(this.divAddressContent, "esriCTAddressResultHeight");
            if (this.locatorScrollbar) {
                domClass.add(this.locatorScrollbar._scrollBarContent, "esriCTZeroHeight");
                this.locatorScrollbar.removeScrollBar();
            }
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
                domClass.replace(this.divAddressHolder, "esriCTZeroHeight", "esriCTAddressContainerHeight");
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
                domStyle.set(this.txtAddress, "verticalAlign", "middle");
                if (domStyle.get(query(".divSelectedFeature")[0], "display", "block") === "block") {
                    domClass.add(query(".esriControlsBR")[0], "esriLogoShiftRight");
                    topic.publish("setMinLegendLength");
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
                        this._locateAddress(evt);
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
                        domStyle.set(this.imgSearchLoader, "display", "none");
                        domStyle.set(this.close, "display", "block");
                        domAttr.set(this.close, "title", "");
                        domConstruct.empty(this.divAddressResults);
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
            if (lang.trim(this.txtAddress.value) === '') {
                domStyle.set(this.imgSearchLoader, "display", "none");
                domStyle.set(this.close, "display", "block");
                domConstruct.empty(this.divAddressResults);
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

            /**
            * call locator service specified in configuration file
            */
            locatorSettings = dojo.configData.LocatorSettings;
            locator = new Locator(locatorSettings.LocatorURL);
            searchFieldName = locatorSettings.LocatorParameters.SearchField;
            addressField = {};
            addressField[searchFieldName] = lang.trim(this.txtAddress.value);
            if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId && lang.trim(dojo.configData.Workflows[dojo.workFlowIndex].WebMapId).length !== 0) {
                baseMapExtent = this.map.getLayer(this.map.layerIds[0]).fullExtent;
            } else if (this.map.getLayer("esriCTbasemap")) {
                baseMapExtent = this.map.getLayer("esriCTbasemap").fullExtent;
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

        _addressResult: function (candidates, nameArray, searchFields, addressFieldName) {
            var order, j;
            domClass.add(this.divAddressScrollContent, "esriCTdivAddressScrollContent");
            domClass.add(this.divAddressResultContainer, "border_bottom");
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
        },

        _locateLayersearchResult: function (defferedArray, index) {
            var layerobject, queryTask, query, currentTime, queryTaskResult, deferred;
            layerobject = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[index];
            domStyle.set(this.imgSearchLoader, "display", "block");
            domStyle.set(this.close, "display", "none");
            if (layerobject.QueryURL) {
                queryTask = new QueryTask(layerobject.QueryURL);
                query = new Query();
                currentTime = new Date();
                query.where = string.substitute(layerobject.SearchExpression, [lang.trim(this.txtAddress.value).toUpperCase()]) + " AND " + currentTime.getTime().toString() + "=" + currentTime.getTime().toString();
                query.outSpatialReference = this.map.spatialReference;
                query.returnGeometry = true;
                query.outFields = ["*"];
                queryTaskResult = queryTask.execute(query, lang.hitch(this, function (featureSet) {
                    deferred = new Deferred();
                    deferred.resolve(featureSet);
                    return deferred.promise;
                }), function () {

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
            topic.publish("clearFeatureList");
            if (this.map.getLayer("esriGraphicsLayerMapSettings")) {
                this.map.getLayer("esriGraphicsLayerMapSettings").clear();
            }
            domConstruct.empty(this.divAddressResults);
            if (lang.trim(this.txtAddress.value) === "") {
                this.txtAddress.focus();
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
                for (candidateArray in candidates) {
                    if (candidates.hasOwnProperty(candidateArray)) {
                        if (candidates[candidateArray].length > 0) {
                            divAddressCounty = domConstruct.create("div", { "class": "esriCTSearchGroupRow esriCTBottomBorder esriCTResultColor esriCTCursorPointer esriAddressCounty" }, this.divAddressResults);
                            divAddressSearchCell = domConstruct.create("div", { "class": "esriCTSearchGroupCell" }, divAddressCounty);
                            candiate = candidateArray + " (" + candidates[candidateArray].length + ")";
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
        _graphicLayerOnMap: function (geometry, symbol) {
            dojo.addresslocation = geometry;
            if (window.location.toString().split("$sliderValue=").length > 1) {
                this.sliderValue = Number(window.location.toString().split("$sliderValue=")[1].split("$")[0]);
            }
            var graphic = new esri.Graphic(geometry, symbol, {}, null);
            if (this.map.getLayer("esriGraphicsLayerMapSettings")) {
                this.map.getLayer("esriGraphicsLayerMapSettings").clear();
                this.map.getLayer("esriGraphicsLayerMapSettings").add(graphic);
            }
            topic.publish("hideProgressIndicator");
            this.addressLocation = graphic;
            topic.publish("SliderChange", this.sliderValue, this.addressLocation, this.drive);
        },

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
            domClass.replace(this.divAddressHolder, "esriCTZeroHeight", "esriCTAddressContainerHeight");
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
            if (domStyle.get(this.imgSearchLoader, "display", "block") === "block") {
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
            if (domClass.contains(this.divSelectedFeature, "esriCTAddressHolderHeight")) {
                return;
            }
            domConstruct.empty(this.divAddressResults);
            domStyle.set(this.imgSearchLoader, "display", "none");
            domStyle.set(this.close, "display", "block");
            domClass.add(this.divAddressContent, "esriCTAddressResultHeight");
            var errorAddressCounty = domConstruct.create("div", { "class": "esriCTBottomBorder" }, this.divAddressResults);
            domAttr.set(errorAddressCounty, "innerHTML", sharedNls.errorMessages.invalidSearch);
            domClass.remove(this.divAddressScrollContent, "esriCTdivAddressScrollContent");
            domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
            domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
            domAttr.set(this.close, "title", "");
            topic.publish("setMaxLegendLength");
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
                this.sliderValue = Number(window.location.toString().split("$sliderValue=")[1].split("$")[0]);
                setTimeout(lang.hitch(this, function () {
                    this._setSliderValueLabel(this.sliderValue);
                }), 100);
            } else {
                this.sliderValue = dojo.sliderValue = dojo.configData.DriveTimeSliderSettings.defaultMinutes;
            }
            horizontalRule = new HorizontalRule({
                SliderRulerContainer: dojo.configData.DriveTimeSliderRulerSettings.SliderRulerContainer,
                count: dojo.configData.DriveTimeSliderSettings.discreteValues,
                "class": "horizontalRule"
            }, this.horizontalRuleContainer);
            horizontalRule.domNode.firstChild.innerHTML = dojo.configData.DriveTimeSliderSettings.minMinutes;
            horizontalRule.domNode.firstChild.style.border = "none";
            horizontalRule.domNode.lastChild.innerHTML = dojo.configData.DriveTimeSliderSettings.maxMinutes;
            horizontalRule.domNode.lastChild.style.border = "none";
            domClass.add(horizontalRule.domNode.lastChild, "esriCTLastChild");
            horizontalSlider = new HorizontalSlider({
                value: this.sliderValue,
                minimum: dojo.configData.DriveTimeSliderSettings.minMinutes,
                maximum: dojo.configData.DriveTimeSliderSettings.maxMinutes,
                discreteValues: dojo.configData.DriveTimeSliderSettings.discreteValues,
                intermediateChanges: dojo.configData.DriveTimeSliderSettings.intermediateChanges,
                showButtons: dojo.configData.DriveTimeSliderSettings.showButtons,
                "class": "horizontalSlider"
            }, this.horizontalSliderContainer);
            on(horizontalSlider, "change", lang.hitch(this, function (defaultMinutes) {
                this._setSliderValueLabel(defaultMinutes);
                this.sliderValue = dojo.sliderValue = defaultMinutes;
                if (this.addressLocation) {
                    topic.publish("SliderChange", this.sliderValue, this.addressLocation, this.drive);
                }
            }));
            domClass.add(query(".dijitRuleMark")[0], "moveLeft");
        },

        _setSliderValueLabel: function (defaultMinutes) {
            var sliderMessage, message;
            sliderMessage = this.sliderMessage.innerHTML.split(/\d+/g);
            message = sliderMessage[0] + " " + Math.floor(defaultMinutes) + " " + sliderMessage[1];
            this.sliderMessage.innerHTML = message;
        },

        _updateBufferArea: function () {
            if (this.addressLocation) {
                topic.publish("SliderChange", this.sliderValue, this.addressLocation, this.drive);
            }
        },

        _createFeatureList: function (featureList) {
            var featureListArray, scrollContentHeight, layerTitleCell, sharedLayer, queryTask, queryFeature;
            topic.subscribe("resetLocatorContainer", lang.hitch(this, function () {
                this._resetLocateContainer();
            }));
            domClass.remove(this.divAddressResultContainer, "border_bottom");
            topic.publish("setMinLegendLength");
            domClass.add(this.divAddressContent, "esriCTAddressHolderHeight");
            featureListArray = [];
            domStyle.set(this.divSelectedFeature, "display", "block");
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
            scrollContentHeight = ((domGeom.getMarginBox(this.divSelectedFeature).h - domGeom.position(this.divSelectedFeature).y) - 60) + "px";
            domStyle.set(this.divSelectedFeatureContent, "height", scrollContentHeight);
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
                array.forEach(featureGroup, lang.hitch(this, function (feature) {
                    var featueNamediv, featueName, spanRouteLength;
                    featueNamediv = domConstruct.create("div", { "class": "esriCTContentBottomBorder divAddressListGrouprow esriCTCursorPointer" }, divAddressListGroup);
                    featueName = domConstruct.create("div", { "innerHTML": feature.featureName, "class": "featureName" }, featueNamediv);
                    if (feature.geometry.type === "point") {
                        spanRouteLength = domConstruct.create("div", { "innerHTML": "Show distance", "class": "spanRouteLength" }, featueNamediv);
                        on.once(spanRouteLength, "click", lang.hitch(this, function () {
                            domClass.add(spanRouteLength, "routeDistanceLoading");
                            domAttr.set(spanRouteLength, "innerHTML", "");
                            this._calculateRouteDistance(feature, spanRouteLength);
                        }));
                    }
                    on(featueNamediv, mouse.enter, lang.hitch(this, function () {
                        dojo.mapClickedPoint = false;
                        setTimeout(lang.hitch(this, function () {
                            this.map.getLayer("esriGraphicsLayerMapSettings").remove(this.selectedPolygon);
                            if (feature.geometry.type === "point") {
                                this._createInfoWindowContent(feature.geometry, feature.attribute, feature.fields, feature.layerIndex, null, null, this.map);
                            } else if (feature.geometry.type === "polygon") {
                                this._createInfoWindowContent(feature.geometry.getCentroid(), feature.attribute, feature.fields, feature.layerIndex, null, null, this.map);
                                this._highlightFeature(feature);
                            }
                        }), 0);
                    }));
                    on(featueName, "click", lang.hitch(this, function () {
                        if (feature.geometry.type === "point") {
                            this.map.centerAndZoom(feature.geometry, dojo.configData.ZoomLevel);
                        } else if (feature.geometry.type === "polygon") {
                            this.map.centerAndZoom(feature.geometry.getCentroid(), dojo.configData.ZoomLevel);
                        }
                    }));
                }));
            }));
            if (window.location.toString().split("$layerID=").length > 1) {
                sharedLayer = parseFloat(window.location.toString().split("$layerID=")[1]);
                array.some(dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings, lang.hitch(this, function (layer, infoIndex) {
                    if (Number(layer.QueryLayerId) === sharedLayer) {
                        queryTask = new QueryTask(layer.QueryURL);
                        queryFeature = new Query();
                        queryFeature.where = "OBJECTID=" + window.location.toString().split("$featureID=")[1].split("$")[0];
                        queryFeature.outSpatialReference = this.map.spatialReference;
                        queryFeature.returnGeometry = true;
                        queryFeature.outFields = ["*"];
                        queryTask.execute(queryFeature, lang.hitch(this, function (featureSet) {
                            if (featureSet.features[0].geometry.type === "point") {
                                this._createInfoWindowContent(featureSet.features[0].geometry, featureSet.features[0].attributes, featureSet.fields, infoIndex, null, null, this.map);
                            } else {
                                this._createInfoWindowContent(featureSet.features[0].geometry.getCentroid(), featureSet.features[0].attributes, featureSet.fields, infoIndex, null, null, this.map);
                            }
                        }), function (error) {
                            console.log(error);
                        });
                        return false;
                    }
                }));
            }
        },

        _toggleFeatureList: function (layerTitle, idx) {
            var sign;
            on(layerTitle[idx], "click", lang.hitch(this, function () {
                this.featureListScrollbar.resetScrollBar();
                sign = (query(".plusMinusFeatureTitle")[idx].innerHTML === "+") ? "-" : "+";
                query(".plusMinusFeatureTitle")[idx].innerHTML = sign;
                if (domClass.contains(query(".divAddressListGroup")[idx], "listExpand")) {
                    domClass.toggle(query(".divAddressListGroup")[idx], "listExpand");
                } else {
                    domClass.add(query(".divAddressListGroup")[idx], "listExpand");
                }
            }));
        },
        _expandList: function () {
            array.forEach(query(".plusMinusFeatureTitle"), function (featureNode, idx) {
                domClass.replace(featureNode, "esriCTExpand", "esriCTCollapse");
                domClass.add(query(".divAddressListGroup")[idx], "listExpand");
                query(".plusMinusFeatureTitle")[idx].innerHTML = "-";
            });
        },
        _collapseList: function () {
            array.forEach(query(".plusMinusFeatureTitle"), function (featureNode, idx) {
                domClass.replace(featureNode, "esriCTCollapse", "esriCTExpand");
                domClass.remove(query(".divAddressListGroup")[idx], "listExpand");
                query(".plusMinusFeatureTitle")[idx].innerHTML = "+";
            });
        },
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
            routeParams.stops.features.push(this.addressLocation);
            routeParams.stops.features.push(pointGraphic);
            routeTask.solve(routeParams, lang.hitch(this, function (route) {
                milesDistance = route.routeResults[0].directions.totalLength.toFixed(1) + " miles";
                domAttr.set(distanceHolder, "innerHTML", milesDistance);
                domClass.add(distanceHolder, "totalDistance");
                domClass.remove(distanceHolder, "routeDistanceLoading");
            }));
        },
        _makeWindowOpenHandler: function (link) {
            return function () {
                window.open(link);
            };
        },

        _createInfoWindowContent: function (mapPoint, attributes, fields, infoIndex, featureArray, count, map) {
            var layerSettings, infoPopupFieldsCollection, infoWindowTitle, infoPopupHeight, infoPopupWidth, divInfoDetailsTab, key,
                divInfoRow, i, j, fieldNames, link, divLink, infoTitle, extentChanged;
            if (featureArray) {
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
            layerSettings = dojo.configData;
            dojo.layerID = layerSettings.Workflows[dojo.workFlowIndex].SearchSettings[infoIndex].QueryLayerId;
            infoPopupFieldsCollection = layerSettings.Workflows[dojo.workFlowIndex].InfowindowSettings[infoIndex].InfoWindowData;
            infoWindowTitle = layerSettings.Workflows[dojo.workFlowIndex].InfowindowSettings[infoIndex].InfoWindowHeaderField;
            infoPopupHeight = layerSettings.InfoPopupHeight;
            infoPopupWidth = layerSettings.InfoPopupWidth;
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
                fieldNames = string.substitute(infoPopupFieldsCollection[key].FieldName, attributes);
                if (string.substitute(infoPopupFieldsCollection[key].FieldName, attributes).match("http:") || string.substitute(infoPopupFieldsCollection[key].FieldName, attributes).match("https:")) {
                    link = fieldNames;
                    divLink = domConstruct.create("div", { "class": "esriCTLink", innerHTML: sharedNls.titles.moreInfo }, this.divInfoFieldValue);
                    on(divLink, "click", lang.hitch(this, this._makeWindowOpenHandler(link)));
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
            infoTitle = string.substitute(layerSettings.Workflows[dojo.workFlowIndex].InfowindowSettings[infoIndex].InfoWindowHeaderField, attributes);
            dojo.selectedMapPoint = mapPoint;
            extentChanged = map.setExtent(this._calculateCustomMapExtent(mapPoint));
            extentChanged.then(lang.hitch(this, function () {
                topic.publish("hideProgressIndicator");
                var screenPoint = map.toScreen(dojo.selectedMapPoint);
                screenPoint.y = map.height - screenPoint.y;
                topic.publish("setInfoWindowOnMap", infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight);
            }));
        },

        _calculateCustomMapExtent: function (mapPoint) {
            var width, infoWidth, height, diff, ratioHeight, ratioWidth, totalYPoint, xmin,
                ymin, xmax, ymax;
            width = this.map.extent.getWidth();
            infoWidth = (this.map.width / 2) + dojo.configData.InfoPopupWidth / 2 + 400;
            height = this.map.extent.getHeight();
            if (infoWidth > this.map.width) {
                diff = infoWidth - this.map.width;
            } else {
                diff = 0;
            }
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

        _resetLocateContainer: function () {
            domConstruct.empty(this.divAddressResults);
            domConstruct.empty(this.divSelectedFeatureList);
            domStyle.set(this.divSelectedFeature, "display", "none");
            domStyle.set(query(".esriCTAddressScrollContent")[0], "display", "none");
            domClass.replace(this.domNode, "esriCTTdHeaderSearch", "esriCTTdHeaderSearch-select");
            domClass.replace(this.divAddressHolder, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
            domClass.replace(this.divAddressHolder, "esriCTZeroHeight", "esriCTAddressContainerHeight");
            domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
            domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
            topic.publish("setMaxLegendLength");
            this.txtAddress.blur();
        },

        _highlightFeature: function (feature) {
            var gLayer, symbolColor, outlineColor, customPolygon;
            gLayer = this.map.getLayer("esriGraphicsLayerMapSettings");
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

        _onSetMapTipPosition: function (selectedPoint, map, infoWindow) {
            if (selectedPoint) {
                var screenPoint = map.toScreen(selectedPoint);
                screenPoint.y = map.height - screenPoint.y;
                infoWindow.setLocation(screenPoint);
            }
        },

        _shareApplication: function () {
            var sharedLocation, mapPoint, point;
            if (window.location.toString().split("$locationPoint=").length > 1) {
                this._showLocateContainer();
                sharedLocation = window.location.toString().split("$locationPoint=")[1];
                mapPoint = new Point(parseFloat(sharedLocation.split(",")[0]), parseFloat(sharedLocation.split(",")[1]), this.map.spatialReference);
                this._locateAddressOnMap(mapPoint);
            }
            if (window.location.toString().split("$mapClickPoint=").length > 1) {
                window.location.toString().split("$mapClickPoint=")[1].split(",");
                point = new Point([window.location.toString().split("$mapClickPoint=")[1].split(",")[0], window.location.toString().split("$mapClickPoint=")[1].split(",")[1]], new SpatialReference({ wkid: 102100 }));
                topic.publish("showInfoWindowOnMap", point, this.map);
            }
        },
        resetShareParameters: function () {
            this.addressLocation = dojo.addresslocation = dojo.infoWindowIsShowing = dojo.mapClickedPoint = null;
        }
    });
});
