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
        // 5.  Set URL for logo                              - [ Tag(s) to look for: LogoURL ]
        // 6.  Set settings  for splash screen               - [ Tag(s) to look for: SplashScreen ]
        // 7.  Specify header widget settings                - [ Tag(s) to look for: AppHeaderWidgets ]
        // 8.  Specify URLs for base maps                    - [ Tag(s) to look for: BaseMapLayers ]
        // 9.  Geometry service setting                      - [ Tag(s) to look for: GeometryService ]
        // 10. RouteTask setting                             - [ Tag(s) to look for: RouteTask ]
        // 11. ServiceAreaTask setting                       - [ Tag(s) to look for: ServiceAreaTask ]
        // 12. Customize zoom level for address search       - [ Tag(s) to look for: ZoomLevel ]
        // 13. Customize InfoPopupHeight                     - [ Tag(s) to look for: InfoPopupHeight ]
        // 14. Customize InfoPopupWidth                      - [ Tag(s) to look for: InfoPopupWidth ]
        // 15. Specify ShowNullValueAs                       - [ Tag(s) to look for: ShowNullValueAs ]
        // 16. Customize DriveTimeSliderSettings             - [ Tag(s) to look for: DriveTimeSliderSettings ]
        // 17. Customize  DriveTimeSliderRulerSettings       - [ Tag(s) to look for: DriveTimeSliderRulerSettings ]
        // 18. Customize  DefaultExtent                      - [ Tag(s) to look for: DefaultExtent]
        // 19. Customize  Workflow                           - [ Tag(s) to look for: Workflow]
        // 20. Customize  LayersRefreshInterval              - [ Tag(s) to look for: LayersRefreshInterval ]
        // 21. Set URL for LocatorSettings                   - [ Tag(s) to look for: LocatorSettings ]
        // 22. Set URL for TaskService                       - [ Tag(s) to look for: TaskService ]
        // 23. Customize  DriveTimePolygonSymbology          - [ Tag(s) to look for: DriveTimePolygonSymbology ]
        // 24. Specify URLs for map sharing                  - [ Tag(s) to look for: MapSharingOptions,TinyURLServiceURL, TinyURLResponseAttribute, FacebookShareURL, TwitterShareURL, ShareByMailLink ]

        // ------------------------------------------------------------------------------------------------------------------------
        // GENERAL SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set application title

        // Set application icon path
        ApplicationIcon: "/js/library/themes/images/applicationIcon.png",

        // Set application Favicon path
        ApplicationFavicon: "/js/library/themes/images/favicon.ico",

        // Set URL of help page/portal
        HelpURL: "help.htm",

        // Set custom logo url, displayed in lower left corner. Set to empty "" to disable.
        LogoURL: "",

        // Set splash window content - Message that appears when the application starts
        SplashScreen: {
            // splash screen Message is set in locale file in nls dirctory
            IsVisible: true,
            SplashScreenContent: "Please select an app to continue"
        },

        Exit: "Exit",

        DriveTime: "Drive Time",

        WalkTime: "Walk Time",

        ExpandResult: "Expand Result",

        CollapseResult: "Collapse Result",

        NearbyText: "What's nearby?",

        SwitchWorkflows: "Click to switch workflows",

        //------------------------------------------------------------------------------------------------------------------------
        // Header Widget Settings
        //------------------------------------------------------------------------------------------------------------------------
        // Set widgets settings such as widget title, widgetPath, mapInstanceRequired to be displayed in header panel
        // Title: Name of the widget, will displayed as title of widget in header panel
        // WidgetPath: path of the widget respective to the widgets package.
        // MapInstanceRequired: true if widget is dependent on the map instance.

        AppHeaderWidgets: [{
            WidgetPath: "widgets/locator/locator",
            MapInstanceRequired: true
        }, {
            WidgetPath: "widgets/geoLocation/geoLocation",
            MapInstanceRequired: true
        }, {
            WidgetPath: "widgets/share/share",
            MapInstanceRequired: true
        }, {
            WidgetPath: "widgets/help/help",
            MapInstanceRequired: false
        }, {
            WidgetPath: "widgets/exit/exit",
            MapInstanceRequired: true
        }],

        GroupURL: "http://www.arcgis.com/sharing/rest/",

        SearchURL: "http://www.arcgis.com/sharing/rest/search?q=group:",

        BasemapGroupTitle: "EsriLocalGovernment",

        BasemapGroupOwner: "sagarnair_cssl",

        WebmapThumbnail: "js/library/themes/images/not-available.png",

        // ------------------------------------------------------------------------------------------------------------------------
        // GEOMETRY SERVICE SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------

        // Set geometry service URL
        GeometryService: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
        // ------------------------------------------------------------------------------------------------------------------------
        RouteTask: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
        ServiceAreaTask: "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World",

        // Set proxy url
        ProxyUrl: "/proxy/proxy.ashx",

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
            defaultMinutes: 10,
            minMinutes: 5,
            maxMinutes: 60,
            discreteValues: 12,
            showButtons: false
        },

        DriveTimeSliderRulerSettings: {
            SliderRulerContainer: "topDecoration"
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
        // If using WebMap, specify WebMapId within quotes, otherwise leave this empty and configure operational layers
        // OperationalLayers: Configure operational layers for each workflow. The order of displaying layers is reversed on map. The last configured layer is displayed on top.
        // ServiceURL: URL of the layer.
        // LoadAsServiceType: Field to specify if the operational layers should be added as dynamic map service layer or feature layer.
        // Supported service types are 'dynamic' or 'feature'.
        // SearchSettings: Configure search settings for each workflow.
        // Title: In case of webmap implementations, it must match layer name specified in webmap and in case of operational layers
        // it should be the name of Map/Feature Service.
        // QueryLayerId: This is the layer index in the webmap or ArcGIS Map/Feature Service and is used for performing queries.
        // SearchDisplayTitle: This text is displayed in search results as the title to group results.
        // SearchDisplayFields: Attribute that will be displayed in the search box when user performs a search.
        // SearchExpression: Configure the query expression to be used for search.
        // InfowindowSettings: Configure info-popup settings. The Title and QueryLayerId fields should be the same as configured in "Title" and "QueryLayerId" fields in SearchSettings.
        // Title: In case of webmap implementations, it must match layer name specified in webmap and in case of operational layers
        // it should be the name of Map/Feature Service.
        // QueryLayerId: Layer index used for performing queries.
        // InfoWindowHeader: Specify field for the info window header
        // ShowAllFields: When set to true, infowindow will display all fields from layer and InfoWindowData section is ignored
        // When set to false, only fields configured in InfoWindowData section will be displayed
        // InfoWindowData: Set the content to be displayed in the info-Popup. Define labels and field values.
        // These fields should be present in the layer referenced by 'QueryLayerId' specified under section 'SearchSettings'
        // DisplayText: Caption to be displayed instead of field alias names. Set this to empty string ("") if you wish to display field alias names as captions.
        // FieldName: Field used for displaying the value

        Workflows: [{
            Name: "LIVE",
            SplashscreenImage: "js/library/themes/images/live-img.png",
            ThemeColor: "js/library/themes/styles/blueTheme.css",
            WebMapId: "",
            FeatureHighlightColor: "#1C86EE",
            OperationalLayers: [{
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/1",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/4",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/7",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/9",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/10",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/25",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/29",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/32",
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
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/56",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/58",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/59",
                LoadAsServiceType: "dynamic"
            }],

            // ------------------------------------------------------------------------------------------------------------------------
            // SEARCH SETTINGS FOR THIS WORKFLOW
            // ------------------------------------------------------------------------------------------------------------------------

            // Title: In case of webmap implementations, it must match layer name specified in webmap and in case of operational layers
            // It should be the name of Map/Feature Service.
            // QueryLayerId: This is the layer index in the webmap or ArcGIS Map/Feature Service and is used for performing queries.
            // SearchDisplayTitle: This text is displayed in search results as the title to group results.
            // SearchDisplayFields: Attribute that will be displayed in the search box when user performs a search.
            // SearchExpression: Configure the query expression to be used for search.

            SearchSettings: [{
                Title: "MedianSalePriceofaHome",
                QueryLayerId: "1",
                SearchDisplayTitle: "Home Median Price",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "HospitalsAndHealthcareFacilities",
                QueryLayerId: "4",
                SearchDisplayTitle: "Hospitals And Healthcare Facilities ",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "Population",
                QueryLayerId: "7",
                SearchDisplayTitle: "Population",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "MedianHouseholdIncome",
                QueryLayerId: "9",
                SearchDisplayTitle: "Median Household Income",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "PopulationDensity",
                QueryLayerId: "10",
                SearchDisplayTitle: "Population Density",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "LocalPersonalIncomeTaxRate",
                QueryLayerId: "25",
                SearchDisplayTitle: "Local Personal Income Tax Rate",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "LaborForce",
                QueryLayerId: "29",
                SearchDisplayTitle: "Labor Force",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "ArtsAndCulturalCenters",
                QueryLayerId: "32",
                SearchDisplayTitle: "Art and Cultural Centers",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Music Venues",
                QueryLayerId: "34",
                SearchDisplayTitle: "Music Venues",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "OrchardsFarmMarkets",
                QueryLayerId: "35",
                SearchDisplayTitle: "Orchards and Farm Markets",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "FarmersMarkets",
                QueryLayerId: "36",
                SearchDisplayTitle: "Farmers Markets",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "PerformingArtsVenues",
                QueryLayerId: "37",
                SearchDisplayTitle: "Performing Arts Venues",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "PettingFarms",
                QueryLayerId: "38",
                SearchDisplayTitle: "Petting Farms",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "ChristmasTreeFarms",
                QueryLayerId: "39",
                SearchDisplayTitle: "Christmas Tree Farms",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "CornMazes",
                QueryLayerId: "40",
                SearchDisplayTitle: "Corn Mazes",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "PickYourOwnProduce",
                QueryLayerId: "41",
                SearchDisplayTitle: "Pick Your Own Produce",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Childrens Activities",
                QueryLayerId: "42",
                SearchDisplayTitle: "Childrens Activities",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Wineries",
                QueryLayerId: "43",
                SearchDisplayTitle: "Wineries",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "HistoricalandCulturalMuseums",
                QueryLayerId: "44",
                SearchDisplayTitle: "Historical and Cultural Museums",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "VisualArtsVenues",
                QueryLayerId: "45",
                SearchDisplayTitle: "Visual Arts Venues",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "TraditionalArtsVenues",
                QueryLayerId: "46",
                SearchDisplayTitle: "Traditional Arts Venues",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "ArtGalleries",
                QueryLayerId: "47",
                SearchDisplayTitle: "Art Galleries",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "StateAndNationalParks",
                QueryLayerId: "48",
                SearchDisplayTitle: "State and National Parks",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "MassTransitStations",
                QueryLayerId: "56",
                SearchDisplayTitle: "Mass Transit Stations",
                SearchDisplayFields: "${sitename}, ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Airports",
                QueryLayerId: "58",
                SearchDisplayTitle: "Airports",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "Municipalities",
                QueryLayerId: "59",
                SearchDisplayTitle: "Municipalities",
                SearchDisplayFields: "${MUNICIPALI}, County:${COUNTY}",
                SearchExpression: "UPPER(municipali) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }],
            // ------------------------------------------------------------------------------------------------------------------------
            // INFOWINDOW SETTING FOR THIS WORKFLOW
            // ------------------------------------------------------------------------------------------------------------------------
            // InfoWindowData: Set the content to be displayed in the info-Popup. Define labels and field values.
            // These fields should be present in the layer referenced by 'QueryLayerId' specified under section 'SearchSettings'
            // DisplayText: Caption to be displayed instead of field alias names. Set this to empty string ("") if you wish to display field alias names as captions.
            // FieldName: Field used for displaying the value
            InfowindowSettings: [{
                Title: "EconomicDevelopment",
                QueryLayerId: "1",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Value:",
                    FieldName: "${value}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "4",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "7",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }, {
                    DisplayText: "Value ",
                    FieldName: "${value}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "9",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "Value :",
                    FieldName: "${value}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "10",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "25",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }, {
                    DisplayText: "Tax Rate:",
                    FieldName: "${value}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "29",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }, {
                    DisplayText: "Value:",
                    FieldName: "${value}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "32",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "34",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "35",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "36",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "37",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "38",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "39",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "40",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "41",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "42",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "43",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "44",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "45",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "46",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "47",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "48",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }, {
                    DisplayText: "Header Image URL:",
                    FieldName: "${headerimage}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "56",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "58",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Image URL:",
                    FieldName: "${image}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "59",
                InfoWindowHeaderField: "${MUNICIPALI}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }]
        }, {
            Name: "WORK",
            SplashscreenImage: "js/library/themes/images/work-img.png",
            ThemeColor: "js/library/themes/styles/greenTheme.css",
            WebMapId: "6bae0ff12ae64291a9a5903aab8d3537",
            FeatureHighlightColor: "#1C86EE",
            OperationalLayers: [{
                ServiceURL: " http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/5",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/14",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/17",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/18",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/19",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/20",
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
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/29",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/30",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/56",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/58",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/59",
                LoadAsServiceType: "dynamic"
            }],

            SearchSettings: [{
                Title: "FederalFacilities",
                QueryLayerId: "5",
                SearchDisplayTitle: " Federal Facilities",
                SearchDisplayFields: "${Agency} / ${City}/Phone: ${Telephone}",
                SearchExpression: "UPPER(Agency) LIKE UPPER('${0}%') OR UPPER(City) LIKE UPPER('${0}%') OR UPPER(County) LIKE UPPER('${0}%')"
            }, {
                Title: "Unemployment",
                QueryLayerId: "14",
                SearchDisplayTitle: "Unemployment",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "ResearchParks",
                QueryLayerId: "17",
                SearchDisplayTitle: "Research Parks",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "Incubators",
                QueryLayerId: "18",
                SearchDisplayTitle: "Incubators",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "TopMilitaryEmployers",
                QueryLayerId: "19",
                SearchDisplayTitle: "Top Military Employers",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "TopBioscienceEmployers",
                QueryLayerId: "20",
                SearchDisplayTitle: "Top Bioscience Employers",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "TopBioscienceEmployers",
                QueryLayerId: "20",
                SearchDisplayTitle: "Top Bioscience Employers",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "TopPrivatelyHeldEmployers",
                QueryLayerId: "21",
                SearchDisplayTitle: "Top Privately Held Employers",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "FastestGrowingCompanies",
                QueryLayerId: "22",
                SearchDisplayTitle: "Fastest Growing Companies",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "LaborForce",
                QueryLayerId: "29",
                SearchDisplayTitle: "Labor Force",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Employment",
                QueryLayerId: "30",
                SearchDisplayTitle: "Employment",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "MassTransitStations",
                QueryLayerId: "56",
                SearchDisplayTitle: " Mass TransitStations",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "Airports",
                QueryLayerId: "58",
                SearchDisplayTitle: "Airports",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "Municipalities",
                QueryLayerId: "59",
                SearchDisplayTitle: "Municipalities",
                SearchDisplayFields: "${MUNICIPALI}, County:${COUNTY}",
                SearchExpression: "UPPER(municipali) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }],

            InfowindowSettings: [{
                Title: "EconomicDevelopment",
                QueryLayerId: "5",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Address1 :",
                    FieldName: "${Address1}"
                }, {
                    DisplayText: "Address2:",
                    FieldName: "${Address2}"
                }, {
                    DisplayText: "Telephone:",
                    FieldName: "${Telephone}"
                }, {
                    DisplayText: "Agency:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Website :",
                    FieldName: "${Website }"
                }, {
                    DisplayText: "Name:",
                    FieldName: "${Name}"
                }, {
                    DisplayText: "USProcurement2009:",
                    FieldName: "${USProcurement2009}"
                }, {
                    DisplayText: "MDProcurement2009 :",
                    FieldName: "${MDProcurement2009}"
                }, {
                    DisplayText: "USProcurement2010 :",
                    FieldName: "${USProcurement2010}"
                }, {
                    DisplayText: "MDProcurement2010 :",
                    FieldName: "${MDProcurement2010 }"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "14",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
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
                    DisplayText: "Organization Name:",
                    FieldName: "${orgname}"
                }, {
                    DisplayText: "Value:",
                    FieldName: "${value}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "17",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "Image URL:",
                    FieldName: "${image}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "18",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "19",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
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
                    DisplayText: "Organization Name:",
                    FieldName: "${orgname}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "20",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "20",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "21",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
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
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "22",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "29",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }, {
                    DisplayText: "Value:",
                    FieldName: "${value}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "30",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Value:",
                    FieldName: "${value}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "56",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "58",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Image URL:",
                    FieldName: "${image}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "59",
                InfoWindowHeaderField: "${MUNICIPALI}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }]
        }, {
            Name: "LOCATE",
            SplashscreenImage: "js/library/themes/images/locate-img.png",
            ThemeColor: "js/library/themes/styles/purpleTheme.css",
            WebMapId: "60a6d49d15db41ec8a6839543d9e8219",
            FeatureHighlightColor: "#1C86EE",
            OperationalLayers: [{
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/4",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/5",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/7",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/9",
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
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/19",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/20",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/27",
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
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/26",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/29",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/30",
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
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/57",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/58",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/59",
                LoadAsServiceType: "dynamic"
            }],

            SearchSettings: [{
                Title: "HospitalsAndHealthcareFacilities",
                QueryLayerId: "4",
                SearchDisplayTitle: "Hospitals And Healthcare Facilities ",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "FederalFacilities",
                QueryLayerId: "5",
                SearchDisplayTitle: " Federal Facilities",
                SearchDisplayFields: "${Agency} / ${City}/Phone: ${Telephone}",
                SearchExpression: "UPPER(Agency) LIKE UPPER('${0}%') OR UPPER(City) LIKE UPPER('${0}%') OR UPPER(County) LIKE UPPER('${0}%')"
            }, {
                Title: "Population",
                QueryLayerId: "7",
                SearchDisplayTitle: "Population",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "MedianHouseholdIncome",
                QueryLayerId: "9",
                SearchDisplayTitle: "Median Household Income",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "PerCaptiaPersonalIncome",
                QueryLayerId: "11",
                SearchDisplayTitle: "Per Captia Personal Income",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "BachelorsDegreeAttainment",
                QueryLayerId: "12",
                SearchDisplayTitle: "Bachelors Degree Attainment",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "HighSchoolAttainment",
                QueryLayerId: "13",
                SearchDisplayTitle: "High School Attainment",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Unemployment",
                QueryLayerId: "14",
                SearchDisplayTitle: "Unemployment",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "ForeignTradeZones",
                QueryLayerId: "16",
                SearchDisplayTitle: "Foreign Trade Zones",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "ResearchParks",
                QueryLayerId: "17",
                SearchDisplayTitle: "Research Parks",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "Incubators",
                QueryLayerId: "18",
                SearchDisplayTitle: "Incubators",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "TopMilitaryEmployers",
                QueryLayerId: "19",
                SearchDisplayTitle: "Top Military Employers",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "TopBioscienceEmployers",
                QueryLayerId: "20",
                SearchDisplayTitle: "Top Bioscience Employers",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "RealPropertyTaxRate",
                QueryLayerId: "27",
                SearchDisplayTitle: "Real Property Tax Rate",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "TopBioscienceEmployers",
                QueryLayerId: "20",
                SearchDisplayTitle: "Top Bioscience Employers",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "TopPrivatelyHeldEmployers",
                QueryLayerId: "21",
                SearchDisplayTitle: "Top Privately Held Employers",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "FastestGrowingCompanies",
                QueryLayerId: "22",
                SearchDisplayTitle: "Fastest Growing Companies",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "BusinessPersonalPropertyTaxRate",
                QueryLayerId: "26",
                SearchDisplayTitle: "Business Personal Property Tax Rate",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "LaborForce",
                QueryLayerId: "29",
                SearchDisplayTitle: "Labor Force",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Employment",
                QueryLayerId: "30",
                SearchDisplayTitle: "Employment",
                SearchDisplayFields: "${sitename} / ${value}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%')n OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "HigherEducationFourYearIndependent",
                QueryLayerId: "50",
                SearchDisplayTitle: "Higher Edu 4-Year Independent",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "HigherEducationFourYearPublic",
                QueryLayerId: "51",
                SearchDisplayTitle: "Higher Edu 4-Year Public",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "HigherEducationTwoYearIndependent",
                QueryLayerId: "52",
                SearchDisplayTitle: "Higher Edu 2-Year Independent",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "HigherEducationRegionalEducationCenter",
                QueryLayerId: "53",
                SearchDisplayTitle: "Higher Edu Regional Edu Center",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Higher Education TwoYearPublic",
                QueryLayerId: "54",
                SearchDisplayTitle: "Higher Edu 2-Year Public",
                SearchDisplayFields: "${sitename}, ${city}, Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "MassTransitStations",
                QueryLayerId: "56",
                SearchDisplayTitle: "Mass Transit Stations",
                SearchDisplayFields: "${sitename}, ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "SeaPorts",
                QueryLayerId: "57",
                SearchDisplayTitle: " Sea Ports",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                Title: "Airports",
                QueryLayerId: "58",
                SearchDisplayTitle: "Airports",
                SearchDisplayFields: "${sitename} / ${city}/ Phone: ${phonenumber}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%') OR UPPER(orgname) LIKE UPPER('${0}')"
            }, {
                Title: "Municipalities",
                QueryLayerId: "59",
                SearchDisplayTitle: "Municipalities",
                SearchDisplayFields: "${MUNICIPALI}, County:${COUNTY}",
                SearchExpression: "UPPER(municipali) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }],

            InfowindowSettings: [{
                Title: "EconomicDevelopment",
                QueryLayerId: "4",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "5",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Address1 :",
                    FieldName: "${Address1}"
                }, {
                    DisplayText: "Address2:",
                    FieldName: "${Address2}"
                }, {
                    DisplayText: "Telephone:",
                    FieldName: "${Telephone}"
                }, {
                    DisplayText: "Agency:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Website :",
                    FieldName: "${Website }"
                }, {
                    DisplayText: "Name:",
                    FieldName: "${Name}"
                }, {
                    DisplayText: "USProcurement2009:",
                    FieldName: "${USProcurement2009}"
                }, {
                    DisplayText: "MDProcurement2009 :",
                    FieldName: "${MDProcurement2009}"
                }, {
                    DisplayText: "USProcurement2010 :",
                    FieldName: "${USProcurement2010}"
                }, {
                    DisplayText: "MDProcurement2010 :",
                    FieldName: "${MDProcurement2010 }"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "7",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "Value:",
                    FieldName: "${value}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "9",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "Value :",
                    FieldName: "${value}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "11",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "12",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "13",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "14",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "16",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "17",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "18",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "19",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
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
                    DisplayText: "Organization Name:",
                    FieldName: "${orgname}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "20",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "27",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "20",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${phonenumber}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "21",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${sitedesc}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
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
                    DisplayText: "Street Address:",
                    FieldName: "${streetaddress}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "22",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "Website URL:",
                    FieldName: "${website}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "26",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "29",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "30",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "50",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "51",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "52",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "53",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "54",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
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
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "56",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "57",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "58",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Description:",
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
                    DisplayText: "More Information:",
                    FieldName: "${more_info}"
                }]
            }, {
                Title: "EconomicDevelopment",
                QueryLayerId: "59",
                InfoWindowHeaderField: "${MUNICIPALI}",
                ShowAllFields: "false",
                InfoWindowData: [{
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
                }]
            }]
        }],

        // ------------------------------------------------------------------------------------------------------------------------
        // Customize LAYER REFRESH INTERVAL
        // ------------------------------------------------------------------------------------------------------------------------
        // Time interval to refresh all layers on map
        LayersRefreshInterval: 5, // in minutes

        // ------------------------------------------------------------------------------------------------------------------------
        // ADDRESS SEARCH SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set locator settings such as locator symbol, size, display fields, match score
        // LocatorParameters: Parameters(text, outFields, maxLocations, bbox, outSR) used for address and location search.
        // AddressSearch: Candidates based on which the address search will be performed.
        // AddressMatchScore: Setting the minimum score for filtering the candidate results.
        // MaxResults: Maximum number of locations to display in the results menu.
        LocatorSettings: {
            DefaultLocatorSymbol: "/js/library/themes/images/redpushpin.png",
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
            FilterFieldValues: ["StreetAddress", "StreetName", "PointAddress", "POI", "POSTAL"],
            MaxResults: 200
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // TASK SERVICE URL
        // ------------------------------------------------------------------------------------------------------------------------
        // TaskService: Services used for route task.
        TaskService: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",

        // ------------------------------------------------------------------------------------------------------------------------
        // DRIVE TIME SYMBOLOGY SETTING
        // ------------------------------------------------------------------------------------------------------------------------
        // DriveTimePolygonSymbology: It shows symbology for polygon.
        // FillSymbolColor: It shows symbol color for feature.
        // FillSymbolTransparency: It shows transparency for symbol.
        // LineSymbolColor: It shows symbol color for line feature.
        // LineSymbolTransparency: it shows transparency for line.

        DriveTimePolygonSymbology: {
            FillSymbolColor: "0,0,255",
            FillSymbolTransparency: "0.10",
            LineSymbolColor: "0,0,255",
            LineSymbolTransparency: "0.30"
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // SETTINGS FOR MAP SHARING
        // ------------------------------------------------------------------------------------------------------------------------
        // Set URL for TinyURL service, and URLs for social media
        // MapSharingOptions: Allow user to share map using social media.
        // TinyURLServiceURL: Set URL for TinyURL service.
        // TinyURLResponseAttribute: Set URL for TinyURL service.
        // FacebookShareURL:  Allow user to share application using facebook.
        // TwitterShareURL:  Allow user to share application using twitter.
        // ShareByMailLink:  Allow user to share application using mail.

        MapSharingOptions: {
            TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
            TinyURLResponseAttribute: "data.url",
            FacebookShareURL: "http://www.facebook.com/sharer.php?u=${0}&t=Live%20Work%20Locate",
            TwitterShareURL: "http://mobile.twitter.com/compose/tweet?status=Live%20Work%20Locate ${0}",
            ShareByMailLink: "mailto:%20?subject=Check%20out%20this%20map!&body=${0}"
        }
    };
});
