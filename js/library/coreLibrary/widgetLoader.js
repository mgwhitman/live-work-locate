/*global define,Modernizr */
/*jslint browser:true,sloppy:true,nomen:true,unparam:true,plusplus:true */
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
    "dijit/_WidgetBase",
    "widgets/mapSettings/mapSettings",
    "widgets/appHeader/appHeader",
    "widgets/splashScreen/splashScreen",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/dom-class",
    "dojo/query",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/i18n!nls/localizedStrings",
    "dojo/domReady!"
],
function (declare, _WidgetBase, Map, appHeader, SplashScreen, array, lang, Deferred, all, domClass, query, topic, domStyle, nls) {

    //========================================================================================================================//

    return declare([_WidgetBase], {
        nls: nls,

        /**
        * load widgets specified in Header Widget Settings of configuration file
        *
        * @class
        * @name coreLibrary/widgetLoader
        */
        startup: function () {
            var widgets, deferredArray, map, splashScreen, appUrl, workflow, mapInstance;
            widgets = {},
            deferredArray = [];
            map = new Map();
            if (dojo.configData.SplashScreen && dojo.configData.SplashScreen.IsVisible) {
                splashScreen = new SplashScreen();
                appUrl = window.location.toString();
                if (appUrl.search("app") > 0) {
                    if (appUrl.search("extent") > 0) {
                        dojo.share = true;
                        workflow = appUrl.slice(appUrl.indexOf("=") + 1, appUrl.indexOf("$"));

                    } else {
                        workflow = appUrl.slice(appUrl.indexOf("=") + 1);
                    }
                    splashScreen._hideSplashScreenDialog();
                    splashScreen.loadSelectedWorkflow(workflow, map);
                }
                else {
                    splashScreen.showSplashScreenDialog(map);
                }
                topic.subscribe("showSplashScreen", function () {
                    splashScreen.showSplashScreenDialog(map);
                });
            }
            mapInstance = this._initializeMap(map);
            /**
            * create an object with widgets specified in Header Widget Settings of configuration file
            * @param {array} dojo.configData.AppHeaderWidgets Widgets specified in configuration file
            */
            array.forEach(dojo.configData.AppHeaderWidgets, function (widgetConfig, index) {
                var deferred = new Deferred();
                widgets[widgetConfig.WidgetPath] = null;
                require([widgetConfig.WidgetPath], function (widget) {

                    widgets[widgetConfig.WidgetPath] = new widget({ map: widgetConfig.MapInstanceRequired ? mapInstance : undefined, title: widgetConfig.Title });

                    deferred.resolve(widgetConfig.WidgetPath);
                });
                deferredArray.push(deferred.promise);

            });
            all(deferredArray).then(lang.hitch(this, function () {
                try {
                    /**
                    * create application header
                    */
                    this._createApplicationHeader(widgets, map, splashScreen);
                    if (dojo.share) {
                        setTimeout(function () {
                            if (dojo.configData.Workflows[dojo.workFlowIndex].WebMapId === "") {
                                topic.publish("locateAddressOnMap");
                            }
                        }, 2000);
                    }
                } catch (ex) {
                    alert(nls.errorMessages.widgetNotLoaded);
                }

            }));
        },
        /**
        * create map object
        * @return {object} Current map instance
        * @memberOf coreLibrary/widgetLoader
        */
        _initializeMap: function (map) {

            var mapInstance = map.getMapInstance();
            return mapInstance;
        },

        /**
        * create application header
        * @param {object} widgets Contain widgets to be displayed in header panel
        * @memberOf coreLibrary/widgetLoader
        */
        _createApplicationHeader: function (widgets, map, workflows) {
            var applicationHeader = new appHeader({ mapObject: map, workflows: workflows });
            applicationHeader.loadHeaderWidgets(widgets);
        }
    });
});
