define([
    'backbone',
    'jquery',
    'js/learner_dashboard/views/program_card_view',
    'js/learner_dashboard/collections/program_collection',
    'js/learner_dashboard/views/collection_list_view',
    'js/learner_dashboard/collections/program_progress_collection'
], function(Backbone, $, ProgramCardView, ProgramCollection, CollectionListView,
        ProgressCollection) {
    'use strict';
        /* jslint maxlen: 500 */

    describe('Collection List View', function() {
        var view = null,
            programCollection,
            progressCollection,
            context = {
                programsData: [
                    {
                        'uuid': 'a87e5eac-3c93-45a1-a8e1-4c79ca8401c8',
                        'title': 'Food Security and Sustainability',
                        'subtitle': 'Learn how to feed all people in the world in a sustainable way.',
                        'type': 'XSeries',
                        'status': 'active',
                        'marketing_slug': 'food-security-sustainability',
                        'marketing_url': 'https://www.edx.org/xseries/food-security-sustainability',
                        'banner_image': {
                            'medium': {
                                'height': 242,
                                'width': 726,
                                'url': 'https://dphy0qlkz2ftb.cloudfront.net/media/programs/banner_images/a87e5eac-3c93-45a1-a8e1-4c79ca8401c8.medium.jpg'
                            },
                            'x-small': {
                                'height': 116,
                                'width': 348,
                                'url': 'https://dphy0qlkz2ftb.cloudfront.net/media/programs/banner_images/a87e5eac-3c93-45a1-a8e1-4c79ca8401c8.x-small.jpg'
                            },
                            'small': {
                                'height': 145,
                                'width': 435,
                                'url': 'https://dphy0qlkz2ftb.cloudfront.net/media/programs/banner_images/a87e5eac-3c93-45a1-a8e1-4c79ca8401c8.small.jpg'
                            },
                            'large': {
                                'height': 480,
                                'width': 1440,
                                'url': 'https://dphy0qlkz2ftb.cloudfront.net/media/programs/banner_images/a87e5eac-3c93-45a1-a8e1-4c79ca8401c8.large.jpg'
                            }
                        },
                        'courses': [
                            {
                                'key': 'WageningenX+GFFCx',
                                'uuid': 'e2181410-1f12-4d19-8058-d2f01c114d21',
                                'title': 'Food Security and Sustainability: Crop production',
                                'course_runs': [
                                    {
                                        'key': 'course-v1:WageningenX+GFFCx+2T2016',
                                        'uuid': 'a36f30ee-6637-11e6-a8e3-22000bdde520',
                                        'title': 'Food Security and Sustainability: Crop production',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/gffcx-thumb-378x225_0.jpg',
                                            'width': null
                                        },
                                        'short_description': 'Learn the basics of crop production in order to feed the world and preserve our planet’s resources.',
                                        'marketing_url': 'https://www.edx.org/course/food-security-sustainability-crop-wageningenx-fsscpx?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2016-06-16T04:00:00Z',
                                        'end': '2017-05-01T00:00:00Z',
                                        'enrollment_start': null,
                                        'enrollment_end': null,
                                        'pacing_type': 'self_paced',
                                        'type': 'verified'
                                    },
                                    {
                                        'key': 'course-v1:WageningenX+GFFCx+2T2015',
                                        'uuid': 'a36f30ab-6637-11e6-a8e3-22000bdde520',
                                        'title': 'Future Food Production: Crops',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/gffcx-thumb-378x225_0.jpg',
                                            'width': null
                                        },
                                        'short_description': 'Learn the basics of crop production in order to feed the world and preserve our planet’s resources.',
                                        'marketing_url': 'https://www.edx.org/course/future-food-production-crops-wageningenx-gffcx?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2015-06-15T04:00:00Z',
                                        'end': '2015-10-01T00:00:00Z',
                                        'enrollment_start': null,
                                        'enrollment_end': null,
                                        'pacing_type': 'instructor_paced',
                                        'type': 'verified'
                                    }
                                ],
                                'owners': [
                                    {
                                        'uuid': '0c6e5fa2-96e8-40b2-9ebe-c8b0df2a3b22',
                                        'key': 'WageningenX',
                                        'name': 'Wageningen University & Research'
                                    }
                                ],
                                'image': {
                                    'description': null,
                                    'height': null,
                                    'src': 'https://www.edx.org/sites/default/files/course/image/promoted/gffcx-thumb-378x225_0.jpg',
                                    'width': null
                                }
                            },
                            {
                                'key': 'WageningenX+FFESx',
                                'uuid': '9f8562eb-f99b-45c7-b437-799fd0c15b6a',
                                'title': 'Systems thinking and environmental sustainability',
                                'course_runs': [
                                    {
                                        'key': 'course-v1:WageningenX+FFESx+2T2016',
                                        'uuid': '9bbb7844-4848-44ab-8e20-0be6604886e9',
                                        'title': 'Food Security and Sustainability: Systems thinking and environmental sustainability',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/systems_thinking_and_sustainability_378x225.jpg',
                                            'width': null
                                        },
                                        'short_description': 'Learn how to apply systems thinking to improve the environmental sustainability of food production systems.',
                                        'marketing_url': 'https://www.edx.org/course/food-security-sustainability-systems-wageningenx-stesx?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2016-09-08T04:00:00Z',
                                        'end': '2016-11-11T00:00:00Z',
                                        'enrollment_start': null,
                                        'enrollment_end': null,
                                        'pacing_type': 'instructor_paced',
                                        'type': 'verified'
                                    },
                                    {
                                        'key': 'course-v1:WageningenX+FFESx+1T2017',
                                        'uuid': '2f2edf03-79e6-4e39-aef0-65436a6ee344',
                                        'title': 'Food Security and Sustainability: Systems thinking and environmental sustainability',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/systems_thinking_and_sustainability_378x225.jpg',
                                            'width': null
                                        },
                                        'short_description': 'Learn how to apply systems thinking to improve the environmental sustainability of food production systems.',
                                        'marketing_url': 'https://www.edx.org/course/food-security-sustainability-systems-wageningenx-ffesx?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2017-02-28T05:00:00Z',
                                        'end': '2017-05-30T23:00:00Z',
                                        'enrollment_start': '2017-01-18T00:00:00Z',
                                        'enrollment_end': null,
                                        'pacing_type': 'self_paced',
                                        'type': 'verified'
                                    }
                                ],
                                'owners': [
                                    {
                                        'uuid': '0c6e5fa2-96e8-40b2-9ebe-c8b0df2a3b22',
                                        'key': 'WageningenX',
                                        'name': 'Wageningen University & Research'
                                    }
                                ],
                                'image': {
                                    'description': null,
                                    'height': null,
                                    'src': 'https://www.edx.org/sites/default/files/course/image/promoted/systems_thinking_and_sustainability_378x225.jpg',
                                    'width': null
                                }
                            },
                            {
                                'key': 'WageningenX+FSSFAx',
                                'uuid': '04bdf14f-b56d-49b1-80e4-f0ecbd45ce99',
                                'title': 'Food Security and Sustainability: Food Access',
                                'course_runs': [
                                    {
                                        'key': 'course-v1:WageningenX+FSSFAx+1T2017',
                                        'uuid': 'ffea8f6f-38fa-4933-a270-5bf61df65481',
                                        'title': 'Food Security and Sustainability: Food Access',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/fssfax_-_wageningen_course_image_378x225.jpg',
                                            'width': null
                                        },
                                        'short_description': 'Who decides what food is on your plate? Understand the basics of access to food and food decision-making from a multilevel perspective.',
                                        'marketing_url': 'https://www.edx.org/course/food-security-sustainability-food-access-wageningenx-fssfax?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2017-01-12T05:00:00Z',
                                        'end': '2017-03-05T23:00:00Z',
                                        'enrollment_start': null,
                                        'enrollment_end': null,
                                        'pacing_type': 'instructor_paced',
                                        'type': 'verified'
                                    }
                                ],
                                'owners': [
                                    {
                                        'uuid': '0c6e5fa2-96e8-40b2-9ebe-c8b0df2a3b22',
                                        'key': 'WageningenX',
                                        'name': 'Wageningen University & Research'
                                    }
                                ],
                                'image': {
                                    'description': null,
                                    'height': null,
                                    'src': 'https://www.edx.org/sites/default/files/course/image/promoted/fssfax_-_wageningen_course_image_378x225.jpg',
                                    'width': null
                                }
                            }
                        ],
                        'authoring_organizations': [
                            {
                                'uuid': '0c6e5fa2-96e8-40b2-9ebe-c8b0df2a3b22',
                                'key': 'WageningenX',
                                'name': 'Wageningen University & Research'
                            }
                        ],
                        'card_image_url': 'https://www.edx.org/sites/default/files/card/images/xseries_image_fss_378x225.jpg'
                    },
                    {
                        'uuid': '91d144d2-1bb1-4afe-90df-d5cff63fa6e2',
                        'title': 'edX Course Creator',
                        'subtitle': 'Become an expert in creating courses for the edX platform.',
                        'type': 'XSeries',
                        'status': 'active',
                        'marketing_slug': 'edx-course-creator',
                        'marketing_url': 'https://www.edx.org/xseries/edx-course-creator',
                        'banner_image': {
                            'medium': {
                                'height': 242,
                                'width': 726,
                                'url': 'https://dphy0qlkz2ftb.cloudfront.net/media/programs/banner_images/91d144d2-1bb1-4afe-90df-d5cff63fa6e2.medium.jpg'
                            },
                            'x-small': {
                                'height': 116,
                                'width': 348,
                                'url': 'https://dphy0qlkz2ftb.cloudfront.net/media/programs/banner_images/91d144d2-1bb1-4afe-90df-d5cff63fa6e2.x-small.jpg'
                            },
                            'small': {
                                'height': 145,
                                'width': 435,
                                'url': 'https://dphy0qlkz2ftb.cloudfront.net/media/programs/banner_images/91d144d2-1bb1-4afe-90df-d5cff63fa6e2.small.jpg'
                            },
                            'large': {
                                'height': 480,
                                'width': 1440,
                                'url': 'https://dphy0qlkz2ftb.cloudfront.net/media/programs/banner_images/91d144d2-1bb1-4afe-90df-d5cff63fa6e2.large.jpg'
                            }
                        },
                        'courses': [
                            {
                                'key': 'edX+BlendedX',
                                'uuid': 'd342270e-c6a2-4e34-a56d-0d3094376956',
                                'title': 'Blended Learning with edX',
                                'course_runs': [
                                    {
                                        'key': 'course-v1:edX+BlendedX+3T2016',
                                        'uuid': '9f16ad11-66b0-4b6e-91e3-5f89c21d9af7',
                                        'title': 'Blended Learning with edX',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/blended_1_0.jpg',
                                            'width': null
                                        },
                                        'short_description': 'Explore ways to blend educational technology with traditional classroom learning to improve educational outcomes.',
                                        'marketing_url': 'https://www.edx.org/course/blended-learning-edx-edx-blendedx-1?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2016-09-23T04:00:00Z',
                                        'end': '2017-09-29T00:00:00Z',
                                        'enrollment_start': '2016-09-23T00:00:00Z',
                                        'enrollment_end': '2017-09-29T00:00:00Z',
                                        'pacing_type': 'self_paced',
                                        'type': 'verified'
                                    }
                                ],
                                'owners': [
                                    {
                                        'uuid': '4f8cb2c9-589b-4d1e-88c1-b01a02db3a9c',
                                        'key': 'edX',
                                        'name': 'edX'
                                    }
                                ],
                                'image': {
                                    'description': null,
                                    'height': null,
                                    'src': 'https://www.edx.org/sites/default/files/course/image/promoted/blended_1_0.jpg',
                                    'width': null
                                }
                            },
                            {
                                'key': 'edX+VideoX',
                                'uuid': '590dd66d-9263-49f9-8171-e4c07ed48ab4',
                                'title': 'Creating Video for the edX Platform',
                                'course_runs': [
                                    {
                                        'key': 'course-v1:edX+VideoX+3T2016',
                                        'uuid': '56d1c2d0-c1c8-4cb6-8fe3-f2f05d2e7bf7',
                                        'title': 'Creating Video for the edX Platform',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/video_1.jpg',
                                            'width': null
                                        },
                                        'short_description': 'Learn the best and most efficient ways to create video content for the edX platform.',
                                        'marketing_url': 'https://www.edx.org/course/creating-video-edx-platform-edx-videox-0?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2016-09-23T04:00:00Z',
                                        'end': '2017-09-29T00:00:00Z',
                                        'enrollment_start': '2016-09-23T00:00:00Z',
                                        'enrollment_end': null,
                                        'pacing_type': 'self_paced',
                                        'type': 'verified'
                                    }
                                ],
                                'owners': [
                                    {
                                        'uuid': '4f8cb2c9-589b-4d1e-88c1-b01a02db3a9c',
                                        'key': 'edX',
                                        'name': 'edX'
                                    }
                                ],
                                'image': {
                                    'description': null,
                                    'height': null,
                                    'src': 'https://www.edx.org/sites/default/files/course/image/promoted/video_1.jpg',
                                    'width': null
                                }
                            },
                            {
                                'key': 'edX+StudioX',
                                'uuid': 'aee2aa1e-48cd-4301-ac45-4ab52b2bf9c8',
                                'title': 'Creating a Course with Studio',
                                'course_runs': [
                                    {
                                        'key': 'course-v1:edX+StudioX+3T2016',
                                        'uuid': '6a0fcd55-666e-4590-84e5-416136b5fe84',
                                        'title': 'Creating a Course with edX Studio',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/studio_1.jpg',
                                            'width': null
                                        },
                                        'short_description': 'Learn the fundamentals of creating courses on the edX platform using edX Studio.',
                                        'marketing_url': 'https://www.edx.org/course/creating-course-edx-studio-edx-studiox-0?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2016-10-07T04:00:00Z',
                                        'end': '2017-09-29T00:00:00Z',
                                        'enrollment_start': '2016-09-05T00:00:00Z',
                                        'enrollment_end': '2017-09-18T00:00:00Z',
                                        'pacing_type': 'self_paced',
                                        'type': 'verified'
                                    }
                                ],
                                'owners': [
                                    {
                                        'uuid': '4f8cb2c9-589b-4d1e-88c1-b01a02db3a9c',
                                        'key': 'edX',
                                        'name': 'edX'
                                    }
                                ],
                                'image': {
                                    'description': null,
                                    'height': null,
                                    'src': 'https://www.edx.org/sites/default/files/course/image/promoted/studio_1.jpg',
                                    'width': null
                                }
                            },
                            {
                                'key': 'edX+edX101',
                                'uuid': '2026761d-d2d9-4164-964d-1c24b2006720',
                                'title': 'Overview of Creating an edX Course',
                                'course_runs': [
                                    {
                                        'key': 'course-v1:edX+edX101+3T2016',
                                        'uuid': 'ec76fb1b-7805-4698-a115-8f916b1489c4',
                                        'title': 'Overview of Creating an edX Course',
                                        'image': {
                                            'description': null,
                                            'height': null,
                                            'src': 'https://www.edx.org/sites/default/files/course/image/promoted/101_1.jpg',
                                            'width': null
                                        },
                                        'short_description': 'A quick course designed to help you explore all of the different steps that go into planning and building an edX course.',
                                        'marketing_url': 'https://www.edx.org/course/overview-creating-edx-course-edx-designx?utm_medium=affiliate_partner&utm_source=r_lucioni',
                                        'start': '2016-10-07T04:00:00Z',
                                        'end': '2017-09-29T00:00:00Z',
                                        'enrollment_start': '2016-09-23T00:00:00Z',
                                        'enrollment_end': '2017-09-22T00:00:00Z',
                                        'pacing_type': 'self_paced',
                                        'type': 'verified'
                                    }
                                ],
                                'owners': [
                                    {
                                        'uuid': '4f8cb2c9-589b-4d1e-88c1-b01a02db3a9c',
                                        'key': 'edX',
                                        'name': 'edX'
                                    }
                                ],
                                'image': {
                                    'description': null,
                                    'height': null,
                                    'src': 'https://www.edx.org/sites/default/files/course/image/promoted/101_1.jpg',
                                    'width': null
                                }
                            }
                        ],
                        'authoring_organizations': [
                            {
                                'uuid': '4f8cb2c9-589b-4d1e-88c1-b01a02db3a9c',
                                'key': 'edX',
                                'name': 'edX'
                            }
                        ],
                        'card_image_url': 'https://www.edx.org/sites/default/files/card/images/course-creator-xseries-_378x225.jpg'
                    }
                ],
                userProgress: [
                    {
                        uuid: 'a87e5eac-3c93-45a1-a8e1-4c79ca8401c8',
                        completed: ['courses', 'the', 'user', 'completed'],
                        in_progress: ['in', 'progress'],
                        not_started: ['courses', 'not', 'yet', 'started']
                    },
                    {
                        uuid: '91d144d2-1bb1-4afe-90df-d5cff63fa6e2',
                        completed: ['Course 1'],
                        in_progress: [],
                        not_started: ['Course 2', 'Course 3', 'Course 4']
                    }
                ]
            };

        beforeEach(function() {
            setFixtures('<div class="program-cards-container"></div>');
            programCollection = new ProgramCollection(context.programsData);
            progressCollection = new ProgressCollection();
            progressCollection.set(context.userProgress);
            context.progressCollection = progressCollection;

            view = new CollectionListView({
                el: '.program-cards-container',
                childView: ProgramCardView,
                collection: programCollection,
                context: context
            });
            view.render();
        });

        afterEach(function() {
            view.remove();
        });

        it('should exist', function() {
            expect(view).toBeDefined();
        });

        it('should load the collection items based on passed in collection', function() {
            var $cards = view.$el.find('.program-card');
            expect($cards.length).toBe(2);
            $cards.each(function(index, el) {
                expect($(el).find('.title').html().trim()).toEqual(context.programsData[index].name);
            });
        });

        it('should display no item if collection is empty', function() {
            var $cards;
            view.remove();
            programCollection = new ProgramCollection([]);
            view = new CollectionListView({
                el: '.program-cards-container',
                childView: ProgramCardView,
                context: {'xseriesUrl': '/programs'},
                collection: programCollection
            });
            view.render();
            $cards = view.$el.find('.program-card');
            expect($cards.length).toBe(0);
        });
        it('should have no title when title not provided', function() {
            var $title;
            setFixtures('<div class="test-container"><div class="program-cards-container"></div></div>');
            view.remove();
            view.render();
            expect(view).toBeDefined();
            $title = view.$el.parent().find('.collection-title');
            expect($title.html()).not.toBeDefined();
        });
        it('should display screen reader header when provided', function() {
            var $title, titleContext = {el: 'h2', title: 'list start'};
            view.remove();
            setFixtures('<div class="test-container"><div class="program-cards-container"></div></div>');
            programCollection = new ProgramCollection(context.programsData);
            view = new CollectionListView({
                el: '.program-cards-container',
                childView: ProgramCardView,
                context: {'xseriesUrl': '/programs'},
                collection: programCollection,
                titleContext: titleContext
            });
            view.render();
            $title = view.$el.parent().find('.collection-title');
            expect($title.html()).toBe(titleContext.title);
        });
    });
}
);
