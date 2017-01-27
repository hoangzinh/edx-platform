"""Helper functions for working with the catalog service."""
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth.models import User
from edx_rest_api_client.client import EdxRestApiClient
from opaque_keys.edx.keys import CourseKey

from openedx.core.djangoapps.catalog.models import CatalogIntegration
from openedx.core.lib.edx_api_utils import get_edx_api_data
from openedx.core.lib.token_utils import JwtBuilder
from xmodule.modulestore.django import modulestore


def create_catalog_api_client(user, catalog_integration):
    """Returns an API client which can be used to make catalog API requests."""
    scopes = ['email', 'profile']
    expires_in = settings.OAUTH_ID_TOKEN_EXPIRATION
    jwt = JwtBuilder(user).build_token(scopes, expires_in)

    return EdxRestApiClient(catalog_integration.internal_api_url, jwt=jwt)


def _get_service_user(user, service_username):
    """
    Retrieve and return the Catalog Integration Service User Object
    if the passed user is None or anonymous
    """
    if not user or user.is_anonymous():
        try:
            user = User.objects.get(username=service_username)
        except User.DoesNotExist:
            user = None
    return user


def get_programs(user=None, uuid=None, type=None, status=None):  # pylint: disable=redefined-builtin
    """Retrieve marketable programs from the catalog service.

    Keyword Arguments:
        uuid  (string): UUID identifying a specific program.
        type  (string): Filter programs by type (e.g., "MicroMasters" will only return MicroMasters programs).
        status(string): Filter programs by status (e.g., "active", "unpublished" ...).

    Returns:
        list of dict, representing programs.
        dict, if a specific program is requested.
    """
    catalog_integration = CatalogIntegration.current()
    if catalog_integration.enabled:
        user = _get_service_user(user, catalog_integration.service_username)
        if not user:
            return []

        api = create_catalog_api_client(user, catalog_integration)

        cache_key = '{base}.programs{type}{status}{full_course_serializer}'.format(
            base=catalog_integration.CACHE_KEY,
            type='.' + type if type else '',
            status='.' + status if status else '',
            full_course_serializer='.full_course_serializer' if uuid else '',
        )

        querystring = {
            'marketable': 1,
            'exclude_utm': 1,
        }
        if type:
            querystring['type'] = type
        if status:
            querystring['status'] = status
        if uuid:
            querystring['use_full_course_serializer'] = True

        return get_edx_api_data(
            catalog_integration,
            user,
            'programs',
            resource_id=uuid,
            cache_key=cache_key if catalog_integration.is_cache_enabled else None,
            api=api,
            querystring=querystring,
        )
    else:
        return []


def get_program_types(user=None):  # pylint: disable=redefined-builtin
    """
    Retrieve all program types from the catalog service.

    Returns:
        list of dict, representing program types.
    """
    catalog_integration = CatalogIntegration.current()
    if catalog_integration.enabled:
        user = _get_service_user(user, catalog_integration.service_username)
        if not user:
            return []

        api = create_catalog_api_client(user, catalog_integration)
        cache_key = '{base}.program_types'.format(base=catalog_integration.CACHE_KEY)

        return get_edx_api_data(
            catalog_integration,
            user,
            'program_types',
            cache_key=cache_key if catalog_integration.is_cache_enabled else None,
            api=api
        )
    else:
        return []


def _get_program_instructors(program):
    """
    Returns the list of instructor from cached if cache key exists otherwise
    iterate over the courses and return all the instructors of each course run
    """
    cache_key = 'program.instructors.{program_id}'.format(
        program_id=program.get('uuid')
    )

    program_instructors_dict = {}
    program_instructors_list = cache.get(cache_key, [])
    if program_instructors_list:
        return program_instructors_list

    module_store = modulestore()
    for course_run_key in _get_all_course_run_keys(program):
        course_descriptor = module_store.get_course(course_run_key)
        if course_descriptor:
            course_instructors = getattr(course_descriptor, 'instructor_info', {})
            # Deduplicate program instructors using instructor name
            program_instructors_dict.update(
                {instructor.get('name'): instructor for instructor in course_instructors.get('instructors', [])}
            )
    program_instructors_list = program_instructors_dict.values()
    cache.set(cache_key, program_instructors_list)
    return program_instructors_list


