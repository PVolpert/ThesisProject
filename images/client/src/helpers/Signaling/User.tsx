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

// Function to convert a UserId object to a string
export function userIdToString(userId: UserId): string {
    return JSON.stringify(userId);
}

// Function to convert a string to a UserId object
export function stringToUserId(str: string): UserId {
    try {
        const parsed = JSON.parse(str);
        if (
            typeof parsed === 'object' &&
            parsed !== null &&
            'issuer' in parsed &&
            'subject' in parsed
        ) {
            return parsed as UserId;
        }
    } catch (error) {
        // Handle parsing errors here
    }
    throw new Error();
}

export function getUsernamesOfUnknownInActiveUsers(
    unknownUsers: UserId[],
    activeUsers: UserInfo[]
): string[] {
    const usernames: string[] = unknownUsers
        .filter((unknownUser) =>
            activeUsers.some(
                (activeUser) =>
                    activeUser.issuer === unknownUser.issuer &&
                    activeUser.subject === unknownUser.subject
            )
        )
        .map(
            (matchedUser) =>
                activeUsers.find(
                    (activeUser) =>
                        activeUser.issuer === matchedUser.issuer &&
                        activeUser.subject === matchedUser.subject
                )!.username
        );

    return usernames;
}
