/**
 * Provides utilities for move xblock.
 */
define(['jquery', 'underscore', 'common/js/components/views/feedback_alert', 'js/views/utils/xblock_utils',
        'js/views/utils/move_xblock_utils', 'edx-ui-toolkit/js/utils/string-utils'],
    function($, _, AlertView, XBlockViewUtils, MoveXBlockUtils, StringUtils) {
        'use strict';
        var MovedAlertView, showMovedNotification, hideMovedNotification;

        MovedAlertView = AlertView.Confirmation.extend({
            events: _.extend({}, AlertView.Confirmation.prototype.events, {
                'click .action-undo-move': 'undoMoveXBlock'
            }),

            options: $.extend({}, AlertView.Confirmation.prototype.options),

            initialize: function() {
                AlertView.prototype.initialize.apply(this, arguments);
                this.undoMovedAlertView = null;
            },

            undoMoveXBlock: function(event) {
                var self = this,
                    $moveLink = $(event.target),
                    sourceLocator = $moveLink.data('source-locator'),
                    sourceDisplayName = $moveLink.data('source-display-name'),
                    sourceParentLocator = $moveLink.data('source-parent-locator'),
                    targetIndex = $moveLink.data('target-index');
                XBlockViewUtils.moveXBlock(sourceLocator, sourceParentLocator, targetIndex)
                .done(function(response) {
                    // show XBlock element
                    $('.studio-xblock-wrapper[data-locator="' + response.move_source_locator + '"]').show();
                    if (self.undoMovedAlertView) {
                        self.undoMovedAlertView.hide();
                    }
                    self.undoMovedAlertView = showMovedNotification(
                        StringUtils.interpolate(
                            gettext('Move cancelled. "{sourceDisplayName}" has been moved back to its original ' +
                                'location.'),
                            {
                                sourceDisplayName: sourceDisplayName
                            }
                        )
                    );
                });
            }
        });

        showMovedNotification = function(title, titleHtml, messageHtml) {
            var movedAlertView = new MovedAlertView({
                title: title,
                titleHtml: titleHtml,
                messageHtml: messageHtml
            });
            movedAlertView.show();
            // scroll to top
            $.smoothScroll({
                offset: 0,
                easing: 'swing',
                speed: 1000
            });
            return movedAlertView;
        };

        hideMovedNotification = function(SystemFeedback) {
            var movedAlertView = SystemFeedback.active_alert;
            if (movedAlertView) {
                MovedAlertView.prototype.hide.apply(movedAlertView);
            }
        };

        return {
            showMovedNotification: showMovedNotification,
            hideMovedNotification: hideMovedNotification
        };
    });