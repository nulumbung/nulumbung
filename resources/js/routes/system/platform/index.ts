import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\System\PlatformController::edit
 * @see app/Http/Controllers/System/PlatformController.php:21
 * @route '/system/platform'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/system/platform',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\System\PlatformController::edit
 * @see app/Http/Controllers/System/PlatformController.php:21
 * @route '/system/platform'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\System\PlatformController::edit
 * @see app/Http/Controllers/System/PlatformController.php:21
 * @route '/system/platform'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\System\PlatformController::edit
 * @see app/Http/Controllers/System/PlatformController.php:21
 * @route '/system/platform'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\System\PlatformController::edit
 * @see app/Http/Controllers/System/PlatformController.php:21
 * @route '/system/platform'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\System\PlatformController::edit
 * @see app/Http/Controllers/System/PlatformController.php:21
 * @route '/system/platform'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\System\PlatformController::edit
 * @see app/Http/Controllers/System/PlatformController.php:21
 * @route '/system/platform'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\System\PlatformController::update
 * @see app/Http/Controllers/System/PlatformController.php:31
 * @route '/system/platform'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/system/platform',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\System\PlatformController::update
 * @see app/Http/Controllers/System/PlatformController.php:31
 * @route '/system/platform'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\System\PlatformController::update
 * @see app/Http/Controllers/System/PlatformController.php:31
 * @route '/system/platform'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\System\PlatformController::update
 * @see app/Http/Controllers/System/PlatformController.php:31
 * @route '/system/platform'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\System\PlatformController::update
 * @see app/Http/Controllers/System/PlatformController.php:31
 * @route '/system/platform'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\System\PlatformController::testEmail
 * @see app/Http/Controllers/System/PlatformController.php:121
 * @route '/system/platform/test-email'
 */
export const testEmail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testEmail.url(options),
    method: 'post',
})

testEmail.definition = {
    methods: ["post"],
    url: '/system/platform/test-email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\System\PlatformController::testEmail
 * @see app/Http/Controllers/System/PlatformController.php:121
 * @route '/system/platform/test-email'
 */
testEmail.url = (options?: RouteQueryOptions) => {
    return testEmail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\System\PlatformController::testEmail
 * @see app/Http/Controllers/System/PlatformController.php:121
 * @route '/system/platform/test-email'
 */
testEmail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testEmail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\System\PlatformController::testEmail
 * @see app/Http/Controllers/System/PlatformController.php:121
 * @route '/system/platform/test-email'
 */
    const testEmailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testEmail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\System\PlatformController::testEmail
 * @see app/Http/Controllers/System/PlatformController.php:121
 * @route '/system/platform/test-email'
 */
        testEmailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testEmail.url(options),
            method: 'post',
        })
    
    testEmail.form = testEmailForm
const platform = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
testEmail: Object.assign(testEmail, testEmail),
}

export default platform