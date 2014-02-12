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
    "dojo/topic"
],
     function (declare, domConstruct, domStyle, domAttr, array, lang, on, domGeom, dom, domClass, html, string, Locator, HorizontalSlider, HorizontalRule, HorizontalRuleLabels, window, Query, SimpleLineSymbol, Polyline, dojoQuery, scrollBar, point, Deferred, DeferredList, QueryTask, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, topic) {
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
                 topic.subscribe("toggleWidget", lang.hitch(this, function (widget) {
                     if (widget != "locator") {
                         if (domGeom.getMarginBox(this.divAddressHolder).h > 0) {
                             domClass.replace(this.domNode, "esriCTTdHeaderSearch", "esriCTTdHeaderSearch-select");
                             domClass.replace(this.divAddressHolder, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                             domClass.replace(this.divAddressHolder, "esriCTZeroHeight", "esriCTAddressContentHeight");
                             this.txtAddress.blur();
                         }
                     }
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
                 domAttr.set(this.imgSearchLoader, "src", dojoConfig.baseURL + "/themes/images/blue-loader.gif");
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
             },
             /**
             * set default value of locator textbox as specified in configuration file
             * @param {array} dojo.configData.LocatorSettings.Locators Locator settings specified in configuration file
             * @memberOf widgets/locator/locator
             */
             _setDefaultTextboxValue: function () {
                 var locatorSettings, storage;
                 locatorSettings = dojo.configData.LocatorSettings;
                 storage = window.localStorage;

                 /**
                 * txtAddress Textbox for search text
                 * @member {textbox} txtAddress
                 * @private
                 * @memberOf widgets/locator/locator
                 */
                 domAttr.set(this.txtAddress, "defaultAddress", locatorSettings.LocatorDefaultAddress);
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
                 domAttr.set(this.txtAddress, "defaultAddress", this.txtAddress.value);
                 domClass.remove(this.divAddressContent, "esriCTAddressContainerHeight");
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
                     domClass.replace(this.divAddressHolder, "esriCTZeroHeight", "esriCTAddressContentHeight");
                     this.txtAddress.blur();
                 } else {

                     /**
                     * when user clicks on locator icon in header panel, open the search panel if it is closed
                     */
                     domClass.replace(this.domNode, "esriCTTdHeaderSearch-select", "esriCTTdHeaderSearch");
                     domClass.replace(this.txtAddress, "esriCTBlurColorChange", "esriCTColorChange");
                     domClass.replace(this.divAddressHolder, "esriCTShowContainerHeight", "esriCTHideContainerHeight");
                     domClass.add(this.divAddressHolder, "esriCTAddressContentHeight");

                     domStyle.set(this.txtAddress, "verticalAlign", "middle");
                     this.txtAddress.value = domAttr.get(this.txtAddress, "defaultAddress");
                     this.lastSearchString = lang.trim(this.txtAddress.value);
                 }
                 this._setHeightAddressResults();
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
                     query.where = string.substitute(layerobject.SearchExpression, [lang.trim(this.txtAddress.value).toUpperCase()]);
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
                 this.locatorScrollbar.createScrollBar();
                 if (resultLength > 0) {
                     for (var candidateArray in candidates) {
                         if (candidates[candidateArray].length > 0) {
                             var divAddressCounty = domConstruct.create("div", { "class": "esriCTBottomBorder esriCTCursorPointer esriAddressCounty" }, this.divAddressResults);
                             domAttr.set(divAddressCounty, "innerHTML", candidateArray);
                             domStyle.set(this.imgSearchLoader, "display", "none");
                             domStyle.set(this.close, "display", "block");
                             for (var i = 0; i < candidates[candidateArray].length; i++) {
                                 this._displayValidLocations(candidates[candidateArray][i], i, candidates[candidateArray]);
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

             /**
             * display valid result in search panel
             * @param {object} candidate Contains valid result to be displayed in search panel
             * @return {Boolean} true if result is displayed successfully
             * @memberOf widgets/locator/locator
             */
             _displayValidLocations: function (candidate, index, candidateArray) {
                 domClass.remove(this.divAddressContent, "esriCTAddressResultHeight");
                 domClass.add(this.divAddressContent, "esriCTAddressContainerHeight");
                 var candidateDate = domConstruct.create("div", { "class": "esriCTContentBottomBorder esriCTCursorPointer" }, this.divAddressResults);
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
                 candidateDate.onclick = function (evt) {
                     topic.publish("showProgressIndicator");
                     if (_this.map.infoWindow) {
                         _this.map.infoWindow.hide();
                     }
                     _this.txtAddress.value = this.innerHTML;
                     domAttr.set(_this.txtAddress, "defaultAddress", _this.txtAddress.value);
                     _this._hideAddressContainer();
                     if (candidate.attributes.location) {
                         _this.mapPoint = new point(domAttr.get(this, "x"), domAttr.get(this, "y"), _this.map.spatialReference);
                         _this._locateAddressOnMap(_this.mapPoint);
                     }
                     else {
                         if (candidateArray[domAttr.get(candidateDate, "index", index)]) {
                             var layer = candidateArray[domAttr.get(candidateDate, "index", index)].layer.QueryURL;
                             for (var infoIndex = 0; infoIndex < dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings.length; infoIndex++) {
                                 if (dojo.configData.Workflows[dojo.workFlowIndex].InfoWindowSettings[infoIndex] && dojo.configData.Workflows[dojo.workFlowIndex].InfoWindowSettings[infoIndex].InfoQueryURL == layer) {
                                     _this._showFeatureResultsOnMap(candidateArray, candidate, infoIndex, index);
                                 } else if (dojo.configData.Workflows[dojo.workFlowIndex].SearchSettings[infoIndex].QueryURL == layer) {
                                     _this._showRoadResultsOnMap(candidate);
                                 }
                             }
                         }
                     }
                 }
             },

             _locateAddressOnMap: function (mapPoint) {
                 var geoLocationPushpin, locatorMarkupSymbol, graphic;
                 this.map.setLevel(dojo.configData.ZoomLevel);
                 this.map.centerAt(mapPoint);
                 geoLocationPushpin = dojoConfig.baseURL + dojo.configData.LocatorSettings.DefaultLocatorSymbol;
                 locatorMarkupSymbol = new esri.symbol.PictureMarkerSymbol(geoLocationPushpin, dojo.configData.LocatorSettings.MarkupSymbolSize.width, dojo.configData.LocatorSettings.MarkupSymbolSize.height);
                 graphic = new esri.Graphic(mapPoint, locatorMarkupSymbol, {}, null);
                 this.map.getLayer("esriGraphicsLayerMapSettings").clear();
                 this.map.getLayer("esriGraphicsLayerMapSettings").add(graphic);
                 topic.publish("hideProgressIndicator");
                 this.addressLocation = graphic;

                 topic.publish("_addOperationalLayer");
                 topic.publish("SliderChange", dojo.configData.DriveTimeSliderSettings.defaultMinutes, this.addressLocation, this.drive);
             },

             /**
             * hide search panel
             * @memberOf widgets/locator/locator
             */
             _hideAddressContainer: function () {
                 domClass.replace(this.domNode, "esriCTTdHeaderSearch", "esriCTTdHeaderSearch-select");
                 //  this.txtAddress.blur();
                 domClass.replace(this.divAddressHolder, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                 domClass.replace(this.divAddressHolder, "esriCTZeroHeight", "esriCTAddressContentHeight");

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
                     domStyle.set(this.divAddressScrollContent, "height", (height - 120) + "px");
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
                 domClass.remove(this.divAddressContent, "esriCTAddressContainerHeight");
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
                 target.style.color = "#FFF";
                 target.value = '';
                 this.txtAddress.value = "";
                 domAttr.set(this.txtAddress, "defaultAddress", this.txtAddress.value);
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
                 horizontalRule.domNode.lastChild.style.marginLeft = "-6%";

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
                     /*slider */

                     if (this.addressLocation) {
                         topic.publish("SliderChange", defaultMinutes, this.addressLocation, this.drive);
                     }
                 }));
             },
             _updateBufferArea: function () {
                 if (this.addressLocation) {
                     topic.publish("SliderChange", this.sliderValue, this.addressLocation, this.drive);
                 }
             }
         });
     });
