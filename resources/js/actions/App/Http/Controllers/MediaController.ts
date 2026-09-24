import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/management/media'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/management/media',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/management/media'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/management/media'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/management/media'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/management/media'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/management/media'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/management/media'
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
* @see \App\Http\Controllers\MediaController::create
 * @see app/Http/Controllers/MediaController.php:45
 * @route '/management/media/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/management/media/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MediaController::create
 * @see app/Http/Controllers/MediaController.php:45
 * @route '/management/media/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::create
 * @see app/Http/Controllers/MediaController.php:45
 * @route '/management/media/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MediaController::create
 * @see app/Http/Controllers/MediaController.php:45
 * @route '/management/media/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MediaController::create
 * @see app/Http/Controllers/MediaController.php:45
 * @route '/management/media/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MediaController::create
 * @see app/Http/Controllers/MediaController.php:45
 * @route '/management/media/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MediaController::create
 * @see app/Http/Controllers/MediaController.php:45
 * @route '/management/media/create'
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
* @see \App\Http\Controllers\MediaController::show
 * @see app/Http/Controllers/MediaController.php:53
 * @route '/management/media/{media}'
 */
export const show = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/management/media/{media}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MediaController::show
 * @see app/Http/Controllers/MediaController.php:53
 * @route '/management/media/{media}'
 */
show.url = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { media: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    media: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        media: typeof args.media === 'object'
                ? args.media.id
                : args.media,
                }

    return show.definition.url
            .replace('{media}', parsedArgs.media.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::show
 * @see app/Http/Controllers/MediaController.php:53
 * @route '/management/media/{media}'
 */
show.get = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MediaController::show
 * @see app/Http/Controllers/MediaController.php:53
 * @route '/management/media/{media}'
 */
show.head = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MediaController::show
 * @see app/Http/Controllers/MediaController.php:53
 * @route '/management/media/{media}'
 */
    const showForm = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MediaController::show
 * @see app/Http/Controllers/MediaController.php:53
 * @route '/management/media/{media}'
 */
        showForm.get = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MediaController::show
 * @see app/Http/Controllers/MediaController.php:53
 * @route '/management/media/{media}'
 */
        showForm.head = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MediaController::edit
 * @see app/Http/Controllers/MediaController.php:63
 * @route '/management/media/{media}/edit'
 */
export const edit = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/management/media/{media}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MediaController::edit
 * @see app/Http/Controllers/MediaController.php:63
 * @route '/management/media/{media}/edit'
 */
edit.url = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { media: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    media: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        media: typeof args.media === 'object'
                ? args.media.id
                : args.media,
                }

    return edit.definition.url
            .replace('{media}', parsedArgs.media.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::edit
 * @see app/Http/Controllers/MediaController.php:63
 * @route '/management/media/{media}/edit'
 */
edit.get = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MediaController::edit
 * @see app/Http/Controllers/MediaController.php:63
 * @route '/management/media/{media}/edit'
 */
edit.head = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MediaController::edit
 * @see app/Http/Controllers/MediaController.php:63
 * @route '/management/media/{media}/edit'
 */
    const editForm = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MediaController::edit
 * @see app/Http/Controllers/MediaController.php:63
 * @route '/management/media/{media}/edit'
 */
        editForm.get = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MediaController::edit
 * @see app/Http/Controllers/MediaController.php:63
 * @route '/management/media/{media}/edit'
 */
        editForm.head = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MediaController::store
 * @see app/Http/Controllers/MediaController.php:73
 * @route '/management/media'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/management/media',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaController::store
 * @see app/Http/Controllers/MediaController.php:73
 * @route '/management/media'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::store
 * @see app/Http/Controllers/MediaController.php:73
 * @route '/management/media'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MediaController::store
 * @see app/Http/Controllers/MediaController.php:73
 * @route '/management/media'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MediaController::store
 * @see app/Http/Controllers/MediaController.php:73
 * @route '/management/media'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\MediaController::uploadFile
 * @see app/Http/Controllers/MediaController.php:109
 * @route '/management/media/upload-file'
 */
export const uploadFile = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadFile.url(options),
    method: 'post',
})

