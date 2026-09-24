import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::show
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:19
 * @route '/newsletter'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/newsletter',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::show
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:19
 * @route '/newsletter'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::show
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:19
 * @route '/newsletter'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::show
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:19
 * @route '/newsletter'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::show
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:19
 * @route '/newsletter'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::show
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:19
 * @route '/newsletter'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::show
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:19
 * @route '/newsletter'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::subscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:30
 * @route '/newsletter/subscribe'
 */
export const subscribe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

subscribe.definition = {
    methods: ["post"],
    url: '/newsletter/subscribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::subscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:30
 * @route '/newsletter/subscribe'
 */
subscribe.url = (options?: RouteQueryOptions) => {
    return subscribe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::subscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:30
 * @route '/newsletter/subscribe'
 */
subscribe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::subscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:30
 * @route '/newsletter/subscribe'
 */
    const subscribeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: subscribe.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::subscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:30
 * @route '/newsletter/subscribe'
 */
        subscribeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: subscribe.url(options),
            method: 'post',
        })
    
    subscribe.form = subscribeForm
/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::unsubscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:59
 * @route '/newsletter/unsubscribe/{token}'
 */
export const unsubscribe = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unsubscribe.url(args, options),
    method: 'get',
})

unsubscribe.definition = {
    methods: ["get","head"],
    url: '/newsletter/unsubscribe/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::unsubscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:59
 * @route '/newsletter/unsubscribe/{token}'
 */
unsubscribe.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return unsubscribe.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::unsubscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:59
 * @route '/newsletter/unsubscribe/{token}'
 */
unsubscribe.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unsubscribe.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::unsubscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:59
 * @route '/newsletter/unsubscribe/{token}'
 */
unsubscribe.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unsubscribe.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::unsubscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:59
 * @route '/newsletter/unsubscribe/{token}'
 */
    const unsubscribeForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: unsubscribe.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::unsubscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:59
 * @route '/newsletter/unsubscribe/{token}'
 */
        unsubscribeForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unsubscribe.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Newsletter\PublicNewsletterController::unsubscribe
 * @see app/Http/Controllers/Newsletter/PublicNewsletterController.php:59
 * @route '/newsletter/unsubscribe/{token}'
 */
        unsubscribeForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unsubscribe.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    unsubscribe.form = unsubscribeForm
const PublicNewsletterController = { show, subscribe, unsubscribe }

export default PublicNewsletterController