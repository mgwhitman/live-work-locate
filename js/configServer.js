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
        // 8.  Set setting for base maps gallery             - [ Tag(s) to look for: BaseMapLayers ]
        // 9.  Geometry service setting                      - [ Tag(s) to look for: GeometryService ]
        // 10. RouteTask setting                             - [ Tag(s) to look for: RouteTask ]
        // 11. ServiceAreaTask setting                       - [ Tag(s) to look for: ServiceAreaTask ]
        // 12. set proxy url                                 - [ Tag(s) to look for: ProxyUrl ]
        // 13. Customize zoom level for address search       - [ Tag(s) to look for: ZoomLevel ]
        // 14. Customize InfoPopupHeight                     - [ Tag(s) to look for: InfoPopupHeight ]
        // 15. Customize InfoPopupWidth                      - [ Tag(s) to look for: InfoPopupWidth ]
        // 16. Specify ShowNullValueAs                       - [ Tag(s) to look for: ShowNullValueAs ]
        // 17. Customize DriveTimeSliderSettings             - [ Tag(s) to look for: DriveTimeSliderSettings ]
        // 18. set Legend visibility                         - [ Tag(s) to look for: ShowLegend ]
        // 19. Customize  DefaultExtent                      - [ Tag(s) to look for: DefaultExtent]
        // 20. Customize  Workflow                           - [ Tag(s) to look for: Workflow]
        // 21. Set URL for LocatorSettings                   - [ Tag(s) to look for: LocatorSettings ]
        // 22. Customize  DriveTimePolygonSymbology          - [ Tag(s) to look for: DriveTimePolygonSymbology ]
        // 23. Specify URLs for map sharing                  - [ Tag(s) to look for: MapSharingOptions,TinyURLServiceURL, TinyURLResponseAttribute, FacebookShareURL, TwitterShareURL, ShareByMailLink ]

        // ------------------------------------------------------------------------------------------------------------------------
        // GENERAL SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set application title
        ApplicationName: "Choose Maryland",
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
            IsVisible: true,
            SplashScreenContent: "Please select an app to continue"
        },

        //-------------------------------------------------------------------------------------------------------------------
        // Header Widget Settings
        //-------------------------------------------------------------------------------------------------------------------
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

        //ExitButtonTooltip: Specify tooltip text for exit workflow button
        ExitButtonTooltip: "Exit",
        //DriveTimeButtonTooltip : Specify tooltip text for switch to drivetime button in distance slider
        DriveTimeButtonTooltip: "Drive Time",
        //WalkTimeButtonTooltip: Specify tooltip text for switch to walktime button in distance slider
        WalkTimeButtonTooltip: "Walk Time",
        //ExpandResultTooltip: Specify tooltip text for expand results button in results panel
        ExpandResultTooltip: "Expand Result",
        //CollapseResultTooltip: Specify tooltip text for collapse results button in results panel
        CollapseResultTooltip: "Collapse Result",
        //ResultsPanelTitleText: Specify label text for title of results panel
        ResultsPanelTitleText: "What's nearby?",
        //SwitchWorkflowsTooltip: Specify tooltip text for switch workflow buttons in header
        SwitchWorkflowsTooltip: "Click to switch workflows",

        // ------------------------------------------------------------------------------------------------------------------------
        // BASEMAP SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set options for basemap
        // Please note: All base-maps need to use the same spatial reference.

        // Specify URL to ArcGIS Portal REST API
        PortalAPIURL: "http://www.arcgis.com/sharing/rest/",
        // Specify the title of group that contains basemaps
        BasemapGroupTitle: "Basemaps",
        // Specify the user name of owner of the group that contains basemaps
        BasemapGroupOwner: "GISITAdmin",
        // Specify spatial reference for basemaps, since all basemaps need to use the same spatial reference
        BasemapSpatialReferenceWKID: 102100,
        // Specify path to image used to display the thumbnail for a basemap when portal does not provide it
        NoThumbnail: "js/library/themes/images/not-available.png",


        // ------------------------------------------------------------------------------------------------------------------------
        // GEOMETRY SERVICE SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------

        // Set geometry service URL
        GeometryService: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",

        // ------------------------------------------------------------------------------------------------------------------------
        //  ROUTE TASK SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set route task service URL
        RouteTask: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",

        // ------------------------------------------------------------------------------------------------------------------------
        //  SERVICE SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Set Service Area Task  URL
        ServiceAreaTask: "http://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World",

        // Set proxy url
        ProxyUrl: "/proxy/proxy.ashx",

        // Following zoom level will be set for the map upon searching an address
        ZoomLevel: 12,

        //minimum height should be 250 for the info-popup in pixels
        InfoPopupHeight: 250,

        // Minimum width should be 300 for the info-popup in pixels
        InfoPopupWidth: 300,

        // Set string value to be shown for null or blank values
        ShowNullValueAs: "N/A",

        // ------------------------------------------------------------------------------------------------------------------------
        // DRIVE TIME SLIDER SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Specify drive/walk time slider settings
        // Possible Values for defaultMinutes should be between 0 to 60 and should be greater than minMinute and less than maxMinute
        // Possible Values for minMinute should be between 0 to 60 and less than maxMinute
        // Possible Values for maxMinute should be between 0 to 60 and greater than minMinute
        // Possible Values for discreteValues should be appropriate

        DriveTimeSliderSettings: {
            defaultMinutes: 10,
            minMinutes: 5,
            maxMinutes: 60,
            discreteValues: 12
        },

        //set legend panel visibility
        ShowLegend: true,

        // Initial map extent. Use comma (,) to separate values and dont delete the last comma
        // The coordinates must be specified in the basemap's coordinate system, usually WKID:102100, unless a custom basemap is used
        DefaultExtent: "-9412951.815477943,4480918.013545, -7742344.125277582,5077738.330395495",

        // ------------------------------------------------------------------------------------------------------------------------
        // WORKFLOW SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------
        // Configure workflows

        // Name: Specify the workflow name. Workflow names have to be unique. It is displayed in the application header panel and splashscreen.
        // SplashscreenImage: Set image to be displayed in splashscreen for this workflow
        // ThemeColor: Set theme color
        // WebMapId: Choose if you want to use WebMap or Map Services for operational layers.
        // If using WebMap, specify WebMapId within quotes, otherwise leave this empty and configure operational layers
        // BgColor: Background color of workflow thumbnail in splashscreen
        // FeatureHighlightColor: To highlight selected polygon feature on map, when selected from proximity results
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
            Visible: true,
            SplashscreenImage: "js/library/themes/images/live-img.png",
            ThemeColor: "js/library/themes/styles/blueTheme.css",
            WebMapId: "",
            BgColor: "#007ac2",
            FeatureHighlightColor: "#1C86EE",
            OperationalLayers: [{
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/0",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/1",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/2",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/3",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/4",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/5",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/6",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/7",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/8",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/9",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/10",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/11",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/12",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/13",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Live/MapServer/14",
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
                UnifiedSearch: "true",
                Title: "ArtsAndCulturalCenters",
                QueryLayerId: "0",
                SearchDisplayTitle: "Art and Cultural Centers",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "MusicVenues",
                QueryLayerId: "1",
                SearchDisplayTitle: "Music Venues",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "OrchardsFarmMarkets",
                QueryLayerId: "2",
                SearchDisplayTitle: "Orchard Markets",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "FarmersMarkets",
                QueryLayerId: "3",
                SearchDisplayTitle: "Farmer's Markets",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "PickYourOwnProduce",
                QueryLayerId: "4",
                SearchDisplayTitle: "Pick Your Own Produce",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "ChildrensActivities",
                QueryLayerId: "5",
                SearchDisplayTitle: "Activities for Children",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(ZIP) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Wineries",
                QueryLayerId: "6",
                SearchDisplayTitle: "Wineries",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "HistoricalandCulturalMuseums",
                QueryLayerId: "7",
                SearchDisplayTitle: "Historical and Cultural Museums",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "ArtGalleries",
                QueryLayerId: "8",
                SearchDisplayTitle: "Art Galleries",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "MassTransitStations",
                QueryLayerId: "9",
                SearchDisplayTitle: "Mass Transit Stations",
                SearchDisplayFields: "${SITENAME}, ${CITY}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Airports",
                QueryLayerId: "10",
                SearchDisplayTitle: "Airports",
                SearchDisplayFields: "${SITENAME} / ${CITY}/ Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%') OR UPPER(ORGNAME) LIKE UPPER('${0}')"
            }, {
                UnifiedSearch: "true",
                Title: "StateAndNationalParks",
                QueryLayerId: "11",
                SearchDisplayTitle: "State and National Parks",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "HospitalsAndHealthcareFacilities",
                QueryLayerId: "12",
                SearchDisplayTitle: "Hospitals and Healthcare Facilities ",
                SearchDisplayFields: "${SITENAME} / ${CITY}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(ORGNAME) LIKE UPPER('${0}')"
            }, {
                UnifiedSearch: "true",
                Title: "PersonalIncomeTaxRate",
                QueryLayerId: "13",
                SearchDisplayTitle: "Personal Income Tax Rate",
                SearchDisplayFields: "${SITENAME} / ${TAXRTE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "MedianSalePriceofaHome",
                QueryLayerId: "14",
                SearchDisplayTitle: "Home Median Sale Price",
                SearchDisplayFields: "${SITENAME} / ${MEDSALEPC}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }],
            // ------------------------------------------------------------------------------------------------------------------------
            // INFOWINDOW SETTING FOR THIS WORKFLOW
            // ------------------------------------------------------------------------------------------------------------------------
            // InfoWindowData: Set the content to be displayed in the info-Popup. Define labels and field values.
            // These fields should be present in the layer referenced by 'QueryLayerId' specified under section 'SearchSettings'
            // DisplayText: Caption to be displayed instead of field alias names. Set this to empty string ("") if you wish to display field alias names as captions.
            // FieldName: Field used for displaying the value
            InfowindowSettings: [{
                Title: "Live",
                QueryLayerId: "0",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "1",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "2",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "3",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "4",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "5",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "6",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "7",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${ORGNAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "8",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "9",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${ORGNAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "10",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${ORGNAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${CONTACTPHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "11",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "Secondary Address:",
                    FieldName: "${SUITENUM}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "12",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${ORGNAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "More Info Link URL:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "13",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Tax Rate:",
                    FieldName: "${TAXRTE}"
                }]
            }, {
                Title: "Live",
                QueryLayerId: "14",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Median Home Sale Price:",
                    FieldName: "${MEDSALEPC}"
                }]
            }]
        }, {
            Name: "WORK",
            Visible: true,
            SplashscreenImage: "js/library/themes/images/work-img.png",
            ThemeColor: "js/library/themes/styles/greenTheme.css",
            WebMapId: "",
            BgColor: "#028D6A",
            FeatureHighlightColor: "#1C86EE",
            OperationalLayers: [{
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/0",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/1",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/2",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/3",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/4",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/5",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/6",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/7",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/8",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/9",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Work/MapServer/10",
                LoadAsServiceType: "dynamic"
            }],

            SearchSettings: [{
                UnifiedSearch: "true",
                Title: "Top Bioscience Employers",
                QueryLayerId: "0",
                SearchDisplayTitle: "Top Bioscience Employers",
                SearchDisplayFields: "${SITENAME}/ ${CITY} / ${NOJOBS}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Top Company Headquarters",
                QueryLayerId: "1",
                SearchDisplayTitle: "Top Company Headquarters",
                SearchDisplayFields: "${SITENAME} / ${CITY}/ ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "HigherEducationFourYearPublic",
                QueryLayerId: "2",
                SearchDisplayTitle: "Higher Ed 4-Year Public",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Mass Transit Stations",
                QueryLayerId: "3",
                SearchDisplayTitle: "Mass Transit Stations",
                SearchDisplayFields: "${SITENAME} / ${CITY} / ${TRANSITNM}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(TRANSITNM) LIKE UPPER('${0}')"
            }, {
                UnifiedSearch: "true",
                Title: "Airports",
                QueryLayerId: "4",
                SearchDisplayTitle: "Airports",
                SearchDisplayFields: "${SITENAME} / ${CITY}/ ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%') OR UPPER(ORGNAME) LIKE UPPER('${0}')"
            }, {
                UnifiedSearch: "true",
                Title: "Research Parks",
                QueryLayerId: "5",
                SearchDisplayTitle: "Research Parks",
                SearchDisplayFields: "${SITENAME} / ${CITY}/ ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Incubators",
                QueryLayerId: "6",
                SearchDisplayTitle: "Incubators",
                SearchDisplayFields: "${SITENAME} / ${CITY}/ ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Labor Force",
                QueryLayerId: "7",
                SearchDisplayTitle: "Labor Force",
                SearchDisplayFields: "${SITENAME} / ${LABORVALUE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Median Household Income",
                QueryLayerId: "8",
                SearchDisplayTitle: "Median Household Income",
                SearchDisplayFields: "${SITENAME} / ${COUNTY} / ${MEDHOUSINCOME}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "PerCapita Personal Income",
                QueryLayerId: "9",
                SearchDisplayTitle: "Per Capita Personal Income",
                SearchDisplayFields: "${sitename} / ${PERCAPIN}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Unemployment",
                QueryLayerId: "10",
                SearchDisplayTitle: "Unemployment",
                SearchDisplayFields: "${SITENAME} / ${NOJOBS}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }],

            InfowindowSettings: [{
                Title: "Work",
                QueryLayerId: "0",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "1",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "2",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }, {
                    DisplayText: "Enrollment Numbers:",
                    FieldName: "${ENROLLMENT}"
                }, {
                    DisplayText: "Grades Supported/Degrees Awarded:",
                    FieldName: "${GRDDEGREE}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "3",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${ORGNAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Additional Info:",
                    FieldName: "${INFO}"
                }, {
                    DisplayText: "Transit Name:",
                    FieldName: "${TRANSITNM}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "4",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "5",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "6",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "7",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "URL:",
                    FieldName: "${INFO}"
                }, {
                    DisplayText: "Labor Value:",
                    FieldName: "${LABORVALUE}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "8",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }, {
                    DisplayText: "Medium Household Income :",
                    FieldName: "${MEDHOUSINCOME}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "9",
                InfoWindowHeaderField: "${sitename}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${sitename}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${orgname}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Per Capita Income:",
                    FieldName: "${PERCAPIN}"
                }]
            }, {
                Title: "Work",
                QueryLayerId: "10",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Unemployment Rate:",
                    FieldName: "${NOJOBS}"
                }]
            }]
        }, {
            Name: "LOCATE",
            Visible: true,
            SplashscreenImage: "js/library/themes/images/locate-img.png",
            ThemeColor: "js/library/themes/styles/orangeTheme.css",
            WebMapId: "",
            BgColor: "#5C2E6F",
            FeatureHighlightColor: "#1C86EE",
            OperationalLayers: [{
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/0",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/1",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/2",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/3",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/4",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/5",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/6",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/7",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/8",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/9",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/10",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/11",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/12",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/13",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/14",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/15",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/16",
                LoadAsServiceType: "dynamic"
            }, {
                ServiceURL: "http://arcgis-gov-1244222493.us-west-2.elb.amazonaws.com/arcgis/rest/services/Locate/MapServer/17",
                LoadAsServiceType: "dynamic"
            }],

            SearchSettings: [{
                UnifiedSearch: "true",
                Title: "Top Bioscience Employers",
                QueryLayerId: "0",
                SearchDisplayTitle: "Top Bioscience Employers",
                SearchDisplayFields: "${SITENAME}/ ${CITY} / ${NOJOBS}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "ResearchParks",
                QueryLayerId: "1",
                SearchDisplayTitle: "Research Parks",
                SearchDisplayFields: "${SITENAME} / ${CITY}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Incubators",
                QueryLayerId: "2",
                SearchDisplayTitle: "Incubators",
                SearchDisplayFields: "${SITENAME} / ${CITY}/ Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "TopCompanyHeadquarters",
                QueryLayerId: "3",
                SearchDisplayTitle: "Top Company Headquarters",
                SearchDisplayFields: "${SITENAME} / ${CITY}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "HigherEducationFourYearIndependent ",
                QueryLayerId: "4",
                SearchDisplayTitle: "Higher Ed 4-Year Independent",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "HigherEducationFourYearPublic",
                QueryLayerId: "5",
                SearchDisplayTitle: "Higher Ed 4-Year Public",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "HigherEducationRegionalEducationCenter",
                QueryLayerId: "6",
                SearchDisplayTitle: "Higher Ed. Regional Ed. Center",
                SearchDisplayFields: "${SITENAME}, ${CITY}, Phone: ${PHONE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "MassTransitStations",
                QueryLayerId: "7",
                SearchDisplayTitle: "Mass Transit Stations",
                SearchDisplayFields: "${SITENAME}, ${CITY}, ${TRANSITNM}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Seaports",
                QueryLayerId: "8",
                SearchDisplayTitle: " Sea Ports",
                SearchDisplayFields: "${SITENAME} / ${CITY}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Airports",
                QueryLayerId: "9",
                SearchDisplayTitle: "Airports",
                SearchDisplayFields: "${SITENAME} / ${CITY}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(CITY) LIKE UPPER('${0}%') OR UPPER(COUNTY)"
            }, {
                UnifiedSearch: "true",
                Title: "LaborForce",
                QueryLayerId: "10",
                SearchDisplayTitle: "Labor Force",
                SearchDisplayFields: "${SITENAME} / ${LABORVALUE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "Employment",
                QueryLayerId: "11",
                SearchDisplayTitle: "Employment",
                SearchDisplayFields: "${SITENAME} / ${COUNTY} / ${NOJOBS}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "BachelorsDegreeAttainment",
                QueryLayerId: "12",
                SearchDisplayTitle: "Bachelors Degree Attainment",
                SearchDisplayFields: "${SITENAME} / ${BACHATTRATE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "HighSchoolAttainment",
                QueryLayerId: "13",
                SearchDisplayTitle: "High School Attainment",
                SearchDisplayFields: "${SITENAME} / ${COUNTY}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "BusinessPersonalPropertyTaxRate",
                QueryLayerId: "14",
                SearchDisplayTitle: "Business Personal Property Tax Rate",
                SearchDisplayFields: "${SITENAME} / ${COUNTY} / ${NOJOBS}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "RealPropertyTaxRate",
                QueryLayerId: "15",
                SearchDisplayTitle: "Property Tax Rate",
                SearchDisplayFields: "${SITENAME} / ${PROPTAXRT}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "BachelorsDegreeAttainment",
                QueryLayerId: "16",
                SearchDisplayTitle: "Bachelors Degree Attainment",
                SearchDisplayFields: "${SITENAME} / ${BACHATTRATE}",
                SearchExpression: "UPPER(SITENAME) LIKE UPPER('${0}%') OR UPPER(COUNTY) LIKE UPPER('${0}%')"
            }, {
                UnifiedSearch: "true",
                Title: "ForeignTradeZones",
                QueryLayerId: "17",
                SearchDisplayTitle: "Foreign Trade Zones",
                SearchDisplayFields: "${sitename} / ${city}",
                SearchExpression: "UPPER(sitename) LIKE UPPER('${0}%') OR UPPER(city) LIKE UPPER('${0}%') OR UPPER(county) LIKE UPPER('${0}%')"
            }],

            InfowindowSettings: [{
                Title: "Locate",
                QueryLayerId: "0",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "1",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${ORGNAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "2",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "3",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "4",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Enrollment Numbers:",
                    FieldName: "${ENROLLMENT}"
                }, {
                    DisplayText: "Grades Supported/Degrees Awarded:",
                    FieldName: "${GRDDEGREE}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "5",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }, {
                    DisplayText: "Enrollment Numbers:",
                    FieldName: "${ENROLLMENT}"
                }, {
                    DisplayText: "Grades Supported/Degrees Awarded:",
                    FieldName: "${GRDDEGREE}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "6",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "Enrollment Numbers:",
                    FieldName: "${ENROLLMENT}"
                }, {
                    DisplayText: "Grades Supported/Degrees Awarded:",
                    FieldName: "${GRDDEGREE}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "7",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${ORGNAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Additional Info:",
                    FieldName: "${INFO}"
                }, {
                    DisplayText: "Transit Name:",
                    FieldName: "${TRANSITNM}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "8",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "9",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "10",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "URL:",
                    FieldName: "${INFO}"
                }, {
                    DisplayText: "Labor Value:",
                    FieldName: "${LABORVALUE}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "11",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Organization Name:",
                    FieldName: "${ORGNAME}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Number of Jobs:",
                    FieldName: "${NOJOBS}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "12",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Bachelor Degree Attainment:",
                    FieldName: "${BACHATTRATE}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "13",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "14",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "Street Address:",
                    FieldName: "${ADDRESS}"
                }, {
                    DisplayText: "City:",
                    FieldName: "${CITY}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${ZIP}"
                }, {
                    DisplayText: "Phone:",
                    FieldName: "${PHONE}"
                }, {
                    DisplayText: "Website URL:",
                    FieldName: "${URL}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "15",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "Description:",
                    FieldName: "${SITEDESC}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Property Tax Rate:",
                    FieldName: "${PROPTAXRT}"
                }]
            }, {
                Title: "Locate",
                QueryLayerId: "16",
                InfoWindowHeaderField: "${SITENAME}",
                ShowAllFields: "false",
                InfoWindowData: [{
                    DisplayText: "Name:",
                    FieldName: "${SITENAME}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${COUNTY}"
                }, {
                    DisplayText: "Bachelor Degree Attainment:",
                    FieldName: "${BACHATTRATE}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }, {
                Title: "Locate",
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
                    DisplayText: "City:",
                    FieldName: "${city}"
                }, {
                    DisplayText: "County:",
                    FieldName: "${county}"
                }, {
                    DisplayText: "Zip Code:",
                    FieldName: "${zip}"
                }, {
                    DisplayText: "More Information:",
                    FieldName: "${INFO}"
                }]
            }]
        }],

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
        // DRIVE TIME SYMBOLOGY SETTING
        // ------------------------------------------------------------------------------------------------------------------------
        // DriveTimePolygonSymbology: It shows symbology for polygon.
        // FillSymbolColor: It shows symbol color for feature.
        // FillSymbolTransparency: It shows transparency for symbol.
        // LineSymbolColor: It shows symbol color for line feature.
        // LineSymbolTransparency: it shows transparency for line.

        DriveTimePolygonSymbology: {
            FillSymbolColor: "255,255,102",
            FillSymbolTransparency: "0.4",
            LineSymbolColor: "255,255,102",
            LineSymbolTransparency: "1"
        },

        // ------------------------------------------------------------------------------------------------------------------------
        // SETTINGS FOR MAP SHARING
        // ------------------------------------------------------------------------------------------------------------------------
        // Set URL for TinyURL service, and URLs for social media
        // MapSharingOptions: Allow user to share map using social media.
        // TinyURLServiceURL: Set URL for TinyURL service.
        // FacebookShareURL:  Allow user to share application using facebook.
        // TwitterShareURL:  Allow user to share application using twitter.
        // ShareByMailLink:  Allow user to share application using mail.

        MapSharingOptions: {
            TinyURLServiceURL: "https://api-ssl.bitly.com/v3/shorten?longUrl=${0}",
            FacebookShareURL: "http://www.facebook.com/sharer.php?u=${0}&t=Live%20Work%20Locate",
            TwitterShareURL: "http://mobile.twitter.com/compose/tweet?status=Live%20Work%20Locate ${0}",
            ShareByMailLink: "mailto:%20?subject=Check%20out%20this%20map!&body=${0}"
        }
    };
});
