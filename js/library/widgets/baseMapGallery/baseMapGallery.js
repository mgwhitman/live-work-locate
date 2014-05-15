/*global define,dojo,dojoConfig,esri,alert,selectedBasemap */
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
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom",
    "dojo/query",
    "dojo/text!./templates/baseMapGalleryTemplate.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin"
], function (declare, domConstruct, lang, on, dom, query, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin) {

    //========================================================================================================================//

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        /**
        * create baseMapGallery widget
        *
        * @class
        * @name widgets/baseMapGallery/baseMapGallery
        */
        postCreate: function () {
            var i, basemapContainer, baseMapURL, baseMapLayers, baseMapURLCount;
            baseMapURL = baseMapURLCount = 0;
            baseMapLayers = dojo.configData.BaseMapLayers;
            for (i = 0; i < baseMapLayers.length; i++) {
                if (baseMapLayers[i].MapURL) {
                    if (baseMapURLCount === 0) {
                        baseMapURL = i;
                    }
                    baseMapURLCount++;
                }
            }
            basemapContainer = domConstruct.create("div", {}, dom.byId("esriCTParentDivContainer"));
            basemapContainer.appendChild(this.esriCTDivLayerContainer);
            this.layerList.appendChild(this._createBaseMapElement(baseMapURL, baseMapURLCount));
            this._loadSharedBasemap();
        },

        /**
        * create basemap layer
        * @param {string} layerURL {string} layerId evt
        * @memberOf widgets/baseMapGallery/baseMapGallery
        */
        _createBaseMapLayer: function (layerURL, layerId) {
            var layer = new esri.layers.ArcGISTiledMapServiceLayer(layerURL, { id: layerId, visible: false });
            return layer;
        },

        _createBaseMapElement: function (baseMapURL, baseMapURLCount) {
            var divContainer, imgThumbnail;
            divContainer = domConstruct.create("div", { "class": "esriCTbaseMapContainerNode" });
            imgThumbnail = domConstruct.create("img", { "class": "basemapThumbnail", "src": dojo.configData.BaseMapLayers[baseMapURL + 1].ThumbnailSource }, null);
            on(imgThumbnail, "click", lang.hitch(this, function () {
                dojo.selectedBasemapIndex++;
                this._changeBasemapThumbnail();
            }));
            divContainer.appendChild(imgThumbnail);
            return divContainer;
        },

        /**
        * change basemap layer
        * @memberOf widgets/baseMapGallery/baseMapGallery
        */
        _changeBaseMap: function () {
            var layer, basemap;
            basemap = this.map.getLayer("defaultBasemap");
            if (basemap) {
                this.map.removeLayer(basemap);
            }
            setTimeout(lang.hitch(this, function () {
                layer = new esri.layers.ArcGISTiledMapServiceLayer(dojo.configData.BaseMapLayers[dojo.selectedBasemapIndex].MapURL, { id: "defaultBasemap", visible: true });
                this.map.addLayer(layer, 0);
            }), 200);

        },

        /**
        * get shared basemap
        * @memberOf widgets/baseMapGallery/baseMapGallery
        */
        _loadSharedBasemap: function () {
            if (window.location.toString().split("$selectedBasemapIndex=").length > 1) {
                dojo.selectedBasemapIndex = parseInt(window.location.toString().split("$selectedBasemapIndex=")[1].split("$")[0], 10);
                this._changeBasemapThumbnail();
            }
        },

        /**
        * change basemap thumbnail
        * @memberOf widgets/baseMapGallery/baseMapGallery
        */
        _changeBasemapThumbnail: function () {
            var baseMapURLCount, presentThumbNail;
            baseMapURLCount = dojo.configData.BaseMapLayers.length;
            if (dojo.selectedBasemapIndex === baseMapURLCount) {
                dojo.selectedBasemapIndex = 0;
            }
            presentThumbNail = dojo.selectedBasemapIndex + 1;
            if (dojo.selectedBasemapIndex === baseMapURLCount - 1) {
                presentThumbNail = 0;
            }
            this._changeBaseMap();
            query('.basemapThumbnail')[0].src = dojo.configData.BaseMapLayers[presentThumbNail].ThumbnailSource;
        },

        /**
        * hide basemap layer
        * @memberOf widgets/baseMapGallery/baseMapGallery
        */
        _hideMapLayers: function () {
            var i, layer;
            for (i = 0; i < dojo.configData.BaseMapLayers.length; i++) {
                if (dojo.configData.BaseMapLayers[i].MapURL) {
                    layer = this.map.getLayer(dojo.configData.BaseMapLayers[i].Key);
                    if (layer) {
                        layer.hide();
                    }
                }
            }
        },
        /**
        * hide basemap gallery
        * @memberOf widgets/baseMapGallery/baseMapGallery
        */
        _hideBaseMapGallery: function () {
            this.esriCTDivLayerContainer.style.display = "none";
        }
    });
});
