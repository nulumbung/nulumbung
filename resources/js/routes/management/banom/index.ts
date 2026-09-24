import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import officers from './officers'
/**
* @see \App\Http\Controllers\BanomController::index
 * @see app/Http/Controllers/BanomController.php:19
 * @route '/management/banom'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/management/banom',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BanomController::index
 * @see app/Http/Controllers/BanomController.php:19
 * @route '/management/banom'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomController::index
 * @see app/Http/Controllers/BanomController.php:19
 * @route '/management/banom'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BanomController::index
 * @see app/Http/Controllers/BanomController.php:19
 * @route '/management/banom'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BanomController::index
 * @see app/Http/Controllers/BanomController.php:19
 * @route '/management/banom'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BanomController::index
 * @see app/Http/Controllers/BanomController.php:19
 * @route '/management/banom'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BanomController::index
 * @see app/Http/Controllers/BanomController.php:19
 * @route '/management/banom'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\BanomController::create
 * @see app/Http/Controllers/BanomController.php:41
 * @route '/management/banom/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/management/banom/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BanomController::create
 * @see app/Http/Controllers/BanomController.php:41
 * @route '/management/banom/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomController::create
 * @see app/Http/Controllers/BanomController.php:41
 * @route '/management/banom/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BanomController::create
 * @see app/Http/Controllers/BanomController.php:41
 * @route '/management/banom/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BanomController::create
 * @see app/Http/Controllers/BanomController.php:41
 * @route '/management/banom/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BanomController::create
 * @see app/Http/Controllers/BanomController.php:41
 * @route '/management/banom/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BanomController::create
 * @see app/Http/Controllers/BanomController.php:41
 * @route '/management/banom/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\BanomController::edit
 * @see app/Http/Controllers/BanomController.php:49
 * @route '/management/banom/{banom}/edit'
 */
export const edit = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/management/banom/{banom}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BanomController::edit
 * @see app/Http/Controllers/BanomController.php:49
 * @route '/management/banom/{banom}/edit'
 */
edit.url = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{banom}', parsedArgs.banom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomController::edit
 * @see app/Http/Controllers/BanomController.php:49
 * @route '/management/banom/{banom}/edit'
 */
edit.get = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BanomController::edit
 * @see app/Http/Controllers/BanomController.php:49
 * @route '/management/banom/{banom}/edit'
 */
edit.head = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BanomController::edit
 * @see app/Http/Controllers/BanomController.php:49
 * @route '/management/banom/{banom}/edit'
 */
    const editForm = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BanomController::edit
 * @see app/Http/Controllers/BanomController.php:49
 * @route '/management/banom/{banom}/edit'
 */
        editForm.get = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BanomController::edit
 * @see app/Http/Controllers/BanomController.php:49
 * @route '/management/banom/{banom}/edit'
 */
        editForm.head = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\BanomController::store
 * @see app/Http/Controllers/BanomController.php:59
 * @route '/management/banom'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/management/banom',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BanomController::store
 * @see app/Http/Controllers/BanomController.php:59
 * @route '/management/banom'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomController::store
 * @see app/Http/Controllers/BanomController.php:59
 * @route '/management/banom'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BanomController::store
 * @see app/Http/Controllers/BanomController.php:59
 * @route '/management/banom'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BanomController::store
 * @see app/Http/Controllers/BanomController.php:59
 * @route '/management/banom'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BanomController::uploadImage
 * @see app/Http/Controllers/BanomController.php:95
 * @route '/management/banom/upload-image'
 */
export const uploadImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/management/banom/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BanomController::uploadImage
 * @see app/Http/Controllers/BanomController.php:95
 * @route '/management/banom/upload-image'
 */
uploadImage.url = (options?: RouteQueryOptions) => {
    return uploadImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomController::uploadImage
 * @see app/Http/Controllers/BanomController.php:95
 * @route '/management/banom/upload-image'
 */
uploadImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BanomController::uploadImage
 * @see app/Http/Controllers/BanomController.php:95
 * @route '/management/banom/upload-image'
 */
    const uploadImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadImage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BanomController::uploadImage
 * @see app/Http/Controllers/BanomController.php:95
 * @route '/management/banom/upload-image'
 */
        uploadImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadImage.url(options),
            method: 'post',
        })
    
    uploadImage.form = uploadImageForm
/**
* @see \App\Http\Controllers\BanomController::update
 * @see app/Http/Controllers/BanomController.php:71
 * @route '/management/banom/{banom}'
 */
export const update = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/management/banom/{banom}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\BanomController::update
 * @see app/Http/Controllers/BanomController.php:71
 * @route '/management/banom/{banom}'
 */
update.url = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{banom}', parsedArgs.banom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomController::update
 * @see app/Http/Controllers/BanomController.php:71
 * @route '/management/banom/{banom}'
 */
update.patch = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\BanomController::update
 * @see app/Http/Controllers/BanomController.php:71
 * @route '/management/banom/{banom}'
 */
    const updateForm = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BanomController::update
 * @see app/Http/Controllers/BanomController.php:71
 * @route '/management/banom/{banom}'
 */
        updateForm.patch = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BanomController::destroy
 * @see app/Http/Controllers/BanomController.php:83
 * @route '/management/banom/{banom}'
 */
export const destroy = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/management/banom/{banom}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BanomController::destroy
 * @see app/Http/Controllers/BanomController.php:83
 * @route '/management/banom/{banom}'
 */
destroy.url = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{banom}', parsedArgs.banom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BanomController::destroy
 * @see app/Http/Controllers/BanomController.php:83
 * @route '/management/banom/{banom}'
 */
destroy.delete = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\BanomController::destroy
 * @see app/Http/Controllers/BanomController.php:83
 * @route '/management/banom/{banom}'
 */
    const destroyForm = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BanomController::destroy
 * @see app/Http/Controllers/BanomController.php:83
 * @route '/management/banom/{banom}'
 */
        destroyForm.delete = (args: { banom: string | { id: string } } | [banom: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const banom = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
edit: Object.assign(edit, edit),
store: Object.assign(store, store),
uploadImage: Object.assign(uploadImage, uploadImage),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
officers: Object.assign(officers, officers),
}

export default banom