import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\NewsController::index
 * @see app/Http/Controllers/NewsController.php:24
 * @route '/management/news'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/management/news',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NewsController::index
 * @see app/Http/Controllers/NewsController.php:24
 * @route '/management/news'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsController::index
 * @see app/Http/Controllers/NewsController.php:24
 * @route '/management/news'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NewsController::index
 * @see app/Http/Controllers/NewsController.php:24
 * @route '/management/news'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NewsController::index
 * @see app/Http/Controllers/NewsController.php:24
 * @route '/management/news'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NewsController::index
 * @see app/Http/Controllers/NewsController.php:24
 * @route '/management/news'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NewsController::index
 * @see app/Http/Controllers/NewsController.php:24
 * @route '/management/news'
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
* @see \App\Http\Controllers\NewsController::create
 * @see app/Http/Controllers/NewsController.php:50
 * @route '/management/news/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/management/news/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NewsController::create
 * @see app/Http/Controllers/NewsController.php:50
 * @route '/management/news/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsController::create
 * @see app/Http/Controllers/NewsController.php:50
 * @route '/management/news/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NewsController::create
 * @see app/Http/Controllers/NewsController.php:50
 * @route '/management/news/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NewsController::create
 * @see app/Http/Controllers/NewsController.php:50
 * @route '/management/news/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NewsController::create
 * @see app/Http/Controllers/NewsController.php:50
 * @route '/management/news/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NewsController::create
 * @see app/Http/Controllers/NewsController.php:50
 * @route '/management/news/create'
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
* @see \App\Http\Controllers\NewsController::show
 * @see app/Http/Controllers/NewsController.php:61
 * @route '/management/news/{news}'
 */
export const show = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/management/news/{news}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NewsController::show
 * @see app/Http/Controllers/NewsController.php:61
 * @route '/management/news/{news}'
 */
show.url = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { news: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { news: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    news: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        news: typeof args.news === 'object'
                ? args.news.id
                : args.news,
                }

    return show.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsController::show
 * @see app/Http/Controllers/NewsController.php:61
 * @route '/management/news/{news}'
 */
show.get = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NewsController::show
 * @see app/Http/Controllers/NewsController.php:61
 * @route '/management/news/{news}'
 */
show.head = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NewsController::show
 * @see app/Http/Controllers/NewsController.php:61
 * @route '/management/news/{news}'
 */
    const showForm = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NewsController::show
 * @see app/Http/Controllers/NewsController.php:61
 * @route '/management/news/{news}'
 */
        showForm.get = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NewsController::show
 * @see app/Http/Controllers/NewsController.php:61
 * @route '/management/news/{news}'
 */
        showForm.head = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\NewsController::edit
 * @see app/Http/Controllers/NewsController.php:75
 * @route '/management/news/{news}/edit'
 */
export const edit = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/management/news/{news}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NewsController::edit
 * @see app/Http/Controllers/NewsController.php:75
 * @route '/management/news/{news}/edit'
 */
edit.url = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { news: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { news: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    news: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        news: typeof args.news === 'object'
                ? args.news.id
                : args.news,
                }

    return edit.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsController::edit
 * @see app/Http/Controllers/NewsController.php:75
 * @route '/management/news/{news}/edit'
 */
edit.get = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NewsController::edit
 * @see app/Http/Controllers/NewsController.php:75
 * @route '/management/news/{news}/edit'
 */
edit.head = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NewsController::edit
 * @see app/Http/Controllers/NewsController.php:75
 * @route '/management/news/{news}/edit'
 */
    const editForm = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NewsController::edit
 * @see app/Http/Controllers/NewsController.php:75
 * @route '/management/news/{news}/edit'
 */
        editForm.get = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NewsController::edit
 * @see app/Http/Controllers/NewsController.php:75
 * @route '/management/news/{news}/edit'
 */
        editForm.head = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\NewsController::store
 * @see app/Http/Controllers/NewsController.php:89
 * @route '/management/news'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/management/news',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NewsController::store
 * @see app/Http/Controllers/NewsController.php:89
 * @route '/management/news'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsController::store
 * @see app/Http/Controllers/NewsController.php:89
 * @route '/management/news'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NewsController::store
 * @see app/Http/Controllers/NewsController.php:89
 * @route '/management/news'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NewsController::store
 * @see app/Http/Controllers/NewsController.php:89
 * @route '/management/news'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\NewsController::uploadImage
 * @see app/Http/Controllers/NewsController.php:139
 * @route '/management/news/upload-image'
 */
export const uploadImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/management/news/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NewsController::uploadImage
 * @see app/Http/Controllers/NewsController.php:139
 * @route '/management/news/upload-image'
 */
uploadImage.url = (options?: RouteQueryOptions) => {
    return uploadImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsController::uploadImage
 * @see app/Http/Controllers/NewsController.php:139
 * @route '/management/news/upload-image'
 */
uploadImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NewsController::uploadImage
 * @see app/Http/Controllers/NewsController.php:139
 * @route '/management/news/upload-image'
 */
    const uploadImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadImage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NewsController::uploadImage
 * @see app/Http/Controllers/NewsController.php:139
 * @route '/management/news/upload-image'
 */
        uploadImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadImage.url(options),
            method: 'post',
        })
    
    uploadImage.form = uploadImageForm
/**
* @see \App\Http\Controllers\NewsController::update
 * @see app/Http/Controllers/NewsController.php:109
 * @route '/management/news/{news}'
 */
export const update = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/management/news/{news}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\NewsController::update
 * @see app/Http/Controllers/NewsController.php:109
 * @route '/management/news/{news}'
 */
update.url = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { news: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { news: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    news: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        news: typeof args.news === 'object'
                ? args.news.id
                : args.news,
                }

    return update.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsController::update
 * @see app/Http/Controllers/NewsController.php:109
 * @route '/management/news/{news}'
 */
update.patch = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\NewsController::update
 * @see app/Http/Controllers/NewsController.php:109
 * @route '/management/news/{news}'
 */
    const updateForm = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NewsController::update
 * @see app/Http/Controllers/NewsController.php:109
 * @route '/management/news/{news}'
 */
        updateForm.patch = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\NewsController::destroy
 * @see app/Http/Controllers/NewsController.php:127
 * @route '/management/news/{news}'
 */
export const destroy = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/management/news/{news}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NewsController::destroy
 * @see app/Http/Controllers/NewsController.php:127
 * @route '/management/news/{news}'
 */
destroy.url = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { news: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { news: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    news: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        news: typeof args.news === 'object'
                ? args.news.id
                : args.news,
                }

    return destroy.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsController::destroy
 * @see app/Http/Controllers/NewsController.php:127
 * @route '/management/news/{news}'
 */
destroy.delete = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NewsController::destroy
 * @see app/Http/Controllers/NewsController.php:127
 * @route '/management/news/{news}'
 */
    const destroyForm = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NewsController::destroy
 * @see app/Http/Controllers/NewsController.php:127
 * @route '/management/news/{news}'
 */
        destroyForm.delete = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const NewsController = { index, create, show, edit, store, uploadImage, update, destroy }

export default NewsController