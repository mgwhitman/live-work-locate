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
    "dojo/text!./templates/splashScreenTemplate.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!application/nls/localizedStrings",
    "../scrollBar/scrollBar",
     "dojo/query",
    "dojo/topic",
    "dojo/dom"
],
     function (declare, domConstruct, domStyle, lang, domClass, domAttr, on, domGeom, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, appNls, scrollBar, query, topic, dom) {
         return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
             templateString: template,
             appNls: appNls,
             currentIndex: null,
             splashScreenScrollbar: null,
             currentWorkflow: null,
             postCreate: function () {
                 var _self, holder, i, innercontainer, workflowContainer, innercontainer, imgcontainerdiv, imgcontainer, key, currentWorkflow;
                 _self = this;
                 this.showSplashScreenDialog();
                 on(this.splashScreenScrollBarOuterContainer, "click", lang.hitch(this, function (evt) {
                     if (dojo.workFlowIndex && dojo.seletedWorkflow) {
                         domStyle.set(this.domNode, "display", "none");
                     }
                 }));

                 on(this.splashScreenWorkflowsContainer, "click", lang.hitch(this, function (evt) {
                     evt.stopPropagation && evt.stopPropagation();
                 }));
                 this.domNode = domConstruct.create("div", { "class": "esriGovtLoadingIndicator" }, dojo.body());
                 this.domNode.appendChild(this.splashScreenScrollBarOuterContainer);
                 holder = domConstruct.create("div", { "class": "holder", "id": "splashscreenUList" }, this.splashScreenScrollBarContainer);
                 for (i = 0; i < dojo.configData.Workflows.length; i++) {
                     workflowContainer = domConstruct.create("div", { "class": "workflowContainer", "key": dojo.configData.Workflows[i].Name, "index": i }, holder);
                     innercontainer = domConstruct.create("div", { "class": "innerSlide esriWorkflow" + dojo.configData.Workflows[i].Name, innerHTML: dojo.configData.Workflows[i].Name }, workflowContainer);
                     imgcontainerdiv = domConstruct.create("div", { "class": "workflowContainerImg" }, innercontainer);
                     imgcontainer = domConstruct.create("img", { "class": "innerSlideimg", src: dojo.configData.Workflows[i].SplashscreenImage }, imgcontainerdiv);
                     this.own(on(workflowContainer, "click", function (evt) {
                         key = domAttr.get(this, "key");
                         currentWorkflow = domAttr.get(this, "index");
                         if (dojo.layerKey == key && dojo.workFlowIndex == currentWorkflow) {
                             _self._hideSplashScreenDialog();
                             return;
                         }
                         dojo.layerKey = key;
                         dojo.workFlowIndex = currentWorkflow;
                         dojo.seletedWorkflow = key;
                         _self._selectWorkflow(key);
                         _self.mapObject._generateLayerURL();
                         _self._hideSplashScreenDialog();
                         _self.mapObject._clearMapGraphics();
                         if (dojo.configData.Workflows[currentWorkflow].WebMapId && lang.trim(dojo.configData.Workflows[currentWorkflow].WebMapId).length != 0) {
                             topic.publish("initializeWebmap");
                             topic.publish("loadingIndicatorHandler");
                         } else {
                             topic.publish("loadBasemapToggleWidget");
                         }
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
                 if (i <= 3) {
                     domClass.add(this.splashscreenNextPage, "esriNextDisabled");
                 }
             },
             showSplashScreenDialog: function (map) {
                 this.mapObject = map;
                 domStyle.set(this.domNode, "display", "block");
                 this.splashScreenLableDiv.innerHTML = appNls.messages.splashScreenContent;
             },

             _selectWorkflow: function (Workflows, share) {
                 var url, j;
                 topic.publish("_addOperationalLayer");
                 url = "?app=" + Workflows;
                 location.hash = url;
                 this._applicationThemeLoader();
                 if (!share) {
                     for (j = 0; j < dojo.configData.Workflows.length; j++) {
                         domClass.remove(query("." + dojo.configData.Workflows[j].Name)[0], "esriCTApplicationHeaderTextSelected");
                         domClass.add(query("." + dojo.seletedWorkflow)[0], "esriCTApplicationHeaderTextSelected");
                     }
                 }
             },

             _applicationThemeLoader: function () {
                 if (dojo.configData.Workflows[dojo.workFlowIndex].ThemeColor) {
                     if (dom.byId("theme")) {
                         domAttr.set(dom.byId("theme"), "href", dojo.configData.Workflows[dojo.workFlowIndex].ThemeColor);
                     } else {
                         themeObj.href = dojo.configData.Workflows[dojo.workFlowIndex].ThemeColor;
                     }
                 }
             },

             loadSelectedWorkflow: function (Workflows, map) {
                 var i;
                 this.mapObject = map;
                 dojo.layerKey = Workflows;
                 dojo.seletedWorkflow = Workflows;
                 for (i = 0; i < dojo.configData.Workflows.length; i++) {
                     if (dojo.configData.Workflows[i].Name == Workflows) {
                         dojo.workFlowIndex = i.toString();
                         break;
                     }
                 }
                 this._applicationThemeLoader();
                 if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId && lang.trim(dojo.configData.Workflows[dojo.workFlowIndex].WebMapId).length != 0) {
                     topic.publish("initializeWebmap");
                     topic.publish("loadingIndicatorHandler");
                 }
                 this.mapObject._generateLayerURL();
                 topic.publish("_addOperationalLayer");
             },

             _hideSplashScreenDialog: function () {
                 domStyle.set(this.domNode, "display", "none");
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