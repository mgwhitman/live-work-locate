/*global dojo,define,document */
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
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/on",
    "dojo/dom-geometry",
    "dojo/window",
    "dojo/text!./templates/splashScreenTemplate.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!nls/localizedStrings",
    "../scrollBar/scrollBar",
     "dojo/query",
    "dojo/topic",
    "dojo/dom"
],
     function (declare, domConstruct, domStyle, lang, domClass, domAttr, on, domGeom, window, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, scrollBar, query, topic, dom) {
         return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
             templateString: template,
             nls: nls,
             currentIndex: null,
             splashScreenScrollbar: null,
             postCreate: function () {
                 var _self = this;
                 this.showSplashScreenDialog();
                 this.domNode = domConstruct.create("div", { "class": "esriGovtLoadingIndicator" }, dojo.body());
                 this.domNode.appendChild(this.splashScreenScrollBarOuterContainer);
                 var holder = domConstruct.create("div", { "class": "holder", "id": "splashscreenUList" }, this.splashScreenScrollBarContainer);
                 for (var i in dojo.configData.Workflows) {
                     var workflowContainer = domConstruct.create("div", { "class": "workflowContainer", "key": dojo.configData.Workflows[i].key }, holder);

                     var innercontainer = domConstruct.create("div", { "class": "innerSlide esriWorkflow" + i, innerHTML: i }, workflowContainer);
                     var imgcontainerdiv = domConstruct.create("div", { "class": "workflowContainerImg" }, innercontainer);
                     var imgcontainer = domConstruct.create("img", { "class": "innerSlideimg", src: dojo.configData.Workflows[i].ImageSrc }, imgcontainerdiv);
                     this.own(on(workflowContainer, "click", function (evt) {
                         topic.publish("loadingIndicatorHandler");
                         var key = domAttr.get(this, "key");
                         dojo.layerKey = key;
                         dojo.seletedWorkflow = key
                         _self._selectWorkflow(key)
                         _self.mapObject._addOperationalLayerToMap
                         for (var i = 0 in dojo.configData.Workflows[key].OperationalLayers) {
                             _self.mapObject._addOperationalLayerToMap(i, dojo.configData.Workflows[key].OperationalLayers[i]);
                         }
                         _self._hideSplashScreenDialog();
                     }));
                 }
                 this.own(on(this.splashscreenPreviousPage, "click", lang.hitch(this, function () {
                     if (!domClass.contains(this.splashscreenPreviousPage, "esriPrevDisabled")) {
                         this._slideSplashscreenPage(false);
                     }
                 })));

                 this.own(on(this.splashscreenNextPage, "click", lang.hitch(this, function () {
                     if (!domClass.contains(this.splashscreenNextPage, "esriNextDisabled")) {
                         this._slideSplashscreenPage(true);
                     }
                 })));

                 if (query('.workflowContainer')[0]) {
                     var slideWidth = domStyle.get(query('.workflowContainer')[0], "width") * i;
                     domStyle.set(holder, "width", slideWidth + 'px');
                 }
             },
             showSplashScreenDialog: function (map) {
                 this.mapObject = map;
                 domStyle.set(this.domNode, "display", "block");

                 this.splashScreenLableDiv.innerHTML = "Please select an app to continue"
             },
             _selectWorkflow: function (Workflows) {
                 var url = "?app=" + Workflows;
                 location.hash = url;
                 for (var j in dojo.configData.Workflows) {

                     domClass.remove(query("." + j)[0], "esriCTApplicationHeaderTextSelected");
                     domClass.add(query("." + dojo.seletedWorkflow)[0], "esriCTApplicationHeaderTextSelected");
                 }
             },
             _loadSlectedWorkflow: function (Workflows, map) {
                 this.mapObject = map;
                 dojo.layerKey = Workflows;
                 dojo.seletedWorkflow = Workflows;
             },
             _addLayer: function (key) {
                 for (var i = 0 in dojo.configData.Workflows[key].OperationalLayers) {
                     this.mapObject._addOperationalLayerToMap(i, dojo.configData.Workflows[key].OperationalLayers[i]);
                 }
             },
             _hideSplashScreenDialog: function () {
                 domStyle.set(this.domNode, "display", "none");
                 topic.publish("hideLoadingIndicatorHandler");
             },
             _slideSplashscreenPage: function (isSlideNext) {
                 var pageWidth, left;
                 pageWidth = domStyle.get(query(".workflowContainer")[0], "width");
                 left = domStyle.get(dom.byId("splashscreenUList"), "marginLeft");
                 if (isSlideNext) {
                     left = left - pageWidth;
                 }
                 else {
                     left = left + pageWidth;
                 }
                 dom.byId("splashscreenUList").style.marginLeft = left + 'px';
                 this._slideMapBookPage(isSlideNext);
             },

             _slideMapBookPage: function (slideLeft) {
                 slideLeft ? this.currentIndex-- : this.currentIndex++;
                 this._setArrowVisibility();
             },
             _setArrowVisibility: function () {
                 if (this.currentIndex === 0) {
                     domClass.remove(this.splashscreenNextPage, "esriNextDisabled");
                     domClass.add(this.splashscreenPreviousPage, "esriPrevDisabled");
                 }
                 else if (this.currentIndex === -1) {
                     domClass.add(this.splashscreenNextPage, "esriNextDisabled");
                     domClass.remove(this.splashscreenPreviousPage, "esriPrevDisabled");
                 }
             }
         });
     });