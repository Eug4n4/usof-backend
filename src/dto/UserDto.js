
class UserDto {

    constructor(user, role) {
        this.id = user['id'];
        this.email = user['email']
        this.login = user['login']
        this.photo = user['photo']
        this.rating = user['rating']
        this.full_name = user['full_name']
        this.role = role;
    }


    static async createInstance(user) {
        const { role } = await user.getRole();
        return new UserDto(user, role)
    }
}

export default UserDto;