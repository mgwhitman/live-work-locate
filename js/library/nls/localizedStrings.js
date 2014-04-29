/*global define,dojo,dojoConfig,esri */
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
define({
    root: {
        showNullValue: "N/A",
        titles: {
            webpageDispalyText: "Copy/paste HTML into your web page",
            moreInfo: "Website",
            sliderDisplayText: "Show results within <b> ${defaultMinute} mins drive</b>"
        },
        errorMessages: {
            invalidSearch: "No results found",
            falseConfigParams: "Required configuration key values are either null or not exactly matching with layer attributes, This message may appear multiple times.",
            invalidLocation: "Current Location not found.",
            invalidProjection: "Unable to plot current location on the map.",
            widgetNotLoaded: "Fail to load widgets.",
            shareLoadingFailed: "Unable to load share options.",
            shareFailed: "Unable to share.",
            noLegend: "No Legend Available",
            invalidSearchSettings: "Title and/or QueryLayerId parameters in SearchSettings do not match with configured webmap."
        },
        buttons: {
            embedding: "Embedding", //Shown next to icon for sharing the map embedding in website
            email: "Email",  // Shown next to icon for sharing the current map extents via email; works with shareViaEmail tooltip
            facebook: "Facebook",  // Shown next to icon for sharing the current map extents via a Facebook post; works with shareViaFacebook tooltip
            twitter: "Twitter"  // Shown next to icon for sharing the current map extents via a Twitter tweet; works with shareViaTwitter tooltip
        },
        tooltips: {
            locate: "Locate",
            share: "Share",
            help: "Help",
            clear: "Clear",
            search: "Search",
            locateAddress: "LocateAddress",
            loadingText: "Loading...",
            previous: "Previous",
            next: "Next"
        }
    },

    es: true,
    fr: true,
    it: true
});
