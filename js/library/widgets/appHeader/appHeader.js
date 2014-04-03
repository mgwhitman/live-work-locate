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
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-attr",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/topic",
    "dojo/query",
    "dojo/text!./templates/appHeaderTemplate.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!application/nls/localizedStrings"
],
     function (declare, domConstruct, lang, array, domAttr, on, dom, domClass, domStyle, topic, query, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, appNls) {

         //========================================================================================================================//

         return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
             templateString: template,
             appNls: appNls,

             /**
             * create header panel
             *
             * @param {string} dojo.configData.ApplicationName Applicaton name specified in configuration file
             *
             * @class
             * @name widgets/appHeader/appHeader
             */
             postCreate: function () {
                 var applicationHeaderDiv, i, workflowSpan;
                 topic.subscribe("loadingIndicatorHandler", (lang.hitch(this, function () {
                     this._showProgressIndicator();
                 })));
                 topic.subscribe("hideLoadingIndicatorHandler", (lang.hitch(this, function () {
                     this._hideProgressIndicator();
                 })));

                 /**
                 * add applicationHeaderParentContainer to div for header panel and append to esriCTParentDivContainer container
                 *
                 * applicationHeaderParentContainer container for application header
                 * @member {div} applicationHeaderParentContainer
                 * @private
                 * @memberOf widgets/appHeader/appHeader
                 */
                 applicationHeaderDiv = domConstruct.create("div", {}, dom.byId("esriCTParentDivContainer"));
                 domConstruct.place(this.applicationHeaderParentContainer, applicationHeaderDiv);
                 this._loadApplicationHeaderIcon();
                 /**
                 * set browser header and application header to application name
                 *
                 * applicationHeaderName container for application name
                 * @member {div} applicationHeaderName
                 * @private
                 * @memberOf widgets/appHeader/appHeader
                 */
                 document["title"] = dojo.configData.ApplicationName;
                 for (i = 0; i < dojo.configData.Workflows.length; i++) {
                     workflowSpan = domConstruct.create("span", { innerHTML: dojo.configData.Workflows[i].Name, index: i, title: appNls.messages.switchWorkflows, class: "esriCTApplicationHeaderTextTD " + dojo.configData.Workflows[i].Name }, query(".esriCTApplicationHeader")[0]);
                     on(workflowSpan, "click", lang.hitch(this, function (evt) {
                         if (dojo.seletedWorkflow !== evt.currentTarget.innerHTML) {
                             dojo.workFlowIndex = domAttr.get(evt.currentTarget, "index");
                             dojo.seletedWorkflow = evt.currentTarget.innerHTML;
                             this.workflows._selectWorkflow(dojo.seletedWorkflow);
                             this.mapObject._generateLayerURL();
                             this.mapObject._clearMapGraphics();
                             if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId && lang.trim(dojo.configData.Workflows[dojo.workFlowIndex].WebMapId).length !== 0) {
                                 topic.publish("initializeWebmap");
                                 topic.publish("loadingIndicatorHandler");
                             } else {
                                 topic.publish("loadBasemapToggleWidget");
                             }
                         }
                     }));
                 }
             },

             /**
             * append widgets to header panel
             * @param {object} widgets Contain widgets to be displayed in header panel
             * @memberOf widgets/appHeader/appHeader
             */
             loadHeaderWidgets: function (widgets) {
                 var i, workflow;
                 /**
                 * applicationHeaderWidgetsContainer container for header panel widgets
                 * @member {div} applicationHeaderWidgetsContainer
                 * @private
                 * @memberOf widgets/appHeader/appHeader
                 */
                 for (i in widgets) {
                     if (widgets[i].domNode) {
                         domConstruct.place(widgets[i].domNode, this.applicationHeaderWidgetsContainer);
                     }
                 }
                 if (location.hash) {
                     workflow = (location.hash.split("#")[1].split("?app=")[1]).toUpperCase();
                     domClass.add(query("." + workflow)[0], "esriCTApplicationHeaderTextSelected");
                     if (query(".esriCTExitImg")[0]) {
                         domStyle.set(query(".esriCTExitImg")[0], "display", "none");
                     }
                 } else if (dojo.share) {
                     domClass.add(query(".esriCTApplicationHeaderTextTD")[Number(dojo.workFlowIndex) + 1], "esriCTApplicationHeaderTextSelected");
                 }
             },
             /**
             * load Application Header Icon
             * @memberOf widgets/appHeader/appHeader
             */
             _loadApplicationHeaderIcon: function () {
                 if (dojo.configData.ApplicationFavicon && lang.trim(dojo.configData.ApplicationFavicon).length != 0) {
                     this._loadIcons("shortcut icon", dojo.configData.ApplicationFavicon);
                 }
                 if (dojo.configData.ApplicationIcon && lang.trim(dojo.configData.ApplicationIcon).length != 0) {
                     this._loadIcons("apple-touch-icon-precomposed", dojo.configData.ApplicationIcon);
                     this._loadIcons("apple-touch-icon", dojo.configData.ApplicationIcon);
                     this.applicationHeaderIcon.src = dojoConfig.baseURL + dojo.configData.ApplicationIcon;
                 }

             },
             _loadIcons: function (rel, iconPath) {
                 var icon = domConstruct.create("link");
                 icon.rel = rel;
                 icon.type = "image/x-icon";
                 icon.href = dojoConfig.baseURL + iconPath;
                 document.getElementsByTagName('head')[0].appendChild(icon);
             },
             _showProgressIndicator: function () {
                 domClass.replace(this.divLoadingIndicator, "displayBlockAll", "displayNoneAll");

             },
             _hideProgressIndicator: function () {
                 domClass.replace(this.divLoadingIndicator, "displayNoneAll", "displayBlockAll");
             }
         });
     });