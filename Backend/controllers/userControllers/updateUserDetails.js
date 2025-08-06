const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const uploadFile = require("../../utils/uploadFileOnCloudinary");

exports.updateUserDetails = catchAsyncErrors(
   async (req, res, next) => {
      const { firstName, lastName, image, phoneNo } = req.body;

      let user = req.user;
      const file = req.file;


      if(!file) {
         return next(new ErrorHandler("No file uploaded", 400));
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if(phoneNo) user.phoneNo = phoneNo;
      const imageUrl = await uploadFile(file);
      if (imageUrl.url) user.image = imageUrl.url;

      await user.save();

      res.status(201).json({
         success: true,
         message: 'User updated successfully.'
      });
   }

)