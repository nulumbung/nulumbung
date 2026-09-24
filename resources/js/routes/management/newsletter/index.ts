import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\NewsletterSubscriberController::index
 * @see app/Http/Controllers/NewsletterSubscriberController.php:20
 * @route '/management/newsletter'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/management/newsletter',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::index
 * @see app/Http/Controllers/NewsletterSubscriberController.php:20
 * @route '/management/newsletter'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::index
 * @see app/Http/Controllers/NewsletterSubscriberController.php:20
 * @route '/management/newsletter'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NewsletterSubscriberController::index
 * @see app/Http/Controllers/NewsletterSubscriberController.php:20
 * @route '/management/newsletter'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NewsletterSubscriberController::index
 * @see app/Http/Controllers/NewsletterSubscriberController.php:20
 * @route '/management/newsletter'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NewsletterSubscriberController::index
 * @see app/Http/Controllers/NewsletterSubscriberController.php:20
 * @route '/management/newsletter'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NewsletterSubscriberController::index
 * @see app/Http/Controllers/NewsletterSubscriberController.php:20
 * @route '/management/newsletter'
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
* @see \App\Http\Controllers\NewsletterSubscriberController::store
 * @see app/Http/Controllers/NewsletterSubscriberController.php:53
 * @route '/management/newsletter'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/management/newsletter',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::store
 * @see app/Http/Controllers/NewsletterSubscriberController.php:53
 * @route '/management/newsletter'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::store
 * @see app/Http/Controllers/NewsletterSubscriberController.php:53
 * @route '/management/newsletter'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NewsletterSubscriberController::store
 * @see app/Http/Controllers/NewsletterSubscriberController.php:53
 * @route '/management/newsletter'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NewsletterSubscriberController::store
 * @see app/Http/Controllers/NewsletterSubscriberController.php:53
 * @route '/management/newsletter'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\NewsletterSubscriberController::send
 * @see app/Http/Controllers/NewsletterSubscriberController.php:109
 * @route '/management/newsletter/send/{news}'
 */
export const send = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/management/newsletter/send/{news}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::send
 * @see app/Http/Controllers/NewsletterSubscriberController.php:109
 * @route '/management/newsletter/send/{news}'
 */
send.url = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return send.definition.url
            .replace('{news}', parsedArgs.news.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::send
 * @see app/Http/Controllers/NewsletterSubscriberController.php:109
 * @route '/management/newsletter/send/{news}'
 */
send.post = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\NewsletterSubscriberController::send
 * @see app/Http/Controllers/NewsletterSubscriberController.php:109
 * @route '/management/newsletter/send/{news}'
 */
    const sendForm = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NewsletterSubscriberController::send
 * @see app/Http/Controllers/NewsletterSubscriberController.php:109
 * @route '/management/newsletter/send/{news}'
 */
        sendForm.post = (args: { news: string | { id: string } } | [news: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(args, options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\NewsletterSubscriberController::update
 * @see app/Http/Controllers/NewsletterSubscriberController.php:71
 * @route '/management/newsletter/{subscriber}'
 */
export const update = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/management/newsletter/{subscriber}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::update
 * @see app/Http/Controllers/NewsletterSubscriberController.php:71
 * @route '/management/newsletter/{subscriber}'
 */
update.url = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscriber: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscriber: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscriber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscriber: typeof args.subscriber === 'object'
                ? args.subscriber.id
                : args.subscriber,
                }

    return update.definition.url
            .replace('{subscriber}', parsedArgs.subscriber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::update
 * @see app/Http/Controllers/NewsletterSubscriberController.php:71
 * @route '/management/newsletter/{subscriber}'
 */
update.patch = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\NewsletterSubscriberController::update
 * @see app/Http/Controllers/NewsletterSubscriberController.php:71
 * @route '/management/newsletter/{subscriber}'
 */
    const updateForm = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NewsletterSubscriberController::update
 * @see app/Http/Controllers/NewsletterSubscriberController.php:71
 * @route '/management/newsletter/{subscriber}'
 */
        updateForm.patch = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\NewsletterSubscriberController::destroy
 * @see app/Http/Controllers/NewsletterSubscriberController.php:97
 * @route '/management/newsletter/{subscriber}'
 */
export const destroy = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/management/newsletter/{subscriber}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::destroy
 * @see app/Http/Controllers/NewsletterSubscriberController.php:97
 * @route '/management/newsletter/{subscriber}'
 */
destroy.url = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscriber: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscriber: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscriber: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscriber: typeof args.subscriber === 'object'
                ? args.subscriber.id
                : args.subscriber,
                }

    return destroy.definition.url
            .replace('{subscriber}', parsedArgs.subscriber.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NewsletterSubscriberController::destroy
 * @see app/Http/Controllers/NewsletterSubscriberController.php:97
 * @route '/management/newsletter/{subscriber}'
 */
destroy.delete = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\NewsletterSubscriberController::destroy
 * @see app/Http/Controllers/NewsletterSubscriberController.php:97
 * @route '/management/newsletter/{subscriber}'
 */
    const destroyForm = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\NewsletterSubscriberController::destroy
 * @see app/Http/Controllers/NewsletterSubscriberController.php:97
 * @route '/management/newsletter/{subscriber}'
 */
        destroyForm.delete = (args: { subscriber: string | { id: string } } | [subscriber: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const newsletter = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
send: Object.assign(send, send),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default newsletter