import { Auth } from '@aws-amplify/auth';

export const isLoggedIn = async () => {
    try {
        await Auth.currentAuthenticatedUser();
        return true;
    } catch {
        return false;
    }
}
