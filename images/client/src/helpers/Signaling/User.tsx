export interface UserId {
    issuer: string;
    subject: string;
}

export interface UserInfo extends UserId {
    username: string;
}

export function isUserEqual(
    user1: UserId | UserInfo,
    user2: UserId | UserInfo
) {
    if (user1.issuer !== user2.issuer || user1.subject !== user2.subject) {
        return false;
    }
    return true;
}
