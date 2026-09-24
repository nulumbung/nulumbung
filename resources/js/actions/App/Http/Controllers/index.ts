import AvatarController from './AvatarController'
import Newsletter from './Newsletter'
import Settings from './Settings'
import System from './System'
import UserController from './UserController'
import RoleController from './RoleController'
import PermissionController from './PermissionController'
import CategoryController from './CategoryController'
import NewsController from './NewsController'
import MediaController from './MediaController'
import HistoryController from './HistoryController'
import BanomController from './BanomController'
import BanomOfficerController from './BanomOfficerController'
import NewsletterSubscriberController from './NewsletterSubscriberController'
const Controllers = {
    AvatarController: Object.assign(AvatarController, AvatarController),
Newsletter: Object.assign(Newsletter, Newsletter),
Settings: Object.assign(Settings, Settings),
System: Object.assign(System, System),
UserController: Object.assign(UserController, UserController),
RoleController: Object.assign(RoleController, RoleController),
PermissionController: Object.assign(PermissionController, PermissionController),
CategoryController: Object.assign(CategoryController, CategoryController),
NewsController: Object.assign(NewsController, NewsController),
MediaController: Object.assign(MediaController, MediaController),
HistoryController: Object.assign(HistoryController, HistoryController),
BanomController: Object.assign(BanomController, BanomController),
BanomOfficerController: Object.assign(BanomOfficerController, BanomOfficerController),
NewsletterSubscriberController: Object.assign(NewsletterSubscriberController, NewsletterSubscriberController),
}

export default Controllers