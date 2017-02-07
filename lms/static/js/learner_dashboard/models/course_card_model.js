/**
 * Model for Course Programs.
 */
(function(define) {
    'use strict';
    define([
        'backbone',
        'edx-ui-toolkit/js/utils/date-utils'
    ],
        function(Backbone, DateUtils) {
            return Backbone.Model.extend({
                initialize: function(data) {
                    if (data) {
                        this.context = data;
                        this.setActiveCourseRun(this.getCourseRun(data.course_runs), data.user_preferences);
                    }
                },

                getUnselectedCourseRun: function(courseRuns) {
                    if (courseRuns && courseRuns.length > 0) {
                        return {
                            course_image_url: courseRuns[0].course_image_url,
                            marketing_url: courseRuns[0].marketing_url,
                            is_enrollment_open: courseRuns[0].is_enrollment_open
                        };
                    }

                    return {};
                },

                getCourseRun: function(courseRuns) {
                    var enrolled_mode = _.findWhere(courseRuns, {is_enrolled: true}),
                        openEnrollmentCourseRuns = this.getEnrollableCourseRuns(),
                        desiredRunMode;
                    // We populate our model by looking at the run modes.
                    if (enrolled_mode) {
                    // If the learner is already enrolled in a run mode, return that one.
                        desiredRunMode = enrolled_mode;
                    } else if (openEnrollmentCourseRuns.length > 0) {
                        if (openEnrollmentCourseRuns.length === 1) {
                            desiredRunMode = openEnrollmentCourseRuns[0];
                        } else {
                            desiredRunMode = this.getUnselectedCourseRun(openEnrollmentCourseRuns);
                        }
                    } else {
                        desiredRunMode = this.getUnselectedCourseRun(courseRuns);
                    }

                    return desiredRunMode;
                },

                getEnrollableCourseRuns: function() {
                    return _.where(this.context.course_runs, {
                        is_enrollment_open: true,
                        is_enrolled: false,
                        is_course_ended: false
                    });
                },

                getUpcomingCourseRuns: function() {
                    return _.where(this.context.course_runs, {
                        is_enrollment_open: false,
                        is_enrolled: false,
                        is_course_ended: false
                    });
                },

                formatDate: function(date, userPreferences) {
                    var context,
                        userTimezone = '',
                        userLanguage = '';
                    if (userPreferences !== undefined) {
                        userTimezone = userPreferences.time_zone;
                        userLanguage = userPreferences['pref-lang'];
                    }
                    context = {
                        datetime: date,
                        timezone: userTimezone,
                        language: userLanguage,
                        format: DateUtils.dateFormatEnum.shortDate
                    };
                    return DateUtils.localize(context);
                },

                setActiveCourseRun: function(courseRun, userPreferences) {
                    var startDateString;
                    if (courseRun) {
                        if (courseRun.advertised_start !== undefined && courseRun.advertised_start !== 'None') {
                            startDateString = courseRun.advertised_start;
                        } else {
                            startDateString = this.formatDate(courseRun.start, userPreferences);
                        }
                        this.set({
                            certificate_url: courseRun.certificate_url,
                            course_image_url: courseRun.image.src || '',
                            course_run_key: courseRun.key,
                            course_url: courseRun.course_url || '',
                            title: this.context.title,
                            end_date: this.formatDate(courseRun.end, userPreferences),
                            enrollable_course_runs: this.getEnrollableCourseRuns(),
                            is_course_ended: courseRun.is_course_ended,
                            is_enrolled: courseRun.is_enrolled,
                            is_enrollment_open: courseRun.is_enrollment_open,
                            key: this.context.key,
                            marketing_url: courseRun.marketing_url,
                            mode_slug: courseRun.type,
                            start_date: startDateString,
                            upcoming_course_runs: this.getUpcomingCourseRuns(),
                            upgrade_url: courseRun.upgrade_url
                        });
                    }
                },
                setUnselected: function() {
                // Called to reset the model back to the unselected state.
                    var unselectedMode = this.getUnselectedCourseRun(this.get('enrollable_course_runs'));
                    this.setActiveCourseRun(unselectedMode);
                },

                updateCourseRun: function(courseRunKey) {
                    var selectedRun = _.findWhere(this.get('course_runs'), {course_run_key: courseRunKey});
                    if (selectedRun) {
                        this.setActiveCourseRun(selectedRun);
                    }
                }
            });
        });
}).call(this, define || RequireJS.define);
