const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  // Prepare the options object
  const options = { 
    folder, 
    resource_type: "auto", 
    use_filename: true // Ensure this is in the options object
  };

  // Add additional parameters like height and quality if provided
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  // Log the options and file path for debugging
  console.log("OPTIONS", options);
  console.log("file.tempFilePath", file.tempFilePath);

  try {
    // Upload the image to Cloudinary with the correct options
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    
    console.log("Upload successful:", result);
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error; // Rethrow error for further handling
  }
};

// const cloudinary = require("cloudinary").v2;

// exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
//   try {
//     const options = { folder };
//     if (height) {
//       options.height = height;
//     }
//     if (quality) {
//       options.quality = quality;
//     }
//     options.resource_type = "auto";
//     console.log("OPTIONS", options);
//     return await cloudinary.uploader.upload(file, options);
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     return null; // Or throw an error, depending on how you want to handle failures
//   }
// };