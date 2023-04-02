
import pkg from 'mongoose';
const { Schema, model, connect } = pkg;
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema({
    _id: { type: String, require: true },
    name: { type: String, required: true },
    email: {},
    role: {},
    password: {}
});
const productSchema = new Schema({
    _id: { type: String, require: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
});
const orderSchema = new Schema({
    date: { type: String, require: true },
    productName: { type: String, require: true },
    userNumber: { type: String, required: true },
    vendorNumber: { type: String, required: true },
    price: { type: String },
    status: {}
});

// 3. Create a Model.
const User = model('User', userSchema);
const Product = model('Product', productSchema);
const Order = model('Order', orderSchema);

export class MongoConnection {
    static async initialization(url: any) {
        try {
            await connect(url)
            return true;
        } catch (e: any) {
            console.log(e);
            return false
        }
    }
    static async addUser(data: {
        _id: String,
        name: String,
        email: String,
        role: string,
        password: true
    }) {
        try {
            let user = new User(data);
            await user.save();
            return true;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
    static async findUser(number: any, password: any) {
        try {
            let res = await User.find({ _id: number, password: password });
            return res;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
    static async findAllUser(number: any, password: any) {
        try {
            let res = await User.find({});
            return res;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
    static async editUser(number: any, data: any) {
        try {
            let res = await User.findByIdAndUpdate({ '_id': number }, data);
            return res;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
    static async addProduct(data: any) {
        try {
            let product = new Product(data);
            await product.save();
            return true;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
    static async editProduct(name: any, data: any) {
        try {
            let res = await Product.findByIdAndUpdate({ 'name': name }, data);
            return res;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
    static async findProduct(name: any) {
        try {
            let res = await User.find({ 'name': name });
            return res;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
    static async findAllProducts() {
        try {
            let res = await Product.find({});
            return res;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }


    static async addOrder(data: any) {
        try {
            let productDetails: any = await Product.find({ name: data.name });
            let order = new Order({
                date: new Date(),
                productName: data.name,
                userNumber: data.userNumber,
                vendorNumber: data.vendorNumber,
                price: productDetails.price,
                status: 'false'
            })
            order.save();
        } catch (e: any) {
            console.log(e);
            return false
        }
    }
    static async editOrder(data: any) {
        try {
            await Order.findByIdAndUpdate({ _id: data._id }, { status: 'true' });
        } catch (e: any) {
            console.log(e);
            return false
        }
    }
    static async findAllOrders() {
        try {
            let res = await Order.find({});
            return res;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
}
// export async function initialization(url: any) {
//     try {
//         await connect(url)
//         const role = new Role({
//             roleName: 'SuperAdmin',
//             excludedList: null
//         });
//         let response = await role.save();
//         const user = new User({
//             "_id": "181fa04376@gmail.com",
//             "firstName": "Kalyan",
//             "lastName": "Shakamuri",
//             "email": "181fa04376@gmail.com",
//             "role": response._id,
//             "password": 1056036961,
//             "designation": "SuperAdmin",
//             "active": true,
//             "dob": '2000-10-21T00:00:00.000+00:00',
//             "__v": 0
//         })
//         await user.save();
//         const tailscale = new TailScale({
//             "_id": "tailscaleId",
//             "token": "feelinggood"
//         })
//         await tailscale.save()
//         const bucket = new Bucket({
//             "_id": "testing",
//             "name": "testing",
//             "deploymentSettings": {
//                 "startTime": "23:50:00",
//                 "endTime": "23:59:00",
//                 "daysOfTheWeek": [
//                     0,
//                     1,
//                     2,
//                     3,
//                     4,
//                     5,
//                     6
//                 ]
//             },
//             "currentVersion": "1.0.0main"
//         })
//         await bucket.save();
//         return true;
//     }
//     catch (e) {
//         return e;
//     }
// }
