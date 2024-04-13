const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
require("dotenv").config();
//models
const Account = require("./models/account");
const User = require("./models/user");

process.on("uncaughtException", (err) => {
  process.exit(1);
});


const app = require("./app");
const uri = 'mongodb+srv://trantrongthiep2002:thiepga123@zalo.tt4feul.mongodb.net/?retryWrites=true&w=majority&appName=zalo';
// Connect the database
mongoose.connect(
  uri,
  () => {
    console.log("Success");
  },
  (e) => console.error(e)
);

// Start the server
const _port = 8091;
app.listen(_port, () => {
  console.log(`Application is running on port ${_port}`);
  console.log(`${process.env.ID}`);
  console.log(`${process.env.SECRET}`);
  console.log(`${process.env.region}`);
  console.log(`${process.env.S3_BUCKET_NAME}`);
});

process.on("unhandledRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});

// run();
// async function run() {
//   ///User 1
//   const _ThiepAccount = await Account.create({
//     phoneNumber:"0968376205",
//     passWord:await bcrypt.hash("123456", 10),
//   });

//   const _ThiepUser = await User.create({
//     fullName:"Thiep clone",
//     bio:"abc",
//     birthday:Date.now(),
//     accountID:_ThiepAccount,
//     avatarLink:"https://gcs.tripi.vn/public-tripi/tripi-feed/img/474250ZNp/photo-6-16675562029442139900239-1667630383932-16676303841561657948359.jpg",
//     backgroundLink:"https://farm3.staticflickr.com/2936/14765026726_b8a02d3989.jpg",     
//   });

//   //User 2

//   const _Thiep2Account = await Account.create({
//     phoneNumber:"0968376205",
//     passWord:await bcrypt.hash("123456", 10),
//   });

//   const _Thiep2User = await User.create({
//     fullName:"thiep 2",
//     bio:"zxc",
//     birthday:Date.now(),
//     accountID:_Thiep2Account,
//     avatarLink:"https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223",
//     backgroundLink:"https://farm3.staticflickr.com/2936/14765026726_b8a02d3989.jpg",
//   });

  // await _ThiepAccount.save();
  // await _ThiepUser.save();

  // await _Thiep2Account.save();
  // await _Thiep2User.save();


  
// }
