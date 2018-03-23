/*global define*/
define([
    'Zearth/Core/defined',
    'Zearth/Core/defineProperties',
//    'Zearth/Core/defaultValue',
    'Zearth/Core/Event',
    'KnockoutES5',
    'Core/registerKnockoutBindings',
    'ViewModels/DistanceLegendViewModel',
    'ViewModels/NavigationViewModel'
], function (
        defined,
        defineProperties,
//    defaultValue,
        ZearthEvent,
        Knockout,
        registerKnockoutBindings,
        DistanceLegendViewModel,
        NavigationViewModel)
{
    'use strict';

    /**
     * @alias ZearthNavigation
     * @constructor
     *
     * @param {Viewer|ZearthWidget} viewerZearthWidget The Viewer or ZearthWidget instance
     */
    var ZearthNavigation = function (viewerZearthWidget) {
        initialize.apply(this, arguments);

        this._onDestroyListeners = [];
    };

    ZearthNavigation.prototype.distanceLegendViewModel = undefined;
    ZearthNavigation.prototype.navigationViewModel = undefined;
    ZearthNavigation.prototype.navigationDiv = undefined;
    ZearthNavigation.prototype.distanceLegendDiv = undefined;
    ZearthNavigation.prototype.terria = undefined;
    ZearthNavigation.prototype.container = undefined;
    ZearthNavigation.prototype._onDestroyListeners = undefined;

    ZearthNavigation.prototype.destroy = function ()
    {
        if (defined(this.navigationViewModel))
        {
            this.navigationViewModel.destroy();
        }
        if (defined(this.distanceLegendViewModel))
        {
            this.distanceLegendViewModel.destroy();
        }

        if (defined(this.navigationDiv))
        {
            this.navigationDiv.parentNode.removeChild(this.navigationDiv);
        }
        delete this.navigationDiv;

        if (defined(this.distanceLegendDiv))
        {
            this.distanceLegendDiv.parentNode.removeChild(this.distanceLegendDiv);
        }
        delete this.distanceLegendDiv;

        if (defined(this.container))
        {
            this.container.parentNode.removeChild(this.container);
        }
        delete this.container;

        for (var i = 0; i < this._onDestroyListeners.length; i++)
        {
            this._onDestroyListeners[i]();
        }
    };

    ZearthNavigation.prototype.addOnDestroyListener = function (callback)
    {
        if (typeof callback === "function")
        {
            this._onDestroyListeners.push(callback);
        }
    };

    /**
     * @param {Viewer|ZearthWidget} viewerZearthWidget The Viewer or ZearthWidget instance
     * @param options
     */
    function initialize(viewerZearthWidget, options) {
        if (!defined(viewerZearthWidget)) {
            throw new DeveloperError('ZearthWidget or Viewer is required.');
        }

//        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var zearthWidget = defined(viewerZearthWidget.zearthWidget) ? viewerZearthWidget.zearthWidget : viewerZearthWidget;

        var container = document.createElement('div');
        container.className = 'zearth-widget-zearthNavigationContainer';
        zearthWidget.container.appendChild(container);

        this.terria = viewerZearthWidget;
        this.terria.options = (defined(options))?options :{};
        this.terria.afterWidgetChanged = new ZearthEvent();
        this.terria.beforeWidgetChanged = new ZearthEvent();
        this.container = container;
        
        //this.navigationDiv.setAttribute("id", "navigationDiv");
        
           
          // Register custom Knockout.js bindings.  If you're not using the TerriaJS user interface, you can remove this.
        registerKnockoutBindings();

        if (!defined(this.terria.options.enableDistanceLegend) || this.terria.options.enableDistanceLegend)
        {
            this.distanceLegendDiv = document.createElement('div');
             container.appendChild(this.distanceLegendDiv);
            this.distanceLegendDiv.setAttribute("id", "distanceLegendDiv");
            this.distanceLegendViewModel = DistanceLegendViewModel.create({
                container: this.distanceLegendDiv,
                terria: this.terria,
                mapElement: container,
                enableDistanceLegend: true
            });
           
        }
     

        if ((!defined(this.terria.options.enableZoomControls) || this.terria.options.enableZoomControls) && (!defined(this.terria.options.enableCompass) || this.terria.options.enableCompass))
        {
            this.navigationDiv = document.createElement('div');
            this.navigationDiv.setAttribute("id", "navigationDiv");
            container.appendChild(this.navigationDiv);
            // Create the navigation controls.
            this.navigationViewModel = NavigationViewModel.create({
                container: this.navigationDiv,
                terria: this.terria,
                enableZoomControls: true,
                enableCompass: true
            });
        }
        else  if ((defined(this.terria.options.enableZoomControls) && !this.terria.options.enableZoomControls) && (!defined(this.terria.options.enableCompass) || this.terria.options.enableCompass))
        {
            this.navigationDiv = document.createElement('div');
            this.navigationDiv.setAttribute("id", "navigationDiv");
            container.appendChild(this.navigationDiv);
            // Create the navigation controls.
            this.navigationViewModel = NavigationViewModel.create({
                container: this.navigationDiv,
                terria: this.terria,
                enableZoomControls: false,
                enableCompass: true
            });
        }
        else  if ((!defined(this.terria.options.enableZoomControls) || this.terria.options.enableZoomControls) && (defined(this.terria.options.enableCompass) && !this.terria.options.enableCompass))
        {
            this.navigationDiv = document.createElement('div');
            this.navigationDiv.setAttribute("id", "navigationDiv");
            container.appendChild(this.navigationDiv);
            // Create the navigation controls.
            this.navigationViewModel = NavigationViewModel.create({
                container: this.navigationDiv,
                terria: this.terria,
                enableZoomControls: true,
                enableCompass: false
            });
        }
        else  if ((defined(this.terria.options.enableZoomControls) &&  !this.terria.options.enableZoomControls) && (defined(this.terria.options.enableCompass) &&  !this.terria.options.enableCompass))
        {
            //this.navigationDiv.setAttribute("id", "navigationDiv");
           // container.appendChild(this.navigationDiv);
            // Create the navigation controls.
//            this.navigationViewModel = NavigationViewModel.create({
//                container: this.navigationDiv,
//                terria: this.terria,
//                enableZoomControls: false,
//                enableCompass: false
//            });
        }

    }

    return ZearthNavigation;
});