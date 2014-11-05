/*global define,dojo,dojoConfig,esri,alert */
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
    "dojo/dom-attr",
    "dojo/on",
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/string",
    "dojo/_base/html",
    "dojo/Deferred",
    "dojo/text!./templates/shareTemplate.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!application/js/library/nls/localizedStrings",
    "dojo/topic",
    "esri/request",
    "widgets/share/commonShare"
], function (declare, domConstruct, domStyle, lang, array, domAttr, on, dom, query, domClass, domGeom, string, html, Deferred, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, sharedNls, topic, esriRequest, commonShare) {

    //========================================================================================================================//

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        sharedNls: sharedNls,
        /**
        * create share widget
        *
        * @class
        * @name widgets/share/share
        */
        postCreate: function () {
            var applicationHeaderDiv;

            /**
            * close share panel if any other widget is opened
            * @param {string} widget Key of the newly opened widget
            */
            topic.subscribe("toggleWidget", lang.hitch(this, function (widgetID) {
                if (widgetID !== "share") {
                    /**
                    * divAppContainer Sharing Options Container
                    * @member {object} divAppContainer
                    * @private
                    * @memberOf widgets/share/share
                    */
                    if (html.coords(this.divAppContainer).h > 0) {
                        domClass.replace(this.domNode, "esriCTImgSocialMedia", "esriCTImgSocialMediaSelect");
                        domClass.replace(this.divAppContainer, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
                    }
                } else {
                    if (domClass.contains(this.divAppContainer, "esriCTHideContainerHeight")) {
                        this._setShareContainerHeight();
                    }
                }
            }));
            this.domNode = domConstruct.create("div", { "title": sharedNls.tooltips.share, "class": "esriCTImgSocialMedia" }, null);
            this.own(on(this.domNode, "click", lang.hitch(this, function () {
                /**
                * minimize other open header panel widgets and show share panel
                */
                topic.publish("toggleWidget", "share");
                topic.publish("setMaxLegendLength");
                this._shareLink();
                this._showHideShareContainer();
                if (domClass.contains(query(".esriControlsBR")[0], "esriLogoShiftRight")) {
                    domClass.remove(query(".esriControlsBR")[0], "esriLogoShiftRight");
                }
            })));
            applicationHeaderDiv = domConstruct.create("div", { "class": "esriCTApplicationShareicon" }, dom.byId("esriCTParentDivContainer"));
            applicationHeaderDiv.appendChild(this.divAppContainer);
            topic.subscribe("setMap", lang.hitch(this, function (map) {
                if (this.map) {
                    this.map = map;
                }
            }));
            on(this.embedding, "click", lang.hitch(this, function () {
                this._showEmbeddingContainer();
            }));

            //send request when fb, mail or twitter icon is clicked for sharing
            on(this.tdFacebook, "click", lang.hitch(this, function () { this._share("facebook"); }));
            on(this.tdTwitter, "click", lang.hitch(this, function () { this._share("twitter"); }));
            on(this.tdMail, "click", lang.hitch(this, function () { this._share("email"); }));

        },

        /**
        * set embedding container
        * @memberOf widgets/share/share
        */
        _showEmbeddingContainer: function () {
            var height;
            if (domGeom.getMarginBox(this.esriCTDivshareContainer).h > 1) {
                domClass.add(this.esriCTDivshareContainer, "esriCTShareBorder");
                domClass.replace(this.esriCTDivshareContainer, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
            } else {
                height = domGeom.getMarginBox(this.esriCTDivshareCodeContainer).h + domGeom.getMarginBox(this.esriCTDivshareCodeContent).h;
                domClass.remove(this.esriCTDivshareContainer, "esriCTShareBorder");
                domClass.replace(this.esriCTDivshareContainer, "esriCTShowContainerHeight", "esriCTHideContainerHeight");
                domStyle.set(this.esriCTDivshareContainer, "height", height + 'px');
            }
            this._setShareContainerHeight(height);
        },

        _setShareContainerHeight: function (embContainerHeight) {
            var contHeight = domStyle.get(this.divAppHolder, "height");
            if (domClass.contains(this.esriCTDivshareContainer, "esriCTShowContainerHeight")) {
                if (embContainerHeight) {
                    contHeight += embContainerHeight;
                } else {
                    contHeight += domStyle.get(this.esriCTDivshareContainer, "height");
                }
            }
            //adding 2px in height of share container to display border
            domStyle.set(this.divAppContainer, "height", contHeight + 2 + "px");
        },

        /* show and hide share container
        * @memberOf widgets/share/share
        */
        _showHideShareContainer: function () {
            if (html.coords(this.divAppContainer).h > 0) {
                /**
                * when user clicks on share icon in header panel, close the sharing panel if it is open
                */
                domClass.replace(this.domNode, "esriCTImgSocialMedia", "esriCTImgSocialMediaSelect");
                domClass.replace(this.divAppContainer, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
            } else {
                /**
                * when user clicks on share icon in header panel, open the sharing panel if it is closed
                */
                domClass.replace(this.domNode, "esriCTImgSocialMediaSelect", "esriCTImgSocialMedia");
                domClass.replace(this.divAppContainer, "esriCTShowContainerHeight", "esriCTHideContainerHeight");
            }
        },

        /**
        * return current map extent
        * @return {string} Current map extent
        * @memberOf widgets/share/share
        */
        _getMapExtent: function () {
            var extents = Math.round(this.map.extent.xmin).toString() + "," + Math.round(this.map.extent.ymin).toString() + "," + Math.round(this.map.extent.xmax).toString() + "," + Math.round(this.map.extent.ymax).toString();
            return extents;
        },

        /**
        * display sharing panel
        * @param {array} dojo.configData.MapSharingOptions Sharing option settings specified in configuration file
        * @memberOf widgets/share/share
        */
        _shareLink: function () {
            var url, mapExtent, splitUrl, locGeom, urlStr, clickCoords;
            /**
            * get current map extent to be shared
            */
            if (domGeom.getMarginBox(this.esriCTDivshareContainer).h <= 1) {
                domClass.add(this.esriCTDivshareContainer, "esriCTShareBorder");
            }
            this.esriCTDivshareCodeContent.value = "<iframe width='100%' height='100%' src='" + location.href + "'></iframe> ";
            domAttr.set(this.esriCTDivshareCodeContainer, "innerHTML", sharedNls.titles.webpageDispalyText);
            mapExtent = this._getMapExtent();
            url = esri.urlToObject(window.location.toString());
            splitUrl = url.path.split("#")[0] + "?app=" + dojo.seletedWorkflow;
            urlStr = encodeURI(splitUrl) + "$extent=" + mapExtent;
            if (dojo.addressLocation) {
                locGeom = dojo.addressLocation.geometry.x + "," + dojo.addressLocation.geometry.y;
                urlStr += "$locationPoint=" + locGeom;
                if (dojo.infoWindowIsShowing) {
                    if (dojo.mapClickedPoint) {
                        clickCoords = dojo.mapClickedPoint.x + "," + dojo.mapClickedPoint.y;
                        urlStr += "$mapClickPoint=" + clickCoords;
                    } else {
                        urlStr += "$layerID=" + dojo.layerID + "$featureID=" + dojo.featureID;
                    }
                }
            } else if (dojo.mapClickedPoint) {
                clickCoords = dojo.mapClickedPoint.x + "," + dojo.mapClickedPoint.y;
                urlStr += "$mapClickPoint=" + clickCoords;
            }
            if (dojo.selectedBasemapIndex !== null) {
                urlStr += "$selectedBasemapIndex=" + dojo.selectedBasemapIndex;
            }
            urlStr += "$sliderValue=" + dojo.sliderValue + "$driveType=" + dojo.driveTime;
            this.urlStr = urlStr;

            // Attempt the shrinking of the URL
            this.getTinyUrl = commonShare.getTinyLink(urlStr, dojo.configData.MapSharingOptions.TinyURLServiceURL);
        },

        /**
        * share application detail with selected share option
        * @param {string} site Selected share option
        * @param {string} tinyUrl Tiny URL for sharing
        * @param {string} urlStr Long URL for sharing
        * @memberOf widgets/share/share
        */
        _share: function (site) {
            /*
            * hide share panel once any of the sharing options is selected
            */
            domClass.replace(this.domNode, "esriCTImgSocialMedia", "esriCTImgSocialMediaSelect");
            if (html.coords(this.divAppContainer).h > 0) {
                domClass.replace(this.divAppContainer, "esriCTHideContainerHeight", "esriCTShowContainerHeight");
            }

            // Do the share
            commonShare.share(this.getTinyUrl, dojo.configData.MapSharingOptions, site);
        }

    });
});
