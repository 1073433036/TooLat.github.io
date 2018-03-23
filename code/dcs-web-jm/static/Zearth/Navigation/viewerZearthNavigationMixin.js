/**
 * Created by Larcius on 18.02.16.
 */
/*global define*/
define([
    'Zearth/Core/defined',
    'Zearth/Core/defineProperties',
    'Zearth/Core/DeveloperError',
    'ZearthNavigation',
    'require-less/less!Styles/zearth-navigation'
], function(
    defined,
    defineProperties,
    DeveloperError,
    ZearthNavigation) {
    'use strict';

    /**
     * A mixin which adds the Compass/Navigation widget to the Viewer widget.
     * Rather than being called directly, this function is normally passed as
     * a parameter to {@link Viewer#extend}, as shown in the example below.
     * @exports viewerZearthNavigationMixin
     *
     * @param {Viewer} viewer The viewer instance.
     * @param {{}} options The options.
     *
     * @exception {DeveloperError} viewer is required.
     *
     * @demo {@link http://localhost:8080/index.html|run local server with examples}
     *
     * @example
     * var viewer = new Zearth.Viewer('zearthContainer');
     * viewer.extend(viewerZearthNavigationMixin);
     */
    function viewerZearthNavigationMixin(viewer, options) {
        if (!defined(viewer)) {
            throw new DeveloperError('viewer is required.');
        }

        var zearthNavigation = init(viewer, options);

        zearthNavigation.addOnDestroyListener((function (viewer) {
            return function () {
                delete viewer.zearthNavigation;
            };
        })(viewer));

        defineProperties(viewer, {
            zearthNavigation: {
                configurable: true,
                get: function () {
                    return viewer.zearthWidget.zearthNavigation;
                }
            }
        });
    }

    /**
     *
     * @param {ZearthWidget} zearthWidget The zearth widget instance.
     * @param {{}} options The options.
     */
    viewerZearthNavigationMixin.mixinWidget = function (zearthWidget, options) {
        return init.apply(undefined, arguments);
    };

    /**
     * @param {Viewer|ZearthWidget} viewerZearthWidget The Viewer or ZearthWidget instance
     * @param {{}} options the options
     */
    var init = function (viewerZearthWidget, options) {
        var zearthNavigation = new ZearthNavigation(viewerZearthWidget, options);

        var zearthWidget = defined(viewerZearthWidget.zearthWidget) ? viewerZearthWidget.zearthWidget : viewerZearthWidget;

        defineProperties(zearthWidget, {
            zearthNavigation: {
                configurable: true,
                get: function () {
                    return zearthNavigation;
                }
            }
        });

        zearthNavigation.addOnDestroyListener((function (zearthWidget) {
            return function () {
                delete zearthWidget.zearthNavigation;
            };
        })(zearthWidget));

        return zearthNavigation;
    };

    return viewerZearthNavigationMixin;
});