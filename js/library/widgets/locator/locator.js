/*global define, document, Modernizr */
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
    "dojo/i18n!nls/localizedStrings",
    "dojo/_base/Color",
    "esri/symbol",
    "dojo/topic",
    "dojo/mouse"
],
     function (declare, domConstruct, domStyle, domAttr, array, lang, on, domGeom, dom, domClass, html, string, Locator, HorizontalSlider, HorizontalRule, HorizontalRuleLabels, dojoWindow, Query, SimpleLineSymbol, Polyline, query, scrollBar, point, Deferred, DeferredList, QueryTask, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, Color, Symbol, topic, mouse) {
         //========================================================================================================================//

         return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
             templateString: template,
             nls: nls,
             lastSearchString: null,
             stagedSearch: null,
             locatorScrollbar: null,
             geometryArrayForPolyline: [],
             addressLocation: null,
             drive: true,
             sliderValue: null,
             logoContainer: null,
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
                 this.logoContainer = query(".map .logo-sm") && query(".map .logo-sm")[0] || query(".map .logo-med") && query(".map .logo-med")[0];
                 topic.subscribe("toggleWidget", lang.hitch(this, function (widget) {
                     if (widget != "locator") {
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

                 topic.subscribe("showInfoWindow", lang.hitch(this, function (mapPoint, attributes, infoIndex, featureArray, count, map) {
                     this._createInfoWindowContent(mapPoint, attributes, infoIndex, featureArray, count, map);
                 }));
                 topic.subscribe("clearSelectedFeature", lang.hitch(this, function () {
                     this.map.getLayer("esriGraphicsLayerMapSettings").remove(this.selectedPolygon);
                 }));

                 this.domNode = domConstruct.create("div", { "title": this.title, "class": "esriCTTdHeaderSearch" }, null);
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
                 on(this.esriCTDrive, "click", lang.hitch(this, function (evt) {
                     if (domClass.contains(this.esriCTDrive.firstElementChild, "driveIcon")) {
                         domClass.replace(this.esriCTDrive.firstElementChild, "driveIconSelected", "driveIcon");
                         domClass.replace(this.esriCTWalk.firstElementChild, "walkIcon", "walkIconSelected");
                         this.sliderMessage.innerHTML = this.sliderMessage.innerHTML.replace("walk", "drive");
                         this.drive = true;
                         this._updateBufferArea();
                     }
                 }));
                 on(this.esriCTWalk, "click", lang.hitch(this, function (evt) {
                     if (domClass.contains(this.esriCTWalk.firstElementChild, "walkIcon")) {
                         domClass.replace(this.esriCTDrive.firstElementChild, "driveIcon", "driveIconSelected");
                         domClass.replace(this.esriCTWalk.firstElementChild, "walkIconSelected", "walkIcon");
                         this.sliderMessage.innerHTML = this.sliderMessage.innerHTML.replace("drive", "walk");
                         this.drive = false;
                         this._updateBufferArea();
                     }
                 }));

                 on(query(".expand")[0], "click", lang.hitch(this, function (evt) {
                     this._expandList();
                     if (domClass.contains(query(".collapse")[0], "collapseSelectedBlue")) {
                         domClass.remove(query(".collapse")[0], "collapseSelectedBlue");
                     }
                     domClass.add(evt.currentTarget, "expandSelectedBlue");
                     this.featureListScrollbar.resetScrollBar();
                 }));

                 on(query(".collapse")[0], "click", lang.hitch(this, function (evt) {
                     domClass.add(evt.currentTarget, "collapseSelectedBlue");
                     this._collapseList();
                     if (domClass.contains(query(".expand")[0], "expandSelectedBlue")) {
                         domClass.remove(query(".expand")[0], "expandSelectedBlue");
                     }
                     this.featureListScrollbar.resetScrollBar();
                 }));
                 domAttr.set(this.sliderMessage, "innerHTML", string.substitute(nls.sliderDisplayText, { defaultMinute: dojo.configData.DriveTimeSliderSettings.defaultMinutes }));
             },
             /**
             * set default value of locator textbox as specified in configuration file
             * @param {array} dojo.configData.LocatorSettings.Locators Locator settings specified in configuration file
             * @memberOf widgets/locator/locator
             */
             _setDefaultTextboxValue: function () {
                 var locatorSettings, storage;
                 locatorSettings = dojo.configData.LocatorSettings; 0
                 storage = window.localStorage;
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
                     if (this.txtAddress.value == "") {
                         domClass.replace(this.close, "clearInputNotApear", "clearInput");
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
                     domClass.remove(this.logoContainer, "mapLogo");
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
                     if (domStyle.get(query(".divSelectedFeature")[0], "display", "block") == "block") {
                         domClass.add(this.logoContainer, "mapLogo");
                     }
                     topic.publish("setMinLegendLength");
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
                     if (evt.keyCode == dojo.keys.ENTER) {
                         if (this.txtAddress.value != '') {
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
                     if ((!((evt.keyCode >= 46 && evt.keyCode < 58) || (evt.keyCode > 64 && evt.keyCode < 91) || (evt.keyCode > 95 && evt.keyCode < 106) || evt.keyCode == 8 || evt.keyCode == 110 || evt.keyCode == 188)) || (evt.keyCode == 86 && evt.ctrlKey) || (evt.keyCode == 88 && evt.ctrlKey)) {
                         evt.cancelBubble = true;
                         evt.stopPropagation && evt.stopPropagation();
                         domStyle.set(this.imgSearchLoader, "display", "none");
                         domStyle.set(this.close, "display", "block");
                         return;
                     }

                     /**
                     * call locator service if search text is not empty
                     */
                     domStyle.set(this.imgSearchLoader, "display", "block");
                     domStyle.set(this.close, "display", "none");
                     if (domGeom.getMarginBox(this.divAddressContent).h > 0) {
                         if (lang.trim(this.txtAddress.value) != '') {
                             if (this.lastSearchString != lang.trim(this.txtAddress.value)) {
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
                 if (lang.trim(this.txtAddress.value) == '') {
                     domStyle.set(this.imgSearchLoader, "display", "none");
                     domStyle.set(this.close, "display", "block");
                     domConstruct.empty(this.divAddressResults);
                     this._locatorErrBack();
                     return;
                 } else {
                     this._searchLocation();
                 }
             },

             /**
             * call locator service and get search results
             * @memberOf widgets/locator/locator
             */
             _searchLocation: function () {
                 var nameArray = { Address: [] };
                 domStyle.set(this.imgSearchLoader, "display", "block");
                 domStyle.set(this.close, "display", "none");
                 domAttr.set(this.txtAddress, "defaultAddress", this.txtAddress.value);
                 this._setHeightAddressResults();

                 /**
                 * call locator service specified in configuration file
                 */
                 var locatorSettings = dojo.configData.LocatorSettings;
                 var locator = new Locator(locatorSettings.LocatorURL);
                 var searchFieldName = locatorSettings.LocatorParameters.SearchField;
                 var addressField = {};
                 addressField[searchFieldName] = lang.trim(this.txtAddress.value);
                 var baseMapExtent = this.map.getLayer(this.map.basemapLayerIds[0]).fullExtent;
                 var options = {};
                 options["address"] = addressField;
                 options["outFields"] = locatorSettings.LocatorOutFields;
                 options[locatorSettings.LocatorParameters.SearchBoundaryField] = baseMapExtent;
                 locator.outSpatialReference = this.map.spatialReference;
                 var searchFields = [];
                 var addressFieldValues = locatorSettings.FilterFieldValues;
                 var addressFieldName = locatorSettings.FilterFieldName;
                 for (var s in addressFieldValues) {
                     if (addressFieldValues.hasOwnProperty(s)) {
                         searchFields.push(addressFieldValues[s]);
                     }
                 }

                 /**
                 * get results from locator service
                 * @param {object} options Contains address, outFields and basemap extent for locator service
                 * @param {object} candidates Contains results from locator service
                 */
                 var defferedArray = [];
                 for (var index = 0; index < dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings.length; index++) {
                     this._locateLayersearchResult(defferedArray, index);
                 }

                 var locatorDef = locator.addressToLocations(options);
                 locator.on("address-to-locations-complete", lang.hitch(this, function (candidates) {
                     var deferred = new Deferred();
                     deferred.resolve(candidates);
                     return deferred.promise;
                 }), function () {
                     domStyle.set(this.imgSearchLoader, "display", "none");
                     domStyle.set(this.close, "display", "block");
                     this._locatorErrBack();
                 });
                 var resultLength;
                 defferedArray.push(locatorDef);
                 var deferredListResult = new DeferredList(defferedArray);
                 deferredListResult.then(lang.hitch(this, function (result) {
                     if (result) {
                         if (result.length > 0) {
                             for (var num = 0; num < result.length; num++) {
                                 if (dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[num]) {
                                     var key = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[num].SearchDisplayTitle;
                                     nameArray[key] = [];
                                     if (result[num][1].features) {
                                         for (var order = 0; order < result[num][1].features.length; order++) {
                                             for (var i in result[num][1].features[order].attributes) {
                                                 if (result[num][1].features[order].attributes.hasOwnProperty(i)) {
                                                     if (!result[num][1].features[order].attributes[i]) {
                                                         result[num][1].features[order].attributes[i] = nls.showNullValue;
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
                 domClass.add(this.divAddressScrollContent, "esriCTdivAddressScrollContent");
                 domClass.add(this.divAddressResultContainer, "border_bottom");
                 for (var order = 0; order < candidates.length; order++) {
                     if (candidates[order].attributes[dojo.configData.LocatorSettings.AddressMatchScore.Field] > dojo.configData.LocatorSettings.AddressMatchScore.Value) {
                         for (var j in searchFields) {
                             if (searchFields.hasOwnProperty(j)) {
                                 if (candidates[order].attributes[addressFieldName] == searchFields[j]) {
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
             },

             _locateLayersearchResult: function (defferedArray, index) {
                 var layerobject = dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[index];
                 domStyle.set(this.imgSearchLoader, "display", "block");
                 domStyle.set(this.close, "display", "none");
                 if (layerobject.QueryURL) {
                     var queryTask = new QueryTask(layerobject.QueryURL);
                     var query = new Query();
                     var currentTime = new Date();
                     query.where = string.substitute(layerobject.SearchExpression, [lang.trim(this.txtAddress.value).toUpperCase()]) + " AND " + currentTime.getTime().toString() + "=" + currentTime.getTime().toString();
                     query.outSpatialReference = this.map.spatialReference;
                     query.returnGeometry = true;
                     query.outFields = ["*"];
                     var queryTaskResult = queryTask.execute(query, lang.hitch(this, function (featureSet) {
                         var deferred = new Deferred();
                         deferred.resolve(featureSet);
                         return deferred.promise;
                     }), function (err) {

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
                 domStyle.set(query(".esriCTAddressScrollContent")[0], "display", "block");
                 domStyle.set(this.divSelectedFeature, "display", "none");
                 topic.publish("clearFeatureList");
                 this.map.getLayer("esriGraphicsLayerMapSettings").clear();
                 var addrListCount = 0;
                 var addrList = [];
                 domConstruct.empty(this.divAddressResults);
                 if (lang.trim(this.txtAddress.value) === "") {
                     this.txtAddress.focus();
                     domConstruct.empty(this.divAddressResults);
                     this.locatorScrollbar = new scrollBar({ domNode: this.divAddressScrollContent });
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
                 this.locatorScrollbar = new scrollBar({ domNode: this.divAddressScrollContent });
                 this.locatorScrollbar.setContent(this.divAddressResults);
                 domStyle.set(this.divAddressScrollContent, "height", "200px");
                 this.locatorScrollbar.createScrollBar();
                 if (resultLength > 0) {
                     for (var candidateArray in candidates) {
                         if (candidates[candidateArray].length > 0) {
                             var divAddressCounty = domConstruct.create("div", { "class": "esriCTBottomBorder esriCTResultColor esriCTCursorPointer esriAddressCounty" }, this.divAddressResults);
                             var candiate = candidateArray + " (" + candidates[candidateArray].length + ")";
                             domConstruct.create("span", { "innerHTML": "+", "class": "plus-minus" }, divAddressCounty);
                             domConstruct.create("span", { "innerHTML": candiate }, divAddressCounty);
                             domStyle.set(this.imgSearchLoader, "display", "none");
                             domStyle.set(this.close, "display", "block");
                             addrList.push(divAddressCounty);
                             this._toggleAddressList(addrList, addrListCount);
                             addrListCount++;
                             var listContainer = domConstruct.create("div", { "class": "listContainer hideAddressList" }, this.divAddressResults);
                             for (var i = 0; i < candidates[candidateArray].length; i++) {
                                 this._displayValidLocations(candidates[candidateArray][i], i, candidates[candidateArray], listContainer);
                             }
                         }
                     }
                 }
                 else {
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
                         var listStatusSymbol = (domAttr.get(query(".plus-minus")[idx], "innerHTML") == "+") ? "-" : "+";
                         domAttr.set(query(".plus-minus")[idx], "innerHTML", listStatusSymbol);

                         this.locatorScrollbar.resetScrollBar();
                         return;
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
                 domClass.remove(this.divAddressScrollContent, "esriCTdivAddressScrollContent");
                 domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
                 domClass.remove(this.logoContainer, "mapLogo");
                 topic.publish("setMaxLegendLength");
                 var esriCTrowResult = domConstruct.create("div", { "class": "esriCTrowTable esriCTContentBottomBorder" }, listContainer);
                 var candidateDate = domConstruct.create("div", { "class": "esriCTrowTableSerchClm  esriCTCursorPointer" }, esriCTrowResult);
                 domAttr.set(candidateDate, "index", index);
                 try {
                     if (candidate.name) {
                         domAttr.set(candidateDate, "innerHTML", candidate.name);
                     }
                     else {
                         domAttr.set(candidateDate, "innerHTML", candidate);
                     }
                     if (candidate.attributes.location) {
                         domAttr.set(candidateDate, "x", candidate.attributes.location.x);
                         domAttr.set(candidateDate, "y", candidate.attributes.location.y);
                         domAttr.set(candidateDate, "address", string.substitute(dojo.configData.LocatorSettings.DisplayField, candidate.attributes.attributes));
                     }
                 } catch (err) {
                     alert(nls.errorMessages.falseConfigParams);
                 }
                 var _this = this;
                 var rendererColor = dojo.configData.Workflows[dojo.workFlowIndex].FeatureHighlightColor;

                 candidateDate.onclick = function (evt) {
                     topic.publish("showProgressIndicator");
                     if (_this.map.infoWindow) {
                         _this.map.infoWindow.hide();
                     }
                     _this.txtAddress.value = this.innerHTML;
                     domAttr.set(_this.txtAddress, "defaultAddress", _this.txtAddress.value);
                     if (candidate.geometry) {
                         if (candidate.geometry.type) {
                             if (candidate.geometry.type == "point") {
                                 var geoLocationPushpin, locatorMarkupSymbol, graphic;
                                 _this.map.centerAt(candidate.geometry);
                                 geoLocationPushpin = dojoConfig.baseURL + dojo.configData.LocatorSettings.DefaultLocatorSymbol;
                                 locatorMarkupSymbol = new esri.symbol.PictureMarkerSymbol(geoLocationPushpin, dojo.configData.LocatorSettings.MarkupSymbolSize.width, dojo.configData.LocatorSettings.MarkupSymbolSize.height);
                                 graphic = new esri.Graphic(candidate.geometry, locatorMarkupSymbol, {}, null);
                                 _this._graphicLayerOnMap(candidate.geometry, locatorMarkupSymbol);
                             }
                             else {
                                 var graphic, symbol;
                                 _this.map.centerAt(candidate.geometry);
                                 var lineColor = new Color();
                                 lineColor.setColor(rendererColor);
                                 var fillColor = new Color();
                                 fillColor.setColor(rendererColor);
                                 fillColor.a = 0.25;
                                 symbol = new Symbol.SimpleFillSymbol(Symbol.SimpleFillSymbol.STYLE_SOLID, new Symbol.SimpleLineSymbol(Symbol.SimpleLineSymbol.STYLE_SOLID, lineColor, 3), fillColor);
                                 _this._graphicLayerOnMap(candidate.geometry, symbol);

                             }

                         }
                     } else if (candidate.attributes.location) {
                         _this.mapPoint = new point(domAttr.get(this, "x"), domAttr.get(this, "y"), _this.map.spatialReference);
                         _this._locateAddressOnMap(_this.mapPoint);
                     }

                 };
             },
             _graphicLayerOnMap: function (geometry, symbol) {
                 graphic = new esri.Graphic(geometry, symbol, {}, null);
                 this.map.getLayer("esriGraphicsLayerMapSettings").clear();
                 this.map.getLayer("esriGraphicsLayerMapSettings").add(graphic);
                 topic.publish("hideProgressIndicator");
                 this.addressLocation = graphic;
                 topic.publish("SliderChange", this.sliderValue, this.addressLocation, this.drive);
             },

             _locateAddressOnMap: function (mapPoint) {
                 var geoLocationPushpin, locatorMarkupSymbol, graphic;
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
                 var height = domGeom.getMarginBox(this.divAddressContent).h;
                 if (height > 0) {

                     /**
                     * divAddressScrollContent Scrollbar container for search results
                     * @member {div} divAddressScrollContent
                     * @private
                     * @memberOf widgets/locator/locator
                     */

                 }
             },

             /**
             * display search by address tab
             * @memberOf widgets/locator/locator
             */
             _showAddressSearchView: function () {
                 if (domStyle.get(this.imgSearchLoader, "display", "block") == "block") {
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
                 domConstruct.empty(this.divAddressResults);
                 domStyle.set(this.imgSearchLoader, "display", "none");
                 domStyle.set(this.close, "display", "block");
                 domClass.add(this.divAddressContent, "esriCTAddressResultHeight");
                 var errorAddressCounty = domConstruct.create("div", { "class": "esriCTBottomBorder esriCTCursorPointer esriAddressCounty" }, this.divAddressResults);
                 domAttr.set(errorAddressCounty, "innerHTML", nls.errorMessages.invalidSearch);
             },

             /**
             * clear default value from search textbox
             * @param {object} evt Dblclick event
             * @memberOf widgets/locator/locator
             */
             _clearDefaultText: function (evt) {
                 var target = window.event ? window.event.srcElement : evt ? evt.target : null;
                 if (!target) return;
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
                 if (!target) return;
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
                 if (target.value == '' && domAttr.get(target, title)) {
                     target.value = target.title;
                     if (target.title == "") {
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
                 this.sliderValue = dojo.configData.DriveTimeSliderSettings.defaultMinutes;
                 var horizontalRule = new HorizontalRule({
                     SliderRulerContainer: dojo.configData.DriveTimeSliderRulerSettings.SliderRulerContainer,
                     count: dojo.configData.DriveTimeSliderSettings.discreteValues,
                     "class": "horizontalRule"
                 }, this.horizontalRuleContainer);
                 horizontalRule.domNode.firstChild.innerHTML = dojo.configData.DriveTimeSliderSettings.minMinutes;
                 horizontalRule.domNode.firstChild.style.border = "none";
                 horizontalRule.domNode.lastChild.innerHTML = dojo.configData.DriveTimeSliderSettings.maxMinutes;
                 horizontalRule.domNode.lastChild.style.border = "none";
                 domClass.add(horizontalRule.domNode.lastChild, "esriCTLastChild");
                 this.sliderValue = dojo.configData.DriveTimeSliderSettings.defaultMinutes;
                 var horizontalSlider = new HorizontalSlider({
                     value: dojo.configData.DriveTimeSliderSettings.defaultMinutes,
                     minimum: dojo.configData.DriveTimeSliderSettings.minMinutes,
                     maximum: dojo.configData.DriveTimeSliderSettings.maxMinutes,
                     discreteValues: dojo.configData.DriveTimeSliderSettings.discreteValues,
                     intermediateChanges: dojo.configData.DriveTimeSliderSettings.intermediateChanges,
                     showButtons: dojo.configData.DriveTimeSliderSettings.showButtons,
                     "class": "horizontalSlider"
                 }, this.horizontalSliderContainer);
                 on(horizontalSlider, "change", lang.hitch(this, function (defaultMinutes) {
                     var sliderMessage = this.sliderMessage.innerHTML.split(/\d+/g);
                     var message = sliderMessage[0] + " " + defaultMinutes + " " + sliderMessage[1];
                     this.sliderMessage.innerHTML = message;
                     this.sliderValue = defaultMinutes;
                     if (this.addressLocation) {
                         topic.publish("SliderChange", this.sliderValue, this.addressLocation, this.drive);
                     }
                 }));
             },

             _updateBufferArea: function () {
                 if (this.addressLocation) {
                     topic.publish("SliderChange", this.sliderValue, this.addressLocation, this.drive);
                 }
             },

             _createFeatureList: function (featureList) {
                 topic.subscribe("resetLocatorContainer", lang.hitch(this, function () {
                     this._resetLocateContainer();
                 }));
                 var layerName;
                 domClass.remove(this.divAddressResultContainer, "border_bottom");
                 topic.publish("setMinLegendLength");
                 domClass.add(this.divAddressContent, "esriCTAddressHolderHeight");
                 domClass.add(this.logoContainer, "mapLogo");
                 var featureListArray = [];
                 domStyle.set(this.divSelectedFeature, "display", "block");
                 domStyle.set(query(".esriCTAddressScrollContent")[0], "display", "none");
                 if (this.featureListScrollbar) {
                     domClass.add(this.featureListScrollbar._scrollBarContent, "esriCTZeroHeight");
                     this.featureListScrollbar.removeScrollBar();
                 }
                 if (featureList.length) {
                     domStyle.set(this.headerContainer, "display", "block");
                 } else {
                     domStyle.set(this.headerContainer, "display", "none");
                 }
                 var scrollContentHeight = ((domGeom.getMarginBox(this.divSelectedFeature).h - domGeom.getMarginBox(this.divSelectedFeature).t) - 60) + "px";
                 domStyle.set(this.divSelectedFeatureContent, "height", scrollContentHeight);
                 this.featureListScrollbar = new scrollBar({ domNode: this.divSelectedFeatureContent });
                 this.featureListScrollbar.setContent(this.divSelectedFeatureList);
                 this.featureListScrollbar.createScrollBar();
                 domConstruct.empty(this.divSelectedFeatureList);
                 array.forEach(featureList, lang.hitch(this, function (featureGroup, idx) {
                     var layerTitle = domConstruct.create("div", { "innerHTML": featureGroup[0].name + " (" + featureGroup.length + ")", "class": "esriCTBottomBorder esriCTResultColor esriCTCursorPointer esriAddressCounty" }, this.divSelectedFeatureList);
                     domConstruct.create("span", { "innerHTML": "+", "class": "plusMinusFeatureTitle" }, layerTitle);
                     featureListArray.push(layerTitle);
                     this._toggleFeatureList(featureListArray, idx);
                     var divAddressListGroup = domConstruct.create("div", { "class": "divAddressListGroup listCollapse" }, this.divSelectedFeatureList);
                     featureGroup.sort(function (a, b) {
                         return (a.routelength - b.routelength);
                     }
                 );
                     array.forEach(featureGroup, lang.hitch(this, function (feature) {
                         var featueNamediv = domConstruct.create("div", { "class": "esriCTContentBottomBorder divAddressListGrouprow esriCTCursorPointer" }, divAddressListGroup);
                         var layerFeature = domConstruct.create("div", { "innerHTML": feature.featureName, "class": "featureName" }, featueNamediv);
                         if (feature.routelength) {
                             var spanRouteLength = domConstruct.create("div", { "innerHTML": feature.routelength.toFixed(2) + " miles", "class": "spanRouteLength" }, featueNamediv);
                         }
                         on(featueNamediv, mouse.enter, lang.hitch(this, function () {
                             this.map.getLayer("esriGraphicsLayerMapSettings").remove(this.selectedPolygon);
                             if (feature.geometry.type == "point") {
                                 this._createInfoWindowContent(feature.geometry, feature.attribute, feature.layerIndex, null, null, this.map);
                             } else if (feature.geometry.type == "polygon") {
                                 this._createInfoWindowContent(feature.geometry.getCentroid(), feature.attribute, feature.layerIndex, null, null, this.map);
                                 this._highlightFeature(feature);
                             }
                         }));
                         on(featueNamediv, "click", lang.hitch(this, function () {
                             if (feature.geometry.type == "point") {
                                 this.map.centerAndZoom(feature.geometry, dojo.configData.ZoomLevel);
                             } else if (feature.geometry.type == "polygon") {
                                 this.map.centerAndZoom(feature.geometry.getCentroid(), dojo.configData.ZoomLevel);
                             }
                         }));
                     }));
                 }));
             },

             _toggleFeatureList: function (layerTitle, idx) {
                 on(layerTitle[idx], "click", lang.hitch(this, function () {
                     this.featureListScrollbar.resetScrollBar();
                     var sign = (query(".plusMinusFeatureTitle")[idx].innerHTML == "+") ? "-" : "+";
                     query(".plusMinusFeatureTitle")[idx].innerHTML = sign;
                     if (domClass.contains(query(".divAddressListGroup")[idx], "listExpand")) {
                         domClass.toggle(query(".divAddressListGroup")[idx], "listExpand");
                         return;
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

             _createInfoWindowContent: function (mapPoint, attributes, infoIndex, featureArray, count, map) {
                 dojo.featureID = attributes.OBJECTID;
                 var layerSettings = dojo.configData;
                 dojo.layerServerName = layerSettings.Workflows[dojo.workFlowIndex].SearchSettings[infoIndex].Title;
                 dojo.layerID = layerSettings.Workflows[dojo.workFlowIndex].SearchSettings[infoIndex].QueryLayerId;
                 var infoPopupFieldsCollection = layerSettings.Workflows[dojo.workFlowIndex].InfowindowSettings[infoIndex].InfoWindowData;
                 var infoWindowTitle = layerSettings.Workflows[dojo.workFlowIndex].InfowindowSettings[infoIndex].InfoWindowHeaderField;
                 var infoPopupHeight = layerSettings.InfoPopupHeight;
                 var infoPopupWidth = layerSettings.InfoPopupWidth;
                 var divInfoDetailsTab = domConstruct.create("div", { "class": "esriCTInfoDetailsTab" }, null);
                 this.divInfoDetailsContainer = domConstruct.create("div", { "class": "divInfoDetailsContainer" }, divInfoDetailsTab);
                 for (var key = 0; key < infoPopupFieldsCollection.length; key++) {
                     var divInfoRow = domConstruct.create("div", { "className": "esriCTDisplayRow" }, this.divInfoDetailsContainer);
                     // Create the row's label
                     this.divInfoDisplayField = domConstruct.create("div", { "className": "esriCTDisplayField", "innerHTML": infoPopupFieldsCollection[key].DisplayText }, divInfoRow);
                     this.divInfoFieldValue = domConstruct.create("div", { "className": "esriCTValueField" }, divInfoRow);
                     for (var i in attributes) {
                         if (attributes.hasOwnProperty(i)) {
                             if (!attributes[i]) {
                                 attributes[i] = nls.showNullValue;
                             }
                         }
                     }
                     var fieldNames = string.substitute(infoPopupFieldsCollection[key].FieldName, attributes);
                     if (infoPopupFieldsCollection[key].FieldName == "${more_info}" || infoPopupFieldsCollection[key].FieldName == "${headerimage}" || infoPopupFieldsCollection[key].FieldName == "${image}" || infoPopupFieldsCollection[key].FieldName == "${website}") {
                         var link = fieldNames;
                         var divLink = domConstruct.create("div", { class: "esriCTLink", innerHTML: nls.moreInfo }, this.divInfoFieldValue);
                         on(divLink, "click", lang.hitch(this, function () {
                             window.open(link);
                         }));
                     }
                     else {
                         this.divInfoFieldValue.innerHTML = fieldNames;
                     }
                 }

                 for (var j in attributes) {
                     if (attributes.hasOwnProperty(j)) {
                         if (!attributes[j]) {
                             attributes[j] = nls.showNullValue;
                         }
                     }
                 }
                 var infoTitle = string.substitute(layerSettings.Workflows[dojo.workFlowIndex].InfowindowSettings[infoIndex].InfoWindowHeaderField, attributes);
                 dojo.selectedMapPoint = mapPoint;
                 var extentChanged = map.setExtent(this._calculateCustomMapExtent(mapPoint));
                 extentChanged.then(lang.hitch(this, function () {
                     topic.publish("hideProgressIndicator");
                     var screenPoint = map.toScreen(dojo.selectedMapPoint);
                     screenPoint.y = map.height - screenPoint.y;
                     topic.publish("setInfoWindowOnMap", infoTitle, divInfoDetailsTab, screenPoint, infoPopupWidth, infoPopupHeight);
                 }));
             },

             _calculateCustomMapExtent: function (mapPoint, map) {
                 var width = this.map.extent.getWidth();
                 var height = this.map.extent.getHeight();
                 var ratioHeight = height / this.map.height;
                 var totalYPoint = dojo.configData.InfoPopupHeight + 30 + 61;
                 var infoWindowHeight = height - (ratioHeight * totalYPoint);
                 var xmin = mapPoint.x - (width / 2);
                 var ymin = mapPoint.y - infoWindowHeight;
                 var xmax = xmin + width;
                 var ymax = ymin + height;
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
                 domClass.remove(this.logoContainer, "mapLogo");
                 domClass.remove(this.divAddressContent, "esriCTAddressHolderHeight");
                 topic.publish("setMaxLegendLength");
                 this.txtAddress.blur();
             },

             _highlightFeature: function (feature) {
                 var gLayer, symbolColor, outlineColor;
                 gLayer = this.map.getLayer("esriGraphicsLayerMapSettings");
                 symbolColor = outlineColor = new dojo.Color(dojo.configData.Workflows[dojo.workFlowIndex].FeatureHighlightColor);
                 symbolColor.a = 0.6;
                 var myPolygon = {
                     "geometry": feature.geometry,
                     "symbol": {
                         "color": symbolColor, "outline": {
                             "color": outlineColor,
                             "width": 1, "type": "esriSLS", "style": "esriSLSSolid"
                         },
                         "type": "esriSFS", "style": "esriSFSSolid"
                     }
                 };
                 this.selectedPolygon = new esri.Graphic(myPolygon);
                 gLayer.add(this.selectedPolygon);
             },

             _onSetMapTipPosition: function (selectedPoint, map, infoWindow) {
                 if (selectedPoint) {
                     var screenPoint = map.toScreen(selectedPoint);
                     screenPoint.y = map.height - screenPoint.y;
                     infoWindow.setLocation(screenPoint);
                 }
             }
         });
     });


