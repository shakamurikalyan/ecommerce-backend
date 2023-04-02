export class UserStore {
    static async store(data: any) {
        console.log(data);
        return {
            success: true,
        }
    }
    static async editUser(data: any) {
        console.log(data);
        return {
            success: true
        }
    }
}
