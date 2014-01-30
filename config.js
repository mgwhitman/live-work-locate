/*global dojo */
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
        ApplicationIcon: "",

        // Set application Favicon path
        ApplicationFavicon: "/themes/images/favicon.ico",

        // Set URL of help page/portal
        HelpURL: "help.htm",

        // Set application logo url
        LogoUrl: "",

        // Set splash window content - Message that appears when the application starts
        SplashScreen: {
            // splash screen Message is set in locale file in nls dirctory
            IsVisible: true
        },


        Workflows: {
            LIVE: {
                key: "LIVE",
                OperationalLayers: [
                    {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/37",
                        LoadAsServiceType: "feature",
                    },
                    {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/4",
                        LoadAsServiceType: "feature",
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/7",
                        LoadAsServiceType: "feature",
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/8",
                        LoadAsServiceType: "feature",

                    }
                ],
                ImageSrc: "themes/images/live-img.png"

            },
            WORK: {
                key: "WORK",
                OperationalLayers: [
                    {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/14",
                        LoadAsServiceType: "feature",
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/16",
                        LoadAsServiceType: "feature",
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/17",
                        LoadAsServiceType: "feature",
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/19",
                        LoadAsServiceType: "feature",

                    }
                ],
                ImageSrc: "themes/images/work-img.png"
            },
            LOCATE:
                  {
                      key: "LOCATE",
                      OperationalLayers: [
                    {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/3",
                        LoadAsServiceType: "feature",
                    },
                    {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/4",
                        LoadAsServiceType: "feature",
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/5",
                        LoadAsServiceType: "feature",
                    }, {
                        ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/7",
                        LoadAsServiceType: "feature",

                    }
                      ],
                      ImageSrc: "themes/images/locate-img.png"
                  },
            TRANSPORT:
             {
                 key: "TRANSPORT",
                 OperationalLayers: [{
                     ServiceURL: "http://50.18.115.76:6080/arcgis/rest/services/EconomicDevelopment/MapServer/51",
                     // DefaultExtent: "-1.1042906288434178E7, 6151915.419550791,-1.1042906288434178E7, 6151915.419550791, 102100  (3857)",
                     LoadAsServiceType: "feature"
                     //text: "TRANSPORT"
                 }],
                 ImageSrc: "themes/images/transport-img.png"
             }
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

        DefaultExtent: "-9412951.815477943,4480918.013545, -7742344.125277582,5077738.330395495",

        // Choose if you want to use WebMap or Map Services for operational layers. If using WebMap, specify WebMapId within quotes, otherwise leave this empty and configure operational layers
        WebMapId: "",

        // OPERATIONAL DATA SETTINGS
        // ------------------------------------------------------------------------------------------------------------------------

        // Configure operational layers:

        // Configure operational layers  below. The order of displaying layers is reversed on map. The last configured layer is displayed on top.
        // ServiceURL: URL of the layer.
        // LoadAsServiceType: Field to specify if the operational layers should be added as dynamic map service layer or feature layer.
        //                    Supported service types are 'dynamic' or 'feature'.
        OperationalLayers: [{
            ServiceURL: "",
            LoadAsServiceType: ""
        }
        ],

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

        SearchAnd511Settings: [
		{
		    Title: "RoadConditions",
		    QueryLayerId: "0",
		    SearchDisplayTitle: "Width Height Restrictions - Workzones",
		    SearchDisplayFields: "${HwyDesc} / ${DelayDesc} / ${WidthRestriction} / ${HeightRestriction}",
		    SearchExpression: "UPPER(HwyName) LIKE UPPER('${0}%') OR UPPER(HwyDesc) LIKE UPPER('${0}%')",
		    BarrierLayer: "true",
		    BarrierSearchExpression: "(UPPER(TravelSpeeds) <> UPPER('NORMAL')) AND (ExpectedStartDate >= DATE '${0}' AND ExpectedEndDate <= DATE '${0}')",
		    InfoLayer: "true",
		    InfoSearchExpression: "",
		    InfoListText: "",
		    InfoDetailFields: "MaxHeight:${HwyDesc} MaxWidth:${WidthRestriction}"
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "1",
		    SearchDisplayTitle: "Severe Alerts",
		    SearchDisplayFields: "${HwyName} / ${ConditionDesc}",
		    SearchExpression: "UPPER(HwyName) LIKE UPPER('${0}%') OR UPPER(HwyDesc) LIKE UPPER('${0}%')",
		    BarrierLayer: "true",
		    BarrierSearchExpression: "(Active = 1) AND (EventStartDateTime >= DATE '${0}' AND EffectiveUntil <= DATE '${0}')",
		    InfoLayer: "true",
		    InfoSearchExpression: "",
		    InfoListText: "",
		    InfoDetailFields: "Hwy:${HwyName} / ${ConditionDesc}"
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "2",
		    SearchDisplayTitle: "Alerts",
		    SearchDisplayFields: "${HwyName} / ${ConditionDesc}",
		    SearchExpression: "UPPER(HwyName) LIKE UPPER('${0}%') OR UPPER(HwyDesc) LIKE UPPER('${0}%')",
		    BarrierLayer: "true",
		    BarrierSearchExpression: "(UPPER(MapIconID) <> UPPER('INFORMATIONAL-GREY')) AND (EventStartDateTime >= DATE '${0}' AND EffectiveUntil <= DATE '${0}')",
		    InfoLayer: "true",
		    InfoSearchExpression: "",
		    InfoListText: "",
		    InfoDetailFields: ""
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "3",
		    SearchDisplayTitle: "Video Cameras",
		    SearchDisplayFields: "${Description}",
		    SearchExpression: "UPPER(Description) LIKE UPPER('%${0}%')",
		    BarrierLayer: "false",
		    BarrierSearchExpression: "",
		    InfoLayer: "true",
		    InfoSearchExpression: "",
		    InfoListText: "",
		    InfoDetailFields: ""
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "4",
		    SearchDisplayTitle: "Cameras",
		    SearchDisplayFields: "${Description}",
		    SearchExpression: "UPPER(Description) LIKE UPPER('%${0}%')",
		    BarrierLayer: "false",
		    BarrierSearchExpression: "",
		    InfoLayer: "true",
		    InfoSearchExpression: "",
		    InfoListText: "",
		    InfoDetailFields: ""
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "5",
		    SearchDisplayTitle: "WorkZones-Point",
		    SearchDisplayFields: "${HwyName} / ${DelayDesc}",
		    SearchExpression: "UPPER(HwyName) LIKE UPPER('${0}%') OR UPPER(HwyDesc) LIKE UPPER('${0}%')",
		    BarrierLayer: "true",
		    BarrierSearchExpression: "(UPPER(Active) = UPPER('Active')) AND (ExpectedStartDate >= DATE '${0}' AND ExpectedEndDate <= DATE '${0}')",
		    InfoLayer: "true",
		    InfoSearchExpression: "UPPER(Active) = UPPER('active')",
		    InfoListText: "",
		    InfoDetailFields: "Hwy:${HwyName}"
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "6",
		    SearchDisplayTitle: "WorkZones-Line",
		    SearchDisplayFields: "${HwyName} / ${DelayDesc}",
		    SearchExpression: "UPPER(HwyName) LIKE UPPER('${0}%') OR UPPER(HwyDesc) LIKE UPPER('${0}%')",
		    BarrierLayer: "true",
		    BarrierSearchExpression: "(UPPER(Active) = UPPER('active')) AND (ExpectedStartDate >= DATE '${0}' AND ExpectedEndDate <= DATE '${0}')",
		    InfoLayer: "true",
		    InfoSearchExpression: "UPPER(Active) = UPPER('active')",
		    InfoListText: "",
		    InfoDetailFields: "Delay:${DelayDesc}"
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "7",
		    SearchDisplayTitle: "RoadConditions",
		    SearchDisplayFields: "${HwyName} / ${ConditionDesc}",
		    SearchExpression: "UPPER(HwyName) LIKE UPPER('${0}%') OR UPPER(HwyDesc) LIKE UPPER('${0}%')",
		    BarrierLayer: "true",
		    BarrierSearchExpression: "(UPPER(ConditionCategory ) <> UPPER('RedWhite')) AND (EffectiveUntil > DATE '${0}') ",
		    InfoLayer: "true",
		    InfoSearchExpression: "",
		    InfoListText: "",
		    InfoDetailFields: "Condition:${ConditionDesc}"
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "8",
		    SearchDisplayTitle: "WindSpeed",
		    SearchDisplayFields: "${place_name} / ${wind}",
		    SearchExpression: "UPPER(place_name) LIKE UPPER('${0}%')",
		    BarrierLayer: "true",
		    BarrierSearchExpression: "wind_speed > 20",
		    InfoLayer: "true",
		    InfoSearchExpression: "wind_speed > 20",
		    InfoListText: "",
		    InfoDetailFields: "${place_name} / Windspeed:${wind}"
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "9",
		    SearchDisplayTitle: "Load Restrictions",
		    SearchDisplayFields: "${HwyName} / ${HwyDesc}",
		    SearchExpression: "UPPER(HwyName) LIKE UPPER('${0}%') OR UPPER(HwyDesc) LIKE UPPER('${0}%')",
		    BarrierLayer: "true",
		    BarrierSearchExpression: "InEffect = 'Y'",
		    InfoLayer: "true",
		    InfoSearchExpression: "InEffect = 'Y'",
		    InfoListText: "Load Restrictions",
		    InfoDetailFields: "Code:${Restriction_Code} / Desc:${Restriction_Code_Desc}"
		}, {
		    Title: "RoadConditions",
		    QueryLayerId: "10",
		    SearchDisplayTitle: "State Routes",
		    SearchDisplayFields: "${HWY_CHAR} / ${DIRECTION}",
		    SearchExpression: "UPPER(HWY_CHAR) LIKE UPPER('${0}%') OR UPPER(HWY_DIR) LIKE UPPER('${0}%')",
		    BarrierLayer: "false",
		    BarrierSearchExpression: "",
		    InfoLayer: "false",
		    InfoSearchExpression: "",
		    InfoListText: "",
		    InfoDetailFields: ""
		}
        ],

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
            LocatorDefaultAddress: "Grandview Ln N, Bismarck, ND, 58503",
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

        BufferMetersForFindingBarriers: "2",

        BufferSymbology: {
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
        },

        /*Start of Horizontal Slider*/
        HorizontalSliderSettings: {
            value: 20,
            minimumValue: 5,
            maximumValue: 60,
            discreteValues: 12,
            intermediateChanges: false,
            showButtons: false
        },
        HorizontalRuleSettings: {
            container: "topDecoration",
            count: 12
        },
        /*End of Horizontal Slider*/
    }
});