def _get_all_course_run_keys(program):
    """
    Returns the course keys of all the course runs of a program.
    """
    keys = []
    for course in program.get('courses', []):  # pylint: disable=E1101
        for course_run in course.get('course_runs', []):
            keys.append(CourseKey.from_string(course_run.get('key')))
    return keys


def get_program_details(user=None, program_id=None):
    """
    This will return the program details with its corresponding program type and instructors
    """
    program = get_programs(user, program_id, status="active")
    if not program:
        return None

    program['type'] = next(
        program_type
        for program_type in get_program_types(user)
        if program_type['name'] == program['type']
    )
    program['instructors'] = _get_program_instructors(program)
    return program


def get_active_programs_list(user=None):
    """
    Return the list of active Programs after adding the ProgramType Logo Image
    """
    programs = get_programs(user, status="active")
    if not programs:
        return []

    program_types = {program_type["name"]: program_type for program_type in get_program_types(user)}
    for program in programs:
        program["logo_image"] = program_types[program["type"]]["logo_image"]
    return programs


def munge_catalog_program(catalog_program):
    """Make a program from the catalog service look like it came from the programs service.

    Catalog-based MicroMasters need to be displayed in the LMS. However, the LMS
    currently retrieves all program data from the soon-to-be-retired programs service.
    Consuming program data exclusively from the catalog service would have taken more time
    than we had prior to the MicroMasters launch. This is a functional middle ground
    introduced by ECOM-5460. Cleaning up this debt is tracked by ECOM-4418.

    Arguments:
        catalog_program (dict): The catalog service's representation of a program.

    Return:
        dict, imitating the schema used by the programs service.
    """
    return {
        'id': catalog_program['uuid'],
        'name': catalog_program['title'],
        'subtitle': catalog_program['subtitle'],
        'category': catalog_program['type'],
        'marketing_slug': catalog_program['marketing_slug'],
        'organizations': [
            {
                'display_name': organization['name'],
                'key': organization['key']
            } for organization in catalog_program['authoring_organizations']
        ],
        'course_codes': [
            {
                'display_name': course['title'],
                'key': course['key'],
                'organization': {
                    # The Programs schema only supports one organization here.
                    'display_name': course['owners'][0]['name'],
                    'key': course['owners'][0]['key']
                } if course['owners'] else {},
                'run_modes': [
                    {
                        'course_key': run['key'],
                        'run_key': CourseKey.from_string(run['key']).run,
                        'mode_slug': 'verified'
                    } for run in course['course_runs']
                ],
            } for course in catalog_program['courses']
        ],
        'banner_image_urls': {
            'w1440h480': catalog_program['banner_image']['large']['url'],
            'w726h242': catalog_program['banner_image']['medium']['url'],
            'w435h145': catalog_program['banner_image']['small']['url'],
            'w348h116': catalog_program['banner_image']['x-small']['url'],
        },
    }


def get_course_run(course_key, user):
    """Get a course run's data from the course catalog service.

    Arguments:
        course_key (CourseKey): Course key object identifying the run whose data we want.
        user (User): The user to authenticate as when making requests to the catalog service.

    Returns:
        dict, empty if no data could be retrieved.
    """
    catalog_integration = CatalogIntegration.current()

    if catalog_integration.enabled:
        api = create_catalog_api_client(user, catalog_integration)

        data = get_edx_api_data(
            catalog_integration,
            user,
            'course_runs',
            resource_id=unicode(course_key),
            cache_key=catalog_integration.CACHE_KEY if catalog_integration.is_cache_enabled else None,
            api=api,
            querystring={'exclude_utm': 1},
        )

        return data if data else {}
    else:
        return {}


def get_run_marketing_url(course_key, user):
    """Get a course run's marketing URL from the course catalog service.

    Arguments:
        course_key (CourseKey): Course key object identifying the run whose marketing URL we want.
        user (User): The user to authenticate as when making requests to the catalog service.

    Returns:
        string, the marketing URL, or None if no URL is available.
    """
    course_run = get_course_run(course_key, user)
    return course_run.get('marketing_url')
