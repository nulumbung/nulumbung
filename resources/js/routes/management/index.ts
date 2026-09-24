import users from './users'
import roles from './roles'
import permissions from './permissions'
import categories from './categories'
import news from './news'
import media from './media'
import history from './history'
import banom from './banom'
import newsletter from './newsletter'
const management = {
    users: Object.assign(users, users),
roles: Object.assign(roles, roles),
permissions: Object.assign(permissions, permissions),
categories: Object.assign(categories, categories),
news: Object.assign(news, news),
media: Object.assign(media, media),
history: Object.assign(history, history),
banom: Object.assign(banom, banom),
newsletter: Object.assign(newsletter, newsletter),
}

export default management