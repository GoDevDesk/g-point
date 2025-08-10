import { Album } from "./album"
import { Subscription } from "./subscription"

export interface PurchasingInfo {
    userId?: number,
    purchasedAlbumsResponse?: PurchasedAlbum[],
    activeSubscriptionsResponse?: ActiveSubscription[]
}

export interface PurchasedAlbum {
    albumOwnerName?: string,
    postCount?: number,
    albumResponse: Album
}

export interface ActiveSubscription {
    planOwnerName?: string,
    planOwnerId?: number,
    avatarUrl?: string,
    subscriptionResponse: Subscription
}