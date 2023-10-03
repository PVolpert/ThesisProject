export interface UserId {
    username: string;
}

export function isUserEqual(user1: UserId, user2: UserId) {
    return user1.username === user2.username;
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
            'username' in parsed
        ) {
            return parsed as UserId;
        }
    } catch (error) {
        // Handle parsing errors here
    }
    throw new Error();
}
