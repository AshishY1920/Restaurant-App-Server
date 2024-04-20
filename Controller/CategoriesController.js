const CategoryModel = require("../Model/CategoryModel")
const { uploadImage } = require("./RestaurantController")

exports.createCategories = async(req,res) => {
    try {
        const {categoriesName} = req.body
        const result = await uploadImage(req.body.image)

        const Categories = await new CategoryModel({
            categoriesName,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            }
        })

        await Categories.save()

        return res.status(201).json({
            status: 1,
            message: "Categories Created Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message,
          });
    }
}