uploadFile.definition = {
    methods: ["post"],
    url: '/management/media/upload-file',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaController::uploadFile
 * @see app/Http/Controllers/MediaController.php:109
 * @route '/management/media/upload-file'
 */
uploadFile.url = (options?: RouteQueryOptions) => {
    return uploadFile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::uploadFile
 * @see app/Http/Controllers/MediaController.php:109
 * @route '/management/media/upload-file'
 */
uploadFile.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadFile.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MediaController::uploadFile
 * @see app/Http/Controllers/MediaController.php:109
 * @route '/management/media/upload-file'
 */
    const uploadFileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadFile.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MediaController::uploadFile
 * @see app/Http/Controllers/MediaController.php:109
 * @route '/management/media/upload-file'
 */
        uploadFileForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadFile.url(options),
            method: 'post',
        })
    
    uploadFile.form = uploadFileForm
/**
* @see \App\Http\Controllers\MediaController::uploadThumbnail
 * @see app/Http/Controllers/MediaController.php:123
 * @route '/management/media/upload-thumbnail'
 */
export const uploadThumbnail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadThumbnail.url(options),
    method: 'post',
})

uploadThumbnail.definition = {
    methods: ["post"],
    url: '/management/media/upload-thumbnail',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MediaController::uploadThumbnail
 * @see app/Http/Controllers/MediaController.php:123
 * @route '/management/media/upload-thumbnail'
 */
uploadThumbnail.url = (options?: RouteQueryOptions) => {
    return uploadThumbnail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::uploadThumbnail
 * @see app/Http/Controllers/MediaController.php:123
 * @route '/management/media/upload-thumbnail'
 */
uploadThumbnail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadThumbnail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MediaController::uploadThumbnail
 * @see app/Http/Controllers/MediaController.php:123
 * @route '/management/media/upload-thumbnail'
 */
    const uploadThumbnailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadThumbnail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MediaController::uploadThumbnail
 * @see app/Http/Controllers/MediaController.php:123
 * @route '/management/media/upload-thumbnail'
 */
        uploadThumbnailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadThumbnail.url(options),
            method: 'post',
        })
    
    uploadThumbnail.form = uploadThumbnailForm
/**
* @see \App\Http\Controllers\MediaController::update
 * @see app/Http/Controllers/MediaController.php:85
 * @route '/management/media/{media}'
 */
export const update = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/management/media/{media}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MediaController::update
 * @see app/Http/Controllers/MediaController.php:85
 * @route '/management/media/{media}'
 */
update.url = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { media: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    media: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        media: typeof args.media === 'object'
                ? args.media.id
                : args.media,
                }

    return update.definition.url
            .replace('{media}', parsedArgs.media.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::update
 * @see app/Http/Controllers/MediaController.php:85
 * @route '/management/media/{media}'
 */
update.patch = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\MediaController::update
 * @see app/Http/Controllers/MediaController.php:85
 * @route '/management/media/{media}'
 */
    const updateForm = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MediaController::update
 * @see app/Http/Controllers/MediaController.php:85
 * @route '/management/media/{media}'
 */
        updateForm.patch = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MediaController::destroy
 * @see app/Http/Controllers/MediaController.php:97
 * @route '/management/media/{media}'
 */
export const destroy = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/management/media/{media}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MediaController::destroy
 * @see app/Http/Controllers/MediaController.php:97
 * @route '/management/media/{media}'
 */
destroy.url = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { media: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { media: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    media: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        media: typeof args.media === 'object'
                ? args.media.id
                : args.media,
                }

    return destroy.definition.url
            .replace('{media}', parsedArgs.media.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MediaController::destroy
 * @see app/Http/Controllers/MediaController.php:97
 * @route '/management/media/{media}'
 */
destroy.delete = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MediaController::destroy
 * @see app/Http/Controllers/MediaController.php:97
 * @route '/management/media/{media}'
 */
    const destroyForm = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MediaController::destroy
 * @see app/Http/Controllers/MediaController.php:97
 * @route '/management/media/{media}'
 */
        destroyForm.delete = (args: { media: string | { id: string } } | [media: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const MediaController = { index, create, show, edit, store, uploadFile, uploadThumbnail, update, destroy }

export default MediaController