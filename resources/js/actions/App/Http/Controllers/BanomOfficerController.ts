import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BanomOfficerController::index
 * @see app/Http/Controllers/BanomOfficerController.php:20
 * @route '/management/banom/{banom}/officers'
 */
export const index = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/management/banom/{banom}/officers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BanomOfficerController::index
 * @see app/Http/Controllers/BanomOfficerController.php:20
 * @route '/management/banom/{banom}/officers'
 */
index.url = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banom: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banom: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banom: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banom: typeof args.banom === 'object'
                ? args.banom.id
                : args.banom,
                }

    return index.definition.url
            .replace('{banom}', parsedArgs.banom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomOfficerController::index
 * @see app/Http/Controllers/BanomOfficerController.php:20
 * @route '/management/banom/{banom}/officers'
 */
index.get = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BanomOfficerController::index
 * @see app/Http/Controllers/BanomOfficerController.php:20
 * @route '/management/banom/{banom}/officers'
 */
index.head = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BanomOfficerController::index
 * @see app/Http/Controllers/BanomOfficerController.php:20
 * @route '/management/banom/{banom}/officers'
 */
    const indexForm = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BanomOfficerController::index
 * @see app/Http/Controllers/BanomOfficerController.php:20
 * @route '/management/banom/{banom}/officers'
 */
        indexForm.get = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BanomOfficerController::index
 * @see app/Http/Controllers/BanomOfficerController.php:20
 * @route '/management/banom/{banom}/officers'
 */
        indexForm.head = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\BanomOfficerController::store
 * @see app/Http/Controllers/BanomOfficerController.php:57
 * @route '/management/banom/{banom}/officers'
 */
export const store = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/management/banom/{banom}/officers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BanomOfficerController::store
 * @see app/Http/Controllers/BanomOfficerController.php:57
 * @route '/management/banom/{banom}/officers'
 */
store.url = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banom: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banom: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banom: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banom: typeof args.banom === 'object'
                ? args.banom.id
                : args.banom,
                }

    return store.definition.url
            .replace('{banom}', parsedArgs.banom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomOfficerController::store
 * @see app/Http/Controllers/BanomOfficerController.php:57
 * @route '/management/banom/{banom}/officers'
 */
store.post = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BanomOfficerController::store
 * @see app/Http/Controllers/BanomOfficerController.php:57
 * @route '/management/banom/{banom}/officers'
 */
    const storeForm = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BanomOfficerController::store
 * @see app/Http/Controllers/BanomOfficerController.php:57
 * @route '/management/banom/{banom}/officers'
 */
        storeForm.post = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BanomOfficerController::update
 * @see app/Http/Controllers/BanomOfficerController.php:69
 * @route '/management/banom/{banom}/officers/{officer}'
 */
export const update = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/management/banom/{banom}/officers/{officer}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\BanomOfficerController::update
 * @see app/Http/Controllers/BanomOfficerController.php:69
 * @route '/management/banom/{banom}/officers/{officer}'
 */
update.url = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    banom: args[0],
                    officer: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banom: typeof args.banom === 'object'
                ? args.banom.id
                : args.banom,
                                officer: typeof args.officer === 'object'
                ? args.officer.id
                : args.officer,
                }

    return update.definition.url
            .replace('{banom}', parsedArgs.banom.toString())
            .replace('{officer}', parsedArgs.officer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomOfficerController::update
 * @see app/Http/Controllers/BanomOfficerController.php:69
 * @route '/management/banom/{banom}/officers/{officer}'
 */
update.patch = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\BanomOfficerController::update
 * @see app/Http/Controllers/BanomOfficerController.php:69
 * @route '/management/banom/{banom}/officers/{officer}'
 */
    const updateForm = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BanomOfficerController::update
 * @see app/Http/Controllers/BanomOfficerController.php:69
 * @route '/management/banom/{banom}/officers/{officer}'
 */
        updateForm.patch = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\BanomOfficerController::destroy
 * @see app/Http/Controllers/BanomOfficerController.php:84
 * @route '/management/banom/{banom}/officers/{officer}'
 */
export const destroy = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/management/banom/{banom}/officers/{officer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BanomOfficerController::destroy
 * @see app/Http/Controllers/BanomOfficerController.php:84
 * @route '/management/banom/{banom}/officers/{officer}'
 */
destroy.url = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    banom: args[0],
                    officer: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banom: typeof args.banom === 'object'
                ? args.banom.id
                : args.banom,
                                officer: typeof args.officer === 'object'
                ? args.officer.id
                : args.officer,
                }

    return destroy.definition.url
            .replace('{banom}', parsedArgs.banom.toString())
            .replace('{officer}', parsedArgs.officer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomOfficerController::destroy
 * @see app/Http/Controllers/BanomOfficerController.php:84
 * @route '/management/banom/{banom}/officers/{officer}'
 */
destroy.delete = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\BanomOfficerController::destroy
 * @see app/Http/Controllers/BanomOfficerController.php:84
 * @route '/management/banom/{banom}/officers/{officer}'
 */
    const destroyForm = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BanomOfficerController::destroy
 * @see app/Http/Controllers/BanomOfficerController.php:84
 * @route '/management/banom/{banom}/officers/{officer}'
 */
        destroyForm.delete = (args: { banom: string | { id: string }, officer: string | { id: string } } | [banom: string | { id: string }, officer: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const BanomOfficerController = { index, store, update, destroy }

export default BanomOfficerController