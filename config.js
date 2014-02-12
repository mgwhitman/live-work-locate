﻿/*global dojo */
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
define([], function () {
    return {

        // This file contains various configuration settings for esri template
        //
        // Use this file to perform the following:
        //
        // 1.  Specify application Name                      - [ Tag(s) to look for: ApplicationName ]
        // 2.  Set path for application icon                 - [ Tag(s) to look for: ApplicationIcon ]
        // 3.  Set path for application favicon              - [ Tag(s) to look for: ApplicationFavicon ]
        // 4.  Set URL for help page                         - [ Tag(s) to look for: HelpURL ]
        // 5.  Specify header widget settings                - [ Tag(s) to look for: AppHeaderWidgets ]
        // 6.  Specify URLs for base maps                    - [ Tag(s) to look for: BaseMapLayers ]
        // 7.  Set initial map extent                        - [ Tag(s) to look for: DefaultExtent ]
        // 8.  Specify URLs for operational layers           - [ Tag(s) to look for: OperationalLayers]
        // 9.  Customize zoom level for address search       - [ Tag(s) to look for: ZoomLevel ]
        // 10.  Customize address search settings            - [ Tag(s) to look for: LocatorSettings]
        // 11.  Set URL for geometry service                 - [ Tag(s) to look for: GeometryService ]
        // 12. Specify URLs for map sharing                  - [ Tag(s) to look for: MapSharingOptions,TinyURLServiceURL, TinyURLResponseAttribute, FacebookShareURL, TwitterShareURL, ShareByMailLink ]

        // ------------------------------------------------------------------------------------------------------------------------
        // GENERAL SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set application title
        ApplicationName: "Live Work Locate",

        // Set application icon path
        ApplicationIcon: "/themes/images/applicationIcon.png",

        // Set application Favicon path
        ApplicationFavicon: "/themes/images/favicon.ico",

        // Set URL of help page/portal
        HelpURL: "help.htm",

        // Set custom logo url, displayed in lower left corner. Set to empty "" to disable.
        LogoURL: "",

        // Set splash window content - Message that appears when the application starts
        SplashScreen: {
            // splash screen Message is set in locale file in nls dirctory
            IsVisible: true
        },
        //------------------------------------------------------------------------------------------------------------------------
        // Header Widget Settings
        //------------------------------------------------------------------------------------------------------------------------
        // Set widgets settings such as widget title, widgetPath, mapInstanceRequired to be displayed in header panel
        // Title: Name of the widget, will displayed as title of widget in header panel
        // WidgetPath: path of the widget respective to the widgets package.
        // MapInstanceRequired: true if widget is dependent on the map instance.

        AppHeaderWidgets: [
           {
               Title: "Search",
               WidgetPath: "widgets/locator/locator",
               MapInstanceRequired: true
           }, {
               Title: "Locate",
               WidgetPath: "widgets/geoLocation/geoLocation",
               MapInstanceRequired: true
           }, {
               Title: "Help",
               WidgetPath: "widgets/help/help",
               MapInstanceRequired: false
           }, {
               Title: "Exit",
               WidgetPath: "widgets/exit/exit",
               MapInstanceRequired: true
           }
        ],

        // ------------------------------------------------------------------------------------------------------------------------
        // BASEMAP SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set baseMap layers
        // Please note: All base-maps need to use the same spatial reference. By default, on application start the first base-map will be loaded

        BaseMapLayers: [{
            Key: "topo",
            ThumbnailSource: "themes/images/Topographic.jpg",
            Name: "Topographic Map",
            MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
        }, {
            Key: "streets",
            ThumbnailSource: "themes/images/streets.png",
            Name: "Street Map",
            MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
        }, {
            Key: "imagery",
            ThumbnailSource: "themes/images/imagery.png",
            Name: "Imagery Map",
            MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
        }],

        // ------------------------------------------------------------------------------------------------------------------------
        // GEOMETRY SERVICE SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------

        // Set geometry service URL
        GeometryService: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
        // ------------------------------------------------------------------------------------------------------------------------

        // Following zoom level will be set for the map upon searching an address
        ZoomLevel: 12,

        //minimum height should be 310 for the info-popup in pixels
        InfoPopupHeight: 250,

        // Minimum width should be 330 for the info-popup in pixels
        InfoPopupWidth: 300,

        // Set string value to be shown for null or blank values
        ShowNullValueAs: "N/A",

        // Specify drive/walk time slider settings
        DriveTimeSliderSettings: {
            defaultMinutes: 20,
            minMinutes: 5,
            maxMinutes: 60,
            discreteValues: 12,
            showButtons: false
        },
        DriveTimeSliderRulerSettings: {
            SliderRulerContainer: "topDecoration",
            numberofTicks: 12
        },

        // Initial map extent. Use comma (,) to separate values and dont delete the last comma
        // The coordinates must be specified in the basemap's coordinate system, usually WKID:102100, unless a custom basemap is used
        DefaultExtent: "-9412951.815477943,4480918.013545, -7742344.125277582,5077738.330395495",

        // WORKFLOW SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Configure workflows

        // Name: Specify the workflow name. Workflow names have to be unique. It is displayed in the application header panel and splashscreen.
        // SplashscreenImage: Set image to be displayed in splashscreen for this workflow
        // ThemeColor: Set theme color
        // WebMapId: Choose if you want to use WebMap or Map Services for operational layers.
        // 			 If using WebMap, specify WebMapId within quotes, otherwise leave this empty and configure operational layers
        // OperationalLayers: Configure operational layers for each workflow. The order of displaying layers is reversed on map. The last configured layer is displayed on top.
        //					ServiceURL: URL of the layer.
        // 					LoadAsServiceType: Field to specify if the operational layers should be added as dynamic map service layer or feature layer.
        //										Supported service types are 'dynamic' or 'feature'.
        // SearchSettings: Configure search settings for each workflow.
        // 				Title: In case of webmap implementations, it must match layer name specified in webmap and in case of operational layers
        // 		  				it should be the name of Map/Feature Service.
        // 				QueryLayerId: This is the layer index in the webmap or ArcGIS Map/Feature Service and is used for performing queries.
        // 				SearchDisplayTitle: This text is displayed in search results as the title to group results.
        // 				SearchDisplayFields: Attribute that will be displayed in the search box when user performs a search.
        // 				SearchExpression: Configure the query expression to be used for search.
        // InfowindowSettings: Configure info-popup settings. The Title and QueryLayerId fields should be the same as configured in "Title" and "QueryLayerId" fields in SearchSettings.
        // 				Title: In case of webmap implementations, it must match layer name specified in webmap and in case of operational layers
        // 		  				it should be the name of Map/Feature Service.
        // 				QueryLayerId: Layer index used for performing queries.
        // 				InfoWindowHeader: Specify field for the info window header
        // 				ShowAllFields: When set to true, infowindow will display all fields from layer and InfoWindowData section is ignored
        //				  				When set to false, only fields configured in InfoWindowData section will be displayed
        // 				InfoWindowData: Set the content to be displayed in the info-Popup. Define labels and field values.
        //                    			These fields should be present in the layer referenced by 'QueryLayerId' specified under section 'SearchSettings'
        // 				DisplayText: Caption to be displayed instead of field alias names. Set this to empty string ("") if you wish to display field alias names as captions.
        // 				FieldName: Field used for displaying the value

        Workflows: [
          {
              Name: "LIVE",
              SplashscreenImage: "themes/images/live-img.png",
              ThemeColor: "themes/styles/blueTheme.css",
              WebMapId: "",
              OperationalLayers: [
                  {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/1",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/4",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/7",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/8",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/25",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/27",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/32",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/33",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/34",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/35",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/36",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/37",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/38",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/39",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/40",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/41",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/42",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/43",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/44",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/45",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/46",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/47",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/48",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/50",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/51",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/52",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/53",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/54",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/56",
                      LoadAsServiceType: "dynamic"
                  }, {
                      ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/59",
                      LoadAsServiceType: "dynamic"
                  }
              ],
              // ------------------------------------------------------------------------------------------------------------------------
              // SEARCH SETTINGS FOR THIS WORKFLOW
              // ------------------------------------------------------------------------------------------------------------------------
              // Configure search, to be displayed in search and 511 Info panels:

              // Configure search and 511 settings below.
              // Title: In case of webmap implementations, it must match layer name specified in webmap and in case of operational layers
              // 		  it should be the name of Map/Feature Service.
              // QueryLayerId: This is the layer index in the webmap or ArcGIS Map/Feature Service and is used for performing queries.
              // SearchDisplayTitle: This text is displayed in search results as the title to group results.
              // SearchDisplayFields: Attribute that will be displayed in the search box when user performs a search.
              // SearchExpression: Configure the query expression to be used for search.

              SearchSettings: [
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "1",
                        SearchDisplayTitle: "Home Median Price",
                        SearchDisplayFields: "${sitename} / ${value}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "4",
                        SearchDisplayTitle: "Hospitals And Healthcare Facilities ",
                        SearchDisplayFields: "${sitename} / ${city}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "7",
                        SearchDisplayTitle: "Population",
                        SearchDisplayFields: "${sitename} / ${value}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "8",
                        SearchDisplayTitle: "Population Change",
                        SearchDisplayFields: "${sitename} / ${value}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "25",
                        SearchDisplayTitle: "Local Personal Income Tax Rate",
                        SearchDisplayFields: "${sitename} / ${value}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "27",
                        SearchDisplayTitle: "Real Property Tax Rate",
                        SearchDisplayFields: "${sitename} / ${value}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "32",
                        SearchDisplayTitle: "Art and Cultural Centers",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "33",
                        SearchDisplayTitle: "Information Centers",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "34",
                        SearchDisplayTitle: "Music Venues",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "35",
                        SearchDisplayTitle: "Orchards and Farm Markets",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "36",
                        SearchDisplayTitle: "Farmers Markets",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "37",
                        SearchDisplayTitle: "Performing Arts Venues",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "38",
                        SearchDisplayTitle: "Petting Farms",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "39",
                        SearchDisplayTitle: "Christmas Tree Farms",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "40",
                        SearchDisplayTitle: "Corn Mazes",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "41",
                        SearchDisplayTitle: "Pick Your Own Produce",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "42",
                        SearchDisplayTitle: "Childrens Activities",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }, {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "43",
                        SearchDisplayTitle: "Wineries",
                        SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    },
					{
					    Title: "EconomicDevelopment",
					    QueryLayerId: "44",
					    SearchDisplayTitle: "Historical and Cultural Museums",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "45",
					    SearchDisplayTitle: "Visual Arts Venues",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "46",
					    SearchDisplayTitle: "Traditional Arts Venues",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "47",
					    SearchDisplayTitle: "Art Galleries",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "48",
					    SearchDisplayTitle: "State and National Parks",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "50",
					    SearchDisplayTitle: "Higher Edu 4-Year Independent",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "51",
					    SearchDisplayTitle: "Higher Edu 4-Year Public",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "52",
					    SearchDisplayTitle: "Higher Edu 2-Year Independent",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "53",
					    SearchDisplayTitle: "Higher Edu Regional Edu Center",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "54",
					    SearchDisplayTitle: "Higher Edu 2-Year Public",
					    SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "56",
					    SearchDisplayTitle: "Mass Transit Stations",
					    SearchDisplayFields: "${sitename}, ${city}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}, {
					    Title: "EconomicDevelopment",
					    QueryLayerId: "59",
					    SearchDisplayTitle: "Municipalities",
					    SearchDisplayFields: "${municipali}, County:${county}",
					    SearchExpression: "UPPER(municipali) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					}
              ],

              InfowindowSettings: [
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "1",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Value:",
                              FieldName: "${value}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "4",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Organization Name:",
                              FieldName: "${orgname}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website URL:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "7",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Population:",
                              FieldName: "${value}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "8",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Population Change:",
                              FieldName: "${value}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "25",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Tax Rate:",
                              FieldName: "${value}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "27",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Tax Rate:",
                              FieldName: "${value}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "32",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website URL:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "33",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip +4:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "34",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "35",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "36",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Building Name or Suite Number:",
                              FieldName: "${building_suite}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "37",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "38",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "39",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "40",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "41",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "42",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "43",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "44",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Organization the site belongs to:",
                              FieldName: "${orgname}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip +4:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "45",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip +4:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "46",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip +4:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "47",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Organization the site belongs to:",
                              FieldName: "${orgname}"
                          }, {
                              DisplayText: "Building Name or Suite Number:",
                              FieldName: "${building_suite}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "48",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Header Image URL:",
                              FieldName: "${headerimage}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "50",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "Image URL:",
                              FieldName: "${image}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Header Image URL:",
                              FieldName: "${headerimage}"
                          }, {
                              DisplayText: "Enrollment Numbers:",
                              FieldName: "${enrollment}"
                          }, {
                              DisplayText: "Grades Supported/Degrees Awarded:",
                              FieldName: "${grades_degrees}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "51",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "Image URL:",
                              FieldName: "${image}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Header Image URL:",
                              FieldName: "${headerimage}"
                          }, {
                              DisplayText: "Enrollment Numbers:",
                              FieldName: "${enrollment}"
                          }, {
                              DisplayText: "Grades Supported/Degrees Awarded:",
                              FieldName: "${grades_degrees}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "52",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "Image URL:",
                              FieldName: "${image}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Header Image URL:",
                              FieldName: "${headerimage}"
                          }, {
                              DisplayText: "Enrollment Numbers:",
                              FieldName: "${enrollment}"
                          }, {
                              DisplayText: "Grades Supported/Degrees Awarded:",
                              FieldName: "${grades_degrees}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "53",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "Image URL:",
                              FieldName: "${image}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Header Image URL:",
                              FieldName: "${headerimage}"
                          }, {
                              DisplayText: "Enrollment Numbers:",
                              FieldName: "${enrollment}"
                          }, {
                              DisplayText: "Grades Supported/Degrees Awarded:",
                              FieldName: "${grades_degrees}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "54",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "County:",
                              FieldName: "${county}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Phone:",
                              FieldName: "${phonenumber}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "Image URL:",
                              FieldName: "${image}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }, {
                              DisplayText: "Header Image URL:",
                              FieldName: "${headerimage}"
                          }, {
                              DisplayText: "Enrollment Numbers:",
                              FieldName: "${enrollment}"
                          }, {
                              DisplayText: "Grades Supported/Degrees Awarded:",
                              FieldName: "${grades_degrees}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "56",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "Name:",
                              FieldName: "${sitename}"
                          }, {
                              DisplayText: "Desc:",
                              FieldName: "${sitedesc}"
                          }, {
                              DisplayText: "Organization the site belongs to:",
                              FieldName: "${orgname}"
                          }, {
                              DisplayText: "Street Address:",
                              FieldName: "${streetaddress}"
                          }, {
                              DisplayText: "City:",
                              FieldName: "${city}"
                          }, {
                              DisplayText: "Zip Code:",
                              FieldName: "${zip}"
                          }, {
                              DisplayText: "Website:",
                              FieldName: "${website}"
                          }, {
                              DisplayText: "More Info Link URL:",
                              FieldName: "${more_info}"
                          }
                      ]
                  },
                  {
                      Title: "EconomicDevelopment",
                      QueryLayerId: "59",
                      InfoWindowHeaderField: "${sitename}",
                      ShowAllFields: "false",
                      InfoWindowData: [
                          {
                              DisplayText: "COUNTY:",
                              FieldName: "${COUNTY}"
                          }, {
                              DisplayText: "MUNICIPALI:",
                              FieldName: "${MUNICIPALI}"
                          }, {
                              DisplayText: "RESOLUTION:",
                              FieldName: "${RESOLUTION}"
                          }, {
                              DisplayText: "ANNEXATION:",
                              FieldName: "${ANNEXATION}"
                          }, {
                              DisplayText: "ACRES:",
                              FieldName: "${ACRES}"
                          }
                      ]
                  }

              ]


          }, {
              Name: "WORK",
              SplashscreenImage: "themes/images/work-img.png",
              ThemeColor: "themes/styles/greenTheme.css",
              WebMapId: "",
              OperationalLayers: [
                    {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/14",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/16",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/17",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/19",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/20",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/21",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/22",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/23",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/25",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/29",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/30",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/56",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/57",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/58",
                        LoadAsServiceType: "dynamic"
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/59",
                        LoadAsServiceType: "dynamic"
                    }
              ],

              SearchSettings: [

					{
					    Title: "EconomicDevelopment",
					    QueryLayerId: "14",
					    SearchDisplayTitle: "Unemployment",
					    SearchDisplayFields: "${sitename} / ${value}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					},
					{
					    Title: "EconomicDevelopment",
					    QueryLayerId: "16",
					    SearchDisplayTitle: "Home Median Price",
					    SearchDisplayFields: "${sitename} / ${city}",
					    SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
					},
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "17",
                        SearchDisplayTitle: "Research Parks",
                        SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "19",
                        SearchDisplayTitle: "Top Military Employers",
                        SearchDisplayFields: "${sitename} / ${city}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "20",
                        SearchDisplayTitle: "Top Bioscience Employers",
                        SearchDisplayFields: "${sitename} / ${city}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "21",
                        SearchDisplayTitle: "Top Privately Held Employers",
                        SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "22",
                        SearchDisplayTitle: "Fastest Growing Companies",
                        SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "23",
                        SearchDisplayTitle: "Top Company Headquarters",
                        SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "25",
                        SearchDisplayTitle: "Local Personal IncomeTaxRate",
                        SearchDisplayFields: "${sitename} / ${value}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "29",
                        SearchDisplayTitle: "Labor Force",
                        SearchDisplayFields: "${sitename} / ${value}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "30",
                        SearchDisplayTitle: "Employment",
                        SearchDisplayFields: "${sitename} / ${value}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "56",
                        SearchDisplayTitle: " Mass TransitStations",
                        SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "57",
                        SearchDisplayTitle: "Sea Ports",
                        SearchDisplayFields: "${sitename} / ${city}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "58",
                        SearchDisplayTitle: "Airports",
                        SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                        SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                    },
                    {
                        Title: "EconomicDevelopment",
                        QueryLayerId: "59",
                        SearchDisplayTitle: "Municipalities",
                        SearchDisplayFields: "${municipali}, County:${county}",
                        SearchExpression: "UPPER(municipali) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                    }
              ]


          },
                  {
                      Name: "LOCATE",
                      SplashscreenImage: "themes/images/locate-img.png",
                      ThemeColor: "themes/styles/purpleTheme.css",
                      WebMapId: "",
                      OperationalLayers: [
                       {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/3",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/4",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/5",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/7",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/8",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/9",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/10",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/11",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/12",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/13",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/14",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/16",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/17",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/18",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/26",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/27",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/29",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/30",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/56",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/57",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/58",
                           LoadAsServiceType: "dynamic"
                       }, {
                           ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/59",
                           LoadAsServiceType: "dynamic"
                       }
                      ],

                      SearchSettings: [

                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "3",
                                SearchDisplayTitle: "Local Economic Development Offices",
                                SearchDisplayFields: "${sitename} / ${city}/Phone: ${phonenumber}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "4",
                                SearchDisplayTitle: "Hospitals And Healthcare Facilities ",
                                SearchDisplayFields: "${sitename} / ${city}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "5",
                                SearchDisplayTitle: " Federal Facilities",
                                SearchDisplayFields: "${Agency} / ${City }/Phone: ${Telephone}",
                                SearchExpression: "UPPER(Agency) LIKE UPPER('${0}%') OR UPPER(City) LIKE UPPER('${0}%') OR UPPER(County) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "7",
                                SearchDisplayTitle: "Population",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
				            {
				                Title: "EconomicDevelopment",
				                QueryLayerId: "8",
				                SearchDisplayTitle: "Population Change",
				                SearchDisplayFields: "${sitename} / ${value}",
				                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
				            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "9",
                                SearchDisplayTitle: "Median Household Income",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "10",
                                SearchDisplayTitle: "Population Density",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "11",
                                SearchDisplayTitle: "Per Captia Personal Income",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "12",
                                SearchDisplayTitle: "Bachelors Degree Attainment",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "13",
                                SearchDisplayTitle: "HighSchool Attainment",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },

					        {
					            Title: "EconomicDevelopment",
					            QueryLayerId: "14",
					            SearchDisplayTitle: "Unemployment",
					            SearchDisplayFields: "${sitename} / ${value}",
					            SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
					        },
					        {
					            Title: "EconomicDevelopment",
					            QueryLayerId: "16",
					            SearchDisplayTitle: "Home Median Price",
					            SearchDisplayFields: "${sitename} / ${city}",
					            SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
					        },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "17",
                                SearchDisplayTitle: "Research Parks",
                                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "18",
                                SearchDisplayTitle: "Incubators",
                                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "26",
                                SearchDisplayTitle: "Business Personal Property Tax Rate",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "27",
                                SearchDisplayTitle: "Real Property TaxRate",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "29",
                                SearchDisplayTitle: "Labor Force",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "30",
                                SearchDisplayTitle: "Employment",
                                SearchDisplayFields: "${sitename} / ${value}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "56",
                                SearchDisplayTitle: "Mass TransitStations",
                                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "57",
                                SearchDisplayTitle: " Sea Ports",
                                SearchDisplayFields: "${sitename} / ${city}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "58",
                                SearchDisplayTitle: "Airports",
                                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
                            },
                            {
                                Title: "EconomicDevelopment",
                                QueryLayerId: "59",
                                SearchDisplayTitle: "Municipalities",
                                SearchDisplayFields: "${municipali}, County:${county}",
                                SearchExpression: "UPPER(municipali) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                            }
                      ]
                  },
                    {
                        Name: "TRANSPORT",
                        SplashscreenImage: "themes/images/transport-img.png",
                        ThemeColor: "themes/styles/orangeTheme.css",
                        WebMapId: "",
                        OperationalLayers: [{
                            ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/51",
                            // DefaultExtent: "-1.1042906288434178E7, 6151915.419550791,-1.1042906288434178E7, 6151915.419550791, 102100  (3857)",
                            LoadAsServiceType: "dynamic"
                            //text: "TRANSPORT"
                        }],
                        SearchSettings: [{
                            Title: "EconomicDevelopment",
                            QueryLayerId: "51",
                            SearchDisplayTitle: "Higher Edu 4-Year Public",
                            SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                            SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
                        }
                        ]
                    }
        ],
        //------------------------------------------------------------------------------------------------------------------------
        // Header Widget Settings
        //------------------------------------------------------------------------------------------------------------------------
        // Set widgets settings such as widget title, widgetPath, mapInstanceRequired to be displayed in header panel
        // Title: Name of the widget, will displayed as title of widget in header panel
        // WidgetPath: path of the widget respective to the widgets package.
        // MapInstanceRequired: true if widget is dependent on the map instance.

        AppHeaderWidgets: [
           {
               Title: "Search",
               WidgetPath: "widgets/locator/locator",
               MapInstanceRequired: true
           }, {
               Title: "Locate",
               WidgetPath: "widgets/geoLocation/geoLocation",
               MapInstanceRequired: true
           }, {
               Title: "Share",
               WidgetPath: "widgets/share/share",
               MapInstanceRequired: true
           }, {
               Title: "Help",
               WidgetPath: "widgets/help/help",
               MapInstanceRequired: false
           }, {
               Title: "Exit",
               WidgetPath: "widgets/exit/exit",
               MapInstanceRequired: true
           }
        ],

        // ------------------------------------------------------------------------------------------------------------------------
        // BASEMAP SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set baseMap layers
        // Please note: All base-maps need to use the same spatial reference. By default, on application start the first base-map will be loaded

        BaseMapLayers: [{
            Key: "topo",
            ThumbnailSource: "themes/images/Topographic.jpg",
            Name: "Topographic Map",
            MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
        }, {
            Key: "streets",
            ThumbnailSource: "themes/images/streets.png",
            Name: "Street Map",
            MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
        }, {
            Key: "imagery",
            ThumbnailSource: "themes/images/imagery.png",
            Name: "Imagery Map",
            MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
        }],


        // Initial map extent. Use comma (,) to separate values and dont delete the last comma
        // The coordinates must be specified in the basemap's coordinate system, usually WKID:102100, unless a custom basemap is used



        // Choose if you want to use WebMap or Map Services for operational layers. If using WebMap, specify WebMapId within quotes, otherwise leave this empty and configure operational layers


        // OPERATIONAL DATA SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------

        // Configure operational layers:

        // Configure operational layers  below. The order of displaying layers is reversed on map. The last configured layer is displayed on top.
        // ServiceURL: URL of the layer.
        // LoadAsServiceType: Field to specify if the operational layers should be added as dynamic map service layer or feature layer.
        //                    Supported service types are 'dynamic' or 'feature'.


        // ------------------------------------------------------------------------------------------------------------------------
        // SEARCH AND 511 SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Configure search, barrier and info settings to be displayed in search and 511 Info panels:

        // Configure search and 511 settings below.
        // Title: In case of webmap implementations, it must match layer name specified in webmap and in case of operational layers
        // 		  it should be the name of Map/Feature Service.
        // QueryLayerId: This is the layer index in the webmap or ArcGIS Map/Feature Service and is used for performing queries.
        // SearchDisplayTitle: This text is displayed in search results as the title to group results.
        // SearchDisplayFields: Attribute that will be displayed in the search box when user performs a search.
        // SearchExpression: Configure the query expression to be used for search.
        // BarrierLayer: Configure "true" or "false" to treat this as a barrier layer to be used for routing and re-routing.
        // BarrierSearchExpression: Configure the query expression to search barriers in the layer.
        //							Set this to emtpy "", if all features in the layer should be considered as barriers.
        // InfoLayer: Allowed values are "true" or "false". Configure this to "true" to consider this as 511 Information layer
        //			  and display in 511 Information panels.
        // InfoSearchExpression: Configure the query expression to search features and display in 511 Information panels.
        //						 Set this to empty "", if all features in the layer should be considered.
        // InfoListText: This text is displayed in 511 Information Summary panel.
        //				 If empty "", then SearchDisplayTitle is used (if configured), else layer name in the webmap/mapservice is used.
        // InfoDetailFields: Attributes that will be displayed in the 511 Information Details panel.
        //					 If empty "", then SearchDisplayFields will be used (if configured), else displayField property of layer in mapservice will be used.



        // Following zoom level will be set for the map upon searching an address
        ZoomLevel: 12,

        // Time interval to refresh all layers on map
        LayersRefreshInterval: 5, // in minutes

        //minimum height should be 310 for the info-popup in pixels
        InfoPopupHeight: 250,

        // Minimum width should be 330 for the info-popup in pixels
        InfoPopupWidth: 300,

        // Set string value to be shown for null or blank values
        ShowNullValueAs: "N/A",
        // ------------------------------------------------------------------------------------------------------------------------
        // INFO-WINDOW SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Configure info-popup settings. The Title and QueryLayerId fields should be the same as configured in "Title" and "QueryLayerId" fields in SearchAnd511Settings.
        // Title: In case of webmap implementations, it must match layer name specified in webmap and in case of operational layers
        // 		  it should be the name of Map/Feature Service.
        // QueryLayerId: Layer index used for performing queries.
        // InfoWindowHeader: Specify field for the info window header
        // MobileCalloutField: Specify field to be displayed in callout bubble for mobile devices
        // ShowAllFields: When set to true, infowindow will display all fields from layer and InfoWindowData section is ignored
        //				  When set to false, only fields configured in InfoWindowData section will be displayed
        // InfoWindowData: Set the content to be displayed in the info-Popup. Define labels and field values.
        //                    These fields should be present in the layer referenced by 'QueryLayerId' specified under section 'SearchSettings'
        // DisplayText: Caption to be displayed instead of field alias names. Set this to empty string ("") if you wish to display field alias names as captions.
        // FieldName: Field used for displaying the value


        // ------------------------------------------------------------------------------------------------------------------------
        // ADDRESS SEARCH SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set locator settings such as locator symbol, size, display fields, match score
        // LocatorParameters: Parameters(text, outFields, maxLocations, bbox, outSR) used for address and location search.
        // AddressSearch: Candidates based on which the address search will be performed.
        // AddressMatchScore: Setting the minimum score for filtering the candidate results.
        // MaxResults: Maximum number of locations to display in the results menu.
        LocatorSettings: {
            DefaultLocatorSymbol: "/themes/images/redpushpin.png",
            MarkupSymbolSize: {
                width: 35,
                height: 35
            },
            DisplayText: "Address",
            LocatorDefaultAddress: "4401 Hartwick Rd, College Park, Maryland, 20740",
            LocatorParameters: {
                SearchField: "SingleLine",
                SearchBoundaryField: "searchExtent"
            },
            LocatorURL: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
            LocatorOutFields: ["Addr_Type", "Type", "Score", "Match_Addr", "xmin", "xmax", "ymin", "ymax"],
            DisplayField: "${Match_Addr}",
            AddressMatchScore: {
                Field: "Score",
                Value: 80
            },
            FilterFieldName: 'Addr_Type',
            FilterFieldValues: ["StreetAddress", "StreetName", "PointAddress", "POI"],
            MaxResults: 200

        },

        // ------------------------------------------------------------------------------------------------------------------------
        // FREQUENTLY TRAVELLED ROUTES SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------

        // LayerURL: URL for the layer (should include the layer id)
        // UniqueRouteField: Specify the field that contains values which uniquely identify routes
        // DisplayField: Attributes to be displayed in list of frequently travelled routes



        // ------------------------------------------------------------------------------------------------------------------------
        // GEOMETRY SERVICE SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------

        // Set geometry service URL
        GeometryService: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",

        // ------------------------------------------------------------------------------------------------------------------------

        TaskService: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
        DriveTimePolygonSymbology: {
            FillSymbolColor: "0,0,255",
            FillSymbolTransparency: "0.10",
            LineSymbolColor: "0,0,255",
            LineSymbolTransparency: "0.30"
        },


        // Set symbology for route
        // ColorRGB: Specify the color as comma separated R,G,B values
        // Transparency: Specify the transparency value between 0:Fully Transparent and 1:Fully Opaque
        // Width: Specify the display width of route in pixels
        RouteSymbology: {
            ColorRGB: "0,0,225",
            Transparency: "0.5",
            Width: "4"
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // SETTINGS FOR MAP SHARING
        // ------------------------------------------------------------------------------------------------------------------------

        // Set URL for TinyURL service, and URLs for social media
        MapSharingOptions: {
            TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
            TinyURLResponseAttribute: "data.url",
            FacebookShareURL: "http://www.facebook.com/sharer.php?u=${0}&t=esri%Template",
            TwitterShareURL: "http://mobile.twitter.com/compose/tweet?status=esri%Template ${0}",
            ShareByMailLink: "mailto:%20?subject=Check%20out%20this%20map!&body=${0}"
        }
    }
});